import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../services/api';
import type { CreateUserRequest, StaffUpdateUserRequest, User } from '../types';
import { USERS_LIST_TTL_MS } from './cache/cacheConstants';

export type UsersListQueryParams = {
  role?: string;
  search?: string;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

function cacheKey(p: UsersListQueryParams): string {
  return JSON.stringify(p);
}

export class UsersListStore {
  users: User[] = [];
  total = 0;
  loading = false;
  error: string | null = null;
  lastQuery: UsersListQueryParams | null = null;

  private cache = new Map<string, { users: User[]; total: number; fetchedAt: number }>();

  constructor() {
    makeAutoObservable(this);
  }

  async loadUsers(params: UsersListQueryParams, force = false): Promise<void> {
    runInAction(() => {
      this.lastQuery = params;
    });
    const key = cacheKey(params);
    if (!force) {
      const hit = this.cache.get(key);
      if (hit && Date.now() - hit.fetchedAt < USERS_LIST_TTL_MS) {
        runInAction(() => {
          this.users = hit.users;
          this.total = hit.total;
          this.error = null;
        });
        return;
      }
    }

    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const result = await api.getUsers({
        role: params.role,
        search: params.search,
        limit: params.limit,
        offset: params.offset,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      });
      runInAction(() => {
        this.users = result.users;
        this.total = result.total;
        this.loading = false;
        this.error = null;
      });
      this.cache.set(key, {
        users: result.users,
        total: result.total,
        fetchedAt: Date.now(),
      });
    } catch (e) {
      runInAction(() => {
        this.error = api.parseApiError(e).message;
        this.users = [];
        this.total = 0;
        this.loading = false;
      });
    }
  }

  async refreshList(): Promise<void> {
    if (this.lastQuery) {
      await this.loadUsers(this.lastQuery, true);
    }
  }

  invalidateCache(): void {
    this.cache.clear();
  }

  async checkLoginAvailability(login: string): Promise<{ available: boolean }> {
    return api.checkEmailAvailability(login);
  }

  async createUser(body: CreateUserRequest): Promise<void> {
    await api.createUser(body);
    this.invalidateCache();
  }

  async deleteUserByLogin(login: string): Promise<void> {
    await api.deleteUserByLogin(login);
    this.invalidateCache();
  }

  async updateStaffUser(body: StaffUpdateUserRequest): Promise<void> {
    await api.updateStaffUser(body);
    this.invalidateCache();
  }
}
