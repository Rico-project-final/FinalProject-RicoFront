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
    _id?:string; 
    name: string;
    email: string;
    phone?: string;
    password: string;
    profileImage: string;
    role: 'admin' | 'customer';
}
export type ReviewCategory = 'food' | 'service' | 'experience';

export interface Review {
  _id: string;
   userId?: string | {
    _id: string;
    name: string;
    email: string;
  };
  text: string;
  category: ReviewCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewForUser {
  _id: string;
  text: string;
  createdAt: string;
  businessId: {
    _id: string;
    BusinessName: string;
  };
}

export interface ReviewAnalysis extends Document {
  reviewId:string;
  userId?: string | null | {
    _id: string;
    name: string;
    email: string;
  }; 
  text: string; 
  category: 'food' | 'service' | 'overall experience';
  sentiment: 'positive' | 'neutral' | 'negative'; 
  analysisSummary: string; 
  suggestions?: string; 
  adminResponse?: string;
  isResolved: boolean; 
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  _id: string;
  BusinessName: string;
  phone: string;
  reviews: string[];
  ownerId?: string;
}

