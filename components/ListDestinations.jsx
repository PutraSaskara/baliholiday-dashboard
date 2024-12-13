// src/components/ListDestinations.jsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "@/apiConfig";
import Link from "next/link";
import Image from "next/image";

function ListDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch paginated destinations
  const fetchDestinations = async (page = 1) => {
    setLoading(true);
    setIsSearching(false);
    try {
      const response = await axios.get(`${baseURL}/api/destinations`, {
        params: { page, limit: 10 },
      });
      setDestinations(response.data.destinations);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      alert("Failed to fetch destinations.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch search results
  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      // If query is empty, fetch paginated destinations
      fetchDestinations();
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const response = await axios.get(`${baseURL}/api/destinations/search`, {
        params: { query },
      });
      setDestinations(response.data);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching destinations:", error);
      alert("Failed to search destinations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSearchResults(searchQuery);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    try {
      await axios.delete(`${baseURL}/destinations/${id}`);
      alert("Destination deleted successfully.");
      // Refresh the list after deletion
      if (isSearching) {
        fetchSearchResults(searchQuery);
      } else {
        // If the last item on the current page is deleted, go to the previous page
        if (destinations.length === 1 && currentPage > 1) {
          fetchDestinations(currentPage - 1);
        } else {
          fetchDestinations(currentPage);
        }
      }
    } catch (error) {
      console.error("Error deleting destination:", error);
      alert("Failed to delete destination.");
    }
  };

  return (
    <div className="p-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-2 md:mb-0">Destinations</h2>
        <Link
          href="/destinations/add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Destination
        </Link>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2"
      >
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
              {destinations.map((destination) => (
                <tr key={destination.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b text-center">{destination.id}</td>
                  <td className="py-2 px-4 border-b">{destination.name}</td>
                  <td
                    className="py-2 px-4 border-b truncate"
                    title={destination.description}
                  >
                    {destination.description.length > 50
                      ? `${destination.description.substring(0, 50)}...`
                      : destination.description}
                  </td>
                  <td className="py-2 px-4 border-b text-center">{destination.lat}</td>
                  <td className="py-2 px-4 border-b text-center">{destination.lng}</td>
                  <td className="py-2 px-4 border-b flex justify-center">
                    <Image
                      src={`${baseURL}${destination.image}`}
                      alt={destination.name}
                      className="w-16 h-16 object-cover rounded"
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="py-2 px-4 border-b space-x-2 text-center">
                    <Link
                      href={`/destinations/view/${destination.id}`}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      View
                    </Link>
                    <Link
                      href={`/destinations/edit/${destination.id}`}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(destination.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {destinations.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No destinations found.
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
              onClick={() => fetchDestinations(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListDestinations;
