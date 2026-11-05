// components/forms/FormShell.jsx
// Kerangka form bersama: header (judul + deskripsi), area konten, dan
// action bar sticky di bawah. Action bar menempel di viewport sehingga
// tombol Back/Simpan selalu terlihat; padding konten + tinggi minimum
// memastikan field terakhir tidak tertutup action bar, termasuk safe-area
// di perangkat berponi.

export default function FormShell({
  title,
  description,
  headerExtra,
  actions,
  maxWidth = "max-w-4xl",
  className = "",
  children,
}) {
  return (
    <div className={`${maxWidth} mx-auto`}>
      <div
        className={`card flex flex-col ${
          title || actions
            ? "min-h-[calc(100dvh-18rem)] sm:min-h-[calc(100dvh-13rem)]"
            : ""
        } ${className}`}
      >
        {title || description || headerExtra ? (
          <div className="border-b border-slate-100 px-4 py-5 sm:px-6">
            {title ? (
              <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
            {headerExtra}
          </div>
        ) : null}

        <div className="flex-1 px-4 py-5 pb-8 sm:px-6">{children}</div>

        {actions ? (
          <div
            className="sticky bottom-0 z-20 rounded-b-xl border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
