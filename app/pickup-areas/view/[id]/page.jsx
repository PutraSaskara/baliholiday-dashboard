// src/app/pickup-areas/view/[id]/page.jsx
"use client";

import ViewArea from '@/components/ViewArea';

function ViewAreaPage({ params }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <ViewArea />
    </div>
  );
}

export default ViewAreaPage;
