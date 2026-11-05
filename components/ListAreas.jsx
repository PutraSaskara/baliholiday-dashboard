// components/ListAreas.jsx
// Daftar pickup area: tabel desktop (hidden md:table), kartu mobile, search
// berikon, pagination store, badge status is_active, ConfirmDialog + toast.

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiEdit2,
  FiEye,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import useAreaStore from "../stores/useAreaStore";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Pagination from "./ui/Pagination";
import EmptyState from "./ui/EmptyState";
import ConfirmDialog from "./ui/ConfirmDialog";
import Skeleton from "./ui/Skeleton";
import Badge from "./ui/Badge";
import { iconButtonClass } from "./ui/IconButton";
import { useToast } from "./ui/Toast";

function ListAreas() {
  const {
    areas,
    totalPages,
    currentPage,
    loading,
    fetchAreas,
    searchAreas,
    deleteArea,
  } = useAreaStore();
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const ok = await deleteArea(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    if (ok) {
      toast.success(`Pickup area "${pendingDelete.name}" dihapus.`);
    } else {
      toast.error("Gagal menghapus pickup area. Coba lagi.");
    }
  };

  const statusBadge = (area) =>
    area.is_active === false ? (
      <Badge variant="neutral">Inactive</Badge>
    ) : (
      <Badge variant="success">Active</Badge>
    );

  const renderActions = (area, size = "sm") => (
    <div
      className={`flex items-center gap-1 ${
        size === "lg" ? "border-t border-slate-100 pt-3" : ""
      }`}
    >
      <Link
        href={`/pickup-areas/view/${area.id}`}
        aria-label={`View ${area.name}`}
        title="View"
        className={iconButtonClass()}
      >
        <FiEye className="h-5 w-5" aria-hidden="true" />
      </Link>
      <Link
        href={`/pickup-areas/edit/${area.id}`}
        aria-label={`Edit ${area.name}`}
        title="Edit"
        className={iconButtonClass("brand")}
      >
        <FiEdit2 className="h-5 w-5" aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => setPendingDelete(area)}
        aria-label={`Delete ${area.name}`}
        title="Delete"
        className={`${iconButtonClass("danger")} ${size === "lg" ? "ml-auto" : ""}`}
      >
        <FiTrash2 className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pickup Areas</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your pickup locations and areas.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={handleSearch} className="w-full sm:w-80">
            <Input
              type="search"
              name="search-areas"
              aria-label="Search pickup areas by name"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leading={<FiSearch className="h-4 w-4" aria-hidden="true" />}
            />
            <button type="submit" className="hidden">
              Search
            </button>
          </form>
          <Button onClick={() => router.push("/pickup-areas/add")}>
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            Add Area
          </Button>
        </div>
      </div>

      {loading ? (
        <div
          aria-hidden="true"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card space-y-3 p-4">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
      ) : areas.length === 0 ? (
        <EmptyState
          icon={<FiMapPin className="h-5 w-5" aria-hidden="true" />}
          title="No pickup areas found"
          description={
            isSearching
              ? "No pickup areas match that name. Try another keyword."
              : "Add your first pickup location for tours and transfers."
          }
          action={
            <Button onClick={() => router.push("/pickup-areas/add")}>
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Add Area
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
                    Pickup Area
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Coordinates
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
                {areas.map((area) => (
                  <tr key={area.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            fill
                            sizes="44px"
                            src={area.image || "/placeholder.jpg"}
                            alt=""
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/pickup-areas/view/${area.id}`}
                            className="line-clamp-1 font-semibold text-slate-900 hover:text-brand-700"
                          >
                            {area.name}
                          </Link>
                          <span className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                            {area.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="block text-xs text-slate-500">
                        Lat {area.lat}
                      </span>
                      <span className="block text-xs text-slate-500">
                        Lng {area.lng}
                      </span>
                    </td>
                    <td className="px-4 py-3">{statusBadge(area)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {renderActions(area)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu mobile */}
          <ul className="space-y-3 md:hidden">
            {areas.map((area) => (
              <li key={area.id} className="card p-4">
                <div className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      fill
                      sizes="56px"
                      src={area.image || "/placeholder.jpg"}
                      alt=""
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/pickup-areas/view/${area.id}`}
                        className="line-clamp-1 font-semibold text-slate-900 hover:text-brand-700"
                      >
                        {area.name}
                      </Link>
                      {statusBadge(area)}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {area.description}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Lat {area.lat} · Lng {area.lng}
                    </p>
                  </div>
                </div>
                <div className="mt-3">{renderActions(area, "lg")}</div>
              </li>
            ))}
          </ul>

          {!isSearching && totalPages > 1 ? (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={(page) => fetchAreas(page)}
              className="mt-8"
            />
          ) : null}
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus pickup area ini?"
        description={`"${pendingDelete?.name}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        confirmLabel="Hapus"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default ListAreas;
