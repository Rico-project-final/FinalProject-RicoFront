import apiClient, { CanceledError } from './axios';
import { Review } from '../types';

export { CanceledError };

export type ReviewCategory = 'food' | 'service' | 'overall';



// POST /reviews/create (user or guest)
export const createReview = (data: {
  text: string;
  // category: ReviewCategory;
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

export const triggerAllReviewAnalyses = () => {
  return apiClient.post("/reviews/triggerAll")
};