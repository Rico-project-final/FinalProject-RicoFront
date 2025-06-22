import apiClient, { CanceledError } from './axios';
import { User, Review } from '../types';

export { CanceledError };

//get all users (admin only) - pagination
export const getAllUsers = (page = 1, limit = 10) => {
  return apiClient.get<{ users: User[]; pagination: any }>(
    `/users/getAll?page=${page}&limit=${limit}`
  );
};

export const getUserById = (userId: string) => {
  return apiClient.get<User>(`/users/${userId}`);
};

export const getProfile = () => {
  return apiClient.get<User>('/users');
};

export const updateProfile = (data: Partial<User>) => {
  return apiClient.post<User>('/users/update', data);
};

export const deleteProfile = () => {
  return apiClient.delete<{ message: string }>('/users/delete');
};
export const getDashboardStats = () => {
  return apiClient.get<{
    totalClients: number;
    totalTasks: number;
    totalReviews: number;
    lastWeekReviews: Review[];
    chartData : any;
  }>('/users/dashboard');
}

