import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
      <div className="container max-w-6xl mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.328.996.002 1.069c0 .527.213 1.028.593 1.393l3.464 3.465a1 1 0 001.414 0l5.586-5.585a1 1 0 000-1.415l-3.465-3.464a1.001 1.001 0 00-1.41 0z" />
                <path d="M3.553 13.776l1.138-.485c.506-.215.784-.791.569-1.297a1 1 0 00-1.297-.569l-1.138.485a1 1 0 00-.569 1.297 1 1 0 001.297.569z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">StudySync</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Focus better, achieve more
            </p>
          </div>
          
          {isLoginView ? (
            <LoginForm onRegisterClick={() => setIsLoginView(false)} />
          ) : (
            <RegisterForm onLoginClick={() => setIsLoginView(true)} />
          )}
        </div>
      </div>
      
      <footer className="bg-white dark:bg-gray-900 py-6 shadow-inner">
        <div className="container max-w-6xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>StudySync &copy; {new Date().getFullYear()} - Focus better, achieve more.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;