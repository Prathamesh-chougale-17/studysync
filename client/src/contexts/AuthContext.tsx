// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  streak: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios default baseURL
  useEffect(() => {
    // If running in development with separate servers
    if (process.env.NODE_ENV === 'development') {
      axios.defaults.baseURL = 'http://localhost:5000';
    }
  }, []);

  // Check for token on mount and load user
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Set auth token to header
        axios.defaults.headers.common['x-auth-token'] = token;
        
        // Get user data
        const res = await axios.get('/api/user');
        setUser(res.data);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        toast.error('Failed to load user data. Please log in again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [toast]);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post('/api/user/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      setUser(res.data.user);
      
      toast.success("Welcome back! You've successfully logged in.");
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(
        errorMessage,
        { description: "Please check your credentials and try again." }
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post('/api/user/register', { 
        username, 
        email, 
        password 
      });
      
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      setUser(res.data.user);
      
      toast.success(
        "Registration Successful!",
        { description: "Welcome! You've successfully registered." }
      );
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(
        errorMessage,
        { description: "Please check your details and try again." }
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    
    toast.success(
        "Logged out successfully!",
        { description: "You have been logged out." }
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};