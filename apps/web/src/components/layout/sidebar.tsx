"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileCode2,
  Settings,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Sources",
    href: "/sources",
    icon: FileCode2,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-surface flex flex-col transition-transform">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <ActivityIcon className="w-5 h-5 text-white" />
          </div>
          API Tracker
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')
                  ? "bg-primary text-white"
                  : "text-text-muted hover:bg-surface-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2 justify-center rounded-lg border border-border p-1 bg-surface-muted">
          {mounted && (
            <>
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  theme === "light" ? "bg-surface shadow-sm" : "text-text-muted hover:text-foreground"
                )}
                title="Light Mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  theme === "system" ? "bg-surface shadow-sm" : "text-text-muted hover:text-foreground"
                )}
                title="System Default"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  theme === "dark" ? "bg-surface shadow-sm" : "text-text-muted hover:text-foreground"
                )}
                title="Dark Mode"
              >
                <Moon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
