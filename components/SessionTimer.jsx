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

  // Warning levels
  const isWarning = remaining <= 300; // 5 minutes
  const isCritical = remaining <= 60;  // 1 minute

  const getColorClass = () => {
    if (isCritical) return 'text-red-400';
    if (isWarning) return 'text-amber-400';
    return 'text-slate-300';
  };

  const getBgClass = () => {
    if (isCritical) return 'bg-red-500/10 border-red-500/30 animate-pulse';
    if (isWarning) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-white/5 border-white/10';
  };

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-300 ${getBgClass()}`}
      title="Sisa waktu sesi"
    >
      <FiClock className={`w-3.5 h-3.5 ${getColorClass()}`} />
      <span className={getColorClass()}>
        {formattedTime}
      </span>
    </div>
  );
}
