import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest, CustomerUpdateUserRequest } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const userData = await api.getUserInfo();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (api.isAuthenticated()) {
        await refreshUser();
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    await api.login(data);
    await refreshUser();
  };

  const register = async (data: RegisterRequest) => {
    await api.register(data);
    await refreshUser();
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const updatePayload: CustomerUpdateUserRequest = {
        login: data.login || '',
        name: data.name ?? null,
        surname: data.surname ?? null,
        patronymic: data.patronymic ?? null,
        phoneNumber: data.phoneNumber ?? null,
      };
      if (data.password) {
        updatePayload.password = data.password;
      }
      await api.updateUserInfo(updatePayload);
      await refreshUser();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
