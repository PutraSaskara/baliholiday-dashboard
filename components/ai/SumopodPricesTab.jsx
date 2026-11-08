// components/ai/SumopodPricesTab.jsx
// Tab Harga Sumopod: tabel model chat Sumopod dengan input harga in/out
// per 1M dan tombol Simpan per baris. Sumopod tidak menyediakan harga,
// jadi admin mengisi manual lewat PUT /api/ai/prices. Harga OpenRouter
// datang otomatis dari provider dan tidak ditampilkan form-nya di sini.
// Harga manual bisa dihapus per baris lewat DELETE /api/ai/prices; badge
// sumber harga ikut berubah (reference/manual/belum ada) setelah reload.

"use client";

import { useCallback, useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { FiDollarSign, FiSave, FiTrash2 } from "react-icons/fi";
import {
  deleteAiPrice,
  fetchAiModels,
  priceSourceMeta,
  saveAiPrice,
} from "@/lib/aiModels";

function buildDrafts(items) {
  const next = {};
  for (const item of items) {
    next[item.id] = {
      inputPer1M: item.inputPer1M ?? "",
      outputPer1M: item.outputPer1M ?? "",
    };
  }
  return next;
}

function parseAmount(value) {
  if (value === "" || value == null) return null;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : NaN;
}

function SourceBadge({ priceSource }) {
  const meta = priceSourceMeta(priceSource);
  if (!meta) return <Badge variant="neutral">belum ada</Badge>;
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

// Hanya harga manual yang tersimpan di backend; harga reference/provider
// datang dari katalog dan tidak punya baris untuk dihapus.
function hasManualPrice(row) {
  return row?.priceSource === "manual";
}

export default function SumopodPricesTab() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const items = await fetchAiModels({ provider: "sumopod", chat: true });
      setRows(items);
      setDrafts(buildDrafts(items));
    } catch (err) {
      console.error("Failed to fetch Sumopod models:", err);
      toast.error("Gagal memuat daftar model Sumopod.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const init = async () => {
      await load();
    };
    init();
  }, [load]);

  const handleDraftChange = (modelId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [modelId]: { ...prev[modelId], [field]: value },
    }));
  };

  const handleSave = async (modelId) => {
    const draft = drafts[modelId] ?? {};
    const input = parseAmount(draft.inputPer1M);
    const output = parseAmount(draft.outputPer1M);
    if (input == null || output == null || Number.isNaN(input) || Number.isNaN(output)) {
      toast.error("Harga harus angka nol atau lebih.");
      return;
    }

    setSavingId(modelId);
    try {
      await saveAiPrice({
        provider: "sumopod",
        model: modelId,
        inputPer1M: input,
        outputPer1M: output,
      });
      toast.success(`Harga "${modelId}" disimpan.`);
      await load();
    } catch (err) {
      console.error("Failed to save Sumopod price:", err);
      toast.error("Gagal menyimpan harga model.");
    } finally {
      setSavingId(null);
    }
  };

  const confirmDelete = async () => {
    const modelId = pendingDelete;
    if (!modelId) return;

    setDeleting(true);
    try {
      await deleteAiPrice({ provider: "sumopod", model: modelId });
      setPendingDelete(null);
      toast.success(`Harga "${modelId}" dihapus.`);
      await load();
    } catch (err) {
      console.error("Failed to delete Sumopod price:", err);
      toast.error("Gagal menghapus harga model.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Card padding={false}>
        <div aria-hidden="true" className="space-y-3 p-4 sm:p-5">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </Card>
    );
  }

  if (rows.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<FiDollarSign className="h-5 w-5" aria-hidden="true" />}
          title="Tidak ada model Sumopod"
          description="Katalog model chat Sumopod kosong."
        />
      </Card>
    );
  }

  const renderInputs = (row) => {
    const draft = drafts[row.id] ?? {};
    return (
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Input / 1M"
          name={`input-${row.id}`}
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={draft.inputPer1M ?? ""}
          onChange={(e) => handleDraftChange(row.id, "inputPer1M", e.target.value)}
          disabled={savingId === row.id}
        />
        <Input
          label="Output / 1M"
          name={`output-${row.id}`}
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={draft.outputPer1M ?? ""}
          onChange={(e) => handleDraftChange(row.id, "outputPer1M", e.target.value)}
          disabled={savingId === row.id}
        />
      </div>
    );
  };

  const renderDeleteButton = (row) => {
    const canDelete = hasManualPrice(row);
    return (
      <IconButton
        variant="danger"
        label={
          canDelete
            ? `Hapus harga "${row.id}"`
            : `Tidak ada harga manual "${row.id}"`
        }
        disabled={!canDelete || deleting}
        className="disabled:pointer-events-none disabled:opacity-40"
        onClick={() => setPendingDelete(row.id)}
      >
        <FiTrash2 className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    );
  };

  return (
    <Card padding={false}>
      <div className="px-4 pt-4 sm:px-5">
        <h2 className="text-base font-semibold text-slate-900">
          Harga manual model Sumopod
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Sumopod tidak menyediakan harga, jadi harga diisi manual per model.
          Model OpenRouter memakai harga otomatis dari provider.
        </p>
      </div>

      {/* Tabel desktop */}
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Model
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sumber harga
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Harga (USD / 1M token)
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row) => (
              <tr key={row.id} className="align-top hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="block font-mono text-sm font-semibold text-slate-800">
                    {row.id}
                  </span>
                  {row.name && row.name !== row.id ? (
                    <span className="block truncate text-xs text-slate-500">
                      {row.name}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <SourceBadge priceSource={row.priceSource} />
                </td>
                <td className="px-4 py-3">{renderInputs(row)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSave(row.id)}
                      loading={savingId === row.id}
                    >
                      <FiSave className="h-4 w-4" aria-hidden="true" />
                      Simpan
                    </Button>
                    {renderDeleteButton(row)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kartu mobile */}
      <ul className="space-y-3 border-t border-slate-100 p-4 md:hidden sm:p-5">
        {rows.map((row) => (
          <li key={row.id} className="rounded-xl border border-slate-200 p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="min-w-0 break-all font-mono text-sm font-semibold text-slate-800">
                {row.id}
              </span>
              <SourceBadge priceSource={row.priceSource} />
            </div>
            <div className="mt-3">{renderInputs(row)}</div>
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="min-w-0 flex-1"
                onClick={() => handleSave(row.id)}
                loading={savingId === row.id}
              >
                <FiSave className="h-4 w-4" aria-hidden="true" />
                Simpan
              </Button>
              {renderDeleteButton(row)}
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus harga manual model ini?"
        description={`Harga manual "${pendingDelete ?? ""}" akan dihapus dari katalog. Badge sumber harga berubah menjadi reference (atau belum ada bila model tidak punya harga patokan).`}
        confirmLabel="Hapus harga"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </Card>
  );
}
