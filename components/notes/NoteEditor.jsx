// components/notes/NoteEditor.jsx
// Modal tambah/edit catatan: desktop jadi dialog terpusat, mobile jadi sheet
// penuh. Input judul ber-counter 150, textarea pesan, toggle isActive, dan
// sortOrder opsional (kosong = otomatis di akhir daftar).

"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import useNotesStore from "@/stores/useNotesStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const TITLE_MAX = 150;

const EMPTY_FORM = {
  title: "",
  message: "",
  isActive: true,
  sortOrder: "",
};

function formFromNote(note) {
  if (!note) return EMPTY_FORM;
  return {
    title: note.title || "",
    message: note.message || "",
    isActive: note.isActive !== false,
    sortOrder:
      note.sortOrder === undefined || note.sortOrder === null
        ? ""
        : String(note.sortOrder),
  };
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

function validate(form) {
  const errors = {};
  const title = form.title.trim();
  if (!title) {
    errors.title = "Judul wajib diisi.";
  } else if (title.length > TITLE_MAX) {
    errors.title = `Judul maksimal ${TITLE_MAX} karakter.`;
  }
  if (!form.message.trim()) {
    errors.message = "Pesan wajib diisi.";
  }
  if (form.sortOrder !== "") {
    const sortOrder = Number(form.sortOrder);
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      errors.sortOrder = "Urutan harus bilangan bulat 0 atau lebih.";
    }
  }
  return errors;
}

export default function NoteEditor({ note = null, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(() => formFromNote(note));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [mounted] = useState(() => typeof document !== "undefined");
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const { createNote, updateNote } = useNotesStore();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  // Kunci scroll, Escape menutup, fokus ke dialog, dan fokus kembali ke pemicu.
  useEffect(() => {
    if (!mounted) return undefined;
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
  }, [mounted, saving]);

  const save = useCallback(async () => {
    const found = validate(form);
    const cleaned = Object.fromEntries(
      Object.entries(found).filter(([, value]) => Boolean(value))
    );
    if (Object.keys(cleaned).length > 0) {
      setErrors(cleaned);
      toast.error("Periksa kembali isian yang ditandai.");
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      isActive: form.isActive,
    };
    if (form.sortOrder !== "") payload.sortOrder = Number(form.sortOrder);

    const result = note
      ? await updateNote(note.id, payload)
      : await createNote(payload);
    setSaving(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(
      note
        ? `Catatan "${result.note.title}" diperbarui.`
        : `Catatan "${result.note.title}" ditambahkan.`
    );
    if (onSaved) onSaved(result.note);
    if (onCloseRef.current) onCloseRef.current();
  }, [form, note, createNote, updateNote, onSaved, toast]);

  if (!mounted) return null;

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
        className="flex h-full w-full flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[92vh] sm:max-w-lg sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-overlay"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="truncate text-lg font-semibold text-slate-900"
            >
              {note ? "Edit catatan" : "Tambah catatan"}
            </h2>
            <p className="mt-0.5 truncate text-sm text-slate-500">
              Tampil di halaman custom-tour web
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup editor catatan"
            className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="nice-scrollbar flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="space-y-5">
            <Input
              label={
                <>
                  Judul
                  <Counter value={form.title} max={TITLE_MAX} />
                </>
              }
              name="noteTitle"
              required
              placeholder="Mis. Booking Rules"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              error={errors.title}
              maxLength={TITLE_MAX}
            />

            <Textarea
              label="Pesan"
              name="noteMessage"
              required
              rows={6}
              placeholder="Isi catatan yang dibaca pengunjung..."
              value={form.message}
              onChange={(e) => setField("message", e.target.value)}
              error={errors.message}
            />

            <Switch
              label="Catatan aktif"
              hint="Catatan aktif tampil di halaman custom-tour web."
              checked={form.isActive}
              onChange={(value) => setField("isActive", value)}
              disabled={saving}
            />

            <Input
              label="Urutan"
              name="noteSortOrder"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              placeholder="Kosongkan = akhir daftar"
              value={form.sortOrder}
              onChange={(e) => setField("sortOrder", e.target.value)}
              error={errors.sortOrder}
              hint="Opsional. Kosongkan untuk menempatkan catatan di akhir daftar."
            />
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
            onClick={save}
            loading={saving}
            className="w-full sm:w-auto"
          >
            {note ? "Simpan perubahan" : "Tambah catatan"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
