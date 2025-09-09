import { User } from '../types';
import apiClient from './axios'; // Use your configured Axios client

// Define auth data structure
interface AuthData {
  accessToken: string;
  user: User;
}

// Define return type for API requests
interface ApiRequest {
  request: Promise<any>;
  cancel: () => void;
}

// Authentication service
const authService = {
  // Create a cancellable request using apiClient
  createCancellableRequest(url: string, method: string, data?: any): ApiRequest {
    const controller = new AbortController();
    const signal = controller.signal;

    const request = apiClient.request({
      url,
      method,
      data,
      signal,
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
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
  registerUser(data: { email: string; password: string; name: string , phone?:string}): ApiRequest {
  return this.createCancellableRequest('/auth/registerCustomer', 'POST', data);
},

// Register a new business
registerBusiness(data: { email: string; password: string; companyName: string; name: string , phone?:string}): ApiRequest {
  return this.createCancellableRequest('/auth/registerBusiness', 'POST', data);
},

  // Login with Google token
  loginWithGoogleToken(credential: string): ApiRequest {
    return this.createCancellableRequest('/auth/customerGoogleAuth', 'POST', { credential });
  },
    businessGoogleSignUp(
    credential: string,
    businessName: string,
    phone: string,
    password: string
  ): ApiRequest {
    return this.createCancellableRequest('/auth/businessGoogleAuth', 'POST', {
      credential,
      businessName,
      phone,
      password,
    });
  },
  verifyEmail(token: string): ApiRequest {
    return this.createCancellableRequest(`/auth/verifyEmail?token=${token}`, 'GET');
  },
  // Logout
  logout(): ApiRequest {
    return this.createCancellableRequest('/auth/logout', 'POST');
  },

  // Save authentication data
  saveAuth(data: AuthData): void {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  // Get current token
  getToken(): string | null {
    return localStorage.getItem('accessToken');
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
    return null;
  },

  // Clear auth data
  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
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
