// app/contexts/AuthContext.jsx

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication status...');
      try {
        const res = await fetch('/api/check-auth', {
          method: 'GET',
          credentials: 'include',
        });
        console.log('Check auth response status:', res.status);
        if (res.ok) {
          const data = await res.json();
          console.log('Authenticated:', data.authenticated);
          setIsAuthenticated(data.authenticated);
        } else {
          console.log('Not authenticated');
          setIsAuthenticated(false);
          if (router.pathname !== '/login') {
            router.push('/login'); // Redirect to login if not authenticated
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        if (router.pathname !== '/login') {
          router.push('/login'); // Redirect to login on error
        }
      }
    };

    checkAuth();
  }, [router]);

  // Handle login success
  const handleLoginSuccess = () => {
    console.log('Login successful');
    setIsAuthenticated(true);
    router.push('/'); // Redirect to dashboard or home page
  };

  // Handle logout
  const handleLogout = async () => {
    console.log('Attempting to log out...');
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      console.log('Logout response status:', res.status);

      if (res.ok) {
        console.log('Logout successful');
        setIsAuthenticated(false);
        router.push('/login'); // Redirect to login page
      } else {
        console.error('Failed to logout');
        const errorData = await res.json();
        console.error('Error message:', errorData.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLoginSuccess, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
