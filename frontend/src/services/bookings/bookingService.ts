import { apiClient } from '../api/apiClient';
import { ApiResponse, Booking, PagedResponse } from '../../types';

export const bookingService = {
  async createBooking(data: {
    vehicleId: number;
    startDateTime: string;
    endDateTime: string;
    specialNotes?: string;
  }): Promise<Booking> {
    const res = await apiClient.post<ApiResponse<Booking>>('/bookings', data);
    return res.data.data;
  },

  async getMyBookings(page = 0, size = 10): Promise<PagedResponse<Booking>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<Booking>>>('/bookings/me', {
      params: { page, size }
    });
    return res.data.data;
  },

  async getBookingById(id: number): Promise<Booking> {
    const res = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return res.data.data;
  },

  async cancelBooking(id: number, reason?: string): Promise<Booking> {
    const res = await apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`, { reason });
    return res.data.data;
  }
};

