// components/ai/SettingsTab.jsx
// Tab Pengaturan: dua kartu (Dashboard Assistant + Web Bot) dengan pilihan
// provider dan model (searchable) plus tombol Simpan. Data dari
// GET /api/ai/settings; simpan lewat PUT /api/ai/settings.

"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import ModelCombobox from "@/components/ai/ModelCombobox";
import {
  AI_PROVIDERS,
  fetchAiModels,
  formatModelPrice,
  hasModelPrice,
  isAiProvider,
  priceSourceMeta,
  saveAiChoice,
  saveAiSettings,
} from "@/lib/aiModels";

function pickInitialModel(items, preferred) {
  if (typeof preferred === "string" && items.some((m) => m.id === preferred)) {
    return preferred;
  }
  return items.find((m) => hasModelPrice(m))?.id ?? items[0]?.id ?? "";
}

function SettingCard({ purpose, title, description, setting, onSaved }) {
  const toast = useToast();
  const [provider, setProvider] = useState("openrouter");
  const [model, setModel] = useState("");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Muat katalog provider sesuai setting tersimpan.
  useEffect(() => {
    if (!setting) return undefined;
    let cancelled = false;

    const load = async () => {
      const initProvider = isAiProvider(setting.provider)
        ? setting.provider
        : "openrouter";
      try {
        const items = await fetchAiModels({ provider: initProvider, chat: true });
        if (cancelled) return;
        setProvider(initProvider);
        setModels(items);
        setModel(pickInitialModel(items, setting.model));
      } catch (err) {
        console.error("Failed to fetch AI models:", err);
        if (!cancelled) {
          setProvider(initProvider);
          setModels([]);
          setModel(typeof setting.model === "string" ? setting.model : "");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [setting]);

  const handleProviderChange = async (event) => {
    const next = event.target.value;
    setProvider(next);
    setLoading(true);
    try {
      const items = await fetchAiModels({ provider: next, chat: true });
      setModels(items);
      setModel(pickInitialModel(items, null));
    } catch (err) {
      console.error("Failed to fetch AI models:", err);
      setModels([]);
      setModel("");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!model) {
      toast.error("Pilih model terlebih dahulu.");
      return;
    }
    setSaving(true);
    try {
      await saveAiSettings({ purpose, provider, model });
      // Sinkronkan pilihan terakhir supaya default modal AI ikut berubah.
      if (purpose === "dashboard") saveAiChoice(provider, model);
      await onSaved();
      toast.success(`Pengaturan "${title}" disimpan.`);
    } catch (err) {
      console.error("Failed to save AI settings:", err);
      toast.error("Gagal menyimpan pengaturan AI.");
    } finally {
      setSaving(false);
    }
  };

  const selected = models.find((m) => m.id === model) ?? null;
  const sourceMeta = priceSourceMeta(selected?.priceSource);

  return (
    <Card>
      <CardHeader title={title} description={description} />

      <div className="space-y-4">
        <Select
          label="Provider"
          name={`provider-${purpose}`}
          value={provider}
          onChange={handleProviderChange}
          options={AI_PROVIDERS}
          disabled={saving || loading}
        />

        {loading ? (
          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-slate-700">
              Model
            </span>
            <Skeleton className="h-[42px] w-full" />
          </div>
        ) : (
          <ModelCombobox
            label="Model"
            name={`model-${purpose}`}
            models={models}
            value={model}
            onChange={setModel}
            disabled={saving}
          />
        )}

        {selected && provider === "sumopod" && !hasModelPrice(selected) ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
            Harga model Sumopod belum diisi. Isi lewat tab &quot;Harga
            Sumopod&quot;.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Harga saat ini:{" "}
            <span className="font-medium text-slate-700">
              {formatModelPrice(selected)}
            </span>
            {sourceMeta ? (
              <Badge variant={sourceMeta.variant} className="ml-1.5">
                {sourceMeta.label}
              </Badge>
            ) : null}
          </p>
          <Button onClick={handleSave} loading={saving} disabled={loading}>
            Simpan
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function SettingsTab({ settings, onSaved, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="mb-3 h-[42px] w-full" />
          <Skeleton className="h-[42px] w-full" />
        </Card>
        <Card>
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="mb-3 h-[42px] w-full" />
          <Skeleton className="h-[42px] w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <SettingCard
        purpose="dashboard"
        title="Dashboard Assistant"
        description="Model yang dipakai assistant di halaman dashboard (modal AI)."
        setting={settings?.dashboard}
        onSaved={onSaved}
      />
      <SettingCard
        purpose="web"
        title="Web Bot (Ask BaliHoliday AI)"
        description="Model yang dipakai bot chat di website publik."
        setting={settings?.web}
        onSaved={onSaved}
      />
    </div>
  );
}
