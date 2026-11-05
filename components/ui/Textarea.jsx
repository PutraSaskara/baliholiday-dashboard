// components/ui/Textarea.jsx
// Textarea beralis: label, hint, error, id otomatis dari name, aria-invalid.

import { useId } from "react";

export default function Textarea({
  label,
  hint,
  error,
  id,
  name,
  required = false,
  rows = 4,
  className = "",
  labelClassName = "",
  ...props
}) {
  const autoId = useId();
  const inputId = id ?? (name ? `textarea-${name}` : autoId);
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className={`mb-1.5 block text-sm font-medium text-slate-700 ${labelClassName}`}
        >
          {label}
          {required ? (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <textarea
        id={inputId}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`input-base min-h-[120px] resize-y ${
          error ? "border-red-400 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-sm text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
