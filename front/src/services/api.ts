import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
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
} from '../types';

// Auth service - port 3001
const AUTH_API_BASE_URL = 'http://localhost:3001';
// Data service - port 3002
const DATA_API_BASE_URL = 'http://localhost:3002';

class ApiService {
  private authClient: AxiosInstance;
  private dataClient: AxiosInstance;
  private accessToken: string | null = null;

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
    const response = await this.authClient.get<LoginResponse>('/refresh', {
      params: { refreshToken },
    });
    this.setToken(response.data.accessToken);
    return response.data;
  }

  // Customer endpoints (data-service on port 3002)
  async getUserInfo(): Promise<User> {
    const response = await this.dataClient.get<User>('/customer/user');
    return response.data;
  }

  async updateUserInfo(data: CustomerUpdateUserRequest): Promise<User> {
    const response = await this.dataClient.put<User>('/customer/user', data);
    return response.data;
  }

  async getCars(params?: CustomerGetCarsRequest): Promise<Car[]> {
    const response = await this.dataClient.get<Car[]>('/customer/car', { params });
    return response.data;
  }

  async getOrders(params?: CustomerGetOrdersRequest): Promise<Order[]> {
    const response = await this.dataClient.get<Order[]>('/customer/order', { params });
    return response.data;
  }
}

export const api = new ApiService();
