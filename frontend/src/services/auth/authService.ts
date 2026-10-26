import { apiClient } from '../api/apiClient';
import { ApiResponse, AuthResponse, User } from '../../types';

export const authService = {
  async register(data: { fullName: string; email: string; password: string; phoneNumber?: string }): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return res.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('tourlynk_token');
      localStorage.removeItem('tourlynk_user');
    }
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  async updateProfile(data: { fullName: string; phoneNumber?: string; newPassword?: string }): Promise<User> {
    const res = await apiClient.put<ApiResponse<User>>('/users/me', data);
    return res.data.data;
  },
};

