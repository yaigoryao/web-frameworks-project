import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../services/api';
import type { Car, Order } from '../types';
import { CUSTOMER_LIST_TTL_MS } from './cache/cacheConstants';

export class CustomerDataStore {
  cars: Car[] = [];
  carsLoading = false;
  carsError: string | null = null;
  carsFetchedAt: number | null = null;
  private carsInflight: Promise<void> | null = null;

  orders: Order[] = [];
  ordersLoading = false;
  ordersError: string | null = null;
  ordersFetchedAt: number | null = null;
  private ordersInflight: Promise<void> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  private isCarsFresh(): boolean {
    return (
      this.carsFetchedAt != null &&
      Date.now() - this.carsFetchedAt < CUSTOMER_LIST_TTL_MS &&
      this.carsError == null
    );
  }

  private isOrdersFresh(): boolean {
    return (
      this.ordersFetchedAt != null &&
      Date.now() - this.ordersFetchedAt < CUSTOMER_LIST_TTL_MS &&
      this.ordersError == null
    );
  }

  async ensureCars(force = false): Promise<void> {
    if (!force && this.isCarsFresh()) return;
    if (this.carsInflight) {
      await this.carsInflight;
      return;
    }
    this.carsInflight = (async () => {
      runInAction(() => {
        this.carsLoading = true;
        this.carsError = null;
      });
      try {
        const data = await api.getCars({ limit: 100, offset: 0 });
        runInAction(() => {
          this.cars = data;
          this.carsFetchedAt = Date.now();
        });
      } catch (e) {
        runInAction(() => {
          this.carsError = api.parseApiError(e).message;
          this.cars = [];
        });
      } finally {
        runInAction(() => {
          this.carsLoading = false;
        });
      }
    })();
    try {
      await this.carsInflight;
    } finally {
      this.carsInflight = null;
    }
  }

  async ensureOrders(force = false): Promise<void> {
    if (!force && this.isOrdersFresh()) return;
    if (this.ordersInflight) {
      await this.ordersInflight;
      return;
    }
    this.ordersInflight = (async () => {
      runInAction(() => {
        this.ordersLoading = true;
        this.ordersError = null;
      });
      try {
        const data = await api.getOrders({ id: 0, limit: 100, offset: 0 });
        runInAction(() => {
          this.orders = data;
          this.ordersFetchedAt = Date.now();
        });
      } catch (e) {
        runInAction(() => {
          this.ordersError = api.parseApiError(e).message;
          this.orders = [];
        });
      } finally {
        runInAction(() => {
          this.ordersLoading = false;
        });
      }
    })();
    try {
      await this.ordersInflight;
    } finally {
      this.ordersInflight = null;
    }
  }

  invalidateCars(): void {
    this.carsFetchedAt = null;
    this.carsError = null;
  }

  invalidateOrders(): void {
    this.ordersFetchedAt = null;
    this.ordersError = null;
  }

  invalidateAll(): void {
    this.invalidateCars();
    this.invalidateOrders();
  }
}
