// src/components/ViewDestination.jsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function ViewDestination() {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true); // Optional: Loading state
  const [error, setError] = useState(null);     // Optional: Error state
  const { id } = useParams();

  // Memoize fetchDestination to prevent it from changing on every render
  const fetchDestination = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/destinations/${id}`);
      setDestination(response.data);
      setError(null); // Reset error if fetch is successful
    } catch (err) {
      console.error('Error fetching destination:', err);
      setError('Failed to fetch destination details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDestination();
    }
  }, [id, fetchDestination]);

  // Optional: Handle loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-5">
        <p>Loading...</p>
      </div>
    );
  }

  // Optional: Handle error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-5">
        <p className="text-red-500">{error}</p>
        <Link href="/destinations" className="mt-4 inline-block px-4 py-2 bg-gray-500 text-white rounded">
          Back to List
        </Link>
      </div>
    );
  }

  // If destination data is available, render it
  if (!destination) {
    return (
      <div className="max-w-2xl mx-auto p-5">
        <p>No destination data available.</p>
        <Link href="/destinations" className="mt-4 inline-block px-4 py-2 bg-gray-500 text-white rounded">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-4">{destination.name}</h1>
      {/* Ensure that the image URL is valid. Adjust the base URL if necessary */}
      <Image
        src={`${baseURL}${destination.image}`}
        alt={destination.name}
        width={800}  // Specify width and height for Next.js Image optimization
        height={400}
        className="w-full h-64 object-cover mb-4"
        
      />
      <p className="mb-2"><strong>Description:</strong> {destination.description}</p>
      <p className="mb-2"><strong>Latitude:</strong> {destination.lat}</p>
      <p className="mb-2"><strong>Longitude:</strong> {destination.lng}</p>
      <div className="mt-4 space-x-2">
        <Link
          href={`/destinations/edit/${destination.id}`}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit
        </Link>
        <Link
          href="/destinations"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
}

export default ViewDestination;
