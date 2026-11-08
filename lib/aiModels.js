// lib/aiModels.js
// Katalog model AI + helper untuk halaman /ai dan modal AI (client only).
// Sumber data: backend /api/ai/models, /api/ai/settings, /api/ai/prices.
// Semua request lewat instance `api` (apiConfig.js) supaya header x-api-key dan
// Bearer JWT otomatis terpasang. Tidak ada allowlist statis lagi: katalog
// model divalidasi ulang oleh backend pada saat generate.

import { api } from "../apiConfig";

export const AI_PROVIDERS = [
  { value: "openrouter", label: "OpenRouter" },
  { value: "sumopod", label: "Sumopod" },
];

const PROVIDER_VALUES = AI_PROVIDERS.map((p) => p.value);

export function isAiProvider(value) {
  return typeof value === "string" && PROVIDER_VALUES.includes(value);
}

export function providerLabel(value) {
  return AI_PROVIDERS.find((p) => p.value === value)?.label ?? value;
}

// Label sumber harga untuk badge. `provider` = harga otomatis OpenRouter,
// `manual` = diisi admin lewat /ai, `reference` = patokan OpenRouter untuk
// model Sumopod, null = harga belum ada.
export const PRICE_SOURCE_META = {
  provider: { label: "provider", variant: "success" },
  manual: { label: "manual", variant: "warning" },
  reference: { label: "reference", variant: "brand" },
};

export function priceSourceMeta(priceSource) {
  return PRICE_SOURCE_META[priceSource] ?? null;
}

export function hasModelPrice(model) {
  return (
    Boolean(model) && model.inputPer1M != null && model.outputPer1M != null
  );
}

// "$0.3 / $2.5 per 1M" atau "harga belum diisi".
export function formatModelPrice(model) {
  if (!hasModelPrice(model)) return "harga belum diisi";
  return `$${model.inputPer1M} / $${model.outputPer1M} per 1M`;
}

/* ------------------------------------------------------------------ */
/* Request ke backend                                                  */
/* ------------------------------------------------------------------ */

export async function fetchAiModels({ provider, chat = true, q = "" } = {}) {
  const params = { provider };
  if (chat) params.chat = 1;
  if (q) params.q = q;
  const res = await api.get("/api/ai/models", { params });
  return Array.isArray(res.data?.items) ? res.data.items : [];
}

export async function fetchAiSettings() {
  const res = await api.get("/api/ai/settings");
  return res.data ?? {};
}

export async function saveAiSettings({ purpose, provider, model }) {
  const res = await api.put("/api/ai/settings", { purpose, provider, model });
  return res.data ?? {};
}

export async function saveAiPrice({
  provider,
  model,
  inputPer1M,
  outputPer1M,
  currency,
}) {
  const body = { provider, model, inputPer1M, outputPer1M };
  if (currency) body.currency = currency;
  const res = await api.put("/api/ai/prices", body);
  return res.data ?? {};
}

// Hapus harga manual satu model. Setelah itu katalog kembali memakai harga
// provider/reference (atau belum ada sama sekali).
export async function deleteAiPrice({ provider, model }) {
  const res = await api.delete("/api/ai/prices", {
    params: { provider, model },
  });
  return res.data ?? {};
}

/* ------------------------------------------------------------------ */
/* Pilihan terakhir user (localStorage)                                */
/* ------------------------------------------------------------------ */

export const AI_CHOICE_KEYS = { provider: "ai.provider", model: "ai.model" };

export function readAiChoice() {
  if (typeof window === "undefined") return { provider: null, model: null };
  try {
    return {
      provider: window.localStorage.getItem(AI_CHOICE_KEYS.provider),
      model: window.localStorage.getItem(AI_CHOICE_KEYS.model),
    };
  } catch {
    return { provider: null, model: null };
  }
}

export function saveAiChoice(provider, model) {
  if (typeof window === "undefined") return;
  try {
    if (provider) window.localStorage.setItem(AI_CHOICE_KEYS.provider, provider);
    if (model) window.localStorage.setItem(AI_CHOICE_KEYS.model, model);
  } catch {
    /* storage tidak tersedia: abaikan */
  }
}

/* ------------------------------------------------------------------ */
/* Resolusi default modal                                              */
/* Urutan: pilihan terakhir (localStorage) -> settings dashboard ->    */
/* model pertama yang berharga. Semua divalidasi terhadap katalog.     */
/* ------------------------------------------------------------------ */

export function resolveInitialProvider({ saved, settings } = {}) {
  if (isAiProvider(saved?.provider)) return saved.provider;
  if (isAiProvider(settings?.dashboard?.provider)) {
    return settings.dashboard.provider;
  }
  return "openrouter";
}

export function resolveInitialModel({
  saved,
  settings,
  provider,
  items = [],
} = {}) {
  const ids = items.map((m) => m?.id);
  if (
    saved?.provider === provider &&
    typeof saved.model === "string" &&
    ids.includes(saved.model)
  ) {
    return saved.model;
  }
  const settingsModel = settings?.dashboard?.model;
  if (typeof settingsModel === "string" && ids.includes(settingsModel)) {
    return settingsModel;
  }
  const priced = items.find((m) => hasModelPrice(m));
  return (priced ?? items[0])?.id ?? "";
}
