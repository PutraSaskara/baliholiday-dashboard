// components/DashboardHome.jsx
// Halaman Overview: header aksi cepat, 6 StatCard (fetch paralel dari store
// yang sudah ada + endpoint yang sudah dipakai), lalu segmented tabs NavList.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiCompass,
  FiFileText,
  FiMap,
  FiMapPin,
  FiPlus,
  FiStar,
  FiTag,
} from "react-icons/fi";
import Button from "./ui/Button";
import StatCard from "./StatCard";
import NavList from "./NavList";
import ListTours from "./ListTours";
import ListArticle from "./ListArticle";
import ListDestinations from "./ListDestinations";
import ListAreas from "./ListAreas";
import ListCustomTourPrices from "./ListCustomTourPrices";
import ListBookings from "./ListBookings";
import { api } from "@/apiConfig";
import useTourStore from "../stores/useTourStore";
import useArticleStore from "../stores/useArticleStore";
import useDestinationStore from "../stores/useDestinationStore";

const STAT_ITEMS = [
  { key: "tours", label: "Tour Packages", icon: FiMap },
  { key: "articles", label: "Articles", icon: FiFileText },
  { key: "activities", label: "Activities", icon: FiStar },
  { key: "destinations", label: "Destinations", icon: FiCompass },
  { key: "areas", label: "Pickup Areas", icon: FiMapPin },
  { key: "bookings", label: "Bookings", icon: FiTag },
];

export default function DashboardHome() {
  const router = useRouter();
  // undefined = masih memuat, null = gagal diambil, angka = hasil.
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let alive = true;

    const load = async (key, fetcher) => {
      try {
        const value = await fetcher();
        if (alive) setCounts((prev) => ({ ...prev, [key]: value }));
      } catch {
        if (alive) setCounts((prev) => ({ ...prev, [key]: null }));
      }
    };

    // Semua sumber diambil paralel; tidak ada endpoint baru.
    Promise.all([
      load("tours", async () => {
        await useTourStore.getState().fetchTours();
        return useTourStore.getState().tours.length;
      }),
      load("articles", async () => {
        await useArticleStore.getState().fetchArticles();
        return useArticleStore.getState().articles.length;
      }),
      load("activities", async () => {
        const res = await api.get("/api/activities/admin/all");
        const data = res.data;
        return (Array.isArray(data) ? data : data?.activities || []).length;
      }),
      load("destinations", async () => {
        const list =
          await useDestinationStore.getState().fetchAllDestinationsList();
        return list.length;
      }),
      load("areas", async () => {
        const res = await api.get("/api/pickup-areas", {
          params: { page: 1, limit: 500 },
        });
        return res.data?.totalItems ?? res.data?.areas?.length ?? null;
      }),
      load("bookings", async () => {
        const res = await api.get("/api/bookings");
        const list = Array.isArray(res.data) ? res.data : [];
        return {
          total: list.length,
          pending: list.filter((b) => b.status === "Pending").length,
        };
      }),
    ]);

    return () => {
      alive = false;
    };
  }, []);

  const renderValue = (key) => {
    const value = counts[key];
    if (value === undefined) return null; // skeleton
    if (value === null) return "–";
    if (key === "bookings") return value.total;
    return value;
  };

  const renderHint = (key) => {
    const value = counts[key];
    if (key === "bookings" && value && typeof value === "object") {
      return `${value.pending} menunggu tindakan`;
    }
    return null;
  };

  return (
    <div className="w-full">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan konten, operasional, dan booking BaliHoliday.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push("/add-tour-package")}
          >
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            Tambah Tour
          </Button>
          <Button onClick={() => router.push("/add-article")}>
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            Tambah Artikel
          </Button>
        </div>
      </header>

      <section
        aria-label="Statistik ringkas"
        className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6"
      >
        {STAT_ITEMS.map((item) => (
          <StatCard
            key={item.key}
            icon={item.icon}
            label={item.label}
            loading={counts[item.key] === undefined}
            value={renderValue(item.key)}
            hint={renderHint(item.key)}
          />
        ))}
      </section>

      <NavList
        ListArticle={<ListArticle />}
        ListTour={<ListTours />}
        DestinationsList={<ListDestinations />}
        ListArea={<ListAreas />}
        ListCustomTourPrices={<ListCustomTourPrices />}
        ListBookings={<ListBookings />}
      />
    </div>
  );
}
