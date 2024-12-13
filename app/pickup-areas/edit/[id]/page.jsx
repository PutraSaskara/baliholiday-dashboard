// src/app/pickup-areas/edit/[id]/page.jsx
"use client";

import EditArea from '@/components/EditArea';

function EditAreaPage({ params }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <EditArea />
    </div>
  );
}

export default EditAreaPage;
