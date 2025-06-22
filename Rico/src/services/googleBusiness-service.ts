import apiClient from './axios';

export const connectGoogleBusiness = (code: string, placeId: string) => {
  return apiClient.post('/googleBusiness/googleOauth', { code, placeId });
};

export const checkGoogleConnection = async () => {
  return apiClient.get('/googleBusiness/isGoogleConnected');
};
