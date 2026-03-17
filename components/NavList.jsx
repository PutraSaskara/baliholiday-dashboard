"use client";

import { useState } from "react";

function NavList({ ListArticle, ListTour, DestinationsList, ListArea }) {
  const [activeItem, setActiveItem] = useState("ListArticle");

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <div className="w-full">
      <div className="mb-8 w-full overflow-x-auto pb-2 nice-scrollbar">
        <ul className="flex sm:justify-start gap-2 p-1.5 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl w-max">
          {[
            { id: "ListArticle", label: "Articles" },
            { id: "ListTour", label: "Tour Packages" },
            { id: "DestinationsList", label: "Destinations" },
            { id: "ListArea", label: "Pickup Areas" },
          ].map((item) => (
            <li key={item.id} className="relative">
              <button
                onClick={() => handleItemClick(item.id)}
                className={`relative px-5 py-2.5 text-sm sm:text-base font-semibold transition-all duration-300 rounded-xl whitespace-nowrap ${
                  activeItem === item.id
                    ? "text-blue-700 bg-white shadow-sm dark:bg-gray-700 dark:text-blue-400"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/50"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeItem === "ListArticle" && ListArticle}
        {activeItem === "ListTour" && ListTour}
        {activeItem === "DestinationsList" && DestinationsList}
        {activeItem === "ListArea" && ListArea}
      </div>
    </div>
  );
}

export default NavList;
