// components/ui/Skeleton.jsx
// Placeholder loading dengan shimmer.

export default function Skeleton({
  className = "",
  rounded = "rounded-lg",
  ...props
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-200 ${rounded} ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`card p-4 sm:p-5 ${className}`} aria-hidden="true">
      <Skeleton className="mb-4 h-5 w-1/3" />
      <SkeletonText lines={3} />
    </div>
  );
}
