// src/components/ListAreas.jsx
"use client";

import { useEffect, useState } from 'react';
import useAreaStore from '../stores/useAreaStore';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import baseURL from '@/apiConfig';

function ListAreas() {
  const { areas, totalPages, currentPage, loading, fetchAreas, searchAreas, deleteArea } = useAreaStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      await fetchAreas(1);
    } else {
      setIsSearching(true);
      await searchAreas(searchQuery);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this area?')) return;
    const success = await deleteArea(id);
    if (success) {
      alert('Area deleted successfully.');
    } else {
      alert('Failed to delete area.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pickup Areas</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your pickup locations and areas.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
            <form onSubmit={handleSearch} className="relative w-full sm:w-80 group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <FiSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <button type="submit" className="hidden">Search</button>
            </form>

            <Link
              href="/pickup-areas/add"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-2xl hover:bg-blue-700 transition shadow-sm text-center whitespace-nowrap"
            >
              Add Area
            </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
            {areas.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No pickup areas found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {areas.map((area) => (
                        <div key={area.id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                                <Link href={`/pickup-areas/view/${area.id}`}>
                                    <Image
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        src={area.image || '/placeholder.jpg'}
                                        alt={area.name}
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>
                            </div>
                            
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="space-y-4 flex-grow">
                                    <div>
                                        <Link href={`/pickup-areas/view/${area.id}`}>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-blue-600 transition-colors">
                                                {area.name}
                                            </h3>
                                        </Link>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                        {area.description}
                                    </p>
                                    <div className="flex gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">Latitude</span>
                                            <span>{area.lat}</span>
                                        </div>
                                        <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">Longitude</span>
                                            <span>{area.lng}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between items-center gap-2">
                                    <Link
                                        href={`/pickup-areas/view/${area.id}`}
                                        className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
                                        title="View Details"
                                    >
                                        <FiEye className="mr-2" />
                                        View
                                    </Link>
                                    <Link
                                        href={`/pickup-areas/edit/${area.id}`}
                                        className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors dark:bg-gray-700 dark:text-orange-400 dark:hover:bg-gray-600"
                                        title="Edit"
                                    >
                                        <FiEdit2 className="mr-2" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(area.id)}
                                        className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600"
                                        title="Delete"
                                    >
                                        <FiTrash2 className="mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {!isSearching && totalPages > 1 && (
                <div className="flex justify-center mt-12 mb-16">
                    <nav aria-label="Page navigation" className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
                        <button
                            onClick={() => fetchAreas(1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                        >
                            First
                        </button>

                        <button
                            onClick={() => fetchAreas(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                        >
                            Previous
                        </button>

                        <div className="flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
                            Page <span className="font-bold text-gray-900 dark:text-white mx-1.5">{currentPage}</span> of <span className="font-bold text-gray-900 dark:text-white mx-1.5">{totalPages}</span>
                        </div>

                        <button
                            onClick={() => fetchAreas(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                        >
                            Next
                        </button>

                        <button
                            onClick={() => fetchAreas(totalPages)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                        >
                            Last
                        </button>
                    </nav>
                </div>
            )}
        </>
      )}
    </div>
  );
}

export default ListAreas;
