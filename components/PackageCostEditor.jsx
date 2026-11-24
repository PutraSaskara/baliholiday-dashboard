"use client";

// Editor biaya net per tier untuk estimasi profit internal.
// Hanya dipakai di dashboard admin; data tidak pernah dikirim ke situs publik.

import { useEffect, useState } from "react";
import { api } from "@/apiConfig";
import Button from "./ui/Button";
import Input from "./ui/Input";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const formatRupiah = (value) => rupiahFormatter.format(Number(value) || 0);

// Angka kosong berarti biaya belum diisi (cost null saat disimpan).
const parseNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const emptyRowMap = (slots) => {
  const next = {};
  slots.forEach((slot) => {
    next[String(slot)] = "";
  });
  return next;
};

function PackageCostEditor({ entityType, entityId, tiers = [] }) {
  const [costs, setCosts] = useState({});
  const [notes, setNotes] = useState({});
  const [savedCosts, setSavedCosts] = useState({});
  const [savedNotes, setSavedNotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const hasEntity = entityId !== null && entityId !== undefined && entityId !== "";
  const slotKey = tiers.map((tier) => tier.slot).join(",");

  useEffect(() => {
    const slots = slotKey ? slotKey.split(",") : [];

    // Mode tambah: biaya disimpan setelah paket punya id.
    if (!hasEntity) {
      setCosts({});
      setNotes({});
      setSavedCosts({});
      setSavedNotes({});
      setMessage(null);
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;

    const loadCosts = async () => {
      setIsLoading(true);
      setMessage(null);
      try {
        const res = await api.get("/api/package-costs", {
          params: { entityType, entityId },
        });
        if (cancelled) return;
        const rows = Array.isArray(res.data?.data) ? res.data.data : [];
        const nextCosts = emptyRowMap(slots);
        const nextNotes = emptyRowMap(slots);
        rows.forEach((row) => {
          const key = String(row.slot);
          nextCosts[key] =
            row.cost === null || row.cost === undefined ? "" : String(row.cost);
          nextNotes[key] = row.note || "";
        });
        setCosts(nextCosts);
        setNotes(nextNotes);
        setSavedCosts(nextCosts);
        setSavedNotes(nextNotes);
      } catch (err) {
        console.error("Error fetching package costs:", err);
        if (!cancelled) {
          setMessage({ type: "error", text: "Gagal memuat biaya." });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadCosts();

    return () => {
      cancelled = true;
    };
  }, [entityType, entityId, slotKey, hasEntity]);

  const isDirty = tiers.some((tier) => {
    const key = String(tier.slot);
    return (
      (costs[key] ?? "") !== (savedCosts[key] ?? "") ||
      (notes[key] ?? "") !== (savedNotes[key] ?? "")
    );
  });

  const handleCostChange = (slot, value) => {
    setCosts((prev) => ({ ...prev, [String(slot)]: value }));
    setMessage(null);
  };

  const handleNoteChange = (slot, value) => {
    setNotes((prev) => ({ ...prev, [String(slot)]: value }));
    setMessage(null);
  };

  const handleSave = async () => {
    if (!hasEntity || !isDirty || isSaving) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const changedTiers = tiers.filter((tier) => {
        const key = String(tier.slot);
        return (
          (costs[key] ?? "") !== (savedCosts[key] ?? "") ||
          (notes[key] ?? "") !== (savedNotes[key] ?? "")
        );
      });

      for (const tier of changedTiers) {
        const key = String(tier.slot);
        await api.put("/api/package-costs", {
          entityType,
          entityId,
          slot: tier.slot,
          cost: parseNumber(costs[key]),
          note: (notes[key] || "").trim().slice(0, 120),
        });
      }

      setSavedCosts({ ...costs });
      setSavedNotes({ ...notes });
      setMessage({ type: "success", text: "Biaya tersimpan." });
    } catch (err) {
      console.error("Error saving package costs:", err);
      setMessage({ type: "error", text: "Gagal menyimpan biaya." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Estimasi Profit (Internal)
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Hanya tampil di dashboard admin, tidak dikirim ke situs publik.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Memuat biaya...</p>
      ) : (
        <div className="space-y-3">
          {tiers.map((tier, index) => {
            const key = String(tier.slot);
            const price = parseNumber(tier.price) || 0;
            const cost = parseNumber(costs[key]);
            const margin = cost === null ? null : price - cost;
            const marginPercent =
              margin === null || price <= 0 ? 0 : (margin / price) * 100;
            const percentLabel = Number.isInteger(marginPercent)
              ? marginPercent
              : marginPercent.toFixed(1);
            const marginClass =
              margin === null
                ? "text-slate-400"
                : margin > 0
                  ? "text-emerald-600"
                  : margin < 0
                    ? "text-red-600"
                    : "text-slate-500";
            const marginText =
              margin === null
                ? "belum diisi"
                : `${formatRupiah(margin)} (${percentLabel}%)`;

            return (
              <div
                key={key}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-3"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-tight text-slate-500">
                    Tier {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    Harga: {formatRupiah(price)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    label="Biaya net (opsional)"
                    name={`${entityType}-cost-${tier.slot}`}
                    type="number"
                    inputMode="numeric"
                    placeholder="kosongkan bila tidak dipakai"
                    value={costs[key] ?? ""}
                    onChange={(e) => handleCostChange(tier.slot, e.target.value)}
                  />
                  <Input
                    label="Catatan biaya"
                    name={`${entityType}-cost-note-${tier.slot}`}
                    maxLength={120}
                    placeholder="mis. ATV 400k + rafting 200k"
                    value={notes[key] ?? ""}
                    onChange={(e) => handleNoteChange(tier.slot, e.target.value)}
                  />
                </div>

                <p className={`mt-2 text-xs font-semibold ${marginClass}`}>
                  Margin: {marginText}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleSave}
          disabled={!hasEntity || !isDirty}
          loading={isSaving}
        >
          Simpan biaya
        </Button>
        {!hasEntity ? (
          <span className="text-xs font-medium text-amber-700">
            Simpan setelah paket dibuat
          </span>
        ) : null}
        {message ? (
          <span
            className={`text-xs font-medium ${
              message.type === "success" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {message.text}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default PackageCostEditor;
