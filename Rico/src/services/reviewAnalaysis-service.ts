import apiClient, { CanceledError } from './axios';
import { ReviewAnalysis } from '../types';

export { CanceledError };

// GET /analysis/getAll (admin only)
export const getAllReviewAnalyses = () => {
  return apiClient.get<ReviewAnalysis[]>('/analysis/getAll');
};

// GET /analysis/:reviewId (admin only)
export const getReviewAnalysisById = (reviewId: string) => {
  return apiClient.get<ReviewAnalysis>(`/analysis/${reviewId}`);
};

export const updateReviewAnalysisResolved = (reviewId: string) => {
  return apiClient.post<ReviewAnalysis>(`/analysis/update/${reviewId}`);
};
