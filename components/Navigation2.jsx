"use client";

import { useState } from "react";

function Navigation2({ editSingleArticle, EditParagraph, EditImage }) {
  const [activeItem, setActiveItem] = useState("editSingleArticle");

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <div>
      <ul className="flex justify-between items-center py-2 border-b-2 mb-5 lg:w-full lg:mx-auto lg:justify-start lg:gap-5 lg:pl-10">
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "editSingleArticle"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("editSingleArticle")}
        >
          <button>
            <p>Edit Single Article</p>
          </button>
        </li>
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "EditParagraph"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("EditParagraph")}
        >
          <button>
            <p>Edit Paragraph</p>
          </button>
        </li>
        <li
          className={`text-black font-bold text-[10px] sm:text-[16px] hover:text-primary ${
            activeItem === "EditImage"
              ? "text-primary border-b-2 border-b-primary transition duration-500"
              : ""
          }`}
          onClick={() => handleItemClick("EditImage")}
        >
          <button>
            <p>Edit Image</p>
          </button>
        </li>
      </ul>

      {activeItem === "editSingleArticle" && editSingleArticle}
      {activeItem === "EditParagraph" && EditParagraph}
      {activeItem === "EditImage" && EditImage}
    </div>
  );
}

export default Navigation2;
