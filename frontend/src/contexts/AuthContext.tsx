import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/auth/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('tourlynk_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('tourlynk_token');
      const storedUser = localStorage.getItem('tourlynk_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('tourlynk_user', JSON.stringify(currentUser));
        } catch (error) {
          // Token invalid or expired
          localStorage.removeItem('tourlynk_token');
          localStorage.removeItem('tourlynk_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('tourlynk_token', response.token);
      localStorage.setItem('tourlynk_user', JSON.stringify(response.user));
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, phoneNumber?: string) => {
    setLoading(true);
    try {
      const response = await authService.register({ fullName, email, password, phoneNumber });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('tourlynk_token', response.token);
      localStorage.setItem('tourlynk_user', JSON.stringify(response.user));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('tourlynk_token');
      localStorage.removeItem('tourlynk_user');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('tourlynk_user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

