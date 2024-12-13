"use client";

import { useState } from "react";

function NavList({ ListArticle, ListTour, DestinationsList, ListArea }) {
  const [activeItem, setActiveItem] = useState("ListArticle");

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <div>
      <ul className="flex justify-between items-center py-2 border-b-2 mb-5 lg:w-full lg:mx-auto lg:justify-start lg:gap-5 lg:pl-10">
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "ListArticle"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("ListArticle")}
        >
          <button>
            <p>Article List</p>
          </button>
        </li>
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "ListTour"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("ListTour")}
        >
          <button>
            <p>Tour Package List</p>
          </button>
        </li>
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "DestinationsList"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("DestinationsList")}
        >
          <button>
            <p>Destinations List</p>
          </button>
        </li>
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "ListArea"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("ListArea")}
        >
          <button>
            <p>Area List</p>
          </button>
        </li>
      </ul>

      {activeItem === "ListArticle" && ListArticle}
      {activeItem === "ListTour" && ListTour}
      {activeItem === "DestinationsList" && DestinationsList}
      {activeItem === "ListArea" && ListArea}
    </div>
  );
}

export default NavList;
