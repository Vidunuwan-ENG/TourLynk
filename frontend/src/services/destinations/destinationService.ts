import { apiClient } from '../api/apiClient';
import { ApiResponse, Destination, DestinationSummary, DistanceRoute, District, PagedResponse, Review } from '../../types';

export interface DestinationQueryParams {
  district?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  size?: number;
}

export const destinationService = {
  async getDestinations(params: DestinationQueryParams = {}): Promise<PagedResponse<DestinationSummary>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<DestinationSummary>>>('/destinations', { params });
    return res.data.data;
  },

  async getDistricts(): Promise<District[]> {
    const res = await apiClient.get<ApiResponse<District[]>>('/destinations/districts');
    return res.data.data;
  },

  async getPopularDestinations(): Promise<DestinationSummary[]> {
    const res = await apiClient.get<ApiResponse<DestinationSummary[]>>('/destinations/popular');
    return res.data.data;
  },

  async getDestinationBySlug(slug: string): Promise<Destination> {
    const res = await apiClient.get<ApiResponse<Destination>>(`/destinations/${slug}`);
    return res.data.data;
  },

  async getRelatedDestinations(slug: string): Promise<DestinationSummary[]> {
    const res = await apiClient.get<ApiResponse<DestinationSummary[]>>(`/destinations/${slug}/related`);
    return res.data.data;
  },

  async getDirections(slug: string, userLat: number, userLng: number): Promise<DistanceRoute> {
    const res = await apiClient.get<ApiResponse<DistanceRoute>>(`/destinations/${slug}/directions`, {
      params: { userLat, userLng }
    });
    return res.data.data;
  },

  async getReviews(slug: string): Promise<Review[]> {
    const res = await apiClient.get<ApiResponse<Review[]>>(`/destinations/${slug}/reviews`);
    return res.data.data;
  },

  async submitReview(slug: string, data: { rating: number; reviewText: string }): Promise<Review> {
    const res = await apiClient.post<ApiResponse<Review>>(`/destinations/${slug}/reviews`, data);
    return res.data.data;
  }
};

