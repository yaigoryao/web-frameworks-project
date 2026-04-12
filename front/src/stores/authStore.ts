import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../services/api';
import type { User, LoginRequest, RegisterRequest, CustomerUpdateUserRequest } from '../types';
import type { RootStore } from './rootStore';

export class AuthStore {
  root: RootStore;
  user: User | null = null;
  isLoading = true;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
    void this.bootstrap();
  }

  get isAuthenticated(): boolean {
    return this.user != null;
  }

  async bootstrap(): Promise<void> {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      if (api.isAuthenticated()) {
        await this.refreshUser();
      }
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async refreshUser(): Promise<void> {
    try {
      const userData = await api.getUserInfo();
      runInAction(() => {
        this.user = userData;
      });
      api.setStaffUserRole(userData.role?.roleName ?? null);
    } catch {
      runInAction(() => {
        this.user = null;
      });
      api.setStaffUserRole(null);
    }
  }

  async login(data: LoginRequest): Promise<void> {
    // #region agent log
    fetch('http://127.0.0.1:7647/ingest/5dbce222-9957-4ad6-b6f1-d80f014d3c87', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'e0fe60' },
      body: JSON.stringify({
        sessionId: 'e0fe60',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'authStore.ts:login',
        message: 'AuthStore.login entry',
        data: {
          thisUndefined: this === undefined,
          thisStrictNull: this == null,
          hasRefreshUser: typeof (this as AuthStore | undefined)?.refreshUser,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    await api.login(data);
    await this.refreshUser();
  }

  async register(data: RegisterRequest): Promise<void> {
    await api.register(data);
    await this.refreshUser();
  }

  logout(): void {
    // #region agent log
    fetch('http://127.0.0.1:7647/ingest/5dbce222-9957-4ad6-b6f1-d80f014d3c87', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'e0fe60' },
      body: JSON.stringify({
        sessionId: 'e0fe60',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'authStore.ts:logout',
        message: 'AuthStore.logout entry',
        data: {
          thisUndefined: this === undefined,
          thisStrictNull: this == null,
          hasRoot: !!(this as AuthStore | undefined)?.root,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    api.clearToken();
    api.setStaffUserRole(null);
    runInAction(() => {
      this.user = null;
    });
    this.root.customerDataStore.invalidateAll();
    this.root.usersListStore.invalidateCache();
    this.root.staffUserDataStore.invalidateAll();
    this.root.staffReferenceStore.invalidateOrderStatuses();
  }

  async updateUser(data: Partial<User>): Promise<void> {
    const updatePayload: CustomerUpdateUserRequest = {
      login: data.login || this.user?.login || '',
      name: data.name ?? null,
      surname: data.surname ?? null,
      patronymic: data.patronymic ?? null,
      phoneNumber: data.phoneNumber ?? null,
    };
    if ('password' in data && data.password) {
      updatePayload.password = data.password as string;
    }
    await api.updateUserInfo(updatePayload);
    await this.refreshUser();
  }
}
