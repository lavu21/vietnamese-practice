"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Lịch sử", href: "/lich-su" },
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { username, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [drawerOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    router.replace("/login");
  }

  return (
    <>
    <div className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-line bg-surface px-4 sm:px-6 md:gap-6">
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Mở menu điều hướng"
        aria-expanded={drawerOpen}
        className="-ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink hover:bg-gray-100 md:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
      <Link href="/" className="min-w-0 truncate text-sm font-bold text-primary sm:text-[15px]">
        Luyện viết tiếng Việt
      </Link>
      <nav className="hidden shrink-0 items-center gap-5 md:flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap text-[13px] font-medium ${pathname === item.href ? "text-ink" : "text-neutral hover:text-ink"}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {isAuthenticated && username && (
        <div ref={menuRef} className="relative ml-auto shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Tài khoản"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[13px] font-bold uppercase text-white hover:bg-primary-hover"
          >
            {username.charAt(0)}
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-line bg-surface shadow-md"
            >
              <div className="border-b border-line px-3 py-2">
                <div className="text-[11px] text-ink-muted">Đăng nhập với</div>
                <div className="truncate text-[13px] font-semibold text-ink">{username}</div>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="block w-full px-3 py-2 text-left text-[13px] text-ink hover:bg-gray-50"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      )}
    </div>

    {drawerOpen && (
      <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setDrawerOpen(false)} />
    )}
    <aside
      aria-label="Menu điều hướng"
      aria-hidden={!drawerOpen}
      inert={!drawerOpen}
      className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] flex-col border-r border-line bg-surface shadow-xl transition-transform duration-200 md:hidden ${
        drawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-12 items-center justify-between border-b border-line px-4">
        <span className="truncate text-sm font-bold text-primary">Luyện viết tiếng Việt</span>
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          aria-label="Đóng menu điều hướng"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-gray-100 hover:text-ink"
        >
          ✕
        </button>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setDrawerOpen(false)}
            className={`rounded-md px-3 py-2.5 text-sm font-medium ${
              pathname === item.href ? "bg-primary/10 text-primary" : "text-ink hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
    </>
  );
}
