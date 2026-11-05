"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Stepper, { stepIndexFromPath } from "./ui/Stepper";

// Urutan langkah wizard tour harus sama dengan alur simpan:
// Basic Info -> Details -> Descriptions -> Tour Plan -> Other Info -> Images.
const STEPS = [
  { label: "Basic Info", href: "/add-tour-package/add-tour" },
  { label: "Details", href: "/add-tour-package/add-tour-detail" },
  { label: "Descriptions", href: "/add-tour-package/add-tour-desc" },
  { label: "Tour Plan", href: "/add-tour-package/add-tour-plan" },
  { label: "Other Info", href: "/add-tour-package/add-other" },
  { label: "Images", href: "/add-tour-package/add-tour-image" },
];

function TourNavbar() {
  const pathname = usePathname();
  const current = stepIndexFromPath(pathname, STEPS);

  return (
    <div className="sticky top-16 z-20 -mx-4 mb-5 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <Stepper steps={STEPS} current={current} />
    </div>
  );
}

export default TourNavbar;
