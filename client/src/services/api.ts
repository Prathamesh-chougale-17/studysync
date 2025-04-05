import axios from 'axios';
import { Task, Note } from '@/types';

// Configure axios
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired, redirect to login
      localStorage.removeItem('token');
      // Using window.location instead of router here since this is outside of React render context
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Task API endpoints
export const taskApi = {
  // Get all tasks
  getAll: async (): Promise<Task[]> => {
    const response = await api.get('/api/tasks');
    return response.data;
  },
  
  // Get a single task
  getById: async (id: string): Promise<Task> => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },
  
  // Create new task
  create: async (taskData: Omit<Task, '_id' | 'createdAt'>): Promise<Task> => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  },
  
  // Update task
  update: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },
  
  // Delete task
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  },
  
  // Get pending tasks count
  getPendingCount: async (): Promise<number> => {
    const response = await api.get('/api/tasks/pending/count');
    return response.data.count;
  }
};

// Note API endpoints
export const noteApi = {
  // Get all notes
  getAll: async (): Promise<Note[]> => {
    const response = await api.get('/api/notes');
    return response.data;
  },
  
  // Get a single note
  getById: async (id: string): Promise<Note> => {
    const response = await api.get(`/api/notes/${id}`);
    return response.data;
  },
  
  // Create new note
  create: async (noteData: Omit<Note, '_id' | 'createdAt'>): Promise<Note> => {
    const response = await api.post('/api/notes', noteData);
    return response.data;
  },
  
  // Update note
  update: async (id: string, noteData: Partial<Note>): Promise<Note> => {
    const response = await api.put(`/api/notes/${id}`, noteData);
    return response.data;
  },
  
  // Delete note
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/notes/${id}`);
  },
  
  // Search notes by tag
  searchByTag: async (tag: string): Promise<Note[]> => {
    const response = await api.get(`/api/notes/tag/${tag}`);
    return response.data;
  },
  
  // Search notes by query
  search: async (query: string): Promise<Note[]> => {
    const response = await api.get(`/api/notes/search/${query}`);
    return response.data;
  }
};

// User API endpoints
export const userApi = {
  // Get user streak
  getStreak: async () => {
    const response = await api.get('/api/user/streak');
    return response.data;
  },
  
  // Update user activity (for streak tracking)
  updateActivity: async () => {
    const response = await api.post('/api/user/activity');
    return response.data;
  }
};

export default api;