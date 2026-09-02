"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/radar",
    label: "Radar",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 12a4 4 0 1 0 4 4" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    href: "/opportunities",
    label: "Opportunités",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="M4.93 19.07l2.83-2.83" />
        <path d="M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    href: "/studio",
    label: "Studio créatif",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: "/runs",
    label: "Runs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[248px] h-screen fixed left-0 top-0 bg-surface p-4 rounded-r-xl z-40">
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-signal-hot flex items-center justify-center text-foreground-inverse font-display font-bold text-sm">
          VC
        </div>
        <span className="font-display font-semibold text-title-md text-foreground">
          Viral Copilot
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname.startsWith(item.href) &&
            (item.href === "/" ? pathname === "/" : true);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150",
                isActive
                  ? "bg-surface-violet text-foreground"
                  : "bg-surface text-muted hover:bg-surface-elevated hover:text-foreground"
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border">
        <div className="px-3 py-2 text-label-sm text-subtle">
          v0.1.0 — Neon Command
        </div>
      </div>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="fixed top-0 left-0 right-0 md:left-[248px] h-16 bg-background flex items-center justify-between px-4 md:px-8 z-30">
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-pill bg-surface-elevated">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-label-sm text-muted">Système OK</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-signal-hot flex items-center justify-center text-label-sm text-foreground-inverse font-medium">
          V
        </div>
      </div>
    </header>
  );
}