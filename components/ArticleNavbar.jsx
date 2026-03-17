"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ArticleNavbar() {
  const pathname = usePathname();

  const steps = [
    { name: "Step 1: Basic Info", path: "/add-article/add-single-article" },
    { name: "Step 2: Paragraphs", path: "/add-article/add-article-paragrafs" },
    { name: "Step 3: Final Images", path: "/add-article/add-article-images" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-md border-b border-gray-200/50 dark:bg-gray-900/60 dark:border-gray-800/50 transition-all shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <ul className="flex items-center gap-3 overflow-x-auto nice-scrollbar pb-2 sm:pb-0 md:justify-center">
          {steps.map((step, index) => {
            const isActive = pathname === step.path;
            return (
              <li key={step.path} className="flex items-center">
                <Link
                  href={step.path}
                  className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap flex items-center gap-2.5
                    ${isActive 
                      ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] scale-105" 
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] 
                    ${isActive ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}>
                    {index + 1}
                  </span>
                  {step.name}
                </Link>
                {index < steps.length - 1 && (
                  <div className="mx-2 text-gray-300 dark:text-gray-700 hidden md:block">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default ArticleNavbar;

