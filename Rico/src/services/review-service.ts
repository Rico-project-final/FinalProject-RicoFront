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

// GET /reviews/getAll (admin only)
export const getAllReviews = () => {
  return apiClient.get<Review[]>('/reviews/getAll');
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
export const getReviewsByUser = () => {
  return apiClient.get<ReviewForUser[]>('/reviews/getByUser');
};
