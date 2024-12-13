// src/app/destinations/view/[id]/page.jsx
"use client";

import ViewDestination from '@/components/ViewDestination';

function page({ params }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <ViewDestination id={id} />
    </div>
  );
}

export default page;
