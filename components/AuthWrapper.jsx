// app/components/AuthWrapper.jsx

'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

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
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLoginSuccess = () => {
    console.log('Login successful');
    setIsAuthenticated(true);
    router.push('/'); // Redirect to dashboard or home page
  };

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

  if (isAuthenticated === null) {
    // Authentication status is being checked
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    // User is not authenticated; show LoginForm
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // User is authenticated; render children with handleLogout passed down
  return React.cloneElement(children, { handleLogout });
}
