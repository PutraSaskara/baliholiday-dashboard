'use client';

// Store catatan situs untuk halaman /notes: daftar catatan penting yang
// tampil di halaman custom-tour web. Fetching dipusatkan di sini agar
// komponen memanggil action dari useEffect tanpa setState sinkron di effect
// (pola yang sama dengan useSeoStore — lihat stores/README.md).

import { create } from 'zustand';
import { api } from '@/apiConfig';

// Pesan error backend punya dua bentuk: { errors: [...] } atau { error: '...' }.
function extractError(error, fallback) {
  const data = error?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.join(', ');
  }
  if (typeof data?.error === 'string' && data.error) return data.error;
  if (typeof data?.message === 'string' && data.message) return data.message;
  return fallback;
}

// Selalu tampil sesuai urutan server: sortOrder lalu id.
function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    const orderDiff = Number(a.sortOrder) - Number(b.sortOrder);
    return orderDiff !== 0 ? orderDiff : Number(a.id) - Number(b.id);
  });
}

// sortOrder opsional: saat kosong, catatan baru diletakkan di akhir daftar.
function nextSortOrder(notes) {
  return notes.reduce(
    (max, note) => Math.max(max, Number(note?.sortOrder) || 0),
    -1
  ) + 1;
}

const useNotesStore = create((set, get) => ({
  notes: [],
  loading: true,

  fetchNotes: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/notes/all');
      set({ notes: sortNotes(res.data.notes || []), loading: false });
      return { ok: true };
    } catch (error) {
      console.error('Error fetching notes:', error);
      set({ notes: [], loading: false });
      return { ok: false, message: extractError(error, 'Gagal memuat catatan.') };
    }
  },

  createNote: async (payload) => {
    try {
      const body = { ...payload };
      if (
        body.sortOrder === undefined ||
        body.sortOrder === null ||
        body.sortOrder === ''
      ) {
        body.sortOrder = nextSortOrder(get().notes);
      }
      const res = await api.post('/api/notes', body);
      const note = res.data.note;
      set({ notes: sortNotes([...get().notes, note]) });
      return { ok: true, note };
    } catch (error) {
      console.error('Error creating note:', error);
      return { ok: false, message: extractError(error, 'Gagal menyimpan catatan.') };
    }
  },

  updateNote: async (id, payload) => {
    try {
      const res = await api.put(`/api/notes/${id}`, payload);
      const note = res.data.note;
      set({
        notes: sortNotes(get().notes.map((item) => (item.id === note.id ? note : item))),
      });
      return { ok: true, note };
    } catch (error) {
      console.error('Error updating note:', error);
      return { ok: false, message: extractError(error, 'Gagal memperbarui catatan.') };
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/api/notes/${id}`);
      set({ notes: get().notes.filter((note) => note.id !== id) });
      return { ok: true };
    } catch (error) {
      console.error('Error deleting note:', error);
      return { ok: false, message: extractError(error, 'Gagal menghapus catatan.') };
    }
  },

  // Toggle aktif langsung lewat PUT (bukan optimis) supaya badge selalu
  // mencerminkan data server.
  toggleNoteActive: async (id) => {
    const note = get().notes.find((item) => item.id === id);
    if (!note) return { ok: false, message: 'Catatan tidak ditemukan.' };
    return get().updateNote(id, { isActive: !note.isActive });
  },

  // PATCH /reorder dengan urutan id terbaru; server mengembalikan daftar utuh.
  reorderNotes: async (ids) => {
    try {
      const res = await api.patch('/api/notes/reorder', { ids });
      set({ notes: sortNotes(res.data.notes || []) });
      return { ok: true };
    } catch (error) {
      console.error('Error reordering notes:', error);
      return { ok: false, message: extractError(error, 'Gagal mengubah urutan catatan.') };
    }
  },
}));

export default useNotesStore;
