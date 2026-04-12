import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../services/api';
import type { OrderStatus } from '../types';
import { ORDER_STATUSES_TTL_MS } from './cache/cacheConstants';

export class StaffReferenceStore {
  orderStatuses: OrderStatus[] = [];
  orderStatusesLoading = false;
  orderStatusesError: string | null = null;
  private orderStatusesFetchedAt: number | null = null;
  private orderStatusesInflight: Promise<void> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  private isOrderStatusesFresh(): boolean {
    return (
      this.orderStatusesFetchedAt != null &&
      Date.now() - this.orderStatusesFetchedAt < ORDER_STATUSES_TTL_MS &&
      this.orderStatusesError == null
    );
  }

  async ensureOrderStatuses(force = false): Promise<void> {
    if (!force && this.isOrderStatusesFresh()) return;
    if (this.orderStatusesInflight) {
      await this.orderStatusesInflight;
      return;
    }
    this.orderStatusesInflight = (async () => {
      runInAction(() => {
        this.orderStatusesLoading = true;
        this.orderStatusesError = null;
      });
      try {
        const data = await api.getStaffOrderStatuses(50, 0);
        runInAction(() => {
          this.orderStatuses = data;
          this.orderStatusesFetchedAt = Date.now();
        });
      } catch (e) {
        runInAction(() => {
          this.orderStatusesError = api.parseApiError(e).message;
          this.orderStatuses = [];
        });
      } finally {
        runInAction(() => {
          this.orderStatusesLoading = false;
        });
      }
    })();
    try {
      await this.orderStatusesInflight;
    } finally {
      this.orderStatusesInflight = null;
    }
  }

  invalidateOrderStatuses(): void {
    this.orderStatusesFetchedAt = null;
    this.orderStatusesError = null;
  }
}
