// components/AIAssistantLazy.jsx
// Wrapper tipis: AIAssistantModal (modal + fetch daftar model) hanya dimuat
// lewat next/dynamic saat tombol AI diklik. Pemicu tombol tetap dirender
// terpisah di komponen induk; wrapper ini hanya memasang modal saat isOpen.

"use client";

import dynamic from "next/dynamic";

const AIAssistantModal = dynamic(() => import("./AIAssistantModal"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
      <div
        role="status"
        className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-overlay"
      >
        <span className="sr-only">Loading AI assistant...</span>
        <div
          aria-hidden="true"
          className="mb-4 h-6 w-56 animate-pulse rounded-lg bg-slate-200"
        />
        <div
          aria-hidden="true"
          className="mb-3 h-[42px] w-full animate-pulse rounded-xl bg-slate-200"
        />
        <div
          aria-hidden="true"
          className="h-32 w-full animate-pulse rounded-xl bg-slate-200"
        />
      </div>
    </div>
  ),
});

export default function AIAssistantLazy({ isOpen = false, ...props }) {
  if (!isOpen) return null;
  return <AIAssistantModal isOpen {...props} />;
}
