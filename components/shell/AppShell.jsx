// components/shell/AppShell.jsx
// Kerangka admin: sidebar desktop (bisa collapse), topbar sticky, drawer mobile.
// Di /login children dirender polos tanpa kerangka.

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiCompass,
  FiFileText,
  FiHome,
  FiLogOut,
  FiMap,
  FiMapPin,
  FiMenu,
  FiStar,
  FiUser,
  FiX,
} from "react-icons/fi";
import useAuthStore from "../../stores/useAuthStore";
import SessionTimer from "../SessionTimer";

const SIDEBAR_WIDTH = "w-[260px]";
const SIDEBAR_WIDTH_COLLAPSED = "w-[76px]";
const COLLAPSED_KEY = "bh.sidebar.collapsed";

// Store kecil untuk status collapse: dibaca langsung dari localStorage sehingga
// tidak perlu setState di dalam useEffect (dan bebas mismatch hidrasi).
const collapsedListeners = new Set();

function subscribeCollapsed(onStoreChange) {
  collapsedListeners.add(onStoreChange);
  return () => {
    collapsedListeners.delete(onStoreChange);
  };
}

function readCollapsedSnapshot() {
  try {
    return window.localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function readCollapsedServerSnapshot() {
  return false;
}

function emitCollapsedChange() {
  collapsedListeners.forEach((listener) => listener());
}

// Daftar menu sesuai struktur P1: Overview / Content / Operations.
const MENU = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/", icon: FiHome }],
  },
  {
    label: "Content",
    items: [
      { label: "Tours", href: "/add-tour-package", icon: FiMap },
      { label: "Articles", href: "/add-article", icon: FiFileText },
      { label: "Activities", href: "/activities", icon: FiStar },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Destinations", href: "/destinations", icon: FiCompass },
      { label: "Pickup Areas", href: "/pickup-areas", icon: FiMapPin },
    ],
  },
];

const SEGMENT_LABELS = {
  activities: "Activities",
  destinations: "Destinations",
  "pickup-areas": "Pickup Areas",
  "add-article": "Articles",
  "add-tour-package": "Tour Packages",
  "add-single-article": "New Article",
  "add-article-images": "Article Images",
  "add-article-paragrafs": "Article Paragraphs",
  "add-tour": "New Tour",
  "add-tour-desc": "Tour Description",
  "add-tour-detail": "Tour Detail",
  "add-tour-image": "Tour Image",
  "add-tour-plan": "Tour Plan",
  "add-other": "Tour Other",
  edit: "Edit",
  login: "Login",
};

function SidebarContent({ collapsed, onToggleCollapse, onNavigate, activeHref }) {
  // Beberapa menu berbagi href; hanya kemunculan pertama yang boleh aktif.
  const seen = new Set();

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Brand */}
      <div
        className={`flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 ${
          collapsed ? "justify-center px-0" : "px-4"
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-bold text-white shadow-sm">
          BH
        </span>
        {!collapsed && (
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-tight text-slate-900">
              BaliHoliday
            </span>
            <span className="block truncate text-[11px] font-medium text-slate-500">
              Admin Panel
            </span>
          </span>
        )}
      </div>

      {/* Navigasi */}
      <nav className="nice-scrollbar flex-1 overflow-y-auto px-3 py-4">
        {MENU.map((group) => {
          return (
            <div key={group.label} className="mb-5 last:mb-0">
              <p
                className={`mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${
                  collapsed ? "hidden" : ""
                }`}
              >
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item, index) => {
                  const hrefSeen = seen.has(item.href);
                  if (!hrefSeen) seen.add(item.href);
                  const isActive = item.href === activeHref && !hrefSeen;
                  const Icon = item.icon;
                  return (
                    <li key={`${group.label}-${item.label}-${index}`}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        title={collapsed ? item.label : undefined}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex h-11 items-center gap-3 rounded-xl text-sm font-medium transition-colors ${
                          collapsed ? "justify-center px-0" : "px-3"
                        } ${
                          isActive
                            ? "bg-brand-600 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 shrink-0 ${
                            isActive ? "text-white" : "text-slate-400"
                          }`}
                          aria-hidden="true"
                        />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Tombol collapse (desktop) */}
      <div className="hidden shrink-0 border-t border-slate-200 p-3 lg:block">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          className={`flex h-11 w-full items-center gap-3 rounded-xl text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
        >
          {collapsed ? (
            <FiChevronsRight className="h-5 w-5" aria-hidden="true" />
          ) : (
            <>
              <FiChevronsLeft className="h-5 w-5" aria-hidden="true" />
              <span>Ciutkan sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AppShell({ children }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { isAuthenticated, logout, checkAuth } = useAuthStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Status collapse dibaca dari localStorage lewat store eksternal.
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    readCollapsedSnapshot,
    readCollapsedServerSnapshot
  );

  // Auth: sama seperti Navbar lama — tunggu checkAuth selesai.
  // Halaman login dilewati supaya tidak memanggil /api/check-auth tanpa cookie
  // (401 yang tercatat sebagai console error).
  useEffect(() => {
    if (pathname === "/login") return;
    if (isAuthenticated === null) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated, pathname]);

  const toggleCollapse = useCallback(() => {
    try {
      const next = window.localStorage.getItem(COLLAPSED_KEY) !== "1";
      window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
    } catch {
      /* storage tidak tersedia: abaikan */
      return;
    }
    emitCollapsedChange();
  }, []);

  // Tutup drawer mobile dan menu user (dipanggil saat navigasi).
  const closeOverlays = useCallback(() => {
    setDrawerOpen(false);
    setUserMenuOpen(false);
  }, []);

  // Tutup menu user saat klik di luar / tekan Escape.
  useEffect(() => {
    if (!userMenuOpen) return undefined;
    const onPointer = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (event) => {
      if (event.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    const success = await logout();
    if (success) router.push("/login");
  };

  // Halaman login: children polos tanpa kerangka. Route lain sudah dijaga
  // proxy (butuh JWT), jadi selalu dibungkus shell.
  if (pathname === "/login") return children;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [
    { label: "Dashboard", href: "/" },
    ...segments.map((segment, i) => ({
      label: SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1),
      href: `/${segments.slice(0, i + 1).join("/")}`,
    })),
  ];

  const sidebar = (
    <SidebarContent
      collapsed={collapsed}
      onToggleCollapse={toggleCollapse}
      onNavigate={closeOverlays}
      activeHref={pathname}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 lg:block ${
          collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH
        }`}
      >
        {sidebar}
      </aside>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            className={`absolute inset-y-0 left-0 shadow-overlay ${SIDEBAR_WIDTH}`}
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
            >
              <FiX className="h-5 w-5" aria-hidden="true" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <div
        className={`transition-[padding] duration-200 ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]"
        }`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
          <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Buka menu"
              className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <FiMenu className="h-5 w-5" aria-hidden="true" />
            </button>

            <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
              <ol className="flex items-center gap-1.5 overflow-hidden text-sm">
                {crumbs.map((crumb, i) => {
                  const isLast = i === crumbs.length - 1;
                  return (
                    <li key={crumb.href} className="flex min-w-0 items-center gap-1.5">
                      {i > 0 && (
                        <FiChevronRight
                          className="h-3.5 w-3.5 shrink-0 text-slate-300"
                          aria-hidden="true"
                        />
                      )}
                      {isLast ? (
                        <span
                          aria-current="page"
                          className="truncate font-semibold text-slate-900"
                        >
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          onClick={closeOverlays}
                          className="truncate font-medium text-slate-500 hover:text-slate-800"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden sm:block">
                <SessionTimer />
              </div>

              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  aria-label="Menu pengguna"
                  className="flex h-11 items-center gap-2 rounded-xl px-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <FiUser className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="hidden md:inline">Akun</span>
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+8px)] w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-overlay"
                  >
                    <div className="px-3 py-2 sm:hidden">
                      <SessionTimer />
                    </div>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      <FiLogOut className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Konten */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
