"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquareText, 
  LineChart, 
  Waypoints ,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils"; 

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/journey", icon: Waypoints, label: "Journey Timeline" },
  { href: "/chat", icon: MessageSquareText, label: "Chat Explorer" },
  { href: "/analytics", icon: LineChart, label: "Analytics & Reports" },
  { href: "/ai-chat", icon: Star, label: "AI based Chat" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {/* A simple, clean brand logo */}
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
                  pathname === item.href && "bg-muted text-primary" // Active link style
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