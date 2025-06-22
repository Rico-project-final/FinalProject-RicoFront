import apiClient, { CanceledError } from './axios';
import {Task} from '../types'

export { CanceledError };



// GET all tasks (admin-only) - pagination
export const getAllTasks = (page = 1, limit = 10) => {
  return apiClient.get<{ tasks: Task[]; pagination: any }>(
    `/tasks?page=${page}&limit=${limit}`
  );
};

// GET a specific task by ID
export const getTaskById = (taskId: string) => {
  return apiClient.get<Task>(`/tasks/${taskId}`);
};

// POST create a new task
export const createTask = (taskData: Partial<Task>) => {
  return apiClient.post<Task>('/tasks/create', taskData);
};

// PUT update a task by ID
export const updateTask = (taskId: string, updates: Partial<Task>) => {
  return apiClient.put<Task>(`/tasks/update/${taskId}`, updates);
};

// DELETE a task by ID
export const deleteTask = (taskId: string) => {
  return apiClient.delete<{ message: string }>(`/tasks/delete/${taskId}`);
};

// POST mark task as complete
export const completeTask = (taskId: string) => {
  return apiClient.post<{ message: string }>(`/tasks/complete/${taskId}`);
};
