import { apiClient } from '../api/apiClient';
import {
  ApiResponse,
  Booking,
  ContactMessage,
  DashboardSummary,
  Destination,
  PagedResponse,
  Vehicle,
  VehicleMaintenance
} from '../../types';

export const adminService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await apiClient.get<ApiResponse<DashboardSummary>>('/admin/dashboard/summary');
    return res.data.data;
  },

  // Vehicles
  async getAdminVehicles(page = 0, size = 20): Promise<PagedResponse<Vehicle>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<Vehicle>>>('/admin/vehicles', {
      params: { page, size }
    });
    return res.data.data;
  },

  async createVehicle(data: any): Promise<Vehicle> {
    const res = await apiClient.post<ApiResponse<Vehicle>>('/admin/vehicles', data);
    return res.data.data;
  },

  async updateVehicle(id: number, data: any): Promise<Vehicle> {
    const res = await apiClient.put<ApiResponse<Vehicle>>(`/admin/vehicles/${id}`, data);
    return res.data.data;
  },

  async deleteVehicle(id: number): Promise<void> {
    await apiClient.delete(`/admin/vehicles/${id}`);
  },

  // Bookings
  async getAdminBookings(page = 0, size = 20): Promise<PagedResponse<Booking>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<Booking>>>('/admin/bookings', {
      params: { page, size }
    });
    return res.data.data;
  },

  async updateBookingStatus(id: number, status: string, notes?: string): Promise<Booking> {
    const res = await apiClient.put<ApiResponse<Booking>>(`/admin/bookings/${id}/status`, { status, notes });
    return res.data.data;
  },

  // Destinations
  async createDestination(data: any): Promise<Destination> {
    const res = await apiClient.post<ApiResponse<Destination>>('/admin/destinations', data);
    return res.data.data;
  },

  async updateDestination(id: number, data: any): Promise<Destination> {
    const res = await apiClient.put<ApiResponse<Destination>>(`/admin/destinations/${id}`, data);
    return res.data.data;
  },

  // Maintenance
  async getMaintenance(): Promise<VehicleMaintenance[]> {
    const res = await apiClient.get<ApiResponse<VehicleMaintenance[]>>('/admin/maintenance');
    return res.data.data;
  },

  async scheduleMaintenance(data: {
    vehicleId: number;
    startDateTime: string;
    endDateTime: string;
    reason: string;
    status?: string;
  }): Promise<VehicleMaintenance> {
    const res = await apiClient.post<ApiResponse<VehicleMaintenance>>('/admin/maintenance', data);
    return res.data.data;
  },

  async deleteMaintenance(id: number): Promise<void> {
    await apiClient.delete(`/admin/maintenance/${id}`);
  },

  // Contact Messages
  async getContactMessages(page = 0, size = 20): Promise<PagedResponse<ContactMessage>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<ContactMessage>>>('/admin/contact-messages', {
      params: { page, size }
    });
    return res.data.data;
  },

  async markMessageAsRead(id: number): Promise<void> {
    await apiClient.put(`/admin/contact-messages/${id}/read`);
  }
};

