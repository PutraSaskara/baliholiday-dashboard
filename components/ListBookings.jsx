"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/apiConfig';
import { FiClock, FiUsers, FiSearch, FiActivity, FiMapPin, FiChevronDown, FiChevronUp, FiDollarSign, FiMail, FiPhone } from "react-icons/fi";

function ListBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError('Failed to load bookings list. Please check authorization or connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    setError('');
    setSuccess('');
    try {
      const response = await api.patch(`/api/bookings/${id}/status`, { status: newStatus });
      if (response.status === 200) {
        setSuccess(`Booking status updated to ${newStatus} successfully.`);
        setBookings(prev =>
          prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError('Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Filter bookings based on search
  const filteredBookings = bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    return (
      b.name?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.tour_name?.toLowerCase().includes(q) ||
      b.paypal_order_id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bookings & Inquiries</h2>
          <p className="text-gray-500 dark:text-gray-400">Review instant PayPal payments and pending manual custom tour inquiries.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <FiSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, tour..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={fetchBookings}
            type="button"
            className="px-5 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl transition cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-800 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 mb-6 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl border border-green-100 dark:border-green-800 text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400 text-lg">
              No bookings or inquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 dark:bg-gray-900/50 dark:border-gray-700">
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider pl-6">ID & Date</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tour Info</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider pr-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {filteredBookings.map((booking) => {
                    const isCustom = booking.booking_type === 'custom';
                    let details = {};
                    try {
                      details = booking.booking_details ? JSON.parse(booking.booking_details) : {};
                    } catch (e) {
                      details = {};
                    }

                    return (
                      <React.Fragment key={booking.id}>
                        <tr className="hover:bg-gray-50/40 dark:hover:bg-gray-850/20 transition duration-150">
                          {/* Date & ID */}
                          <td className="p-4 pl-6">
                            <span className="block font-bold text-gray-950 dark:text-white">#{booking.id}</span>
                            <span className="block text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {new Date(booking.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="p-4">
                            <span className="block font-bold text-gray-900 dark:text-white leading-snug">{booking.name}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mt-1">
                              <FiMail className="flex-shrink-0" /> {booking.email}
                            </span>
                            {booking.phone && (
                              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mt-0.5">
                                <FiPhone className="flex-shrink-0" /> {booking.phone}
                              </span>
                            )}
                          </td>

                          {/* Type */}
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isCustom 
                                ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' 
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                              {booking.booking_type}
                            </span>
                          </td>

                          {/* Tour Name / Date */}
                          <td className="p-4">
                            <span className="block font-bold text-gray-800 dark:text-white leading-snug line-clamp-1">
                              {isCustom ? `${details.selectedDestinations?.length || 0} Destinations` : booking.tour_name}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 block mt-1">
                              Tour Date: {booking.tour_date}
                            </span>
                            {booking.group_size && (
                              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                                <FiUsers size={11} /> {booking.group_size} pax
                              </span>
                            )}
                          </td>

                          {/* Price */}
                          <td className="p-4">
                            <span className="text-md font-black text-gray-900 dark:text-white flex items-center">
                              <FiDollarSign size={13} className="text-gray-400" />
                              {parseFloat(booking.price)?.toFixed(2)}
                            </span>
                            <span className="block text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide">USD</span>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            <div className="relative">
                              {updatingId === booking.id ? (
                                <span className="text-xs text-gray-400">Updating...</span>
                              ) : (
                                <select
                                  value={booking.status}
                                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                  className={`px-3 py-1 text-xs font-bold rounded-full border border-transparent outline-none cursor-pointer ${
                                    booking.status === 'Paid'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : booking.status === 'Pending'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Paid">Paid</option>
                                  <option value="Failed">Failed</option>
                                </select>
                              )}
                            </div>
                          </td>

                          {/* Action Expand */}
                          <td className="p-4 pr-6 text-center">
                            <button
                              type="button"
                              onClick={() => toggleExpand(booking.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl transition dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                            >
                              {expandedId === booking.id ? (
                                <>Collapse <FiChevronUp /></>
                              ) : (
                                <>Details <FiChevronDown /></>
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Collapsible Details Panel */}
                        {expandedId === booking.id && (
                          <tr className="bg-gray-50/50 dark:bg-gray-900/20">
                            <td colSpan="7" className="p-6 pl-8 pr-8">
                              <div className="bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-6 shadow-inner space-y-4">
                                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-700">
                                  Full Booking Details
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
                                  {/* Left Panel: Contact & Settings */}
                                  <div className="space-y-2">
                                    <p><strong>PayPal Order ID:</strong> <span className="font-mono bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded text-xs">{booking.paypal_order_id || 'N/A'}</span></p>
                                    <p><strong>Nationality:</strong> {booking.nationality || 'N/A'}</p>
                                    <p><strong>Date & Time:</strong> {booking.tour_date} {details.pickupTime ? `@ ${details.pickupTime}` : ''}</p>
                                    {details.specialRequests && (
                                      <p className="bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900 p-3 rounded-xl text-yellow-800 dark:text-yellow-400 mt-2">
                                        <strong>Special Requests:</strong> {details.specialRequests}
                                      </p>
                                    )}
                                  </div>

                                  {/* Right Panel: Itinerary / Details */}
                                  <div className="space-y-3">
                                    {isCustom ? (
                                      <>
                                        <div className="bg-teal-50/30 border border-teal-100/50 dark:bg-teal-950/10 dark:border-teal-900/30 p-4 rounded-xl space-y-2">
                                          <span className="block text-xs uppercase font-bold text-teal-600 dark:text-teal-400 mb-1">Custom Route Waypoints</span>
                                          <p className="text-xs">
                                            <strong>Pickup:</strong> {details.pickupArea || 'N/A'} 
                                            {details.hotelName ? ` (${details.hotelName})` : ''}
                                            {details.hotelMapLink && (
                                              <a 
                                                href={details.hotelMapLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-semibold inline-flex items-center"
                                              >
                                                [Google Maps]
                                              </a>
                                            )}
                                          </p>
                                          <div className="flex flex-col gap-1 text-xs">
                                            <strong>Destinations:</strong>
                                            <ul className="list-disc pl-5 space-y-0.5">
                                              {details.selectedDestinations?.map((dest, idx) => (
                                                <li key={idx}>{dest}</li>
                                              ))}
                                            </ul>
                                          </div>
                                          <p className="text-xs mt-1"><strong>Drop:</strong> {details.dropArea || 'N/A'}</p>
                                          <div className="flex gap-4 text-xs font-semibold pt-1 text-teal-700 dark:text-teal-400">
                                            <span>Duration: {details.estimatedTime || '-'}</span>
                                            <span>Distance: {details.distance?.toFixed(2)} km</span>
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <p><strong>Tour Package:</strong> {booking.tour_name}</p>
                                        <p><strong>Total Guests:</strong> {booking.group_size} People</p>
                                        {details.hotelName && (
                                          <p><strong>Hotel / Pickup:</strong> {details.hotelName}</p>
                                        )}
                                        {details.hotelMapLink && (
                                          <p>
                                            <strong>Google Maps Pickup:</strong>{" "}
                                            <a 
                                              href={details.hotelMapLink} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-semibold inline-flex items-center"
                                            >
                                              [Google Maps Link]
                                            </a>
                                          </p>
                                        )}
                                        {details.tourDestinations && Array.isArray(details.tourDestinations) && details.tourDestinations.length > 0 && (
                                          <div className="bg-blue-50/30 border border-blue-100/50 dark:bg-blue-950/10 dark:border-blue-900/30 p-3 rounded-xl mt-2 text-xs">
                                            <strong className="block text-blue-600 dark:text-blue-400 mb-1">📍 Tour Itinerary / Destinations:</strong>
                                            <ul className="list-decimal pl-5 space-y-0.5">
                                              {details.tourDestinations.map((dest, idx) => (
                                                <li key={idx} className="font-medium text-gray-700 dark:text-gray-300">{dest}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        {details.note && (
                                          <p className="mt-2"><strong>Message / Note:</strong> {details.note}</p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ListBookings;
