import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/auth-service';
import {User} from '../types'
import { UserRole } from '../types'; // Import UserRole enum


// Define the shape of the context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isClient: boolean;
  isGuest: boolean; // Keeping this for convenience, but will calculate differently
  login: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, name: string , phone?:string) => Promise<void>;
  registerBusiness: (email: string, password: string, name: string , companyName:string, phone?:string) => Promise<void>;

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

  // Check if user is already logged in on component mount
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

  // Login function
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
  // Register function for business
  const registerBusiness = async (email: string, password: string, name: string , companyName:string  , phone?:string) => {
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

  // Register function
  const registerUser = async (email : string, password : string, name : string , phone? : string) => {
  setIsLoading(true);
  setError(null);

  try {
    const { request } = authService.registerUser({ email, password , name, phone });
    const response = await request;

    authService.saveAuth(response.data);
    setUser(response.data.user);
  } catch (err: any) {
    setError(err.response?.data?.message || 'Registration failed');
    throw err;
  } finally {
    setIsLoading(false);
  }
};


  // Logout function
  const logout = async () => {
    try {
      // Call logout API if user is authenticated
      if (user) {
        const { request } = await authService.logout();
        authService.clearAuth();
        setUser(null);
        // We don't need to await this, as we want to log out immediately
        request.catch(err => console.error('Logout error:', err));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Logout failed');
    }
  };

  // Google Login function
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

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Role check helpers
  const isAdmin = user?.role === UserRole.ADMIN;
  const isClient = user?.role === UserRole.CLIENT;
  const isGuest = !isAdmin && !isClient; // Anyone who is not an admin or client is a guest

  // Context value
  const value = {
    user,
    isAuthenticated: !!user, // If we have a user object, they are authenticated
    isLoading,
    error,
    isAdmin,
    isClient,
    isGuest,
    login,
    registerUser,
    registerBusiness,
    logout,
    loginWithGoogle,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;