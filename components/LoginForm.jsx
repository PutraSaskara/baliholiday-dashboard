// components/LoginForm.jsx

'use client';

import { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { FiEye, FiEyeOff, FiLock, FiUser } from 'react-icons/fi';
import Button from './ui/Button';
import Input from './ui/Input';

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();

  // Load saved username on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      // SECURITY: the legacy key stored the password in plain text — remove it.
      localStorage.removeItem('rememberedCredentials');
      const savedUser = localStorage.getItem('rememberedUsername');
      if (savedUser) {
        setUsername(savedUser);
        setRememberMe(true);
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { success, message } = await login(username, password);

      if (success) {
        // Only the username is ever persisted — never the password.
        localStorage.removeItem('rememberedCredentials');
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(message);
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Panel brand — hanya desktop */}
      <aside className="relative hidden w-[44%] max-w-[560px] shrink-0 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-brand-900/40 blur-2xl"
        />

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-base font-bold text-white ring-1 ring-white/30">
            BH
          </span>
          <span className="text-sm font-semibold uppercase tracking-widest text-white/80">
            BaliHoliday
          </span>
        </div>

        <div className="relative">
          <span className="mb-6 block h-1 w-16 rounded-full bg-gold-400" />
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
            Admin Panel
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/75">
            Kelola paket tur, artikel, aktivitas, destinasi, area jemput, dan
            booking BaliHoliday dalam satu tempat.
          </p>
        </div>

        <p className="relative text-sm text-white/80">
          © {new Date().getFullYear()} Bali Holiday. All rights reserved.
        </p>
      </aside>

      {/* Kolom form */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          {/* Brand ringkas untuk mobile */}
          <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-bold text-white shadow-sm">
              BH
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              BaliHoliday
            </span>
          </div>

          <div className="card p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Selamat Datang
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Masuk ke panel admin Anda
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                leading={<FiUser className="h-4 w-4" aria-hidden="true" />}
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                leading={<FiLock className="h-4 w-4" aria-hidden="true" />}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    aria-pressed={showPassword}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <FiEye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                }
              />

              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-slate-600 select-none"
                >
                  Ingat username
                </label>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                loading={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Bali Holiday. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
