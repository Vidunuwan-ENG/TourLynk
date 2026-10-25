import { apiClient } from '../api/apiClient';
import { ApiResponse, PagedResponse, Vehicle, VehicleAvailabilityCheck } from '../../types';

export interface VehicleQueryParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minPassengers?: number;
  transmission?: string;
  fuelType?: string;
  search?: string;
  startDateTime?: string;
  endDateTime?: string;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  size?: number;
}

export const vehicleService = {
  async getVehicles(params: VehicleQueryParams = {}): Promise<PagedResponse<Vehicle>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<Vehicle>>>('/vehicles', { params });
    return res.data.data;
  },

  async getPopularVehicles(): Promise<Vehicle[]> {
    const res = await apiClient.get<ApiResponse<Vehicle[]>>('/vehicles/popular');
    return res.data.data;
  },

  async getVehicleById(id: number, startDateTime?: string, endDateTime?: string): Promise<Vehicle> {
    const params = startDateTime && endDateTime ? { startDateTime, endDateTime } : {};
    const res = await apiClient.get<ApiResponse<Vehicle>>(`/vehicles/${id}`, { params });
    return res.data.data;
  },

  async checkAvailability(id: number, startDateTime: string, endDateTime: string): Promise<VehicleAvailabilityCheck> {
    const res = await apiClient.get<ApiResponse<VehicleAvailabilityCheck>>(`/vehicles/${id}/availability`, {
      params: { startDateTime, endDateTime }
    });
    return res.data.data;
  },

  async toggleFavorite(vehicleId: number, isCurrentlyFavorite: boolean): Promise<void> {
    if (isCurrentlyFavorite) {
      await apiClient.delete(`/favorites/${vehicleId}`);
    } else {
      await apiClient.post(`/favorites/${vehicleId}`);
    }
  },

  async getUserFavorites(): Promise<Vehicle[]> {
    const res = await apiClient.get<ApiResponse<Array<{ vehicle: Vehicle }>>>('/favorites');
    return res.data.data.map(f => f.vehicle);
  }
};

