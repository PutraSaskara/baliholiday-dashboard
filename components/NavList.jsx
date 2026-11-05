"use client";

import { useState } from "react";

// Segmented tabs: satu baris pil di atas konten, bisa digeser horizontal
// di layar sempit tanpa membuat body meluber.
const TABS = [
  { id: "ListArticle", label: "Articles" },
  { id: "ListTour", label: "Tour Packages" },
  { id: "DestinationsList", label: "Destinations" },
  { id: "ListArea", label: "Pickup Areas" },
  { id: "ListCustomTourPrices", label: "Custom Tour Prices" },
  { id: "ListBookings", label: "Bookings & Inquiries" },
];

function NavList({
  ListArticle,
  ListTour,
  DestinationsList,
  ListArea,
  ListCustomTourPrices,
  ListBookings,
}) {
  const [activeItem, setActiveItem] = useState("ListArticle");

  return (
    <div className="w-full">
      <div className="mb-6 w-full overflow-x-auto pb-1 nice-scrollbar">
        <div
          role="tablist"
          aria-label="Bagian dashboard"
          className="flex w-max gap-1 rounded-xl bg-slate-100 p-1"
        >
          {TABS.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                onClick={() => setActiveItem(item.id)}
                className={`h-10 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeItem}`}
        aria-labelledby={`tab-${activeItem}`}
      >
        {activeItem === "ListArticle" && ListArticle}
        {activeItem === "ListTour" && ListTour}
        {activeItem === "DestinationsList" && DestinationsList}
        {activeItem === "ListArea" && ListArea}
        {activeItem === "ListCustomTourPrices" && ListCustomTourPrices}
        {activeItem === "ListBookings" && ListBookings}
      </div>
    </div>
  );
}

export default NavList;
