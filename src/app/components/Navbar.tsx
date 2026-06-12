"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { player } from "@/app/data";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/competitions/", label: "赛事" },
  { href: "/stats/", label: "数据统计" },
  { href: "/gallery/", label: "图集" },
];

/** 全局顶部导航栏 */
export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href.replace(/\/$/, ""));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
            <Crosshair className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">CS2 Pro</p>
            <p className="text-sm font-bold text-foreground">{player.nickname} · IDOL</p>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-xs font-medium uppercase tracking-wider transition sm:px-4 sm:text-sm",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/"
            className="ml-1 rounded px-1.5 py-1 text-[10px] text-muted-foreground/25 transition hover:text-muted-foreground/60"
            aria-label="数据管理"
          >
            admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
