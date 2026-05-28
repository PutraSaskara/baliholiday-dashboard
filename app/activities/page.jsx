"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/apiConfig";

const categoryLabels = {
  activity: "Activity",
  experience: "Experience",
  transfer: "Transfer",
  ticket: "Ticket",
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchActivities();
  }, [filter]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const params = filter ? `?category=${filter}` : "";
      const res = await api.get(`/api/activities/admin/all${params}`);
      setActivities(Array.isArray(res.data) ? res.data : res.data.activities || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/api/activities/${id}`);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete activity");
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Activities</h1>
          <p className="text-gray-500 mt-1">Manage activities, experiences, transfers & tickets</p>
        </div>
        <Link
          href="/activities/add"
          className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all"
        >
          + Add New
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[{ value: "", label: "All" }, ...Object.entries(categoryLabels).map(([v, l]) => ({ value: v, label: l }))].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all ${
              filter === opt.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-2xl mb-2">📭</p>
          <p className="text-gray-500">No activities found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Title</th>
                <th className="text-left px-5 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Category</th>
                <th className="text-left px-5 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Price</th>
                <th className="text-left px-5 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                <th className="text-right px-5 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {item.image1 && (
                        <img src={item.image1} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <span className="font-semibold text-gray-800 truncate max-w-[200px]">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                      {categoryLabels[item.category] || item.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-700">${item.price1}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${item.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/activities/edit/${item.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
