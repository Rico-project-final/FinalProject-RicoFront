import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/auth-service';
import { User } from '../types';
import { UserRole } from '../types';

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;

  login: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, name: string, phone?: string) => Promise<{ message: string }>;
  registerBusiness: (email: string, password: string, name: string, companyName: string, phone?: string) => Promise<void>;
  registerBusinessWithGoogle: (
    credential: string,
    password: string,
    companyName: string,
    phone?: string
  ) => Promise<void>;
  logout: () => void;
  loginWithGoogle: (credential: string) => Promise<void>;
  clearError: () => void;
}

// Create context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { request } = authService.login({ email, password });
      const response = await request;
      authService.saveAuth(response.data);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerBusiness = async (email: string, password: string, name: string, companyName: string, phone?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { request } = authService.registerBusiness({ email, password, companyName, name, phone });
      const response = await request;
      authService.saveAuth(response.data);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Business registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    name: string,
    phone?: string
  ): Promise<{ message: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const { request } = authService.registerUser({ email, password, name, phone });
      const response = await request;
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user) {
        const { request } = await authService.logout();
        authService.clearAuth();
        setUser(null);
        request.catch(err => console.error('Logout error:', err));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Logout failed');
    }
  };

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { request } = authService.loginWithGoogleToken(credential);
      const response = await request;
      authService.saveAuth(response.data);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerBusinessWithGoogle = async (
    credential: string,
    password: string,
    companyName: string,
    phone?: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { request } = authService.businessGoogleSignUp(
        credential,
        companyName,
        phone ?? '',
        password
      );
      const response = await request;
      authService.saveAuth(response.data);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google business registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    isAdmin,
    setUser, // ✅ Make setUser accessible
    login,
    registerUser,
    registerBusiness,
    registerBusinessWithGoogle,
    logout,
    loginWithGoogle,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
