// components/ListDestinations.jsx
// Daftar destinasi: tabel desktop (hidden md:table), kartu mobile, search
// berikon, pagination store, ConfirmDialog untuk hapus, toast untuk hasil.

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiCompass,
  FiEdit2,
  FiEye,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import useDestinationStore from "../stores/useDestinationStore";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Pagination from "./ui/Pagination";
import EmptyState from "./ui/EmptyState";
import ConfirmDialog from "./ui/ConfirmDialog";
import Skeleton from "./ui/Skeleton";
import { iconButtonClass } from "./ui/IconButton";
import { useToast } from "./ui/Toast";

function ListDestinations() {
  const {
    destinations,
    totalPages,
    currentPage,
    loading,
    fetchDestinations,
    searchDestinations,
    deleteDestination,
  } = useDestinationStore();
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      await fetchDestinations(1);
    } else {
      setIsSearching(true);
      await searchDestinations(searchQuery);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const ok = await deleteDestination(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    if (ok) {
      toast.success(`Destinasi "${pendingDelete.name}" dihapus.`);
    } else {
      toast.error("Gagal menghapus destinasi. Coba lagi.");
    }
  };

  const renderActions = (destination, size = "sm") => (
    <div
      className={`flex items-center gap-1 ${
        size === "lg" ? "border-t border-slate-100 pt-3" : ""
      }`}
    >
      <Link
        href={`/destinations/view/${destination.id}`}
        aria-label={`View ${destination.name}`}
        title="View"
        className={iconButtonClass()}
      >
        <FiEye className="h-5 w-5" aria-hidden="true" />
      </Link>
      <Link
        href={`/destinations/edit/${destination.id}`}
        aria-label={`Edit ${destination.name}`}
        title="Edit"
        className={iconButtonClass("brand")}
      >
        <FiEdit2 className="h-5 w-5" aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => setPendingDelete(destination)}
        aria-label={`Delete ${destination.name}`}
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
          <h1 className="text-2xl font-bold text-slate-900">Destinations</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your destination locations and details.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={handleSearch} className="w-full sm:w-80">
            <Input
              type="search"
              name="search-destinations"
              aria-label="Search destinations by name"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leading={<FiSearch className="h-4 w-4" aria-hidden="true" />}
            />
            <button type="submit" className="hidden">
              Search
            </button>
          </form>
          <Button onClick={() => router.push("/destinations/add")}>
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            Add Destination
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
      ) : destinations.length === 0 ? (
        <EmptyState
          icon={<FiCompass className="h-5 w-5" aria-hidden="true" />}
          title="No destinations found"
          description={
            isSearching
              ? "No destinations match that name. Try another keyword."
              : "Add your first destination to build tour plans."
          }
          action={
            <Button onClick={() => router.push("/destinations/add")}>
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Add Destination
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
                    Destination
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Coordinates
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {destinations.map((destination) => (
                  <tr key={destination.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            fill
                            sizes="44px"
                            src={destination.image || "/placeholder.jpg"}
                            alt=""
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/destinations/view/${destination.id}`}
                            className="line-clamp-1 font-semibold text-slate-900 hover:text-brand-700"
                          >
                            {destination.name}
                          </Link>
                          <span className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                            {destination.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="block text-xs text-slate-500">
                        Lat {destination.lat}
                      </span>
                      <span className="block text-xs text-slate-500">
                        Lng {destination.lng}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {renderActions(destination)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu mobile */}
          <ul className="space-y-3 md:hidden">
            {destinations.map((destination) => (
              <li key={destination.id} className="card p-4">
                <div className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      fill
                      sizes="56px"
                      src={destination.image || "/placeholder.jpg"}
                      alt=""
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/destinations/view/${destination.id}`}
                      className="line-clamp-1 font-semibold text-slate-900 hover:text-brand-700"
                    >
                      {destination.name}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {destination.description}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Lat {destination.lat} · Lng {destination.lng}
                    </p>
                  </div>
                </div>
                <div className="mt-3">{renderActions(destination, "lg")}</div>
              </li>
            ))}
          </ul>

          {!isSearching && totalPages > 1 ? (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={(page) => fetchDestinations(page)}
              className="mt-8"
            />
          ) : null}
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus destinasi ini?"
        description={`"${pendingDelete?.name}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        confirmLabel="Hapus"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default ListDestinations;
