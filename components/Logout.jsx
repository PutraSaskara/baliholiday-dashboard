'use client';

import React from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../stores/useAuthStore";

function Logout() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
    >
      Logout
    </button>
  );
}

export default Logout;
