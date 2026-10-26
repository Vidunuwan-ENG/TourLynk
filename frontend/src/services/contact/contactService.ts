import { apiClient } from '../api/apiClient';
import { ApiResponse, ContactMessage } from '../../types';

export const contactService = {
  async submitContact(data: { name: string; email: string; subject: string; message: string }): Promise<ContactMessage> {
    const res = await apiClient.post<ApiResponse<ContactMessage>>('/contact', data);
    return res.data.data;
  }
};

