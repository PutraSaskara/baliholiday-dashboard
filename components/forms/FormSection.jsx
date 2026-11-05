// components/forms/FormSection.jsx
// Kelompok field dengan judul opsional dan grid responsif:
// 1 kolom di mobile, 2 kolom mulai sm. Anak yang butuh lebar penuh
// cukup diberi kelas "sm:col-span-2".

export default function FormSection({
  title,
  description,
  columns = 2,
  className = "",
  children,
}) {
  return (
    <section className={className}>
      {title ? (
        <div className="mb-3 border-b border-slate-100 pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div
        className={`grid grid-cols-1 gap-4 ${
          columns === 1 ? "" : "sm:grid-cols-2"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
