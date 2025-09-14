import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - cookies are automatically sent with credentials: true
api.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent with credentials: true
    // No need to manually add Authorization headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.get('/auth/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  
  verifyUser: async () => {
    const response = await api.get('/auth/verify-user');
    return response.data;
  },
};

// Fleet API
export const fleetAPI = {
  getCars: async () => {
    const response = await api.get('/fleet/fleet');
    return response.data;
  },
  
  addCar: async (carData: {
    make: string;
    model: string;
    year: string;
    price: string;
    carType: string;
  }) => {
    const response = await api.post('/fleet/fleet', carData);
    return response.data;
  },
};

// Booking API
export const bookingAPI = {
  getBookings: async () => {
    const response = await api.get('/bookings/bookings');
    return response.data;
  },
  
  createBooking: async (bookingData: {
    carId: string;
    userId: string;
    addressId: string;
  }) => {
    const response = await api.post('/bookings/book', bookingData);
    return response.data;
  },
  
  cancelBooking: async (bookingId: string) => {
    const response = await api.post('/bookings/cancel', { bookingId });
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  getMessages: async (sessionId: string) => {
    const response = await api.get(`/chat/session/${sessionId}/messages`);
    return response.data;
  },
  
  sendMessage: async (sessionId: string, message: string) => {
    const response = await api.post(`/chat/session/${sessionId}/message`, { message });
    return response.data;
  },
  
  createSession: async () => {
    const response = await api.post('/chat/session');
    return response.data;
  },
};

export default api;
