import apiClient, { CanceledError } from './axios';
import { ReviewAnalysis } from '../types';

export { CanceledError };

// GET /analysis/getAll (admin only) - pagination
export const getAllReviewAnalyses = (page = 1, limit = 10) => {
  return apiClient.get<{ reviews: ReviewAnalysis[]; pagination: any }>(
    `/analysis/getAll?page=${page}&limit=${limit}`
  );
};
// GET /analysis/getAll (admin only)
export const getAllReviewAnalysesNoPage = () => {
  return apiClient.get<ReviewAnalysis[]>('/analysis/getAllNoPage');
};

// GET /analysis/:reviewId (admin only)
export const getReviewAnalysisById = (reviewId: string) => {
  return apiClient.get<ReviewAnalysis>(`/analysis/${reviewId}`);
};

export const updateReviewAnalysisResolved = (reviewId: string) => {
  return apiClient.post<ReviewAnalysis>(`/analysis/update/${reviewId}`);
};

export const getReviewAnalysisStatus = () => {
  return apiClient.get<{ allAnalyzed: boolean }>('/analysis/status');
};
