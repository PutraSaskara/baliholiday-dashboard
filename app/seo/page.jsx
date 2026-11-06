// app/seo/page.jsx
// Halaman /seo: dua tab — Metadata (CRUD + publish) dan Agent API
// (kelola key + audit log).

"use client";

import { useState } from "react";
import AgentApiTab from "@/components/seo/AgentApiTab";
import SeoMetadataTab from "@/components/seo/SeoMetadataTab";

const TABS = [
  { id: "metadata", label: "Metadata" },
  { id: "agent-api", label: "Agent API" },
];

export default function SeoPage() {
  const [activeTab, setActiveTab] = useState("metadata");

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">SEO</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola metadata SEO seluruh halaman dan akses API untuk agent eksternal.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 w-full overflow-x-auto pb-1 nice-scrollbar">
        <div
          role="tablist"
          aria-label="Bagian pengelolaan SEO"
          className="flex w-max gap-1 rounded-xl bg-slate-100 p-1"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`seo-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`seo-panel-${tab.id}`}
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
        id={`seo-panel-${activeTab}`}
        aria-labelledby={`seo-tab-${activeTab}`}
      >
        {activeTab === "metadata" ? <SeoMetadataTab /> : <AgentApiTab />}
      </div>
    </div>
  );
}
