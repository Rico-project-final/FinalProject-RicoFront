import axios from 'axios';
import { User } from '../context/auth-context';

// Define API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Define auth data structure
interface AuthData {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: number;
}

// Define return type for API requests
interface ApiRequest {
  request: Promise<any>;
  cancel: () => void;
}

// Authentication service
const authService = {
  // Create a cancellable request
  createCancellableRequest(url: string, method: string, data?: any): ApiRequest {
    const controller = new AbortController();
    const signal = controller.signal;

    const request = axios({
      url: `${API_URL}${url}`,
      method,
      data,
      signal,
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      },
    });

    return {
      request,
      cancel: () => controller.abort(),
    };
  },

  // Login with email and password
  login(credentials: { email: string; password: string }): ApiRequest {
    return this.createCancellableRequest('/auth/login', 'POST', credentials);
  },

  // Register a new user
  register(formData: FormData): ApiRequest {
    return this.createCancellableRequest('/auth/register', 'POST', formData);
  },

  // No specific guest login endpoint needed

  // Login with Google token
  loginWithGoogleToken(credential: string): ApiRequest {
    return this.createCancellableRequest('/auth/google', 'POST', { credential });
  },

  // Refresh token
  refreshToken(): ApiRequest {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.createCancellableRequest('/auth/refresh-token', 'POST', { refreshToken });
  },

  // Logout
  logout(): ApiRequest {
    return this.createCancellableRequest('/auth/logout', 'POST');
  },

  // Save authentication data
  saveAuth(data: AuthData): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('expiresAt', data.expiresAt.toString());
  },

  // No specific saveGuestSession needed

  // Get current token
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        return null;
      }
    }
    
    return null; // If no user data found, return null (user will be treated as guest)
  },

  // Clear auth data
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('expiresAt');
  },

  // Check if token is expired
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('expiresAt');
    if (!expiresAt) return true;
    
    return Date.now() > parseInt(expiresAt, 10);
  },

  // Get authenticated HTTP headers
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) return {};
    
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};

export default authService;