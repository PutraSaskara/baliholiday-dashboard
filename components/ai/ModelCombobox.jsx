// components/ai/ModelCombobox.jsx
// Select model yang bisa dicari: ketik untuk filter id/nama model.
// Tiap opsi menampilkan harga in/out per 1M + badge sumber harga,
// atau teks "harga belum diisi" bila harga belum ada.

"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Badge from "../ui/Badge";
import { formatModelPrice, priceSourceMeta } from "../../lib/aiModels";

function OptionPrice({ model }) {
  const meta = priceSourceMeta(model.priceSource);
  return (
    <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
      <span>{formatModelPrice(model)}</span>
      {meta ? (
        <Badge variant={meta.variant} className="text-[10px]">
          {meta.label}
        </Badge>
      ) : null}
    </span>
  );
}

export default function ModelCombobox({
  label = "Model",
  name,
  models = [],
  value,
  onChange,
  disabled = false,
  loading = false,
  placeholder = "Ketik untuk mencari model...",
  id,
}) {
  const autoId = useId();
  const inputId = id ?? (name ? `model-${name}` : autoId);
  const listId = `${inputId}-list`;
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = models.find((m) => m?.id === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return models;
    return models.filter(
      (m) =>
        String(m?.id ?? "").toLowerCase().includes(q) ||
        String(m?.name ?? "").toLowerCase().includes(q)
    );
  }, [models, query]);

  // Tutup dropdown saat klik di luar atau tekan Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const pick = (modelId) => {
    onChange?.(modelId);
    setOpen(false);
    setQuery("");
  };

  const displayValue = open ? query : (selected?.id ?? "");

  return (
    <div className="w-full" ref={wrapRef}>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          name={name}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled || loading}
          placeholder={loading ? "Memuat model..." : placeholder}
          value={displayValue}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="input-base pr-10"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>

        {open && !disabled && !loading ? (
          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            className="nice-scrollbar absolute left-0 right-0 top-[calc(100%+4px)] z-40 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-overlay"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-slate-500">
                Tidak ada model cocok.
              </li>
            ) : (
              filtered.map((model) => {
                const isActive = model.id === value;
                return (
                  <li key={model.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => pick(model.id)}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                        isActive
                          ? "bg-brand-50 ring-1 ring-inset ring-brand-200"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="block truncate font-mono text-sm font-medium text-slate-800">
                        {model.id}
                      </span>
                      {model.name && model.name !== model.id ? (
                        <span className="block truncate text-xs text-slate-500">
                          {model.name}
                        </span>
                      ) : null}
                      <OptionPrice model={model} />
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>

      {!open && selected ? (
        <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span>{formatModelPrice(selected)}</span>
          {priceSourceMeta(selected.priceSource) ? (
            <Badge
              variant={priceSourceMeta(selected.priceSource).variant}
              className="text-[10px]"
            >
              {priceSourceMeta(selected.priceSource).label}
            </Badge>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
