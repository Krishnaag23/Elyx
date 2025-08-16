import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { ThemeToggle } from "./toggleThemes";

export function Header() {
  return (
    // Sticky header with glassmorphism effect
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <div className="flex-1">
        {/* Placeholder for breadcrumbs or page title */}
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <ThemeToggle />
      {/* Placeholder for future actions like search or user profile */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">User Profile</span>
        </Button>
        <div className="hidden flex-col text-right sm:flex">
          <span className="text-sm font-medium">Rohan Patel</span>
          <span className="text-xs text-muted-foreground">Member</span>
        </div>
      </div>
    </header>
  );
}
