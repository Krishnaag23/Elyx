"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  LineChart,
  Waypoints,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// EXPORT this array so other components can use it
export const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/journey", icon: Waypoints, label: "Journey Map" },
  { href: "/chat", icon: MessageSquareText, label: "Chat Explorer" },
  { href: "/analytics", icon: LineChart, label: "Analytics" },
  { href: "/ai-chat", icon: Sparkles, label: "AI Co-pilot" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    // This sidebar is now explicitly hidden on small screens
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <div className="h-6 w-6 rounded-lg bg-primary" />
          <span className="text-lg">Elyx Cockpit</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                  (pathname === item.href ||
                    (item.href === "/dashboard" && pathname === "/")) &&
                    "bg-muted text-primary font-semibold"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
