import React from "react";
import useAuthStore from "../stores/useAuthStore";

function Logout() {
  const { isAuthenticated, logout: handleLogout } = useAuthStore();
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
