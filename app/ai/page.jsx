// app/ai/page.jsx
// Halaman /ai: dua tab — Pengaturan (model dashboard + web bot) dan
// Harga Sumopod (harga manual per model).

"use client";

import { useCallback, useEffect, useState } from "react";
import SettingsTab from "@/components/ai/SettingsTab";
import SumopodPricesTab from "@/components/ai/SumopodPricesTab";
import { fetchAiSettings } from "@/lib/aiModels";

const TABS = [
  { id: "settings", label: "Pengaturan" },
  { id: "prices", label: "Harga Sumopod" },
];

export default function AiPage() {
  const [activeTab, setActiveTab] = useState("settings");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const data = await fetchAiSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch AI settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadSettings();
    };
    init();
  }, [loadSettings]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI</h1>
        <p className="mt-1 text-sm text-slate-500">
          Atur model assistant dashboard, web bot, dan harga manual model
          Sumopod.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 w-full overflow-x-auto pb-1 nice-scrollbar">
        <div
          role="tablist"
          aria-label="Bagian pengaturan AI"
          className="flex w-max gap-1 rounded-xl bg-slate-100 p-1"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`ai-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`ai-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`h-10 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`ai-panel-${activeTab}`}
        aria-labelledby={`ai-tab-${activeTab}`}
      >
        {activeTab === "settings" ? (
          <SettingsTab
            settings={settings}
            loading={loading}
            onSaved={loadSettings}
          />
        ) : (
          <SumopodPricesTab />
        )}
      </div>
    </div>
  );
}
