// app/components/Navbar.jsx

'use client';

import Link from "next/link";
import React from "react";
import { useAuth } from "../contexts/AuthContext";


function Navbar() {
  const { isAuthenticated, handleLogout } = useAuth();

  if (!isAuthenticated) {
    // Don't render Navbar if not authenticated
    return null;
  }

  return (
    <>
      {/* Sidebar for large screens */}
      <div className="bg-[#344955] h-[100px]  w-full hidden lg:flex pl-1 relative">
        <div className="m-auto w-[100%] px-10 flex items-center justify-between">
          <ul className="text-white flex left-5 items-center justify-center">
            {/* <li className="mb-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </li> */}
            <li className="mb-2">
              <Link
                href="/"
                className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[12px] px-2 py-2.5 text-center me-2"
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/add-article"
                className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[12px] px-2 py-2.5 text-center me-2"
              >
                Add Article
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/add-tour-package"
                className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[12px] px-2 py-2.5 text-center me-2"
              >
                Add Tour Package
              </Link>
            </li>
          </ul>
          <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
        </div>
      </div>
      {/* Navbar for small screens */}
      <div className="bg-[#344955] w-full flex lg:hidden">
        <div className="m-auto">
          <ul className="text-white flex justify-center items-center mt-4">
          
            <li className="mx-2 mb-2">
              <Link
                href="/"
                className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[10px] px-2 py-2.5 text-center"
              >
                Dashboard
              </Link>
            </li>
            <li className="mx-2 mb-2">
              <Link
                href="/add-article"
                className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[10px] px-2 py-2.5 text-center"
              >
                Add Article
              </Link>
            </li>
            <li className="mx-2 mb-2">
              <Link
                href="/add-tour-package"
                className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-white shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-[10px] px-2 py-2.5 text-center"
              >
                Add Tour Package
              </Link>
            </li>
            <li className="mx-2 mb-1">
              <button
                onClick={handleLogout}
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-white shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-[10px] px-2 py-2.5 text-center"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
