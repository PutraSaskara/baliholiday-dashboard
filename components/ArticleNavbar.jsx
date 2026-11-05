"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Stepper, { stepIndexFromPath } from "./ui/Stepper";

// Urutan langkah wizard article harus sama dengan alur simpan:
// Single Article -> Paragraphs -> Images.
const STEPS = [
  { label: "Single Article", href: "/add-article/add-single-article" },
  { label: "Paragraphs", href: "/add-article/add-article-paragrafs" },
  { label: "Images", href: "/add-article/add-article-images" },
];

function ArticleNavbar() {
  const pathname = usePathname();
  const current = stepIndexFromPath(pathname, STEPS);

  return (
    <div className="sticky top-16 z-20 -mx-4 mb-5 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <Stepper steps={STEPS} current={current} />
    </div>
  );
}

export default ArticleNavbar;
