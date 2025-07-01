import apiClient from './axios';
import { Business } from '../types';

export const getBusinessById = (businessId: string) => {
  return apiClient.get<Business>(`/business/id/${businessId}`);
};

export const generateBusinessQr = () => {
  return apiClient.post<{ image: string; message: string }>('/business/generateQR');
};

export const sendResponseToCustomer = (email : string , text : string) => {
  return apiClient.post<{ message: string }>('/business/sendEmailResponse', {email,text});
};

export const getLastSyncDate = () => {
  return apiClient.get<{ lastSyncDate: string }>('/business/lastSyncDate');
};


