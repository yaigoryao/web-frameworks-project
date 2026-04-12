import { makeAutoObservable, observable, runInAction } from 'mobx';
import { api } from '../services/api';
import type { Car, Order, Role, User } from '../types';
import { STAFF_ROLES_TTL_MS, STAFF_USER_DATA_TTL_MS } from './cache/cacheConstants';
import type { RootStore } from './rootStore';
import type { StaffUpdateUserRequest } from '../types';

export class StaffUserDataStore {
  private root: RootStore;
  private profileCache = observable.map<number, { user: User; fetchedAt: number }>();
  private ordersCache = observable.map<number, { orders: Order[]; fetchedAt: number }>();
  private carsCache = observable.map<number, { cars: Car[]; fetchedAt: number }>();

  profileLoadingUserId: number | null = null;
  ordersLoadingUserId: number | null = null;
  carsLoadingUserId: number | null = null;

  staffRoles: Role[] = [];
  staffRolesLoading = false;
  staffRolesError: string | null = null;
  private staffRolesFetchedAt: number | null = null;
  private staffRolesInflight: Promise<void> | null = null;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  async updateStaffProfileUser(userId: number, body: StaffUpdateUserRequest): Promise<void> {
    await api.updateStaffUser(body);
    this.invalidateProfile(userId);
    this.root.usersListStore.invalidateCache();
    await this.ensureProfileUser(userId, true);
  }

  getProfileUser(userId: number): User | undefined {
    return this.profileCache.get(userId)?.user;
  }

  getOrders(userId: number): Order[] {
    return this.ordersCache.get(userId)?.orders ?? [];
  }

  getCars(userId: number): Car[] {
    return this.carsCache.get(userId)?.cars ?? [];
  }

  private isProfileFresh(userId: number): boolean {
    const e = this.profileCache.get(userId);
    return !!e && Date.now() - e.fetchedAt < STAFF_USER_DATA_TTL_MS;
  }

  private isOrdersFresh(userId: number): boolean {
    const e = this.ordersCache.get(userId);
    return !!e && Date.now() - e.fetchedAt < STAFF_USER_DATA_TTL_MS;
  }

  private isCarsFresh(userId: number): boolean {
    const e = this.carsCache.get(userId);
    return !!e && Date.now() - e.fetchedAt < STAFF_USER_DATA_TTL_MS;
  }

  async ensureProfileUser(userId: number, force = false): Promise<void> {
    if (!force && this.isProfileFresh(userId)) return;
    runInAction(() => {
      this.profileLoadingUserId = userId;
    });
    try {
      const u = await api.getStaffUserById(userId);
      runInAction(() => {
        this.profileCache.set(userId, { user: u, fetchedAt: Date.now() });
      });
    } catch (e) {
      runInAction(() => {
        this.profileCache.delete(userId);
      });
      throw e;
    } finally {
      runInAction(() => {
        this.profileLoadingUserId = null;
      });
    }
  }

  async ensureStaffRoles(force = false): Promise<void> {
    if (!force && this.staffRolesFetchedAt && Date.now() - this.staffRolesFetchedAt < STAFF_ROLES_TTL_MS) {
      return;
    }
    if (this.staffRolesInflight) {
      await this.staffRolesInflight;
      return;
    }
    this.staffRolesInflight = (async () => {
      runInAction(() => {
        this.staffRolesLoading = true;
        this.staffRolesError = null;
      });
      try {
        const r = await api.getStaffRoles(50, 0);
        runInAction(() => {
          this.staffRoles = r;
          this.staffRolesFetchedAt = Date.now();
        });
      } catch (e) {
        runInAction(() => {
          this.staffRolesError = api.parseApiError(e).message;
          this.staffRoles = [];
        });
      } finally {
        runInAction(() => {
          this.staffRolesLoading = false;
        });
      }
    })();
    try {
      await this.staffRolesInflight;
    } finally {
      this.staffRolesInflight = null;
    }
  }

  async ensureStaffOrders(userId: number, force = false): Promise<void> {
    if (!force && this.isOrdersFresh(userId)) return;
    runInAction(() => {
      this.ordersLoadingUserId = userId;
    });
    try {
      const list = await api.getStaffOrders({ userId, id: 0, limit: 200, offset: 0 });
      runInAction(() => {
        this.ordersCache.set(userId, { orders: list, fetchedAt: Date.now() });
      });
    } catch (e) {
      runInAction(() => {
        this.ordersCache.delete(userId);
      });
      throw e;
    } finally {
      runInAction(() => {
        this.ordersLoadingUserId = null;
      });
    }
  }

  async ensureStaffCars(userId: number, force = false): Promise<void> {
    if (!force && this.isCarsFresh(userId)) return;
    runInAction(() => {
      this.carsLoadingUserId = userId;
    });
    try {
      const list = await api.getStaffCars({ userId, limit: 100, offset: 0 });
      runInAction(() => {
        this.carsCache.set(userId, { cars: list, fetchedAt: Date.now() });
      });
    } catch (e) {
      runInAction(() => {
        this.carsCache.delete(userId);
      });
      throw e;
    } finally {
      runInAction(() => {
        this.carsLoadingUserId = null;
      });
    }
  }

  invalidateProfile(userId: number): void {
    this.profileCache.delete(userId);
  }

  invalidateOrders(userId: number): void {
    this.ordersCache.delete(userId);
  }

  invalidateCars(userId: number): void {
    this.carsCache.delete(userId);
  }

  invalidateUser(userId: number): void {
    this.invalidateProfile(userId);
    this.invalidateOrders(userId);
    this.invalidateCars(userId);
  }

  invalidateAll(): void {
    this.profileCache.clear();
    this.ordersCache.clear();
    this.carsCache.clear();
    this.staffRolesFetchedAt = null;
    this.staffRoles = [];
  }
}
