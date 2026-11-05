"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/apiConfig";
import { FiEdit2, FiPlus, FiSearch, FiStar, FiTrash2 } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Skeleton from "@/components/ui/Skeleton";
import { iconButtonClass } from "@/components/ui/IconButton";
import { useToast } from "@/components/ui/Toast";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const toast = useToast();

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
      setActivities([]);
      toast.error("Failed to load activities.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/activities/${pendingDelete.id}`);
      setActivities((prev) => prev.filter((a) => a.id !== pendingDelete.id));
      toast.success(`Activity "${pendingDelete.title}" deleted.`);
      setPendingDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete activity.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredActivities = activities.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.title || "").toLowerCase().includes(q) ||
      (categoryLabels[item.category] || item.category || "").toLowerCase().includes(q)
    );
  });

  const renderActions = (item, align = "end") => (
    <div
      className={`flex items-center gap-1 ${
        align === "between" ? "border-t border-slate-100 pt-3" : "justify-end"
      }`}
    >
      <Link
        href={`/activities/edit/${item.id}`}
        aria-label={`Edit ${item.title}`}
        title="Edit"
        className={iconButtonClass("brand")}
      >
        <FiEdit2 className="h-5 w-5" aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => setPendingDelete(item)}
        aria-label={`Delete ${item.title}`}
        title="Delete"
        className={`${iconButtonClass("danger")} ${align === "between" ? "ml-auto" : ""}`}
      >
        <FiTrash2 className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activities</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage activities, experiences, transfers & tickets.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="search"
            name="search-activities"
            aria-label="Search activities"
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leading={<FiSearch className="h-4 w-4" aria-hidden="true" />}
            className="sm:w-80"
          />
          <Button onClick={() => router.push("/activities/add")}>
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            Add New
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 -mx-1 overflow-x-auto px-1 pb-1 nice-scrollbar">
        <div className="flex w-max gap-1 rounded-xl bg-slate-100 p-1">
          {[
            { value: "", label: "All" },
            ...Object.entries(categoryLabels).map(([v, l]) => ({ value: v, label: l })),
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              aria-pressed={filter === opt.value}
              className={`h-10 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition-colors ${
                filter === opt.value
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div aria-hidden="true" className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card flex items-center gap-4 p-4">
              <Skeleton className="h-11 w-11" />
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </div>
      ) : filteredActivities.length === 0 ? (
        <EmptyState
          icon={<FiStar className="h-5 w-5" aria-hidden="true" />}
          title="No activities found"
          description={
            searchQuery || filter
              ? "No activities match the current filter."
              : "Add your first activity, experience, transfer, or ticket."
          }
          action={
            <Button onClick={() => router.push("/activities/add")}>
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Add New
            </Button>
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
                    Title
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
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
                {filteredActivities.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {item.image1 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.image1}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FiStar
                              className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-slate-400"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <span className="line-clamp-1 max-w-[240px] font-semibold text-slate-900">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral">
                        {categoryLabels[item.category] || item.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      ${item.price1}
                    </td>
                    <td className="px-4 py-3">
                      {item.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Inactive</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {renderActions(item)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu mobile */}
          <ul className="space-y-3 md:hidden">
            {filteredActivities.map((item) => (
              <li key={item.id} className="card p-4">
                <div className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.image1 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image1}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiStar
                        className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge variant="neutral">
                        {categoryLabels[item.category] || item.category}
                      </Badge>
                      {item.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Inactive</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      ${item.price1}
                    </p>
                  </div>
                </div>
                <div className="mt-3">{renderActions(item, "between")}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this activity?"
        description={`"${pendingDelete?.title}" will be permanently deleted and cannot be restored.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
