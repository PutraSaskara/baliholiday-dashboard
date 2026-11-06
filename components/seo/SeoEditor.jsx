// components/seo/SeoEditor.jsx
// Editor metadata SEO: modal desktop / full-screen sheet di mobile.
// Preview SERP + OG/Twitter real-time, validasi klien sebelum kirim.

"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiCode, FiX } from "react-icons/fi";
import { api } from "@/apiConfig";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import {
  CUSTOM_PAGE_KEY,
  ENTITY_TYPES,
  NOINDEX_PAGE_KEYS,
  PAGE_KEY_OPTIONS,
  SITE_BASE_URL,
  extractApiError,
  isAbsoluteHttpUrl,
  isPresetPageKey,
  resolvePageKey,
} from "./seoUtils";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const OG_TYPES = ["website", "article", "product", "profile", "book"];
const TWITTER_CARDS = ["summary", "summary_large_image"];

const EMPTY_FORM = {
  pageKeyMode: "preset",
  pageKey: "/",
  pageKeyCustom: "",
  entityType: "page",
  entityId: "",
  title: "",
  description: "",
  canonical: "",
  robotsIndex: true,
  robotsFollow: true,
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  jsonld: "",
};

function formFromRecord(record) {
  if (!record) return EMPTY_FORM;
  const preset = isPresetPageKey(record.pageKey);
  return {
    pageKeyMode: preset ? "preset" : "custom",
    pageKey: preset ? record.pageKey : "/",
    pageKeyCustom: preset ? "" : record.pageKey || "",
    entityType: record.entityType || "page",
    entityId: record.entityId || "",
    title: record.title || "",
    description: record.description || "",
    canonical: record.canonical || "",
    robotsIndex: record.robotsIndex !== false,
    robotsFollow: record.robotsFollow !== false,
    keywords: record.keywords || "",
    ogTitle: record.ogTitle || "",
    ogDescription: record.ogDescription || "",
    ogImage: record.ogImage || "",
    ogType: record.ogType || "website",
    twitterCard: record.twitterCard || "summary_large_image",
    twitterTitle: record.twitterTitle || "",
    twitterDescription: record.twitterDescription || "",
    twitterImage: record.twitterImage || "",
    jsonld:
      record.jsonld && typeof record.jsonld === "object"
        ? JSON.stringify(record.jsonld, null, 2)
        : "",
  };
}

function validateForm(form) {
  const errors = {};
  const pageKey = resolvePageKey(form);

  if (!pageKey) {
    errors.pageKey = "pageKey wajib diisi.";
  } else if (!pageKey.startsWith("/") && pageKey !== "*") {
    errors.pageKey = "pageKey harus diawali '/' atau bernilai '*'.";
  } else if (/\s/.test(pageKey)) {
    errors.pageKey = "pageKey tidak boleh mengandung spasi.";
  }

  if (form.entityType !== "page" && !form.entityId.trim()) {
    errors.entityId = "entityId wajib diisi untuk entitas non-page.";
  }
  if (form.title.length > 70) {
    errors.title = "Title maksimal 70 karakter.";
  }
  if (form.description.length > 200) {
    errors.description = "Description maksimal 200 karakter.";
  }
  if (form.canonical.trim() && !isAbsoluteHttpUrl(form.canonical.trim())) {
    errors.canonical = "Canonical harus URL absolut http(s).";
  }
  if (form.ogImage.trim() && !isValidImageRef(form.ogImage.trim())) {
    errors.ogImage = "Berupa URL http(s) atau path yang diawali '/'.";
  }
  if (form.twitterImage.trim() && !isValidImageRef(form.twitterImage.trim())) {
    errors.twitterImage = "Berupa URL http(s) atau path yang diawali '/'.";
  }

  const jsonld = form.jsonld.trim();
  if (jsonld) {
    try {
      const parsed = JSON.parse(jsonld);
      if (typeof parsed !== "object" || parsed === null) {
        errors.jsonld = "JSON-LD harus berupa object atau array.";
      }
    } catch {
      errors.jsonld = "JSON-LD bukan JSON valid.";
    }
  }

  return errors;
}

function isValidImageRef(value) {
  return value.startsWith("/") || isAbsoluteHttpUrl(value);
}

// URL preview SERP: canonical jika valid, selain itu situs + pageKey.
function previewUrl(form) {
  const canonical = form.canonical.trim();
  if (canonical && isAbsoluteHttpUrl(canonical)) return canonical;
  const pageKey = resolvePageKey(form);
  if (!pageKey || pageKey === "*") return SITE_BASE_URL;
  return `${SITE_BASE_URL}${pageKey}`;
}

function Switch({ checked, onChange, label, hint, disabled = false }) {
  return (
    <div className="rounded-xl border border-slate-200 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            checked ? "bg-brand-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              checked ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function Counter({ value, max }) {
  const over = value.length > max;
  return (
    <span
      className={`ml-2 text-xs font-medium tabular-nums ${
        over ? "text-red-600" : "text-slate-400"
      }`}
    >
      {value.length}/{max}
    </span>
  );
}

// Kartu preview SERP: judul biru, URL hijau, deskripsi.
function SerpPreview({ form }) {
  const url = previewUrl(form);
  let host = url;
  let path = "";
  try {
    const parsed = new URL(url);
    host = parsed.host + parsed.pathname.replace(/\/$/, "");
    path = parsed.pathname;
  } catch {
    /* URL selalu valid dari previewUrl */
  }
  const title = form.title.trim() || form.ogTitle.trim() || "Judul halaman";
  const description =
    form.description.trim() || form.ogDescription.trim() || "Deskripsi halaman.";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Preview SERP
      </p>
      <div className="rounded-lg bg-slate-50 px-3 py-3">
        <p className="truncate text-xs text-slate-500">{host}</p>
        <p className="mt-0.5 line-clamp-2 text-lg leading-snug text-[#1a0dab]">
          {title}
        </p>
        <p className="mt-1 line-clamp-3 text-sm leading-snug text-slate-600">
          {description}
        </p>
      </div>
      <p className="mt-2 break-all text-[11px] text-slate-400">{path || "/"}</p>
    </div>
  );
}

// Kartu preview Open Graph / Twitter: sama bentuk, beda sumber field.
function SocialPreview({ form, kind }) {
  const isTwitter = kind === "twitter";
  const title = (
    isTwitter ? form.twitterTitle : form.ogTitle
  ).trim() ||
    form.title.trim() ||
    "Judul halaman";
  const description = (
    isTwitter ? form.twitterDescription : form.ogDescription
  ).trim() ||
    form.description.trim() ||
    "Deskripsi halaman.";
  const image = (isTwitter ? form.twitterImage : form.ogImage).trim();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {isTwitter ? "Preview Twitter/X" : "Preview Open Graph"}
      </p>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="flex h-28 items-center justify-center bg-slate-100 px-3">
          {image ? (
            <span className="line-clamp-2 break-all text-center text-[11px] text-slate-400">
              {image}
            </span>
          ) : (
            <span className="text-xs text-slate-400">Belum ada gambar</span>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {new URL(previewUrl(form)).host}
          </p>
          <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900">
            {title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        {isTwitter
          ? `twitter:card = ${form.twitterCard}`
          : `og:type = ${form.ogType}`}
      </p>
    </div>
  );
}

export default function SeoEditor({ open, record, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(() => formFromRecord(record));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [mounted] = useState(() => typeof document !== "undefined");
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  // Kunci scroll, Escape menutup, fokus ke dialog, dan fokus kembali ke pemicu.
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        if (!saving && onCloseRef.current) onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = [...root.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    const focusTarget = closeRef.current ?? dialogRef.current;
    if (focusTarget) focusTarget.focus();

    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = overflow;
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [open, saving]);

  const buildPayload = useCallback(() => {
    const trimOrNull = (value) => (value.trim() ? value.trim() : null);
    return {
      pageKey: resolvePageKey(form),
      entityType: form.entityType,
      entityId: form.entityType === "page" ? "" : form.entityId.trim(),
      title: trimOrNull(form.title),
      description: trimOrNull(form.description),
      canonical: trimOrNull(form.canonical),
      robotsIndex: form.robotsIndex,
      robotsFollow: form.robotsFollow,
      keywords: trimOrNull(form.keywords),
      ogTitle: trimOrNull(form.ogTitle),
      ogDescription: trimOrNull(form.ogDescription),
      ogImage: trimOrNull(form.ogImage),
      ogType: trimOrNull(form.ogType),
      twitterCard: trimOrNull(form.twitterCard),
      twitterTitle: trimOrNull(form.twitterTitle),
      twitterDescription: trimOrNull(form.twitterDescription),
      twitterImage: trimOrNull(form.twitterImage),
      jsonld: form.jsonld.trim() ? form.jsonld.trim() : null,
    };
  }, [form]);

  const save = useCallback(
    async ({ publish }) => {
      const found = validateForm(form);
      const cleaned = Object.fromEntries(
        Object.entries(found).filter(([, value]) => Boolean(value))
      );
      if (Object.keys(cleaned).length > 0) {
        setErrors(cleaned);
        toast.error("Periksa kembali isian yang ditandai.");
        return;
      }

      setSaving(true);
      try {
        const payload = buildPayload();
        let data;
        if (record) {
          const res = await api.put(`/api/seo/${record.id}`, {
            ...payload,
            ...(publish ? {} : { status: "draft" }),
          });
          data = res.data.data;
        } else {
          const res = await api.post("/api/seo", { ...payload, status: "draft" });
          data = res.data.data;
        }

        if (publish) {
          const res = await api.post("/api/seo/publish", { id: data.id });
          data = res.data.data;
        }

        toast.success(
          publish
            ? `Metadata "${data.pageKey}" dipublikasikan.`
            : `Metadata "${data.pageKey}" disimpan sebagai draft.`
        );
        if (onSaved) onSaved(data);
        if (onCloseRef.current) onCloseRef.current();
      } catch (err) {
        toast.error(
          extractApiError(err, "Gagal menyimpan metadata SEO. Coba lagi.")
        );
      } finally {
        setSaving(false);
      }
    },
    [form, buildPayload, record, onSaved, toast]
  );

  const formatJsonld = useCallback(() => {
    const raw = form.jsonld.trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setField("jsonld", JSON.stringify(parsed, null, 2));
      toast.info("JSON-LD diformat.");
    } catch {
      setErrors((prev) => ({ ...prev, jsonld: "JSON-LD bukan JSON valid." }));
      toast.error("JSON-LD bukan JSON valid.");
    }
  }, [form.jsonld, setField, toast]);

  if (!open || !mounted) return null;

  const pageKey = resolvePageKey(form);
  const noindexWarning = NOINDEX_PAGE_KEYS.includes(pageKey);
  const pageKeySelectValue =
    form.pageKeyMode === "custom" ? CUSTOM_PAGE_KEY : form.pageKey;

  const pageKeyOptions = [
    ...PAGE_KEY_OPTIONS,
    { value: CUSTOM_PAGE_KEY, label: "Custom (ketik manual)" },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-stretch justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving && onClose) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-overlay"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="truncate text-lg font-semibold text-slate-900"
            >
              {record ? "Edit metadata SEO" : "Tambah metadata SEO"}
            </h2>
            <p className="mt-0.5 truncate text-sm text-slate-500">
              {pageKey || "Tentukan pageKey halaman"}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup editor"
            className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="nice-scrollbar flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Kolom kiri: isian */}
            <div className="space-y-5">
              {/* Target */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                  Target halaman
                </h3>

                <Select
                  label="pageKey"
                  name="pageKey"
                  required
                  value={pageKeySelectValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === CUSTOM_PAGE_KEY) {
                      setForm((prev) => ({
                        ...prev,
                        pageKeyMode: "custom",
                        pageKeyCustom: prev.pageKeyCustom || "/",
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        pageKeyMode: "preset",
                        pageKey: value,
                      }));
                    }
                    setErrors((prev) =>
                      prev.pageKey ? { ...prev, pageKey: undefined } : prev
                    );
                  }}
                  options={pageKeyOptions}
                  error={errors.pageKey}
                  hint={
                    form.pageKeyMode === "custom"
                      ? "Path manual, diawali '/' atau '*'."
                      : undefined
                  }
                />

                {form.pageKeyMode === "custom" ? (
                  <Input
                    label="pageKey manual"
                    name="pageKeyCustom"
                    required
                    placeholder="/contoh-path"
                    value={form.pageKeyCustom}
                    onChange={(e) => setField("pageKeyCustom", e.target.value)}
                    error={errors.pageKey}
                  />
                ) : null}

                {noindexWarning ? (
                  <div
                    role="status"
                    className="flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
                  >
                    <FiAlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-relaxed text-amber-800">
                      Path ini dijalankan web dengan{" "}
                      <span className="font-mono font-semibold">robots noindex</span>{" "}
                      terpaksa. Setelan robots index di bawah tidak berlaku untuk
                      halaman ini.
                    </p>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select
                    label="entityType"
                    name="entityType"
                    value={form.entityType}
                    onChange={(e) => setField("entityType", e.target.value)}
                    options={ENTITY_TYPES}
                    hint="Page = metadata per halaman."
                  />
                  <Input
                    label="entityId"
                    name="entityId"
                    required={form.entityType !== "page"}
                    disabled={form.entityType === "page"}
                    placeholder={
                      form.entityType === "page"
                        ? "Tidak berlaku untuk page"
                        : "slug / id entitas"
                    }
                    value={form.entityId}
                    onChange={(e) => setField("entityId", e.target.value)}
                    error={errors.entityId}
                  />
                </div>
              </section>

              {/* Konten utama */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                  Konten utama
                </h3>

                <Input
                  label={
                    <>
                      Title
                      <Counter value={form.title} max={70} />
                    </>
                  }
                  name="title"
                  placeholder="Judul hasil pencarian (maks. 70)"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  error={errors.title}
                  maxLength={120}
                />

                <Textarea
                  label={
                    <>
                      Description
                      <Counter value={form.description} max={200} />
                    </>
                  }
                  name="description"
                  rows={3}
                  placeholder="Deskripsi hasil pencarian (maks. 200)"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  error={errors.description}
                />

                <Input
                  label="Canonical"
                  name="canonical"
                  type="url"
                  inputMode="url"
                  placeholder="https://baliholiday.xyz/about"
                  value={form.canonical}
                  onChange={(e) => setField("canonical", e.target.value)}
                  error={errors.canonical}
                  hint="URL absolut http(s). Kosongkan untuk canonical otomatis."
                />

                <Input
                  label="Keywords"
                  name="keywords"
                  placeholder="bali tour, private driver, ..."
                  value={form.keywords}
                  onChange={(e) => setField("keywords", e.target.value)}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Switch
                    label="robots: index"
                    hint="Izinkan mesin pencari mengindeks halaman."
                    checked={form.robotsIndex}
                    onChange={(value) => setField("robotsIndex", value)}
                    disabled={saving}
                  />
                  <Switch
                    label="robots: follow"
                    hint="Izinkan perayap mengikuti tautan."
                    checked={form.robotsFollow}
                    onChange={(value) => setField("robotsFollow", value)}
                    disabled={saving}
                  />
                </div>
              </section>

              {/* Open Graph */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                  Open Graph
                </h3>
                <Input
                  label="og:title"
                  name="ogTitle"
                  value={form.ogTitle}
                  onChange={(e) => setField("ogTitle", e.target.value)}
                />
                <Textarea
                  label="og:description"
                  name="ogDescription"
                  rows={2}
                  value={form.ogDescription}
                  onChange={(e) => setField("ogDescription", e.target.value)}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="og:image"
                    name="ogImage"
                    placeholder="/og.jpg atau https://..."
                    value={form.ogImage}
                    onChange={(e) => setField("ogImage", e.target.value)}
                    error={errors.ogImage}
                  />
                  <Select
                    label="og:type"
                    name="ogType"
                    value={form.ogType}
                    onChange={(e) => setField("ogType", e.target.value)}
                    options={OG_TYPES.map((v) => ({ value: v, label: v }))}
                  />
                </div>
              </section>

              {/* Twitter */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
                  Twitter card
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="twitter:title"
                    name="twitterTitle"
                    value={form.twitterTitle}
                    onChange={(e) => setField("twitterTitle", e.target.value)}
                  />
                  <Select
                    label="twitter:card"
                    name="twitterCard"
                    value={form.twitterCard}
                    onChange={(e) => setField("twitterCard", e.target.value)}
                    options={TWITTER_CARDS.map((v) => ({ value: v, label: v }))}
                  />
                </div>
                <Textarea
                  label="twitter:description"
                  name="twitterDescription"
                  rows={2}
                  value={form.twitterDescription}
                  onChange={(e) => setField("twitterDescription", e.target.value)}
                />
                <Input
                  label="twitter:image"
                  name="twitterImage"
                  placeholder="/twitter.jpg atau https://..."
                  value={form.twitterImage}
                  onChange={(e) => setField("twitterImage", e.target.value)}
                  error={errors.twitterImage}
                />
              </section>

              {/* JSON-LD */}
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    JSON-LD
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={formatJsonld}
                    disabled={saving || !form.jsonld.trim()}
                  >
                    <FiCode className="h-4 w-4" aria-hidden="true" />
                    Format
                  </Button>
                </div>
                <Textarea
                  name="jsonld"
                  rows={6}
                  aria-label="JSON-LD"
                  className="font-mono text-xs"
                  placeholder='{"@context":"https://schema.org", ...}'
                  value={form.jsonld}
                  onChange={(e) => setField("jsonld", e.target.value)}
                  error={errors.jsonld}
                  hint="Object atau array JSON valid. Kosongkan bila tidak dipakai."
                />
              </section>
            </div>

            {/* Kolom kanan: preview (ikut bergulir di mobile, sticky di desktop) */}
            <div className="space-y-4 lg:sticky lg:top-0 lg:self-start">
              <SerpPreview form={form} />
              <SocialPreview form={form} kind="og" />
              <SocialPreview form={form} kind="twitter" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button
            variant="secondary"
            onClick={() => save({ publish: false })}
            loading={saving}
            className="w-full sm:w-auto"
          >
            Simpan draft
          </Button>
          <Button
            onClick={() => save({ publish: true })}
            loading={saving}
            className="w-full sm:w-auto"
          >
            Simpan &amp; Publish
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
