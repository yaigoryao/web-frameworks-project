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

const API_BASE_URL = 'http://localhost:3002';

class ApiService {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
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

  // Auth endpoints
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', data);
    this.setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/register', data);
    this.setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/refresh', {
      refreshToken,
    });
    this.setToken(response.data.accessToken);
    return response.data;
  }

  // Customer endpoints
  async getUserInfo(): Promise<User> {
    const response = await this.client.get<User>('/customer/user');
    return response.data;
  }

  async updateUserInfo(data: CustomerUpdateUserRequest): Promise<User> {
    const response = await this.client.put<User>('/customer/user', data);
    return response.data;
  }

  async getCars(params?: CustomerGetCarsRequest): Promise<Car[]> {
    const response = await this.client.get<Car[]>('/customer/car', { params });
    return response.data;
  }

  async getOrders(params?: CustomerGetOrdersRequest): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/customer/order', { params });
    return response.data;
  }
}

export const api = new ApiService();
