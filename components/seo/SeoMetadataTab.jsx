// components/seo/SeoMetadataTab.jsx
// Tab Metadata: filter status, pencarian pageKey, tabel desktop + kartu
// mobile, pagination, aksi edit/publish/hapus, dan editor modal.
// Data list diambil lewat useSeoStore (pola store proyek).

"use client";

import { useEffect, useState } from "react";
import { api } from "@/apiConfig";
import { FiEdit2, FiGlobe, FiPlus, FiSearch, FiTrash2, FiUpload } from "react-icons/fi";
import useSeoStore from "@/stores/useSeoStore";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import { iconButtonClass } from "@/components/ui/IconButton";
import { useToast } from "@/components/ui/Toast";
import SeoEditor from "./SeoEditor";
import { extractApiError, formatDateTime } from "./seoUtils";

const LIMIT = 10;

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

function StatusBadge({ status }) {
  return status === "published" ? (
    <Badge variant="success">Published</Badge>
  ) : (
    <Badge variant="warning">Draft</Badge>
  );
}

export default function SeoMetadataTab() {
  const toast = useToast();
  const {
    seoItems,
    seoTotal,
    seoTotalPages,
    seoLoading,
    fetchSeoList,
  } = useSeoStore();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pendingPublish, setPendingPublish] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchSeoList({ page, limit: LIMIT, status, q: query });
  }, [page, status, query, fetchSeoList]);

  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchInput.trim());
    setPage(1);
  };

  const changePage = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reload = () => fetchSeoList({ page, limit: LIMIT, status, q: query });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/seo/${pendingDelete.id}`);
      toast.success(`Metadata "${pendingDelete.pageKey}" dihapus.`);
      setPendingDelete(null);
      if (seoItems.length === 1 && page > 1) setPage(page - 1);
      else await reload();
    } catch (err) {
      console.error("Error deleting SEO metadata:", err);
      toast.error(extractApiError(err, "Gagal menghapus metadata."));
    } finally {
      setDeleting(false);
    }
  };

  const confirmPublish = async () => {
    if (!pendingPublish) return;
    setPublishing(true);
    try {
      await api.post("/api/seo/publish", { id: pendingPublish.id });
      toast.success(`Metadata "${pendingPublish.pageKey}" dipublikasikan.`);
      setPendingPublish(null);
      await reload();
    } catch (err) {
      console.error("Error publishing SEO metadata:", err);
      toast.error(extractApiError(err, "Gagal mempublikasikan metadata."));
    } finally {
      setPublishing(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setEditorOpen(true);
  };

  const renderActions = (item, align = "end") => (
    <div
      className={`flex items-center gap-1 ${
        align === "between" ? "border-t border-slate-100 pt-3" : "justify-end"
      }`}
    >
      <button
        type="button"
        onClick={() => openEdit(item)}
        aria-label={`Edit metadata ${item.pageKey}`}
        title="Edit"
        className={iconButtonClass("brand")}
      >
        <FiEdit2 className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => setPendingPublish(item)}
        aria-label={`Publish metadata ${item.pageKey}`}
        title="Publish"
        className={iconButtonClass()}
      >
        <FiUpload className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => setPendingDelete(item)}
        aria-label={`Hapus metadata ${item.pageKey}`}
        title="Hapus"
        className={`${iconButtonClass("danger")} ${
          align === "between" ? "ml-auto" : ""
        }`}
      >
        <FiTrash2 className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Metadata halaman</h2>
          <p className="mt-1 text-sm text-slate-500">
            {seoTotal} record metadata untuk seluruh halaman dan entitas.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={handleSearch} className="w-full sm:w-80">
            <Input
              type="search"
              name="search-seo"
              aria-label="Cari pageKey"
              placeholder="Cari pageKey..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              leading={<FiSearch className="h-4 w-4" aria-hidden="true" />}
            />
            <button type="submit" className="hidden">
              Cari
            </button>
          </form>
          <Button onClick={openCreate}>
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            Tambah metadata
          </Button>
        </div>
      </div>

      {/* Filter status */}
      <div className="mb-6 -mx-1 overflow-x-auto px-1 pb-1 nice-scrollbar">
        <div className="flex w-max gap-1 rounded-xl bg-slate-100 p-1">
          {STATUS_FILTERS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => changeStatus(opt.value)}
              aria-pressed={status === opt.value}
              className={`h-10 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition-colors ${
                status === opt.value
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {seoLoading ? (
        <div aria-hidden="true" className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card space-y-3 p-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
      ) : seoItems.length === 0 ? (
        <EmptyState
          icon={<FiGlobe className="h-5 w-5" aria-hidden="true" />}
          title="Belum ada metadata"
          description={
            query || status
              ? "Tidak ada record yang cocok dengan filter saat ini."
              : "Tambahkan metadata SEO pertama untuk halaman situs Anda."
          }
          action={
            <Button onClick={openCreate}>
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Tambah metadata
            </Button>
          }
        />
      ) : (
        <>
          {/* Tabel desktop */}
          <div className="hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    pageKey / entity
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Title
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {seoItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span
                        className="block max-w-[200px] truncate font-mono text-xs font-semibold text-slate-800"
                        title={item.pageKey}
                      >
                        {item.pageKey}
                      </span>
                      <span className="mt-0.5 block max-w-[200px] truncate text-xs text-slate-400">
                        {item.entityType}
                        {item.entityId ? ` · ${item.entityId}` : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="block max-w-[280px] truncate text-slate-700"
                        title={item.title || ""}
                      >
                        {item.title || <span className="text-slate-400">—</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {formatDateTime(item.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {renderActions(item)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu mobile */}
          <ul className="space-y-3 md:hidden">
            {seoItems.map((item) => (
              <li key={item.id} className="card p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className="truncate font-mono text-xs font-semibold text-slate-800"
                      title={item.pageKey}
                    >
                      {item.pageKey}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {item.entityType}
                      {item.entityId ? ` · ${item.entityId}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p
                  className="mt-2 truncate text-sm font-medium text-slate-700"
                  title={item.title || ""}
                >
                  {item.title || <span className="text-slate-400">Tanpa title</span>}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {formatDateTime(item.updatedAt)}
                </p>
                <div className="mt-3">{renderActions(item, "between")}</div>
              </li>
            ))}
          </ul>

          <Pagination
            page={page}
            totalPages={seoTotalPages}
            onChange={changePage}
            className="mt-8"
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus metadata SEO ini?"
        description={`"${pendingDelete?.pageKey}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        confirmLabel="Hapus"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={Boolean(pendingPublish)}
        tone="primary"
        title="Publikasikan metadata ini?"
        description={`"${pendingPublish?.pageKey}" akan langsung dipakai halaman publik setelah publish.`}
        confirmLabel="Publish"
        loading={publishing}
        onConfirm={confirmPublish}
        onClose={() => setPendingPublish(null)}
      />

      {/* Dipasang hanya saat terbuka supaya state form di-reset per record. */}
      {editorOpen ? (
        <SeoEditor
          open={editorOpen}
          record={editing}
          onClose={() => setEditorOpen(false)}
          onSaved={reload}
        />
      ) : null}
    </div>
  );
}
