"use client";

import React, { useState } from "react";
import Stepper from "./ui/Stepper";

// Urutan langkah edit article sama dengan alur tambah:
// Single Article -> Paragraph -> Image.
const STEPS = [
  { label: "Edit Single Article" },
  { label: "Edit Paragraph" },
  { label: "Edit Image" },
];

function Navigation2({ editSingleArticle, EditParagraph, EditImage }) {
  const [activeItem, setActiveItem] = useState(0);
  // Batas langkah yang boleh diklik: hanya langkah yang sudah dilalui.
  const [visited, setVisited] = useState(0);

  const handleSelect = (index) => {
    if (index > visited) return;
    setActiveItem(index);
  };

  const goNext = () => {
    const next = Math.min(activeItem + 1, STEPS.length - 1);
    setActiveItem(next);
    setVisited((prev) => Math.max(prev, next));
  };

  const items = [editSingleArticle, EditParagraph, EditImage];
  const content =
    activeItem === STEPS.length - 1
      ? items[activeItem]
      : items[activeItem]
      ? React.cloneElement(items[activeItem], { onNext: goNext })
      : null;

  return (
    <div className="py-2">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <Stepper
          steps={STEPS}
          current={activeItem}
          maxVisited={visited}
          onSelect={handleSelect}
        />
      </div>

      {content}
    </div>
  );
}

export default Navigation2;
