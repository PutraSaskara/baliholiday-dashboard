"use client";

import { useEffect, useState, useCallback } from 'react';
import useAreaStore from '../stores/useAreaStore';
import baseURL, { api } from '@/apiConfig';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function ViewArea() {
  const [area, setArea] = useState(null);
  const [toggling, setToggling] = useState(false);
  const { id } = useParams();

  const { fetchAreaById } = useAreaStore();

  const fetchArea = useCallback(async () => {
    try {
      const data = await fetchAreaById(id);
      setArea(data);
    } catch (error) {
      console.error('Error fetching pickup area:', error);
      alert('Failed to fetch pickup area details.');
    }
  }, [id, fetchAreaById]);

  useEffect(() => {
    if (id) {
      fetchArea();
    }
  }, [id, fetchArea]);

  const handleToggleActive = async () => {
    if (!area || toggling) return;
    setToggling(true);
    try {
      const updatedStatus = area.is_active === false ? true : false;
      const response = await api.patch(`/api/pickup-areas/${area.id}`, {
        is_active: updatedStatus
      });

      if (response.status === 200) {
        setArea(prev => ({
          ...prev,
          is_active: updatedStatus
        }));
      } else {
        alert("Failed to toggle area coverage status.");
      }
    } catch (error) {
      console.error("Error toggling area status:", error);
      alert("An error occurred while updating coverage status.");
    } finally {
      setToggling(false);
    }
  };

  if (!area) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{area.name}</h1>
        <span className={`px-4 py-1.5 text-xs font-bold rounded-full w-fit ${area.is_active !== false ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
          {area.is_active !== false ? '● Active Pickup Area' : '○ Disabled (No Coverage)'}
        </span>
      </div>

      <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-sm bg-gray-100">
        <Image src={area.image || '/placeholder.jpg'} alt={area.name} className="object-cover" fill />
      </div>

      <div className="bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-6 space-y-4 shadow-sm">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong className="text-gray-900 dark:text-white block mb-1">Description:</strong> 
          {area.description}
        </p>

        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="block text-xs uppercase tracking-wider text-gray-400 mb-0.5">Latitude</span>
            <span className="font-mono font-medium">{area.lat}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-gray-400 mb-0.5">Longitude</span>
            <span className="font-mono font-medium">{area.lng}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleToggleActive}
          disabled={toggling}
          className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl transition cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
            area.is_active !== false 
              ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-600/10' 
              : 'bg-green-600 hover:bg-green-700 hover:shadow-green-600/10'
          }`}
        >
          {toggling ? 'Updating...' : area.is_active !== false ? 'Disable Area Coverage' : 'Enable Area Coverage'}
        </button>

        <Link href={`/pickup-areas/edit/${area.id}`} className="px-5 py-2.5 text-sm font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl transition dark:bg-gray-800 dark:text-orange-400 dark:hover:bg-gray-700">
          Edit Area
        </Link>
        <Link href="/pickup-areas" className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          Back to List
        </Link>
      </div>
    </div>
  );
}

export default ViewArea;
