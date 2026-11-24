// components/ListTours.jsx
// Daftar paket tur: grid kartu modern, search berikon, pagination primitive,
// empty state, skeleton, dan konfirmasi hapus via ConfirmDialog.

"use client";

import { useEffect, useState } from "react";
import { FiMap, FiPlus, FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Card from "./Card";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Pagination from "./ui/Pagination";
import EmptyState from "./ui/EmptyState";
import ConfirmDialog from "./ui/ConfirmDialog";
import Skeleton from "./ui/Skeleton";
import { useToast } from "./ui/Toast";
import useTourStore from "../stores/useTourStore";
import { api } from "../apiConfig";

const ITEMS_PER_PAGE = 6;

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const formatRupiah = (value) => rupiahFormatter.format(Number(value) || 0);

// Margin tier 1 dari data bulk biaya; "—" bila biaya belum diisi.
const getMarginDisplay = (tour, costs) => {
  const rows = Array.isArray(costs[String(tour.id)]) ? costs[String(tour.id)] : [];
  const row = rows.find((entry) => String(entry.slot) === "1");
  const cost =
    row && row.cost !== null && row.cost !== undefined && row.cost !== ""
      ? Number(row.cost)
      : null;
  const price =
    Number(String(tour.price1 ?? "").replace(/[^0-9.-]/g, "")) || 0;

  if (cost === null || Number.isNaN(cost)) {
    return { label: "—", className: "text-slate-400" };
  }

  const margin = price - cost;
  const percent = price > 0 ? (margin / price) * 100 : 0;
  const percentLabel = Number.isInteger(percent) ? percent : percent.toFixed(1);

  return {
    label: `${formatRupiah(margin)} (${percentLabel}%)`,
    className:
      margin > 0
        ? "text-emerald-600"
        : margin < 0
          ? "text-red-600"
          : "text-slate-500",
  };
};

function ListTours() {
  const { tours, loading, fetchTours, deleteTour } = useTourStore();
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [costs, setCosts] = useState({});

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const ok = await deleteTour(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    if (ok) {
      toast.success(`Tour "${pendingDelete.title}" dihapus.`);
    } else {
      toast.error("Gagal menghapus tour. Coba lagi.");
    }
  };

  const filteredTours = tours.filter((tour) =>
    (tour.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const currentTours = filteredTours.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const pageIds = currentTours
    .map((tour) => tour.id)
    .slice(0, 200)
    .join(",");

  // Ambil biaya semua tour di halaman ini sekali untuk kolom margin.
  useEffect(() => {
    if (!pageIds) {
      setCosts({});
      return undefined;
    }

    let cancelled = false;

    const fetchCosts = async () => {
      try {
        const res = await api.get(
          `/api/package-costs/bulk?eventType=tour&entityType=tour&entityIds=${pageIds}`
        );
        if (!cancelled) setCosts(res.data?.data || {});
      } catch {
        // Gagal ambil biaya: biarkan kosong, margin tampil "—".
        if (!cancelled) setCosts({});
      }
    };

    fetchCosts();

    return () => {
      cancelled = true;
    };
  }, [pageIds]);

  const convertSpaceToDash = (title) => title.replace(/\s+/g, "-");

  const isLoading = loading && tours.length === 0;

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tour Packages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your tours and packages catalog.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="search"
            name="search-tours"
            aria-label="Search tours by name"
            placeholder="Search tours by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            leading={<FiSearch className="h-4 w-4" aria-hidden="true" />}
            className="sm:w-80"
          />
          <Button onClick={() => router.push("/add-tour-package")}>
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            Add Tour
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div
          aria-hidden="true"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" rounded="rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTours.length === 0 ? (
        <EmptyState
          icon={<FiMap className="h-5 w-5" aria-hidden="true" />}
          title="No tours found"
          description={
            searchQuery
              ? "No tours match that title. Try another keyword."
              : "Create your first tour package to get started."
          }
          action={
            <Button onClick={() => router.push("/add-tour-package")}>
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Add Tour
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {currentTours.map((tour) => (
              <Card
                key={tour.id}
                title={tour.title}
                price={tour.price1}
                priceNote={tour.pricenote1}
                status={tour.status}
                img={tour.image?.imageUrl1}
                desc={tour.tour_description?.paragraf1}
                link={`edit-tour-package/${tour.id}`}
                link2={`https://baliholiday.xyz/package/${
                  tour.slug ||
                  convertSpaceToDash(tour.title)
                    .toLowerCase()
                    .replace(/[^\w-]+/g, "")
                }`}
                onDelete={() => setPendingDelete(tour)}
                margin={getMarginDisplay(tour, costs)}
              />
            ))}
          </div>

          <Pagination
            page={safePage}
            totalPages={totalPages}
            onChange={setCurrentPage}
            className="mt-8"
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus tour ini?"
        description={`"${pendingDelete?.title}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        confirmLabel="Hapus"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default ListTours;
