import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '../ui/sonner';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="studysync-theme">
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
        <header className="bg-white dark:bg-gray-900 shadow">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.328.996.002 1.069c0 .527.213 1.028.593 1.393l3.464 3.465a1 1 0 001.414 0l5.586-5.585a1 1 0 000-1.415l-3.465-3.464a1.001 1.001 0 00-1.41 0z" />
                <path d="M3.553 13.776l1.138-.485c.506-.215.784-.791.569-1.297a1 1 0 00-1.297-.569l-1.138.485a1 1 0 00-.569 1.297 1 1 0 001.297.569z" />
              </svg>
              <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">StudySync</h1>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline-block">
                  Hello, {user.username}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 flex-grow">
          <Outlet />
        </main>
        
        <footer className="bg-white dark:bg-gray-900 py-6 shadow-inner">
          <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>StudySync &copy; {new Date().getFullYear()} - Focus better, achieve more.</p>
          </div>
        </footer>
      </div>
      <Toaster richColors closeButton/>
    </ThemeProvider>
  );
};

export default MainLayout;