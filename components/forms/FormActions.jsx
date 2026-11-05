// components/forms/FormActions.jsx
// Susunan tombol aksi form: kiri (Back/Simpan) dan kanan (Lanjut).
// Mobile: menumpuk vertikal, tombol memenuhi lebar layar dan tombol utama
// berada paling bawah agar mudah dijangkau jempol. Desktop: baris.

export default function FormActions({ left, right, className = "" }) {
  return (
    <div
      className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">{left}</div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">{right}</div>
    </div>
  );
}
