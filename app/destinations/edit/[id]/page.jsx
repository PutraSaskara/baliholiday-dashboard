// src/app/destinations/edit/[id]/page.jsx
"use client";

import EditDestination from '@/components/EditDestination';

function page({ params }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <EditDestination id={id} />
    </div>
  );
}

export default page;
