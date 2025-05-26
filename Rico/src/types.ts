export interface Task {
  _id: string;
  title: string;
  description?: string;
  relatedReview?: string;
  isCompleted: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin'
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}
export type ReviewCategory = 'food' | 'service' | 'overall';

export interface Review {
  _id: string;
   userId?: string | null | {
    _id: string;
    name: string;
    email: string;
  };
  text: string;
  category: ReviewCategory;
  createdAt: string;
  updatedAt: string;
}