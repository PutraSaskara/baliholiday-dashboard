"use client";

import Script from "next/script";

// Cloudinary media library hanya dimuat di halaman yang membuka widget
// (Add/Edit Image tour & article), bukan di seluruh aplikasi lewat layout.
// lazyOnload: tidak bersaing dengan kritikal path saat halaman dibuka.
function CloudinaryWidgetScript() {
  return (
    <Script
      src="https://media-library.cloudinary.com/global/all.js"
      strategy="lazyOnload"
    />
  );
}

export default CloudinaryWidgetScript;
