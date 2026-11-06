import ArticleNavbar from "../../components/ArticleNavbar";

export const metadata = {
  title: "Articles",
  description:
    "Kelola artikel BaliHoliday: tulis, sunting, unggah gambar, dan susun paragraf konten blog.",
};

export default function RootLayout({
  children
}) {
  // Tanpa overflow-y-auto di sini agar action bar sticky di dalam form
  // menempel ke viewport (bukan ke kontainer yang tidak ikut men-scroll).
  return (
    <div className="w-full bg-slate-50">
      <ArticleNavbar />
      {children}
    </div>
  );
}
