'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Pasang beforeunload HANYA saat ada perubahan belum disimpan.
// Dialog native hanya untuk reload/close/navigasi eksternal. Klik link internal
// (Next Link / anchor same-origin) ditandai dulu supaya tidak memicu dialog,
// lalu penanda di-reset setelah router berpindah halaman.
const useWarnIfUnsavedChanges = (unsavedChanges) => {
  const pathname = usePathname();
  const internalNavRef = useRef(false);

  // Navigasi selesai (atau halaman baru dimuat): reset penanda.
  useEffect(() => {
    internalNavRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!unsavedChanges) return undefined;

    const handleDocumentClick = (event) => {
      if (event.defaultPrevented) return;
      // Hanya klik mouse utama tanpa modifier (buka tab baru = biarkan).
      if (
        typeof event.button === 'number' &&
        event.button !== 0
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      const anchor =
        target && typeof target.closest === 'function'
          ? target.closest('a[href]')
          : null;
      if (!anchor) return;

      try {
        const url = new URL(anchor.href, window.location.href);
        internalNavRef.current = url.origin === window.location.origin;
      } catch {
        internalNavRef.current = false;
      }
    };

    const handleBeforeUnload = (event) => {
      if (internalNavRef.current) {
        internalNavRef.current = false;
        return; // navigasi internal: jangan blokir
      }
      event.preventDefault();
      event.returnValue = ''; // Required for generic browser prompt
    };

    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);
};

export default useWarnIfUnsavedChanges;
