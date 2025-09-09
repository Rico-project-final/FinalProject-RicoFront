import apiClient, { CanceledError } from './axios';
import { Review , ReviewForUser} from '../types';

export { CanceledError };

export type ReviewCategory = 'food' | 'service' | 'experience';



// POST /reviews/create (user or guest)
export const createReview = (data: {
  text: string;
  businessId: string;
}) => {
  return apiClient.post<Review>('/reviews/create', data);
};

// GET /reviews/getAll (admin only) - pagination
export const getAllReviews = (page = 1, limit = 10) => {
  return apiClient.get<{ reviews: Review[]; pagination: any }>(
    `/reviews/getAll?page=${page}&limit=${limit}`
  );
};

// GET /reviews/:reviewId (admin only)
export const getReviewById = (reviewId: string) => {
  return apiClient.get<Review>(`/reviews/${reviewId}`);
};

// DELETE /reviews/delete/:reviewId (admin only)
export const deleteReview = (reviewId: string) => {
  return apiClient.delete<{ message: string }>(`/reviews/delete/${reviewId}`);
};
// POST /reviews/triggerAll (admin only)

export const triggerAllReviewAnalyses = () => {
  return apiClient.post("/reviews/triggerAll")
};
// GET /reviews/getByUser (user only)
export const getReviewsByUser = (userId: string) => {
  return apiClient.get<any>(`/reviews/getByUser/${userId}`);
};
