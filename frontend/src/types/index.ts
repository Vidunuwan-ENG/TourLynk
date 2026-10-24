export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface VehicleImage {
  id: number;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  manufacturingYear: number;
  category: 'Car' | 'SUV' | 'Van' | 'Compact' | 'Luxury';
  description: string;
  registrationNumber: string;
  passengerCapacity: number;
  luggageCapacity: number;
  transmission: 'Automatic' | 'Manual' | 'Auto';
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  dailyRate: number;
  listingStatus: 'AVAILABLE' | 'MAINTENANCE' | 'UNAVAILABLE' | 'ARCHIVED';
  primaryImageUrl: string;
  isAvailable: boolean;
  computedStatus: 'Available' | 'Booked' | 'Maintenance' | 'Unavailable';
  isFavorite?: boolean;
  images?: VehicleImage[];
  createdAt?: string;
}

export interface VehicleAvailabilityCheck {
  vehicleId: number;
  available: boolean;
  status: 'Available' | 'Booked' | 'Maintenance' | 'Unavailable';
  startDateTime: string;
  endDateTime: string;
  totalDays: number;
  dailyRate: number;
  subtotal: number;
  totalAmount: number;
  currency: string;
  message: string;
}

export interface District {
  id: number;
  name: string;
  province: string;
  destinationCount: number;
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  district: string;
  province: string;
  shortDescription: string;
  fullDescription: string;
  latitude: number;
  longitude: number;
  category: 'Cultural' | 'Nature' | 'Coastal' | 'Wildlife' | 'Adventure';
  bestVisitPeriod?: string;
  estimatedVisitDuration?: string;
  entranceFeeInformation?: string;
  primaryImageUrl: string;
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
  images?: string[];
  createdAt?: string;
}

export interface DestinationSummary {
  id: number;
  name: string;
  slug: string;
  district: string;
  shortDescription: string;
  latitude: number;
  longitude: number;
  category: string;
  primaryImageUrl: string;
  averageRating: number;
  reviewCount: number;
}

export interface DistanceRoute {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  destinationName: string;
  straightLineDistanceKm: number;
  drivingDistanceKm?: number;
  drivingDistanceText?: string;
  drivingDurationMinutes?: number;
  drivingDurationText?: string;
  navigationUrl: string;
  routingSource: string;
  routeFound: boolean;
  routeCoordinates?: [number, number][];
}

export interface Booking {
  id: number;
  bookingReference: string;
  userId: number;
  userName: string;
  userEmail: string;
  vehicleId: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleCategory: string;
  vehicleImageUrl: string;
  vehicleRegistrationNumber: string;
  startDateTime: string;
  endDateTime: string;
  totalDays: number;
  dailyRateSnapshot: number;
  subtotal: number;
  additionalFees: number;
  totalAmount: number;
  currency: string;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | 'PAY_ON_PICKUP';
  specialNotes?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  destinationId?: number;
  destinationName?: string;
  vehicleId?: number;
  vehicleModel?: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface Favorite {
  id: number;
  userId: number;
  vehicle: Vehicle;
  createdAt: string;
}

export interface VehicleMaintenance {
  id: number;
  vehicleId: number;
  vehicleModel: string;
  vehicleRegistrationNumber: string;
  startDateTime: string;
  endDateTime: string;
  reason: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

export interface DashboardSummary {
  totalVehicles: number;
  availableVehicles: number;
  unavailableVehicles: number;
  upcomingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalUsers: number;
  totalDestinations: number;
  activeMaintenance: number;
  unreadContactMessages: number;
  recentBookings: Booking[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

