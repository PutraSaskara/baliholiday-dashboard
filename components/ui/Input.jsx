// components/ui/Input.jsx
// Field beralis: label, hint, error, id otomatis dari name, aria-invalid,
// slot opsional leading/trailing (ikon, tombol show/hide password).

import { useId } from "react";

export default function Input({
  label,
  hint,
  error,
  id,
  name,
  required = false,
  leading,
  trailing,
  className = "",
  labelClassName = "",
  ...props
}) {
  const autoId = useId();
  const inputId = id ?? (name ? `input-${name}` : autoId);
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const field = (
    <div className="relative">
      {leading ? (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          {leading}
        </span>
      ) : null}
      <input
        id={inputId}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`input-base ${leading ? "pl-10" : ""} ${
          trailing ? "pr-12" : ""
        } ${error ? "border-red-400 focus:border-red-500" : ""} ${className}`}
        {...props}
      />
      {trailing ? (
        <span className="absolute inset-y-0 right-0 flex items-center pr-1.5">
          {trailing}
        </span>
      ) : null}
    </div>
  );

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

      {field}

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
