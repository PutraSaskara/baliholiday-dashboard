// components/StatCard.jsx
// Kartu ringkasan angka di halaman Overview: ikon brand, angka besar, label.

import Skeleton from "./ui/Skeleton";

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  loading = false,
}) {
  return (
    <div className="card p-4 sm:p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
      </span>

      <div className="mt-4 text-2xl font-bold leading-none text-slate-900">
        {loading ? (
          <Skeleton className="h-7 w-14" rounded="rounded-md" />
        ) : (
          value
        )}
      </div>

      <p className="mt-2 text-sm text-slate-500">{label}</p>
      {!loading && hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}
