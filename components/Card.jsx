// components/Card.jsx
// Kartu tur: gambar rasio 4/3, judul, harga, badge status/catin, aksi ikon 44px.

import Image from "next/image";
import Link from "next/link";
import { FiEdit2, FiExternalLink, FiTrash2 } from "react-icons/fi";
import Badge from "./ui/Badge";
import { iconButtonClass } from "./ui/IconButton";

const STATUS_VARIANTS = {
  Paid: "success",
  Active: "success",
  Published: "success",
  Pending: "warning",
  Draft: "warning",
  Failed: "danger",
  Inactive: "neutral",
};

function Card({ title, price, priceNote, status, img, desc, link, link2, onDelete }) {
  const handleDelete = (event) => {
    event.preventDefault();
    onDelete();
  };

  // Tur tidak punya field status; jatuh ke catatan harga (mis. "Per Person").
  const badgeLabel = status ?? priceNote;
  const badge = badgeLabel ? (
    <Badge
      variant={status ? STATUS_VARIANTS[status] ?? "neutral" : "brand"}
    >
      {badgeLabel}
    </Badge>
  ) : null;

  return (
    <div className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Link href={link} className="block h-full w-full">
          <Image
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            src={img || "/placeholder.jpg"}
            alt={title || "Tour image"}
          />
        </Link>
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 shadow-sm">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link
          href={link}
          className="line-clamp-2 text-base font-semibold text-slate-900 hover:text-brand-700"
        >
          {title}
        </Link>

        {price ? (
          <p className="mt-2 text-lg font-bold text-brand-700">${price}</p>
        ) : null}

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
          {desc}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
          <Link
            href={link}
            aria-label={`Edit ${title}`}
            title="Edit"
            className={iconButtonClass("brand")}
          >
            <FiEdit2 className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Delete ${title}`}
            title="Delete"
            className={iconButtonClass("danger")}
          >
            <FiTrash2 className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link
            href={link2}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View public page"
            title="View public page"
            className={`${iconButtonClass()} ml-auto`}
          >
            <FiExternalLink className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
