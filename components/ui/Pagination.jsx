// components/ui/Pagination.jsx
// Navigasi halaman: tombol Sebelumnya/Berikutnya + angka halaman.
// Mobile-first: nomor halaman ringkas di layar kecil, lengkap di sm+.

function pageList(page, totalPages, siblings = 1) {
  const pages = new Set([1, totalPages]);
  for (
    let i = Math.max(2, page - siblings);
    i <= Math.min(totalPages - 1, page + siblings);
    i += 1
  ) {
    pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("gap");
    out.push(p);
    prev = p;
  }
  return out;
}

export default function Pagination({
  page = 1,
  totalPages = 1,
  onChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const go = (p) => {
    if (p < 1 || p > totalPages || p === page || !onChange) return;
    onChange(p);
  };

  const base =
    "inline-flex h-11 min-w-[44px] items-center justify-center rounded-xl px-3 text-sm font-medium transition-colors";
  const idle = "text-slate-600 hover:bg-slate-100";
  const active =
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700";

  return (
    <nav
      aria-label="Navigasi halaman"
      className={`flex items-center justify-center gap-1.5 sm:justify-between ${className}`}
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className={`${base} ${idle} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Sebelumnya
      </button>

      <div className="flex items-center gap-1.5">
        {pageList(page, totalPages).map((p, i) =>
          p === "gap" ? (
            <span
              key={`gap-${i}`}
              aria-hidden="true"
              className="px-1 text-sm text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Halaman ${p}`}
              className={`${base} ${p === page ? active : idle}`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className={`${base} ${idle} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Berikutnya
      </button>
    </nav>
  );
}
