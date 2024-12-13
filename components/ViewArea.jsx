"use client";

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function ViewArea() {
  const [area, setArea] = useState(null);
  const { id } = useParams();

  const fetchArea = useCallback(async () => {
    try {
      const response = await axios.get(`${baseURL}/api/pickup-areas/${id}`);
      setArea(response.data);
    } catch (error) {
      console.error('Error fetching pickup area:', error);
      alert('Failed to fetch pickup area details.');
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchArea();
    }
  }, [id, fetchArea]);

  if (!area) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-4">{area.name}</h1>
      <Image src={`${baseURL}${area.image}`} alt={area.name} className="w-full h-64 object-cover mb-4" width={100} height={100}/>
      <p className="mb-2"><strong>Description:</strong> {area.description}</p>
      <p className="mb-2"><strong>Latitude:</strong> {area.lat}</p>
      <p className="mb-2"><strong>Longitude:</strong> {area.lng}</p>
      <div className="mt-4 space-x-2">
        <Link href={`/pickup-areas/edit/${area.id}`} className="px-4 py-2 bg-yellow-500 text-white rounded">
          Edit
        </Link>
        <Link href="/pickup-areas" className="px-4 py-2 bg-gray-500 text-white rounded">
          Back to List
        </Link>
      </div>
    </div>
  );
}

export default ViewArea;
