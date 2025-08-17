"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./toggleThemes";
import { navItems } from "./sidebar"; // We'll export navItems from the sidebar
import { Menu, CircleUser } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ memberName }: { memberName: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      {/* --- Mobile Menu (Sheet) --- */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold mb-4"
              >
                <div className="h-6 w-6 rounded-lg bg-primary" />
                <span>Elyx Cockpit</span>
              </Link>
              {navItems.map((item:any) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                    (pathname === item.href ||
                      (item.href === "/dashboard" && pathname === "/")) &&
                      "bg-muted text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* --- Spacer to push items to the right --- */}
      <div className="flex-1" />

      {/* --- Right-side Actions --- */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">User Profile</span>
          </Button>
          <div className="hidden flex-col text-right sm:flex">
            <span className="text-sm font-medium">{memberName}</span>
            <span className="text-xs text-muted-foreground">Member</span>
          </div>
        </div>
      </div>
    </header>
  );
}
