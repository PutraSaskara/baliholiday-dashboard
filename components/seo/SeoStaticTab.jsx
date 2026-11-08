// components/seo/SeoStaticTab.jsx
// Tab "Statis": ringkasan SEO statis/otomatis web (robots.txt, sitemap,
// redirect 301, path noindex, JSON-LD bawaan). Read-only — tanpa aksi edit.
// Data lewat proxy dashboard /api/seo-static (cookie JWT wajib).

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCopy, FiExternalLink, FiRefreshCw } from "react-icons/fi";
import useSeoStore from "@/stores/useSeoStore";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

const SAMPLE_LIMIT = 5;

function Section({ title, description, actions, children }) {
  return (
    <Card>
      <CardHeader title={title} description={description} actions={actions} />
      {children}
    </Card>
  );
}

function SummaryItem({ label, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-1.5 min-w-0">{children}</div>
    </div>
  );
}

export default function SeoStaticTab() {
  const toast = useToast();
  const router = useRouter();
  // Fetching dipusatkan di store (pola proyek) agar tidak ada setState sinkron
  // di dalam useEffect.
  const {
    seoStatic: data,
    seoStaticLoading: loading,
    seoStaticError: error,
    fetchSeoStatic,
  } = useSeoStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    fetchSeoStatic().then((result) => {
      // Sesi habis — samakan dengan perilaku tab lain.
      if (active && result === "unauthorized") router.push("/login");
    });
    return () => {
      active = false;
    };
  }, [fetchSeoStatic, router]);

  const retry = () => {
    fetchSeoStatic();
  };

  const handleCopyRobots = async () => {
    const content = (data && data.robots && data.robots.content) || "";
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Isi robots.txt disalin ke clipboard.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin. Salin manual dari panel.");
    }
  };

  if (loading) {
    return (
      <div aria-hidden="true" className="w-full space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full">
        <EmptyState
          icon={<FiRefreshCw className="h-5 w-5" aria-hidden="true" />}
          title="Gagal memuat data SEO statis"
          description={
            error
              ? `Proxy /api/seo-static mengembalikan masalah: ${error}.`
              : "Data tidak tersedia. Coba muat ulang."
          }
          action={
            <Button variant="secondary" onClick={retry}>
              <FiRefreshCw className="h-4 w-4" aria-hidden="true" />
              Coba lagi
            </Button>
          }
        />
      </div>
    );
  }

  const robots = data.robots || {};
  const sitemap = data.sitemap || {};
  const redirects = data.redirects || {};
  const verification = data.verification || {};
  const titleTemplate = data.titleTemplate || {};
  const noindexPaths = Array.isArray(data.noindexPaths) ? data.noindexPaths : [];
  const jsonLd = Array.isArray(data.builtInJsonLd) ? data.builtInJsonLd : [];
  const sitemapSample = (Array.isArray(sitemap.sample) ? sitemap.sample : []).slice(
    0,
    SAMPLE_LIMIT
  );
  const redirectSample = (Array.isArray(redirects.sample) ? redirects.sample : []).slice(
    0,
    SAMPLE_LIMIT
  );

  return (
    <div className="w-full space-y-6">
      {/* Banner read-only */}
      <div className="flex flex-wrap items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
        <Badge variant="neutral">Read-only</Badge>
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-slate-600">
          Data ini dihasilkan oleh kode dan data web, tidak dapat diubah dari
          dashboard.
          {data.generatedAt ? (
            <span className="mt-1 block text-xs text-slate-400">
              Terakhir dibaca: {new Date(data.generatedAt).toLocaleString("en-GB")}
            </span>
          ) : null}
        </p>
        <Button variant="ghost" size="sm" onClick={retry} aria-label="Muat ulang data SEO statis">
          <FiRefreshCw className="h-4 w-4" aria-hidden="true" />
          Muat ulang
        </Button>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryItem label="metadataBase">
          <p className="break-all font-mono text-sm text-slate-800">
            {data.metadataBase || "—"}
          </p>
        </SummaryItem>

        <SummaryItem label="Verifikasi search console">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-600">Google:</span>
            {verification.google ? (
              <Badge variant="success">Aktif</Badge>
            ) : (
              <Badge variant="warning">Belum</Badge>
            )}
            <span className="ml-2 text-sm text-slate-600">Bing:</span>
            {verification.bing ? (
              <Badge variant="success">Aktif</Badge>
            ) : (
              <Badge variant="warning">Belum</Badge>
            )}
          </div>
        </SummaryItem>

        <SummaryItem label="Title template">
          <div className="flex flex-wrap items-center gap-2">
            {titleTemplate.stored ? (
              <Badge variant="success">Tersimpan</Badge>
            ) : (
              <Badge variant="neutral">Belum tersimpan</Badge>
            )}
            {titleTemplate.applied ? (
              <Badge variant="success">Diterapkan</Badge>
            ) : (
              <Badge variant="warning">Belum diterapkan</Badge>
            )}
          </div>
          {titleTemplate.note ? (
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              {titleTemplate.note}
            </p>
          ) : null}
        </SummaryItem>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* robots.txt */}
        <Section
          title="robots.txt"
          description={robots.source ? `Sumber: ${robots.source}` : "Kontrol crawler mesin pencari."}
          actions={
            <Button variant="secondary" size="sm" onClick={handleCopyRobots}>
              <FiCopy className="h-4 w-4" aria-hidden="true" />
              {copied ? "Tersalin" : "Salin"}
            </Button>
          }
        >
          <pre className="nice-scrollbar max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs leading-relaxed text-slate-800">
            {robots.content || "(kosong)"}
          </pre>
        </Section>

        {/* Sitemap */}
        <Section
          title="Sitemap"
          description={`${sitemap.count != null ? sitemap.count : 0} URL terindeks.`}
          actions={
            sitemap.url ? (
              <a
                href={sitemap.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base h-11 bg-white px-3.5 text-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
              >
                <FiExternalLink className="h-4 w-4" aria-hidden="true" />
                Buka sitemap
              </a>
            ) : null
          }
        >
          <ul className="space-y-2">
            {sitemapSample.length === 0 ? (
              <li className="text-sm text-slate-500">Belum ada contoh URL.</li>
            ) : (
              sitemapSample.map((url) => (
                <li key={url} className="min-w-0">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block break-all rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-xs text-brand-700 transition-colors hover:bg-slate-50"
                  >
                    {url}
                  </a>
                </li>
              ))
            )}
          </ul>
          {sitemapSample.length > 0 && sitemap.count > sitemapSample.length ? (
            <p className="mt-3 text-xs text-slate-400">
              +{sitemap.count - sitemapSample.length} URL lainnya tidak ditampilkan.
            </p>
          ) : null}
        </Section>
      </div>

      {/* Redirect 301 */}
      <Section
        title="Redirect 301"
        description={`${redirects.count != null ? redirects.count : 0} aturan permanen.`}
      >
        {redirectSample.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada aturan redirect.</p>
        ) : (
          <>
            {/* Tabel desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-y border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      From
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      To
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {redirectSample.map((rule) => (
                    <tr key={`${rule.from}→${rule.to}`} className="hover:bg-slate-50">
                      <td className="px-4 py-3 align-top">
                        <span className="block break-all font-mono text-xs text-slate-600">
                          {rule.from}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className="block break-all font-mono text-xs text-slate-700">
                          {rule.to}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Kartu mobile */}
            <ul className="space-y-2 md:hidden">
              {redirectSample.map((rule) => (
                <li
                  key={`${rule.from}→${rule.to}`}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <p className="break-all font-mono text-xs text-slate-500">
                    {rule.from}
                  </p>
                  <p className="mt-1 break-all font-mono text-xs font-semibold text-slate-800">
                    {rule.to}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
        {redirects.count > redirectSample.length ? (
          <p className="mt-3 text-xs text-slate-400">
            +{redirects.count - redirectSample.length} aturan lainnya tidak ditampilkan.
          </p>
        ) : null}
      </Section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Noindex paksa */}
        <Section
          title="Path noindex paksa"
          description={`${noindexPaths.length} path dijalankan dengan meta robots noindex.`}
        >
          {noindexPaths.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada path noindex.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {noindexPaths.map((path) => (
                <Badge key={path} variant="warning" className="font-mono">
                  {path}
                </Badge>
              ))}
            </div>
          )}
        </Section>

        {/* JSON-LD bawaan */}
        <Section
          title="JSON-LD bawaan"
          description={`${jsonLd.length} rute memakai structured data otomatis.`}
        >
          {jsonLd.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada JSON-LD bawaan.</p>
          ) : (
            <>
              {/* Tabel desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-y border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Route
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Types
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Catatan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {jsonLd.map((entry) => (
                      <tr key={entry.route} className="hover:bg-slate-50">
                        <td className="px-4 py-3 align-top">
                          <span className="block break-all font-mono text-xs text-slate-700">
                            {entry.route}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {(Array.isArray(entry.types) ? entry.types : []).map(
                              (type) => (
                                <Badge key={type} variant="brand">
                                  {type}
                                </Badge>
                              )
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top text-xs text-slate-500">
                          {entry.note || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Kartu mobile */}
              <ul className="space-y-2 md:hidden">
                {jsonLd.map((entry) => (
                  <li
                    key={entry.route}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <p className="break-all font-mono text-xs font-semibold text-slate-800">
                      {entry.route}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(Array.isArray(entry.types) ? entry.types : []).map((type) => (
                        <Badge key={type} variant="brand">
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      {entry.note || "—"}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Section>
      </div>

      {/* Aset statis opsional */}
      {data.staticAssets ? (
        <Section title="Aset statis" description="Manifest, ikon, dan warna tema web.">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={data.staticAssets.manifest ? "success" : "warning"}>
              manifest: {data.staticAssets.manifest ? "ada" : "tidak ada"}
            </Badge>
            <Badge variant={Array.isArray(data.staticAssets.icons) && data.staticAssets.icons.length > 0 ? "success" : "warning"}>
              icons: {Array.isArray(data.staticAssets.icons) ? data.staticAssets.icons.length : 0}
            </Badge>
            <Badge variant="neutral">
              themeColor: {data.staticAssets.themeColor || "—"}
            </Badge>
          </div>
        </Section>
      ) : null}
    </div>
  );
}
