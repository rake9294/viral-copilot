import { Radar, BarChart3, Layers, FileText, Settings, Activity } from "lucide-react";
import Link from "next/link";

const nav = [
  { label: "Radar", icon: Radar, href: "/radar" },
  { label: "Niches", icon: Layers, href: "/niches" },
  { label: "Opportunités", icon: BarChart3, href: "/opportunities" },
  { label: "Studio", icon: FileText, href: "/studio" },
  { label: "Runs", icon: Activity, href: "/runs" },
  { label: "Paramètres", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="sidebar-layout flex flex-col gap-1 h-full">
      <div className="flex items-center gap-3 px-3 py-4 mb-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#fc69ff] to-[#4b73ff]" />
        <span className="text-[--color-foreground] font-semibold text-[--text-heading-sm]">
          Viral Copilot
        </span>
      </div>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[--radius-md] text-[--color-muted] hover:text-[--color-foreground] hover:bg-[--color-surface-elevated] transition-colors duration-150 text-[--text-label-md] font-medium"
        >
          <item.icon className="w-4 h-4 shrink-0" />
          {item.label}
        </Link>
      ))}
    </aside>
  );
}