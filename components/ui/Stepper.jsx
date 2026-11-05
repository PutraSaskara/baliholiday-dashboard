// components/ui/Stepper.jsx
// Indikator langkah wizard: nomor/centang, label, status aktif/selesai.
// Desktop: deretan horizontal berisi nomor + label. Mobile: "Langkah X dari N"
// plus progress bar agar hemat tempat. Langkah yang sudah dilalui bisa diklik
// lewat `href` (Link) atau `onSelect` (button).

"use client";

import Link from "next/link";
import { FiCheck } from "react-icons/fi";

// Index langkah dari pathname. Kandidat terpanjang yang cocok dipakai agar
// /add-tour-package/add-tour-detail tidak dianggap sebagai langkah add-tour.
export function stepIndexFromPath(pathname, steps = []) {
  if (!pathname) return 0;
  let match = 0;
  steps.forEach((step, index) => {
    if (step.href && pathname.startsWith(step.href)) match = index;
  });
  return match;
}

function StepCircle({ state, index }) {
  const base =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors";
  if (state === "done") {
    return (
      <span className={`${base} bg-brand-600 text-white`}>
        <FiCheck className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span
        className={`${base} bg-white text-brand-700 ring-2 ring-brand-600`}
        aria-hidden="true"
      >
        {index + 1}
      </span>
    );
  }
  return (
    <span
      className={`${base} bg-white text-slate-400 ring-1 ring-slate-200`}
      aria-hidden="true"
    >
      {index + 1}
    </span>
  );
}

export default function Stepper({
  steps = [],
  current = 0,
  maxVisited,
  onSelect,
  className = "",
}) {
  const total = steps.length;
  if (total === 0) return null;

  const safeCurrent = Math.min(Math.max(current, 0), total - 1);
  // Langkah boleh diklik bila sudah dilalui (<= furthest) dan bukan langkah aktif.
  const furthest = Math.min(
    Math.max(maxVisited ?? safeCurrent, safeCurrent),
    total - 1
  );

  const labelClass = (index) => {
    if (index === safeCurrent) return "font-semibold text-slate-900";
    if (index < safeCurrent) return "text-slate-600";
    return "text-slate-400";
  };

  const interactive = (index) =>
    index !== safeCurrent && index <= furthest && Boolean(onSelect);

  const renderItem = (index, step) => {
    const state =
      index < safeCurrent ? "done" : index === safeCurrent ? "active" : "upcoming";
    const circle = <StepCircle state={state} index={index} />;
    const label = (
      <span className={`truncate text-xs ${labelClass(index)}`}>{step.label}</span>
    );

    if (interactive(index)) {
      return (
        <button
          type="button"
          key={step.label + index}
          onClick={() => onSelect(index)}
          className="flex min-w-0 items-center gap-2 rounded-lg text-left hover:text-brand-700"
        >
          {circle}
          {label}
        </button>
      );
    }

    return (
      <span
        key={step.label + index}
        className="flex min-w-0 items-center gap-2"
        aria-current={index === safeCurrent ? "step" : undefined}
      >
        {circle}
        {label}
      </span>
    );
  };

  return (
    <nav aria-label="Progres langkah" className={className}>
      {/* Mobile: ringkas "Langkah X dari N" + progress bar. */}
      <div className="sm:hidden">
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <p className="shrink-0 text-xs font-semibold text-slate-900">
            Langkah {safeCurrent + 1} dari {total}
          </p>
          <p className="truncate text-xs text-slate-500">
            {steps[safeCurrent].label}
          </p>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={safeCurrent + 1}
        >
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${((safeCurrent + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: nomor/centang + label + penghubung. */}
      <ol className="hidden sm:flex sm:items-center sm:gap-0">
        {steps.map((step, index) => (
          <li key={step.label + index} className="flex min-w-0 flex-1 items-center gap-2">
            {renderItem(index, step)}
            {index < total - 1 ? (
              <span
                aria-hidden="true"
                className={`h-px min-w-4 flex-1 ${
                  index < safeCurrent ? "bg-brand-600" : "bg-slate-200"
                }`}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
