// src/app/destinations/view/[id]/page.jsx
"use client";

import ViewDestination from '@/components/ViewDestination';
import { useParams } from 'next/navigation';

function Page() {
  const { id } = useParams();

  return (
    <div className="w-full">
      <ViewDestination id={id} />
    </div>
  );
}

export default Page;
