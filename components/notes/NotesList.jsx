// components/notes/NotesList.jsx
// Daftar catatan situs: tabel desktop (hidden md:table), kartu mobile,
// status aktif via toggle + badge, aksi urutkan naik/turun (PATCH /reorder),
// edit lewat NoteEditor, dan hapus dengan ConfirmDialog + toast.

"use client";

import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiFileText,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import useNotesStore from "@/stores/useNotesStore";
import NoteEditor from "./NoteEditor";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { iconButtonClass } from "@/components/ui/IconButton";
import { useToast } from "@/components/ui/Toast";

// Tombol urut naik/turun: tombol ikon 44px dengan status nonaktif di ujung.
function orderButtonClass(disabled) {
  return `${iconButtonClass("neutral")} disabled:cursor-not-allowed disabled:opacity-40${
    disabled ? " opacity-40" : ""
  }`;
}

function StatusToggle({ note, disabled, onToggle }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={note.isActive}
        aria-label={`${note.isActive ? "Nonaktifkan" : "Aktifkan"} catatan ${note.title}`}
        disabled={disabled}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          note.isActive ? "bg-brand-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            note.isActive ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
      <Badge variant={note.isActive ? "success" : "neutral"}>
        {note.isActive ? "Aktif" : "Nonaktif"}
      </Badge>
    </div>
  );
}

function NotesList() {
  const { notes, loading, fetchNotes, deleteNote, toggleNoteActive, reorderNotes } =
    useNotesStore();
  const toast = useToast();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = await deleteNote(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    if (result.ok) {
      toast.success(`Catatan "${pendingDelete.title}" dihapus.`);
    } else {
      toast.error(result.message);
    }
  };

  const handleToggle = async (note) => {
    setBusyId(note.id);
    const result = await toggleNoteActive(note.id);
    setBusyId(null);
    if (result.ok) {
      toast.success(
        result.note.isActive
          ? `Catatan "${result.note.title}" diaktifkan.`
          : `Catatan "${result.note.title}" dinonaktifkan.`
      );
    } else {
      toast.error(result.message);
    }
  };

  const handleMove = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= notes.length) return;
    const ids = notes.map((note) => note.id);
    const nextIds = [...ids];
    [nextIds[index], nextIds[target]] = [nextIds[target], nextIds[index]];
    const movingId = ids[index];
    setBusyId(movingId);
    const result = await reorderNotes(nextIds);
    setBusyId(null);
    if (result.ok) {
      toast.success("Urutan catatan diperbarui.");
    } else {
      toast.error(result.message);
    }
  };

  const statusCell = (note) => (
    <StatusToggle
      note={note}
      disabled={busyId === note.id}
      onToggle={() => handleToggle(note)}
    />
  );

  const renderActions = (note, index, size = "sm") => (
    <div
      className={`flex items-center gap-1 ${
        size === "lg" ? "border-t border-slate-100 pt-3" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => handleMove(index, -1)}
        disabled={index === 0 || busyId === note.id}
        aria-label={`Naikkan urutan ${note.title}`}
        title="Naikkan urutan"
        className={orderButtonClass(index === 0)}
      >
        <FiChevronUp className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => handleMove(index, 1)}
        disabled={index === notes.length - 1 || busyId === note.id}
        aria-label={`Turunkan urutan ${note.title}`}
        title="Turunkan urutan"
        className={orderButtonClass(index === notes.length - 1)}
      >
        <FiChevronDown className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => openEdit(note)}
        disabled={busyId === note.id}
        aria-label={`Edit ${note.title}`}
        title="Edit"
        className={`${iconButtonClass("brand")} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <FiEdit2 className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => setPendingDelete(note)}
        disabled={busyId === note.id}
        aria-label={`Hapus ${note.title}`}
        title="Hapus"
        className={`${iconButtonClass("danger")} ${
          size === "lg" ? "ml-auto" : ""
        } disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <FiTrash2 className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Catatan penting yang tampil di halaman custom-tour web.
          </p>
        </div>
        <Button onClick={openCreate}>
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          Tambah Catatan
        </Button>
      </div>

      {loading ? (
        <div aria-hidden="true" className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card space-y-3 p-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={<FiFileText className="h-5 w-5" aria-hidden="true" />}
          title="Belum ada catatan"
          description="Tambahkan catatan penting agar tampil di halaman custom-tour web."
          action={
            <Button onClick={openCreate}>
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Tambah Catatan
            </Button>
          }
        />
      ) : (
        <>
          {/* Tabel desktop */}
          <div className="hidden overflow-hidden md:block">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="w-16 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Urutan
                  </th>
                  <th className="w-[22%] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Judul
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pesan
                  </th>
                  <th className="w-[16%] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="w-[200px] px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {notes.map((note, index) => (
                  <tr key={note.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600">
                      <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-semibold tabular-nums text-slate-700">
                        {note.sortOrder}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="truncate font-semibold text-slate-900"
                        title={note.title}
                      >
                        {note.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="line-clamp-2 text-slate-600" title={note.message}>
                        {note.message}
                      </p>
                    </td>
                    <td className="px-4 py-3">{statusCell(note)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {renderActions(note, index)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu mobile */}
          <ul className="space-y-3 md:hidden">
            {notes.map((note, index) => (
              <li key={note.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 min-w-[1.75rem] shrink-0 items-center justify-center rounded-lg bg-slate-100 px-1.5 text-[11px] font-semibold tabular-nums text-slate-700">
                        {note.sortOrder}
                      </span>
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {note.title}
                      </p>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs text-slate-500">
                      {note.message}
                    </p>
                  </div>
                </div>
                <div className="mt-3">{statusCell(note)}</div>
                <div className="mt-3">{renderActions(note, index, "lg")}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      {editorOpen ? (
        <NoteEditor
          note={editing}
          onClose={closeEditor}
          onSaved={() => {
            /* daftar sudah diperbarui oleh store */
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus catatan ini?"
        description={`"${pendingDelete?.title}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        confirmLabel="Hapus"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default NotesList;
