import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import {
  User,
  Car,
  Order,
  OrderStatus,
  Role,
  UserCar,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  CustomerUpdateUserRequest,
  CustomerGetCarsRequest,
  CustomerGetOrdersRequest,
  CreateUserRequest,
  CreateUserResponse,
  UserListResponse,
  ApiError,
  StaffUpdateUserRequest,
} from '../types';

/** Локальная разработка: прямой доступ к сервисам. Docker/nginx: относительные префиксы `/api/auth` и `/api/data`. */
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE ?? 'http://localhost:3001';
const DATA_API_BASE_URL = import.meta.env.VITE_DATA_API_BASE ?? 'http://localhost:3002';

class ApiService {
  private authClient: AxiosInstance;
  private dataClient: AxiosInstance;
  private accessToken: string | null = null;
  /** Роль для staff-роутов (из JWT или из GET /customer/user как fallback) */
  private staffRoleName: string | null = null;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private refreshErrorSubscribers: ((error: unknown) => void)[] = [];

  constructor() {
    // Auth client for authentication endpoints
    this.authClient = axios.create({
      baseURL: AUTH_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Data client for all other API endpoints
    this.dataClient = axios.create({
      baseURL: DATA_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to data requests
    this.dataClient.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const method = (config.method ?? '').toLowerCase();
        if (method === 'post' || method === 'put') {
          await this.refreshBeforePost();
        }
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      }
    );

    // Handle 401 and token refresh
    this.dataClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            const token = await this.waitForRefresh();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.dataClient(originalRequest);
          }

          this.isRefreshing = true;
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refresh(refreshToken);
              this.isRefreshing = false;
              this.refreshSubscribers.forEach((cb) => cb(response.accessToken));
              this.refreshErrorSubscribers = [];
              this.refreshSubscribers = [];
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              }
              return this.dataClient(originalRequest);
            }
            throw new Error('Refresh token missing');
          } catch {
            this.isRefreshing = false;
            this.refreshErrorSubscribers.forEach((cb) => cb(error));
            this.refreshErrorSubscribers = [];
            this.refreshSubscribers = [];
            this.clearToken();
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.accessToken = token;
    }
  }

  setToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
    this.syncRoleFromToken(token);
  }

  clearToken(): void {
    this.accessToken = null;
    this.staffRoleName = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /** Вызывать после загрузки профиля, чтобы owner/manager попадали на верные эндпоинты */
  setStaffUserRole(roleName: string | null): void {
    this.staffRoleName = roleName ? roleName.toLowerCase() : null;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Auth endpoints (user-service on port 3001)
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.authClient.post<LoginResponse>('/login', data);
    this.setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await this.authClient.post<LoginResponse>('/register', data);
    this.setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const response = await this.authClient.post<LoginResponse>('/refresh', {
      accessToken: this.accessToken,
      refreshToken,
    });
    this.setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  }

  private async refreshBeforePost(): Promise<void> {
    if (!this.accessToken) {
      return;
    }
    if (this.isRefreshing) {
      await this.waitForRefresh();
      return;
    }
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return;
    }
    this.isRefreshing = true;
    try {
      const response = await this.refresh(refreshToken);
      this.refreshSubscribers.forEach((cb) => cb(response.accessToken));
      this.refreshErrorSubscribers = [];
      this.refreshSubscribers = [];
    } catch (error) {
      this.refreshErrorSubscribers.forEach((cb) => cb(error));
      this.refreshErrorSubscribers = [];
      this.refreshSubscribers = [];
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private waitForRefresh(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.refreshSubscribers.push((token: string) => resolve(token));
      this.refreshErrorSubscribers.push((error: unknown) => reject(error));
    });
  }

  private syncRoleFromToken(token: string): void {
    const payload = this.parseJwtPayload(token);
    const roleFromToken = payload?.role ?? payload?.roleName;
    if (typeof roleFromToken === 'string' && roleFromToken.trim()) {
      this.staffRoleName = roleFromToken.toLowerCase();
    }
  }

  private parseJwtPayload(token: string): Record<string, unknown> | null {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }
    try {
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      return JSON.parse(atob(padded)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  // Customer endpoints (data-service on port 3002)
  async getUserInfo(): Promise<User> {
    const response = await this.dataClient.get<User>('/customer/user');
    return response.data;
  }

  async updateUserInfo(data: CustomerUpdateUserRequest): Promise<boolean> {
    const response = await this.dataClient.put<number>('/customer/user', data);
    // UserUpdateStatus: 0 = Success, 1 = NotFound, 2 = Error
    return response.data === 0;
  }

  async getCars(params?: CustomerGetCarsRequest): Promise<Car[]> {
    const response = await this.dataClient.get<Car[]>('/customer/car', { params });
    return response.data;
  }

  async getOrders(params?: CustomerGetOrdersRequest): Promise<Order[]> {
    const merged = { id: 0, limit: 100, offset: 0, ...params };
    const response = await this.dataClient.get<(Order | null)[]>('/customer/order', { params: merged });
    return (response.data || []).filter((o): o is Order => o != null);
  }

  /** GET /manager/order или /owner/order с фильтром userId */
  async getStaffOrders(params: {
    userId: number;
    id?: number;
    orderStatusId?: number | null;
    limit?: number;
    offset?: number;
  }): Promise<Order[]> {
    const base = this.getUserRole() === 'owner' ? '/owner/order' : '/manager/order';
    const merged = {
      id: params.id ?? 0,
      userId: params.userId,
      limit: params.limit ?? 100,
      offset: params.offset ?? 0,
      ...(params.orderStatusId != null ? { orderStatusId: params.orderStatusId } : {}),
    };
    const response = await this.dataClient.get<(Order | null)[]>(base, { params: merged });
    return (response.data || []).filter((o): o is Order => o != null);
  }

  /** PUT /manager/order — тело UpdateOrderCommand */
  async updateManagerOrder(body: {
    id: number;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    plannedEndDate?: string | Date | null;
    orderStatusId?: number | null;
    totalPrice?: number | null;
    description?: string | null;
  }): Promise<void> {
    const response = await this.dataClient.put<number>('/manager/order', body);
    if (response.data !== 0) {
      throw new Error(response.data === 1 ? 'Заказ не найден' : 'Не удалось обновить заказ');
    }
  }

  /** PUT /owner/order */
  async updateOwnerOrder(body: {
    id: number;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    plannedEndDate?: string | Date | null;
    orderStatusId?: number | null;
    totalPrice?: number | null;
    description?: string | null;
  }): Promise<void> {
    const response = await this.dataClient.put<number>('/owner/order', body);
    if (response.data !== 0) {
      throw new Error(response.data === 1 ? 'Заказ не найден' : 'Не удалось обновить заказ');
    }
  }

  async updateStaffOrder(body: {
    id: number;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    plannedEndDate?: string | Date | null;
    orderStatusId?: number | null;
    totalPrice?: number | null;
    description?: string | null;
  }): Promise<void> {
    if (this.getUserRole() === 'owner') {
      await this.updateOwnerOrder(body);
    } else {
      await this.updateManagerOrder(body);
    }
  }

  async deleteStaffOrder(orderId: number): Promise<void> {
    const base = this.getUserRole() === 'owner' ? '/owner/order' : '/manager/order';
    const response = await this.dataClient.delete<number>(`${base}/${orderId}`);
    if (response.data !== 0) {
      throw new Error(
        response.data === 1 ? 'Заказ не найден' : 'Не удалось пометить заказ как удалённый'
      );
    }
  }

  parseApiError(error: unknown): ApiError {
    if (error instanceof AxiosError && error.response?.data) {
      return {
        message: error.response.data.message || 'Произошла ошибка',
        code: error.response.data.code,
        status: error.response.status,
      };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: 'Неизвестная ошибка' };
  }

  async getUsers(params?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<UserListResponse> {
    // Use /manager/users for managers, /owner/users for owners
    const userRole = this.getUserRole();
    const endpoint = userRole === 'owner' ? '/owner/users' : '/manager/users';
    const response = await this.dataClient.get<UserListResponse>(endpoint, { params });
    return response.data;
  }

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const userRole = this.getUserRole();
    const endpoint = userRole === 'owner' ? '/owner/users' : '/manager/users';
    const body =
      userRole === 'owner'
        ? data
        : {
            name: data.name,
            surname: data.surname,
            patronymic: data.patronymic,
            login: data.login,
            password: data.password,
            phoneNumber: data.phoneNumber,
          };
    const response = await this.dataClient.post<CreateUserResponse>(endpoint, body);
    return response.data;
  }

  async checkEmailAvailability(login: string): Promise<{ available: boolean }> {
    // Use /manager/users for managers, /owner/users for owners
    const userRole = this.getUserRole();
    const endpoint = userRole === 'owner' ? '/owner/users' : '/manager/users';
    const response = await this.dataClient.get<{ available: boolean }>(`${endpoint}/check-login`, {
      params: { login },
    });
    return response.data;
  }

  /** DELETE /manager/user/:login или /owner/user/:login — см. contract / data-service */
  async deleteUserByLogin(login: string): Promise<void> {
    const userRole = this.getUserRole();
    const base = userRole === 'owner' ? '/owner/user' : '/manager/user';
    const response = await this.dataClient.delete<number>(`${base}/${encodeURIComponent(login)}`);
    const code = response.data;
    if (code !== 0) {
      throw new Error(code === 1 ? 'Пользователь не найден' : 'Не удалось удалить пользователя');
    }
  }

  /** PUT /manager/user или /owner/user — статус и прочие поля */
  async updateStaffUser(body: StaffUpdateUserRequest): Promise<void> {
    const userRole = this.getUserRole();
    const endpoint = userRole === 'owner' ? '/owner/user' : '/manager/user';
    const response = await this.dataClient.put<number>(endpoint, body);
    const code = response.data;
    if (code !== 0) {
      throw new Error(code === 1 ? 'Пользователь не найден' : 'Не удалось обновить пользователя');
    }
  }

  /** GET /manager/user или /owner/user с query id */
  async getStaffUserById(id: number): Promise<User> {
    const endpoint = this.getUserRole() === 'owner' ? '/owner/user' : '/manager/user';
    const response = await this.dataClient.get<User>(endpoint, { params: { id } });
    return response.data;
  }

  /** GET /manager/role (доступен и владельцу по RolesGuard) */
  async getStaffRoles(limit = 50, offset = 0): Promise<Role[]> {
    const response = await this.dataClient.get<{ roles: Role[]; total: number }>('/manager/role', {
      params: { limit, offset },
    });
    return response.data.roles;
  }

  /** GET /manager/car или /owner/car */
  async getStaffCars(params: {
    userId?: number;
    vin?: string;
    id?: number;
    carNumber?: string;
    limit: number;
    offset: number;
  }): Promise<Car[]> {
    const base = this.getUserRole() === 'owner' ? '/owner/car' : '/manager/car';
    const response = await this.dataClient.get<(Car | null)[]>(base, { params });
    return (response.data || []).filter((c): c is Car => c != null);
  }

  /** POST /manager/car — 0 = success */
  async createStaffCar(body: {
    carNumber: string;
    modelName: string;
    vin: string;
    color: number;
  }): Promise<void> {
    const response = await this.dataClient.post<number>('/manager/car', body);
    if (response.data !== 0) {
      throw new Error('Не удалось добавить автомобиль');
    }
  }

  /** PUT /manager/car — 0 = success */
  async updateStaffCar(body: {
    id: number;
    carNumber: string;
    modelName: string;
    vin: string;
    color: number;
  }): Promise<void> {
    const response = await this.dataClient.put<number>('/manager/car', body);
    if (response.data !== 0) {
      throw new Error(response.data === 1 ? 'Автомобиль не найден' : 'Не удалось обновить автомобиль');
    }
  }

  /** GET /manager/usercar */
  async getStaffUserCarLinks(params: {
    userId?: number;
    carId?: number;
    ownsNow?: boolean;
    limit: number;
    offset: number;
  }): Promise<UserCar[]> {
    const response = await this.dataClient.get<UserCar[]>('/manager/usercar', { params });
    return response.data || [];
  }

  /** POST /manager/usercar — 0 = success */
  async addStaffUserCar(body: { userId: number; carId: number; ownsNow: boolean }): Promise<void> {
    const response = await this.dataClient.post<number>('/manager/usercar', body);
    if (response.data !== 0) {
      throw new Error('Не удалось привязать автомобиль');
    }
  }

  /** DELETE /manager/usercar?userId=&carId= */
  async deleteStaffUserCar(userId: number, carId: number): Promise<void> {
    const response = await this.dataClient.delete<number>('/manager/usercar', {
      params: { userId, carId },
    });
    if (response.data !== 0) {
      throw new Error('Не удалось снять привязку');
    }
  }

  /** GET /manager/orderstatus */
  async getStaffOrderStatuses(limit = 50, offset = 0): Promise<OrderStatus[]> {
    const response = await this.dataClient.get<OrderStatus[]>('/manager/orderstatus', { params: { limit, offset } });
    return response.data || [];
  }

  /** POST /manager/order — 0 = success */
  async createStaffOrder(body: {
    userId: number;
    carId: number;
    totalPrice: number;
    description: string | null;
    startDate: string;
    plannedEndDate: string;
    endDate: string | null;
    orderStatusId: number;
  }): Promise<void> {
    const response = await this.dataClient.post<number>('/manager/order', body);
    if (response.data !== 0) {
      throw new Error('Не удалось создать заказ');
    }
  }

  private getUserRole(): string {
    if (this.staffRoleName === 'owner' || this.staffRoleName === 'manager') {
      return this.staffRoleName;
    }
    return 'user';
  }

  isOwner(): boolean {
    return this.accessToken !== null;
  }

  isManager(): boolean {
    return this.accessToken !== null;
  }

  isClient(): boolean {
    return this.accessToken !== null;
  }
}

export const api = new ApiService();
