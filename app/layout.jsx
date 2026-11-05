// app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "../components/shell/AppShell";
import ToastProvider from "../components/ui/Toast";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "BaliHoliday Admin",
    template: "%s · BaliHoliday Admin",
  },
  description:
    "Panel admin BaliHoliday untuk mengelola tur, artikel, aktivitas, destinasi, area jemput, booking, dan harga kustom.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
        <Script src="https://media-library.cloudinary.com/global/all.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
