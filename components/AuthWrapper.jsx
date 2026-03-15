// app/components/AuthWrapper.jsx

'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import useAuthStore from "../stores/useAuthStore";

export default function AuthWrapper({ children }) {
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check auth on mount
    checkAuth();
  }, [checkAuth]);

  // Optionally handle redirect if not authenticated when it's determined
  useEffect(() => {
    if (isAuthenticated === false && router.pathname !== '/login') {
      // router.push('/login'); // AuthWrapper renders LoginForm anyway
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    console.log('Login successful');
    router.push('/'); // Redirect to dashboard or home page
  };

  const handleLogout = async () => {
    console.log('Attempting to log out...');
    const success = await logout();
    if (success) {
      console.log('Logout successful');
      router.push('/login'); // Redirect to login page
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
