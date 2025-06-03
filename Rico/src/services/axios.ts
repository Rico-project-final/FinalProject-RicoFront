import axios, { CanceledError } from "axios";
import authService from './auth-service';

// יצוא השגיאה לשימוש במקומות אחרים
export { CanceledError };

// הגדרת המשתנה הסביבתי או ברירת מחדל אם חסר
const API_URL = import.meta.env.VITE_API_URL;
console.log('API_URL:', API_URL);
// יצירת מופע axios עם הגדרות בסיסיות
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor להוספת טוקן לכל בקשה
apiClient.interceptors.request.use(
  (config) => {
    // בדיקה אם יש טוקן בלוקל סטורג'
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor לטיפול בשגיאות
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Handle 403 Forbidden - Invalid or expired token
    if (status === 403 && message === "Invalid or expired token") {
      authService.clearAuth();

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default apiClient;