// src/app/destinations/edit/[id]/page.jsx
"use client";

import EditDestination from '@/components/EditDestination';
import { useParams } from 'next/navigation';

function Page() {
  const { id } = useParams();

  return (
    <div className="w-full">
      <EditDestination id={id} />
    </div>
  );
}

export default Page;
