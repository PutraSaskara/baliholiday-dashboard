import React from "react";
import { useAuth } from "../contexts/AuthContext";

function Logout() {
  const { isAuthenticated, handleLogout } = useAuth();
  if (!isAuthenticated) {
    // Don't render Navbar if not authenticated
    return null;
  }

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
