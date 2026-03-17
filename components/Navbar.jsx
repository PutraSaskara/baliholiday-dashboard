// app/components/Navbar.jsx

'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import SessionTimer from "./SessionTimer";


function Navbar() {
  const { isAuthenticated, logout, checkAuth } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated === null) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated]);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push('/login');
    }
  };

  // Atasi hydration mismatch & pastikan checkAuth selesai
  if (!mounted || isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    // Don't render Navbar if not authenticated
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800 transition-all shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-shrink-0 flex items-center gap-2">
                <Link href="/" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    BaliHoliday Admin
                </Link>
            </div>
            
            <div className="hidden lg:flex md:items-center space-x-2">
              <Link href="/" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50">Dashboard</Link>
              <Link href="/add-article" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50">Add Article</Link>
              <Link href="/add-tour-package" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50">Add Tour Package</Link>
            </div>

            <div className="hidden lg:flex items-center gap-5">
               <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl dark:bg-gray-800 dark:border-gray-700 shadow-inner"><SessionTimer /></div>
               <button onClick={handleLogout} className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 duration-200">Logout</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navbar Bottom / Alternative */}
      <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 px-4 py-3 overflow-x-auto nice-scrollbar shadow-inner">
         <ul className="flex items-center justify-start sm:justify-center gap-3 w-max mx-auto">
            <li>
                <Link href="/" className="px-5 py-2.5 whitespace-nowrap rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-300">Dashboard</Link>
            </li>
            <li>
                <Link href="/add-article" className="px-5 py-2.5 whitespace-nowrap rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-300">Add Article</Link>
            </li>
            <li>
                <Link href="/add-tour-package" className="px-5 py-2.5 whitespace-nowrap rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400">Add Tour</Link>
            </li>
            <li className="flex items-center">
                 <div className="px-4 py-2 text-xs font-medium bg-gray-50 border border-gray-100 rounded-xl dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap shadow-inner"><SessionTimer /></div>
            </li>
            <li>
                <button onClick={handleLogout} className="px-5 py-2.5 whitespace-nowrap rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm">Logout</button>
            </li>
         </ul>
      </div>
    </nav>
  );
}

export default Navbar;
