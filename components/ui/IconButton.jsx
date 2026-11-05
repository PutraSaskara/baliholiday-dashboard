// components/ui/IconButton.jsx
// Tombol ikon 44x44 (>= 40px sentuh) untuk aksi baris/tabel/kartu.
// Wajib punya `label` -> aria-label + title agar tetap bisa diakses.

const VARIANTS = {
  neutral: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  brand: "text-brand-700 hover:bg-brand-50 hover:text-brand-800",
  danger: "text-red-600 hover:bg-red-50 hover:text-red-700",
};

export function iconButtonClass(variant = "neutral") {
  return `inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
    VARIANTS[variant] ?? VARIANTS.neutral
  }`;
}

export default function IconButton({
  variant = "neutral",
  label,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`${iconButtonClass(variant)} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
