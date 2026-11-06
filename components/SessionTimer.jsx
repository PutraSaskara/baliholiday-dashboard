'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTokenExpiry, clearTokenCache } from '@/apiConfig';
import useAuthStore from '../stores/useAuthStore';
import { FiClock } from 'react-icons/fi';

export default function SessionTimer() {
  const [remaining, setRemaining] = useState(null);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  const calculateRemaining = useCallback(() => {
    const expiry = getTokenExpiry();
    if (!expiry) return null;
    const diff = expiry - Math.floor(Date.now() / 1000);
    return diff > 0 ? diff : 0;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial calculation
    setRemaining(calculateRemaining());

    const interval = setInterval(() => {
      const timeLeft = calculateRemaining();
      setRemaining(timeLeft);

      if (timeLeft !== null && timeLeft <= 0) {
        clearInterval(interval);
        clearTokenCache();
        logout().then(() => {
          router.push('/login');
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, calculateRemaining, logout, router]);

  if (!isAuthenticated || remaining === null) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Warning levels: merah < 1 menit, amber < 5 menit.
  const isWarning = remaining <= 300; // 5 minutes
  const isCritical = remaining <= 60;  // 1 minute

  const getBadgeClass = () => {
    if (isCritical) return 'border-red-200 bg-red-50 text-red-600 animate-pulse';
    if (isWarning) return 'border-amber-200 bg-amber-50 text-amber-700';
    return 'border-slate-200 bg-white text-slate-600';
  };

  const getIconClass = () => {
    if (isCritical) return 'text-red-500';
    if (isWarning) return 'text-amber-500';
    return 'text-slate-400';
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums transition-colors duration-300 ${getBadgeClass()}`}
      title="Sisa waktu sesi"
    >
      <FiClock className={`h-3.5 w-3.5 ${getIconClass()}`} aria-hidden="true" />
      <span className="sr-only">Sisa waktu sesi</span>
      <span>{formattedTime}</span>
    </div>
  );
}
