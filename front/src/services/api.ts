import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import {
  User,
  Car,
  Order,
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
} from '../types';

// Auth service - port 3001
const AUTH_API_BASE_URL = 'http://localhost:3001';
// Data service - port 3002
const DATA_API_BASE_URL = 'http://localhost:3002';

class ApiService {
  private authClient: AxiosInstance;
  private dataClient: AxiosInstance;
  private accessToken: string | null = null;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

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
      (config: InternalAxiosRequestConfig) => {
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
        const originalRequest = error.config;
        if (error.response?.status === 401 && originalRequest && !this.isRefreshing) {
          this.isRefreshing = true;
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refresh(refreshToken);
              this.isRefreshing = false;
              this.refreshSubscribers.forEach((cb) => cb(response.accessToken));
              this.refreshSubscribers = [];
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              }
              return this.dataClient(originalRequest);
            }
          } catch {
            this.isRefreshing = false;
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

  private subscribeTokenRefresh(cb: (token: string) => void): void {
    this.refreshSubscribers.push(cb);
  }

  private async withRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: Error | null = null;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401 || status === 403 || status === 404 || status === 422) {
            throw error;
          }
          if (error.code === 'ECONNABORTED' || !error.response) {
            await new Promise((res) => setTimeout(res, delay * (i + 1)));
            continue;
          }
        }
        throw error;
      }
    }
    throw lastError || new Error('Request failed');
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
  }

  clearToken(): void {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
    return response.data;
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
    const response = await this.dataClient.get<Order[]>('/customer/order', { params });
    return response.data;
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
    // Use /manager/users for managers, /owner/users for owners
    const userRole = this.getUserRole();
    const endpoint = userRole === 'owner' ? '/owner/users' : '/manager/users';
    const response = await this.dataClient.post<CreateUserResponse>(endpoint, data);
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

  async deleteUser(userId: number): Promise<void> {
    const userRole = this.getUserRole();
    const endpoint = userRole === 'owner' ? '/owner/users' : '/manager/users';
    await this.dataClient.delete(`${endpoint}/${userId}`);
  }

  async updateUserStatus(userId: number, isActive: boolean): Promise<User> {
    const userRole = this.getUserRole();
    const endpoint = userRole === 'owner' ? '/owner/users' : '/manager/users';
    const response = await this.dataClient.patch<User>(`${endpoint}/${userId}/status`, { isActive });
    return response.data;
  }

  private getUserRole(): string {
    const token = this.accessToken;
    if (!token) return 'client';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role?.toLowerCase() || 'client';
    } catch {
      return 'client';
    }
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
