// components/ListCustomTourPrices.jsx
// Editor harga custom tour (bukan daftar baris): header + Card per kategori,
// field memakai primitive Input/Button, umpan balik lewat toast.

"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/apiConfig';
import { FiClock, FiRefreshCw, FiSave, FiUsers } from "react-icons/fi";
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Skeleton from './ui/Skeleton';
import { useToast } from './ui/Toast';

const TIERS = [
  { key: 'price_1_3', label: 'Tier 1: 1 - 3 People (USD)' },
  { key: 'price_4_7', label: 'Tier 2: 4 - 7 People (USD)' },
  { key: 'price_8_12', label: 'Tier 3: 8 - 12 People (USD)' },
];

function ListCustomTourPrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  // Temporary local state for editing
  const [editedPrices, setEditedPrices] = useState({
    halfDay: { price_1_3: '', price_4_7: '', price_8_12: '' },
    fullDay: { price_1_3: '', price_4_7: '', price_8_12: '' }
  });

  // Dipanggil dari effect: hanya memakai setter + api (tanpa toast) supaya
  // tidak menambah warning exhaustive-deps.
  const fetchPrices = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/custom-tour-prices');
      const data = response.data;
      setPrices(data);

      // Populate local editing state
      const localState = {
        halfDay: { price_1_3: '', price_4_7: '', price_8_12: '' },
        fullDay: { price_1_3: '', price_4_7: '', price_8_12: '' }
      };

      data.forEach(item => {
        if (localState[item.duration_category]) {
          localState[item.duration_category] = {
            price_1_3: String(item.price_1_3),
            price_4_7: String(item.price_4_7),
            price_8_12: String(item.price_8_12)
          };
        }
      });
      setEditedPrices(localState);
    } catch (err) {
      console.error("Error fetching prices:", err);
      setError('Failed to fetch current custom tour prices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handlePriceChange = (category, tier, value) => {
    // Only allow digits
    const cleanedValue = value.replace(/[^0-9]/g, '');
    setEditedPrices(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [tier]: cleanedValue
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        prices: [
          {
            duration_category: 'halfDay',
            price_1_3: parseInt(editedPrices.halfDay.price_1_3) || 0,
            price_4_7: parseInt(editedPrices.halfDay.price_4_7) || 0,
            price_8_12: parseInt(editedPrices.halfDay.price_8_12) || 0
          },
          {
            duration_category: 'fullDay',
            price_1_3: parseInt(editedPrices.fullDay.price_1_3) || 0,
            price_4_7: parseInt(editedPrices.fullDay.price_4_7) || 0,
            price_8_12: parseInt(editedPrices.fullDay.price_8_12) || 0
          }
        ]
      };

      const response = await api.put('/api/custom-tour-prices', payload);
      if (response.status === 200) {
        toast.success('Custom tour prices updated successfully!');
        // Refresh prices
        await fetchPrices();
      }
    } catch (err) {
      console.error("Error updating prices:", err);
      toast.error(err.response?.data?.error || 'Failed to update prices. Please check credentials or try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderCategory = (category, title, tone) => (
    <Card className="space-y-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            tone === 'brand'
              ? 'bg-brand-50 text-brand-600'
              : 'bg-gold-50 text-gold-700'
          }`}
        >
          <FiClock className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">Duration category: {category}</p>
        </div>
      </div>

      <div className="space-y-4">
        {TIERS.map((tier) => (
          <Input
            key={tier.key}
            label={tier.label}
            name={`${category}-${tier.key}`}
            type="text"
            inputMode="numeric"
            value={editedPrices[category][tier.key]}
            onChange={(e) => handlePriceChange(category, tier.key, e.target.value)}
            leading={
              <span className="font-semibold text-slate-400" aria-hidden="true">
                $
              </span>
            }
            required
          />
        ))}
      </div>
    </Card>
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Custom Tour Prices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure base rates for different custom tour durations and group sizes.
          </p>
        </div>
        <Button variant="secondary" onClick={fetchPrices}>
          <FiRefreshCw
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          Refresh
        </Button>
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
        <div
          aria-hidden="true"
          className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card space-y-4 p-4 sm:p-5">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} className="max-w-4xl space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderCategory('halfDay', 'Half Day Tour', 'brand')}
            {renderCategory('fullDay', 'Full Day Tour', 'gold')}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={saving}>
              <FiSave className="h-4 w-4" aria-hidden="true" />
              {saving ? 'Saving Changes...' : 'Save Price Configuration'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ListCustomTourPrices;
