// components/ui/Badge.jsx
// Label status ringkas: neutral/success/warning/danger/brand.

const STYLES = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
};

export default function Badge({
  variant = "neutral",
  className = "",
  children,
  ...props
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        STYLES[variant] ?? STYLES.neutral
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
