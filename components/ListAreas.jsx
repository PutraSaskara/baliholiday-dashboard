// src/components/ListAreas.jsx
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '@/apiConfig';
import Link from 'next/link';
import Image from 'next/image';

function ListAreas() {
  const [areas, setAreas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch paginated areas
  const fetchAreas = async (page = 1) => {
    setLoading(true);
    setIsSearching(false);
    try {
      const response = await axios.get(`${baseURL}/api/pickup-areas`, {
        params: { page, limit: 10 },
      });
      setAreas(response.data.areas);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching areas:', error);
      alert('Failed to fetch pickup areas.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch search results
  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      // If query is empty, fetch paginated areas
      fetchAreas();
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const response = await axios.get(`${baseURL}/api/pickup-areas/search`, {
        params: { query },
      });
      setAreas(response.data);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching areas:', error);
      alert('Failed to search pickup areas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSearchResults(searchQuery);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this area?')) return;
    try {
      await axios.delete(`${baseURL}/api/pickup-areas/${id}`);
      alert('Area deleted successfully.');
      // Refresh the list after deletion
      if (isSearching) {
        fetchSearchResults(searchQuery);
      } else {
        // If the last item on the current page is deleted, go to the previous page
        if (areas.length === 1 && currentPage > 1) {
          fetchAreas(currentPage - 1);
        } else {
          fetchAreas(currentPage);
        }
      }
    } catch (error) {
      console.error('Error deleting area:', error);
      alert('Failed to delete area.');
    }
  };

  return (
    <div className="p-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-2 md:mb-0">Pickup Areas</h2>
        <Link
          href="/pickup-areas/add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Area
        </Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Search
        </button>
      </form>

      {/* Loading Indicator */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Latitude</th>
                <th className="py-2 px-4 border-b">Longitude</th>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b text-center">{area.id}</td>
                  <td className="py-2 px-4 border-b">{area.name}</td>
                  <td className="py-2 px-4 border-b truncate" title={area.description}>
                    {area.description.length > 50 ? `${area.description.substring(0, 50)}...` : area.description}
                  </td>
                  <td className="py-2 px-4 border-b text-center">{area.lat}</td>
                  <td className="py-2 px-4 border-b text-center">{area.lng}</td>
                  <td className="py-2 px-4 border-b flex justify-center">
                    <Image
                      src={`${baseURL}${area.image}`}
                      alt={area.name}
                      className="w-16 h-16 object-cover rounded"
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="py-2 px-4 border-b space-x-2 text-center">
                    <Link
                      href={`/pickup-areas/view/${area.id}`}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      View
                    </Link>
                    <Link
                      href={`/pickup-areas/edit/${area.id}`}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(area.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {areas.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No pickup areas found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isSearching && totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchAreas(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListAreas;
