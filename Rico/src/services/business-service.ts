import apiClient from './axios';
import { Business } from '../types';

export const getBusinessById = (businessId: string) => {
  return apiClient.get<Business>(`/business/${businessId}`);
};

export const generateBusinessQr = () => {
  return apiClient.post<{ image: string; message: string }>('/business/generateQR');
};


