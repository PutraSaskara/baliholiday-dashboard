// components/AIAssistantModal.jsx
// Modal AI global: restyle memakai primitives (Card/Select/Button/Skeleton),
// role dialog + aria-modal, Escape menutup, focus trap, dan fokus kembali ke
// pemicu setelah tutup. Error yang tampil selalu generik; detail upstream
// hanya dicatat ke console. Dimuat lazy lewat components/AIAssistantLazy.jsx.
// Sumber model: backend /api/ai/models (per provider) + /api/ai/settings
// untuk default; pilihan terakhir disimpan di localStorage (ai.provider,
// ai.model) dan divalidasi ulang terhadap katalog.

"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Select from "./ui/Select";
import Skeleton from "./ui/Skeleton";
import ModelCombobox from "./ai/ModelCombobox";
import {
  AI_PROVIDERS,
  fetchAiModels,
  fetchAiSettings,
  readAiChoice,
  resolveInitialModel,
  resolveInitialProvider,
  saveAiChoice,
} from "../lib/aiModels";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Pesan aman untuk user. Penyebab sebenarnya tetap masuk console.error.
const GENERIC_ERROR = "Failed to generate content. Please try again.";

export default function AIAssistantModal({
  isOpen = true,
  onClose,
  mode, // 'add' or 'edit'
  tourId, // required if edit tour
  blogId, // required if edit article
  targetSection, // e.g. 'tour', 'detail', 'desc', 'article', 'article-paragraphs'
  drafts, // In Add mode: the full state. In Edit mode: the current form state
  onApply,
}) {
  const [provider, setProvider] = useState("openrouter");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [defaultSavedVisible, setDefaultSavedVisible] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);

  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  // onClose diambil lewat ref supaya handler Escape/Tab stabil antar render.
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      if (onCloseRef.current) onCloseRef.current();
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
  }, []);

  // Kunci scroll, pasang listener keyboard, pindahkan fokus ke dialog, dan
  // kembalikan fokus ke pemicu saat modal ditutup/di-unmount.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown, true);

    const focusTarget = closeRef.current ?? dialogRef.current;
    if (focusTarget) focusTarget.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = overflow;
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  // Komponen hanya dipasang saat terbuka, jadi state awal sudah bersih
  // (previewData null, loadingModels true) dan tidak perlu di-reset di sini.
  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;

    const loadCatalog = async () => {
      const saved = readAiChoice();
      let settings = null;
      try {
        settings = await fetchAiSettings();
      } catch (err) {
        console.error("Failed to fetch AI settings", err);
      }

      const initProvider = resolveInitialProvider({ saved, settings });
      try {
        const items = await fetchAiModels({ provider: initProvider, chat: true });
        if (cancelled) return;
        setProvider(initProvider);
        setModels(items);
        setSelectedModel(
          resolveInitialModel({ saved, settings, provider: initProvider, items })
        );
      } catch (err) {
        console.error("Failed to fetch AI models", err);
        if (!cancelled) {
          setProvider(initProvider);
          setModels([]);
          setSelectedModel("");
        }
      } finally {
        if (!cancelled) setLoadingModels(false);
      }
    };

    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Ganti provider: muat ulang katalog lalu reset model terpilih.
  const handleProviderChange = async (event) => {
    const next = event.target.value;
    setProvider(next);
    setSelectedModel("");
    setModels([]);
    setLoadingModels(true);
    try {
      const items = await fetchAiModels({ provider: next, chat: true });
      const saved = readAiChoice();
      const nextModel = resolveInitialModel({
        saved,
        settings: null,
        provider: next,
        items,
      });
      setModels(items);
      setSelectedModel(nextModel);
      saveAiChoice(next, nextModel);
    } catch (err) {
      console.error("Failed to fetch AI models", err);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    saveAiChoice(provider, modelId);
  };

  const handleSetDefault = () => {
    if (typeof window !== "undefined") {
      saveAiChoice(provider, selectedModel);
      setDefaultSavedVisible(true);
      setTimeout(() => setDefaultSavedVisible(false), 3000);
    }
  };

  const handleGenerate = async () => {
    if (!provider || !selectedModel) {
      setError("Please choose an AI model first.");
      return;
    }
    try {
      setIsGenerating(true);
      setError(null);

      const payload = {
        provider,
        model: selectedModel,
        mode,
        tourId,
        blogId,
        targetSection,
      };

      if (mode === "add") {
        payload.drafts = drafts; // Whole store drafts
      } else {
        payload.currentSectionData = drafts; // Just the current form
      }

      const res = await fetch("/api/generate-global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Detail upstream tidak boleh tampil ke user.
        console.error("AI generate failed with status", res.status);
        setError(GENERIC_ERROR);
        return;
      }

      const generatedData = await res.json();
      setPreviewData(generatedData);
    } catch (err) {
      console.error(err);
      setError(GENERIC_ERROR);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (previewData && onApply) {
      onApply(previewData);
    }
    if (onCloseRef.current) onCloseRef.current();
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && onCloseRef.current) {
          onCloseRef.current();
        }
      }}
    >
      <Card
        ref={dialogRef}
        padding={false}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-4">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="flex items-center gap-2 text-lg font-semibold text-slate-900"
            >
              <span aria-hidden="true">✨</span> Global AI Editor
            </h2>
            <p id={descId} className="mt-1 text-sm leading-relaxed text-slate-500">
              {mode === "add"
                ? "The AI will read ALL your drafts and fill missing fields across the entire tour."
                : `The AI is reading the full tour from the database to perfectly generate the missing ${targetSection} fields.`}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => onCloseRef.current && onCloseRef.current()}
            aria-label="Close dialog"
            className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Top Controls */}
          <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="sm:w-48">
                <Select
                  label="Provider"
                  name="aiProvider"
                  value={provider}
                  onChange={handleProviderChange}
                  options={AI_PROVIDERS}
                  disabled={isGenerating || loadingModels}
                />
              </div>
              <div className="min-w-0 flex-1">
                {loadingModels ? (
                  <div className="space-y-1.5">
                    <span className="block text-sm font-medium text-slate-700">
                      AI Model
                    </span>
                    <Skeleton className="h-[42px] w-full" />
                  </div>
                ) : (
                  <ModelCombobox
                    label="AI Model"
                    name="aiModel"
                    models={models}
                    value={selectedModel}
                    onChange={handleModelChange}
                    disabled={isGenerating}
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSetDefault}
                  disabled={loadingModels || isGenerating || !selectedModel}
                >
                  {defaultSavedVisible ? "✓ Saved" : "Set as Default"}
                </Button>
                <Button
                  onClick={handleGenerate}
                  loading={isGenerating}
                  disabled={loadingModels || !selectedModel}
                  className="sm:whitespace-nowrap"
                >
                  {isGenerating
                    ? "Generating..."
                    : "✨ Auto-Fill Empty Fields"}
                </Button>
              </div>
            </div>
            <p role="status" className="mt-2 h-4 text-xs font-medium text-brand-700">
              {defaultSavedVisible ? "Default model saved." : ""}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          {/* Generated Content Preview */}
          <div className="space-y-3">
            <h3 className="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
              Fields generated by AI
            </h3>

            {!previewData && !isGenerating && (
              <p className="py-8 text-center text-sm italic text-slate-400">
                Click the generate button above to see what the AI creates.
              </p>
            )}

            {isGenerating && (
              <div
                role="status"
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <p className="col-span-full text-center text-sm font-semibold text-brand-700">
                  Generating content...
                </p>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}

            {previewData && (
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 md:grid-cols-2">
                {/* Render everything returned dynamically since we have many fields across sections */}
                {Object.entries(previewData).map(([key, val]) => {
                  if (key === "faq") return null; // handle separately
                  return (
                    <div key={key} className="space-y-1">
                      <span className="text-xs font-bold uppercase text-slate-500">
                        {key.replace(/_/g, " ")}
                      </span>
                      <div className="min-h-[48px] rounded-lg border border-emerald-200 bg-white p-3 text-sm font-medium text-emerald-700">
                        {val}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {previewData?.faq && Array.isArray(previewData.faq) && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-slate-500">
                  Generated FAQs
                </span>
                <div className="space-y-2">
                  {previewData.faq.map((f, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3"
                    >
                      <p className="text-sm font-bold text-emerald-900">
                        Q: {f.question}
                      </p>
                      <p className="mt-1 text-sm text-emerald-800">
                        A: {f.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => onCloseRef.current && onCloseRef.current()}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!previewData || isGenerating}
          >
            Apply Changes &amp; Close
          </Button>
        </div>
      </Card>
    </div>,
    document.body
  );
}
