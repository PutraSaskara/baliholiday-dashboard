"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/apiConfig';
import { FiClock, FiUsers, FiSave, FiRefreshCw } from "react-icons/fi";

function ListCustomTourPrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Temporary local state for editing
  const [editedPrices, setEditedPrices] = useState({
    halfDay: { price_1_3: '', price_4_7: '', price_8_12: '' },
    fullDay: { price_1_3: '', price_4_7: '', price_8_12: '' }
  });

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
    setError('');
    setSuccess('');

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
        setSuccess('Custom tour prices updated successfully!');
        // Refresh prices
        await fetchPrices();
      }
    } catch (err) {
      console.error("Error updating prices:", err);
      setError(err.response?.data?.error || 'Failed to update prices. Please check credentials or try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Custom Tour Prices</h2>
          <p className="text-gray-500 dark:text-gray-400">Configure base rates for different custom tour durations and group sizes.</p>
        </div>
        <div>
          <button
            type="button"
            onClick={fetchPrices}
            className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl transition cursor-pointer"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-800 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl border border-green-100 dark:border-green-800 text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Half Day Tour Prices */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 dark:bg-gray-800 dark:border-gray-700 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <FiClock size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Half Day Tour</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Duration category: halfDay</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <FiUsers size={14} className="text-gray-400" /> Tier 1: 1 - 3 People (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-semibold">$</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editedPrices.halfDay.price_1_3}
                      onChange={(e) => handlePriceChange('halfDay', 'price_1_3', e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm dark:bg-gray-900 dark:border-gray-750 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <FiUsers size={14} className="text-gray-400" /> Tier 2: 4 - 7 People (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-semibold">$</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editedPrices.halfDay.price_4_7}
                      onChange={(e) => handlePriceChange('halfDay', 'price_4_7', e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm dark:bg-gray-900 dark:border-gray-750 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <FiUsers size={14} className="text-gray-400" /> Tier 3: 8 - 12 People (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-semibold">$</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editedPrices.halfDay.price_8_12}
                      onChange={(e) => handlePriceChange('halfDay', 'price_8_12', e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm dark:bg-gray-900 dark:border-gray-750 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Full Day Tour Prices */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 dark:bg-gray-800 dark:border-gray-700 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FiClock size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Full Day Tour</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Duration category: fullDay</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <FiUsers size={14} className="text-gray-400" /> Tier 1: 1 - 3 People (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-semibold">$</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editedPrices.fullDay.price_1_3}
                      onChange={(e) => handlePriceChange('fullDay', 'price_1_3', e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm dark:bg-gray-900 dark:border-gray-750 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <FiUsers size={14} className="text-gray-400" /> Tier 2: 4 - 7 People (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-semibold">$</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editedPrices.fullDay.price_4_7}
                      onChange={(e) => handlePriceChange('fullDay', 'price_4_7', e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm dark:bg-gray-900 dark:border-gray-750 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <FiUsers size={14} className="text-gray-400" /> Tier 3: 8 - 12 People (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-semibold">$</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editedPrices.fullDay.price_8_12}
                      onChange={(e) => handlePriceChange('fullDay', 'price_8_12', e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm dark:bg-gray-900 dark:border-gray-750 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-2xl transition shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <FiSave size={18} /> Save Price Configuration
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ListCustomTourPrices;
