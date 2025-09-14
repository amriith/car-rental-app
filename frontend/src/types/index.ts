// Backend Car model (from Prisma schema)
export interface Car {
  id: string;
  make: string;
  model: string;
  year: string;
  price: string;
  carType: 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'SportsCar' | 'Convertible' | 'Coupe' | 'Hatchback' | 'Wagon';
  createdAt: string;
  updatedAt: string;
}

// Frontend Car interface with additional UI properties
export interface CarWithDetails extends Car {
  name: string;
  brand: string;
  category: 'luxury' | 'suv' | 'electric' | 'economy';
  image: string;
  images: string[];
  transmission: 'automatic' | 'manual';
  fuel: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  features: string[];
  rating: number;
  reviews: number;
  available: boolean;
}

// Backend Booking model (from Prisma schema)
export interface Booking {
  id: string;
  userId: string;
  carId: string;
  addressId: string;
  createdAt: string;
  updatedAt: string;
  car: Car;
  address: Address;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Frontend Booking interface with additional UI properties
export interface BookingWithDetails extends Booking {
  startDate: Date;
  endDate: Date;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalPrice: number;
  pickupLocation: string;
  dropoffLocation: string;
}

// Backend User model (from Prisma schema)
export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend User interface for UI
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isAdmin?: boolean;
}

// Address model (from Prisma schema)
export interface Address {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

// Chat models (from Prisma schema)
export interface ChatMessage {
  id: string;
  sessionId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | any[];
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}