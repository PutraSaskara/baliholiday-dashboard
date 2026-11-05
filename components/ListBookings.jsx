// components/ListBookings.jsx
// Daftar booking & inquiry: tabel desktop (hidden md:table), kartu mobile,
// search berikon, badge status, aksi ikon, toast untuk hasil update status.

"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/apiConfig';
import {
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiUsers,
} from "react-icons/fi";
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import Skeleton from './ui/Skeleton';
import { useToast } from './ui/Toast';

const STATUS_CLASSES = {
  Paid: 'bg-emerald-100 text-emerald-800',
  Pending: 'bg-amber-100 text-amber-800',
  Failed: 'bg-red-100 text-red-800',
};

function StatusSelect({ booking, updating, onChange }) {
  if (updating) {
    return <span className="text-xs text-slate-500">Updating...</span>;
  }
  return (
    <select
      value={booking.status}
      onChange={(e) => onChange(booking.id, e.target.value)}
      aria-label={`Status booking #${booking.id}`}
      className={`h-10 cursor-pointer rounded-lg border-0 px-2.5 text-xs font-semibold outline-none ${STATUS_CLASSES[booking.status] || 'bg-slate-100 text-slate-700'}`}
    >
      <option value="Pending">Pending</option>
      <option value="Paid">Paid</option>
      <option value="Failed">Failed</option>
    </select>
  );
}

function BookingDetails({ booking, details, isCustom }) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h4 className="border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Full Booking Details
      </h4>

      <div className="grid grid-cols-1 gap-4 text-sm text-slate-700 md:grid-cols-2">
        {/* Left Panel: Contact & Settings */}
        <div className="space-y-2">
          <p>
            <strong>PayPal Order ID:</strong>{' '}
            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">
              {booking.paypal_order_id || 'N/A'}
            </span>
          </p>
          <p>
            <strong>Nationality:</strong> {booking.nationality || 'N/A'}
          </p>
          <p>
            <strong>Date & Time:</strong> {booking.tour_date}
            {details.pickupTime ? ` @ ${details.pickupTime}` : ''}
          </p>
          {details.specialRequests && (
            <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
              <strong>Special Requests:</strong> {details.specialRequests}
            </p>
          )}
        </div>

        {/* Right Panel: Itinerary / Details */}
        <div className="space-y-3">
          {isCustom ? (
            <div className="space-y-2 rounded-xl border border-brand-200 bg-brand-50 p-4">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-700">
                Custom Route Waypoints
              </span>
              <p className="break-words text-xs">
                <strong>Pickup:</strong> {details.pickupArea || 'N/A'}
                {details.hotelName ? ` (${details.hotelName})` : ''}
                {details.hotelMapLink && (
                  <a
                    href={details.hotelMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center font-semibold text-brand-700 underline"
                  >
                    [Google Maps]
                  </a>
                )}
              </p>
              <div className="flex flex-col gap-1 text-xs">
                <strong>Destinations:</strong>
                <ul className="list-disc space-y-0.5 pl-5">
                  {details.selectedDestinations?.map((dest, idx) => (
                    <li key={idx}>{dest}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-1 text-xs">
                <strong>Drop:</strong> {details.dropArea || 'N/A'}
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-xs font-semibold text-brand-700">
                <span>Duration: {details.estimatedTime || '-'}</span>
                <span>Distance: {details.distance?.toFixed(2)} km</span>
              </div>
            </div>
          ) : (
            <>
              <p>
                <strong>Tour Package:</strong> {booking.tour_name}
              </p>
              <p>
                <strong>Total Guests:</strong> {booking.group_size} People
              </p>
              {details.hotelName && (
                <p>
                  <strong>Hotel / Pickup:</strong> {details.hotelName}
                </p>
              )}
              {details.hotelMapLink && (
                <p className="break-words">
                  <strong>Google Maps Pickup:</strong>{' '}
                  <a
                    href={details.hotelMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-700 underline"
                  >
                    [Google Maps Link]
                  </a>
                </p>
              )}
              {details.tourDestinations &&
                Array.isArray(details.tourDestinations) &&
                details.tourDestinations.length > 0 && (
                  <div className="mt-2 rounded-xl border border-brand-200 bg-brand-50 p-3 text-xs">
                    <strong className="mb-1 block text-brand-700">
                      Tour Itinerary / Destinations:
                    </strong>
                    <ul className="list-decimal space-y-0.5 pl-5">
                      {details.tourDestinations.map((dest, idx) => (
                        <li key={idx} className="font-medium text-slate-700">
                          {dest}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {details.note && (
                <p className="mt-2">
                  <strong>Message / Note:</strong> {details.note}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ListBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const toast = useToast();

  // Dipanggil dari effect: hanya memakai setter + api (tanpa toast) supaya
  // tidak menambah warning exhaustive-deps.
  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
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
    try {
      const response = await api.patch(`/api/bookings/${id}/status`, { status: newStatus });
      if (response.status === 200) {
        toast.success(`Booking status updated to ${newStatus}.`);
        setBookings(prev =>
          prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error('Failed to update booking status.');
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

  const parseDetails = (booking) => {
    try {
      return booking.booking_details ? JSON.parse(booking.booking_details) : {};
    } catch (e) {
      return {};
    }
  };

  const typeBadge = (booking) =>
    booking.booking_type === 'custom' ? (
      <Badge variant="brand">{booking.booking_type}</Badge>
    ) : (
      <Badge variant="neutral">{booking.booking_type}</Badge>
    );

  const detailsButton = (booking) => (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => toggleExpand(booking.id)}
      aria-expanded={expandedId === booking.id}
    >
      {expandedId === booking.id ? (
        <>
          Collapse <FiChevronUp className="h-4 w-4" aria-hidden="true" />
        </>
      ) : (
        <>
          Details <FiChevronDown className="h-4 w-4" aria-hidden="true" />
        </>
      )}
    </Button>
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings & Inquiries</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review instant PayPal payments and pending manual custom tour inquiries.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="search"
            name="search-bookings"
            aria-label="Search bookings"
            placeholder="Search by name, email, tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leading={<FiSearch className="h-4 w-4" aria-hidden="true" />}
            className="sm:w-80"
          />
          <Button variant="secondary" onClick={fetchBookings}>
            <FiRefreshCw
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            Refresh
          </Button>
        </div>
      </div>

      {error && !loading ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <div aria-hidden="true" className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card flex items-center gap-4 p-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon={<FiUsers className="h-5 w-5" aria-hidden="true" />}
          title="No bookings found"
          description={
            searchQuery
              ? 'No bookings match your search. Try another keyword.'
              : 'Bookings and inquiries will appear here once customers submit them.'
          }
          action={
            searchQuery ? (
              <Button variant="secondary" onClick={() => setSearchQuery('')}>
                Clear search
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          {/* Tabel desktop */}
          <div className="hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    ID & Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tour Info
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredBookings.map((booking) => {
                  const isCustom = booking.booking_type === 'custom';
                  const details = parseDetails(booking);

                  return (
                    <React.Fragment key={booking.id}>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="block font-semibold text-slate-900">
                            #{booking.id}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {new Date(booking.createdAt).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="block font-semibold text-slate-900">
                            {booking.name}
                          </span>
                          <span className="mt-0.5 flex items-center gap-1.5 break-all text-xs text-slate-500">
                            <FiMail className="shrink-0" aria-hidden="true" />
                            {booking.email}
                          </span>
                          {booking.phone && (
                            <span className="mt-0.5 flex items-center gap-1.5 break-all text-xs text-slate-500">
                              <FiPhone className="shrink-0" aria-hidden="true" />
                              {booking.phone}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">{typeBadge(booking)}</td>

                        <td className="px-4 py-3">
                          <span className="block font-semibold text-slate-800">
                            {isCustom
                              ? `${details.selectedDestinations?.length || 0} Destinations`
                              : booking.tour_name}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            Tour Date: {booking.tour_date}
                          </span>
                          {booking.group_size && (
                            <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                              <FiUsers size={11} aria-hidden="true" />
                              {booking.group_size} pax
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <span className="flex items-center font-semibold text-slate-900">
                            <FiDollarSign size={13} className="text-slate-400" aria-hidden="true" />
                            {parseFloat(booking.price)?.toFixed(2)}
                          </span>
                          <span className="block text-[10px] font-medium tracking-wide text-slate-400">
                            USD
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <StatusSelect
                            booking={booking}
                            updating={updatingId === booking.id}
                            onChange={handleStatusChange}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {detailsButton(booking)}
                          </div>
                        </td>
                      </tr>

                      {expandedId === booking.id && (
                        <tr className="bg-slate-50">
                          <td colSpan="7" className="px-4 py-4">
                            <BookingDetails
                              booking={booking}
                              details={details}
                              isCustom={isCustom}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Kartu mobile */}
          <ul className="space-y-3 md:hidden">
            {filteredBookings.map((booking) => {
              const isCustom = booking.booking_type === 'custom';
              const details = parseDetails(booking);

              return (
                <li key={booking.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block font-semibold text-slate-900">
                        #{booking.id} · {booking.name}
                      </span>
                      <span className="mt-0.5 block break-all text-xs text-slate-500">
                        {booking.email}
                      </span>
                    </div>
                    {typeBadge(booking)}
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">
                      {isCustom
                        ? `${details.selectedDestinations?.length || 0} Destinations`
                        : booking.tour_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Tour Date: {booking.tour_date}
                      {booking.group_size ? ` · ${booking.group_size} pax` : ''}
                    </p>
                    <p className="flex items-center font-semibold text-slate-900">
                      <FiDollarSign size={13} className="text-slate-400" aria-hidden="true" />
                      {parseFloat(booking.price)?.toFixed(2)}
                      <span className="ml-1 text-[10px] font-medium text-slate-400">USD</span>
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <StatusSelect
                      booking={booking}
                      updating={updatingId === booking.id}
                      onChange={handleStatusChange}
                    />
                    {detailsButton(booking)}
                  </div>

                  {expandedId === booking.id && (
                    <div className="mt-3">
                      <BookingDetails
                        booking={booking}
                        details={details}
                        isCustom={isCustom}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default ListBookings;
