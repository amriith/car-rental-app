import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { UserProfile, RegisterRequest } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.user) {
        const userProfile: UserProfile = {
          id: response.user.id,
          name: `${response.user.firstName} ${response.user.lastName}`,
          email: response.user.email,
          phone: response.user.phone,
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
          isAdmin: false // You can add admin logic based on your requirements
        };
        
        setUser(userProfile);
        localStorage.setItem('user', JSON.stringify(userProfile));
        localStorage.setItem('token', response.token || '');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      
      if (response.success && response.user) {
        const userProfile: UserProfile = {
          id: response.user.id,
          name: `${response.user.firstName} ${response.user.lastName}`,
          email: response.user.email,
          phone: response.user.phone,
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
          isAdmin: false
        };
        
        setUser(userProfile);
        localStorage.setItem('user', JSON.stringify(userProfile));
        localStorage.setItem('token', response.token || '');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  // Check for existing user on mount by verifying authentication
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if we have a saved user in localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          // Verify the user is still authenticated by checking with the backend
          const response = await authAPI.verifyUser();
          if (response.success) {
            // User is still authenticated, set the user
            setUser(JSON.parse(savedUser));
          } else {
            // User is not authenticated, clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear localStorage on error
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: user !== null,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};