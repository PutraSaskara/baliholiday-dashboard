// components/ui/Card.jsx
// Container kartu: sudut 12px, border slate-200, bayangan halus.

export default function Card({
  as: Tag = "div",
  padding = true,
  hover = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={`card ${padding ? "p-4 sm:p-5" : ""} ${
        hover ? "transition-shadow hover:shadow-card-hover" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, description, actions, className = "" }) {
  return (
    <div
      className={`mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
