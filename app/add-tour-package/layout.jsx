import TourNavbar from '../../components/TourNavbar'

export const metadata = {
  title: "Tour Packages",
  description:
    "Kelola paket tur BaliHoliday: buat, sunting, dan terbitkan detail, deskripsi, rencana perjalanan, serta gambar tur.",
};

export default function RootLayout({
  children
}) {
  // Tanpa overflow-y-auto di sini agar action bar sticky di dalam form
  // menempel ke viewport (bukan ke kontainer yang tidak ikut men-scroll).
  return (
        <div className='w-full bg-slate-50'>
            <TourNavbar/>
          {children}
        </div>
  );
}
