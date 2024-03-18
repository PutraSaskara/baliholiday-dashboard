"use client";

import { useState } from "react";

function Navigation({ editTour, EditDetail, EditDesc, editPlan, editImage, editOther }) {
  const [activeItem, setActiveItem] = useState("editTour");

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <div>
      <ul className="flex justify-between items-center py-2 border-b-2 mb-5 lg:w-full lg:mx-auto lg:justify-start lg:gap-5 lg:pl-10">
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "editTour"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("editTour")}
        >
          <button>
            <p>Edit Tour</p>
          </button>
        </li>
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "EditDetail"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("EditDetail")}
        >
          <button>
            <p>Edit Detail</p>
          </button>
        </li>
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "EditDesc"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("EditDesc")}
        >
          <button>
            <p>Edit Description</p>
          </button>
        </li>
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "editPlan"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("editPlan")}
        >
          <button>
            <p>Edit Plan</p>
          </button>
        </li>
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "editImage"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("editImage")}
        >
          <button>
            <p>Edit Image</p>
          </button>
        </li>
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "editOther"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("editOther")}
        >
          <button>
            <p>Edit Other</p>
          </button>
        </li>
      </ul>

      {activeItem === "editTour" && editTour}
      {activeItem === "EditDetail" && EditDetail}
      {activeItem === "EditDesc" && EditDesc}
      {activeItem === "editPlan" && editPlan}
      {activeItem === "editImage" && editImage}
      {activeItem === "editOther" && editOther}
    </div>
  );
}

export default Navigation;
