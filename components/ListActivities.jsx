// components/ListActivities.jsx
// Daftar activity untuk tab Activities di Overview: tabel + kartu mobile,
// pencarian judul, margin dari biaya slot 1, tanpa pagination.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiEdit2,
  FiExternalLink,
  FiSearch,
  FiStar,
} from "react-icons/fi";
import { api } from "@/apiConfig";
import Badge from "./ui/Badge";
import EmptyState from "./ui/EmptyState";
import Input from "./ui/Input";
import Skeleton from "./ui/Skeleton";
import { iconButtonClass } from "./ui/IconButton";
import { useToast } from "./ui/Toast";

const categoryLabels = {
  activity: "Activity",
  experience: "Experience",
  transfer: "Transfer",
  ticket: "Ticket",
};

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatUsd = (value) => usdFormatter.format(Number(value) || 0);

// Margin slot 1 dari data bulk biaya; "—" bila biaya belum diisi.
const getMarginDisplay = (item, costs) => {
  const rows = Array.isArray(costs[String(item.id)]) ? costs[String(item.id)] : [];
  const row = rows.find((entry) => String(entry.slot) === "1");
  const cost =
    row && row.cost !== null && row.cost !== undefined && row.cost !== ""
      ? Number(row.cost)
      : null;
  const price =
    Number(String(item.price1 ?? "").replace(/[^0-9.-]/g, "")) || 0;

  if (cost === null || Number.isNaN(cost)) {
    return { label: "—", className: "text-slate-400" };
  }

  const margin = price - cost;
  const percent = price > 0 ? (margin / price) * 100 : 0;
  const percentLabel = Number.isInteger(percent) ? percent : percent.toFixed(1);

  return {
    label: `${formatUsd(margin)} (${percentLabel}%)`,
    className:
      margin > 0
        ? "text-emerald-600"
        : margin < 0
          ? "text-red-600"
          : "text-slate-500",
  };
};

const slugify = (value) =>
  (value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const getPriceLabel = (item) => {
  if (
    item.price1 === null ||
    item.price1 === undefined ||
    String(item.price1).trim() === ""
  ) {
    return "—";
  }
  return `$${item.price1}`;
};

function ListActivities() {
  const toast = useToast();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [costs, setCosts] = useState({});

  useEffect(() => {
    let cancelled = false;

    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/api/activities/admin/all");
        if (!cancelled) {
          setActivities(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Error fetching activities:", err);
        if (!cancelled) {
          setActivities([]);
          toast.error("Gagal memuat activities.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchActivities();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  // Ambil biaya semua activity sekali untuk kolom margin.
  useEffect(() => {
    if (activities.length === 0) {
      setCosts({});
      return undefined;
    }

    let cancelled = false;

    const fetchCosts = async () => {
      try {
        const ids = activities.map((item) => item.id).join(",");
        const res = await api.get(
          `/api/package-costs/bulk?entityType=activity&entityIds=${ids}`
        );
        if (!cancelled) setCosts(res.data?.data || {});
      } catch (err) {
        console.error("Error fetching activity costs:", err);
        if (!cancelled) setCosts({});
      }
    };

    fetchCosts();

    return () => {
      cancelled = true;
    };
  }, [activities]);

  const filteredActivities = activities.filter((item) =>
    (item.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <Link
        href={`/activity/${item.slug || slugify(item.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Lihat ${item.title}`}
        title="Lihat"
        className={iconButtonClass()}
      >
        <FiExternalLink className="h-5 w-5" aria-hidden="true" />
      </Link>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activities</h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar activity, experience, transfer & ticket.
          </p>
        </div>
        <Input
          type="search"
          name="search-activities-overview"
          aria-label="Cari activity berdasarkan judul"
          placeholder="Cari activity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leading={<FiSearch className="h-4 w-4" aria-hidden="true" />}
          className="sm:w-80"
        />
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
          title="Belum ada activity"
          description={
            searchQuery
              ? "Tidak ada activity yang cocok dengan judul tersebut."
              : "Tambahkan activity pertama untuk mulai mengelolanya."
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
                    Gambar
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Judul
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Margin
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredActivities.map((item) => {
                  const margin = getMarginDisplay(item, costs);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3">
                        <span className="block max-w-[240px] truncate font-semibold text-slate-900">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block max-w-[240px] truncate text-xs text-slate-400">
                          {item.slug || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="neutral">
                          {categoryLabels[item.category] || item.category || "—"}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                        {getPriceLabel(item)}
                      </td>
                      <td className="px-4 py-3">
                        {item.isActive ? (
                          <Badge variant="success">Aktif</Badge>
                        ) : (
                          <Badge variant="warning">Draft</Badge>
                        )}
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 font-semibold ${margin.className}`}
                      >
                        {margin.label}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {renderActions(item)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Kartu mobile */}
          <ul className="space-y-3 md:hidden">
            {filteredActivities.map((item) => {
              const margin = getMarginDisplay(item, costs);
              return (
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
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {item.slug || "—"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant="neutral">
                          {categoryLabels[item.category] || item.category || "—"}
                        </Badge>
                        {item.isActive ? (
                          <Badge variant="success">Aktif</Badge>
                        ) : (
                          <Badge variant="warning">Draft</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {getPriceLabel(item)}
                      </p>
                      <p
                        className={`mt-1 text-xs font-semibold ${margin.className}`}
                      >
                        Margin: {margin.label}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">{renderActions(item, "between")}</div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default ListActivities;
