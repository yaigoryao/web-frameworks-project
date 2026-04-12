export type UserRole = 'owner' | 'manager' | 'user';

export interface User {
  id: number;
  login: string;
  name: string;
  surname: string;
  patronymic: string | null;
  isActive: boolean;
  phoneNumber: string;
  roleId: number;
  role: Role;
  createdAt?: string;
}

export interface Role {
  id: number;
  roleName: string;
  description: string;
}

export interface Car {
  id: number;
  carNumber: string;
  modelName: string;
  vin: string;
  color: number;
}

export interface Order {
  id: number;
  totalPrice: number;
  description: string;
  startDate: string;
  endDate: string | null;
  plannedEndDate: string;
  orderStatusId: number;
  orderStatus: OrderStatus;
  carId: number;
  car: Car;
  userId: number;
}

export interface OrderStatus {
  id: number;
  orderStatusName: string;
}

export interface UserCar {
  userId: number;
  carId: number;
  ownsNow: boolean;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  login: string;
  password: string;
  name: string;
  surname: string;
  patronymic?: string;
  phoneNumber: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CustomerUpdateUserRequest {
  login: string;
  name: string | null;
  surname: string | null;
  patronymic: string | null;
  phoneNumber: string | null;
  password?: string | null;
}

export interface CustomerGetCarsRequest {
  limit?: number;
  offset?: number;
}

export interface CustomerGetOrdersRequest {
  id?: number;
  startDate?: string | null;
  endDate?: string | null;
  orderStatusId?: number | null;
  limit?: number;
  offset?: number;
}

export interface CreateUserRequest {
  name: string;
  surname: string;
  patronymic?: string;
  login: string;
  password: string;
  phoneNumber?: string;
  role?: 'manager' | 'user';
}

export interface StaffUpdateUserRequest {
  login: string;
  password?: string | null;
  name?: string | null;
  surname?: string | null;
  patronymic?: string | null;
  isActive?: boolean | null;
  phoneNumber?: string | null;
  roleId?: number | null;
}

export interface CreateUserResponse {
  id: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const COLOR_MAP: Record<number, { name: string; hex: string }> = {
  0: { name: 'Белый', hex: '#FFFFFF' },
  1: { name: 'Жёлтый', hex: '#FFFF00' },
  2: { name: 'Коричневый', hex: '#8B4513' },
  3: { name: 'Красный', hex: '#FF0000' },
  4: { name: 'Оранжевый', hex: '#FFA500' },
  5: { name: 'Фиолетовый', hex: '#800080' },
  6: { name: 'Синий', hex: '#0000FF' },
  7: { name: 'Зелёный', hex: '#008000' },
  8: { name: 'Чёрный', hex: '#000000' },
  9: { name: 'Иной', hex: '#808080' },
};

export function normalizeCarColorIndex(color: number): number {
  if (typeof color !== 'number' || !Number.isFinite(color)) return 9;
  const n = Math.floor(color);
  if (n < 0 || n > 9) return 9;
  return n;
}

export const ORDER_STATUS_MAP: Record<string, string> = {
  pending: 'Ожидание',
  in_process: 'В процессе',
  completed: 'Завершён',
  cancelled: 'Отменён',
  deleted: 'Удалён',
  waiting_car: 'Ожидание машины',
};

export const ROLE_NAMES: Record<string, string> = {
  owner: 'Владелец',
  manager: 'Менеджер',
  user: 'Клиент',
};

