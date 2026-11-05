// components/ListArticle.jsx
// Daftar artikel: tabel di desktop (hidden md:table), kartu di mobile,
// search berikon, pagination primitive, empty state, skeleton, ConfirmDialog.

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2, FiExternalLink, FiFileText, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Pagination from "./ui/Pagination";
import EmptyState from "./ui/EmptyState";
import ConfirmDialog from "./ui/ConfirmDialog";
import Skeleton from "./ui/Skeleton";
import Badge from "./ui/Badge";
import { iconButtonClass } from "./ui/IconButton";
import { useToast } from "./ui/Toast";
import useArticleStore from "../stores/useArticleStore";

const ITEMS_PER_PAGE = 6;

function ListArticle() {
  const { articles, loading, fetchArticles, deleteArticle } = useArticleStore();
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const ok = await deleteArticle(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    if (ok) {
      toast.success(`Artikel "${pendingDelete.title}" dihapus.`);
    } else {
      toast.error("Gagal menghapus artikel. Coba lagi.");
    }
  };

  const filtered = articles.filter((article) =>
    (article.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const currentItems = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const convertSpaceToDash = (title) => title.replace(/\s+/g, "-");

  const publicUrl = (article) =>
    `https://baliholiday.xyz/blog/${
      article.slug ||
      convertSpaceToDash(article.title)
        .toLowerCase()
        .replace(/[^\w-]+/g, "")
    }`;

  const isLoading = loading && articles.length === 0;

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Articles</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and publish your blog content.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="search"
            name="search-articles"
            aria-label="Search articles by title"
            placeholder="Search articles by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            leading={<FiSearch className="h-4 w-4" aria-hidden="true" />}
            className="sm:w-80"
          />
          <Button onClick={() => router.push("/add-article")}>
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            Add Article
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div
          aria-hidden="true"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card space-y-3 p-4">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FiFileText className="h-5 w-5" aria-hidden="true" />}
          title="No articles found"
          description={
            searchQuery
              ? "No articles match that title. Try another keyword."
              : "Publish your first article to get started."
          }
          action={
            <Button onClick={() => router.push("/add-article")}>
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Add Article
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
                    Article
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Author
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {currentItems.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            fill
                            sizes="44px"
                            src={article.blogimage?.imageUrl1 || "/placeholder.jpg"}
                            alt=""
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/edit-article/${article.id}`}
                            className="line-clamp-1 font-semibold text-slate-900 hover:text-brand-700"
                          >
                            {article.title}
                          </Link>
                          <span className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                            {article.blog_paragraf?.paragraf1}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral">{article.author}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/edit-article/${article.id}`}
                          aria-label={`Edit ${article.title}`}
                          title="Edit"
                          className={iconButtonClass("brand")}
                        >
                          <FiEdit2 className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        <Link
                          href={publicUrl(article)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${article.title} on public site`}
                          title="View public page"
                          className={iconButtonClass()}
                        >
                          <FiExternalLink className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(article)}
                          aria-label={`Delete ${article.title}`}
                          title="Delete"
                          className={iconButtonClass("danger")}
                        >
                          <FiTrash2 className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu mobile */}
          <ul className="space-y-3 md:hidden">
            {currentItems.map((article) => (
              <li key={article.id} className="card p-4">
                <div className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      fill
                      sizes="56px"
                      src={article.blogimage?.imageUrl1 || "/placeholder.jpg"}
                      alt=""
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/edit-article/${article.id}`}
                      className="line-clamp-2 font-semibold text-slate-900 hover:text-brand-700"
                    >
                      {article.title}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {article.author}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-3">
                  <Link
                    href={`/edit-article/${article.id}`}
                    aria-label={`Edit ${article.title}`}
                    title="Edit"
                    className={iconButtonClass("brand")}
                  >
                    <FiEdit2 className="h-5 w-5" aria-hidden="true" />
                  </Link>
                  <Link
                    href={publicUrl(article)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${article.title} on public site`}
                    title="View public page"
                    className={iconButtonClass()}
                  >
                    <FiExternalLink className="h-5 w-5" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(article)}
                    aria-label={`Delete ${article.title}`}
                    title="Delete"
                    className={`${iconButtonClass("danger")} ml-auto`}
                  >
                    <FiTrash2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <Pagination
            page={safePage}
            totalPages={totalPages}
            onChange={setCurrentPage}
            className="mt-8"
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus artikel ini?"
        description={`"${pendingDelete?.title}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        confirmLabel="Hapus"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default ListArticle;
