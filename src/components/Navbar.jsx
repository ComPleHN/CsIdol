"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页", icon: "◈" },
  { href: "/about/", label: "简介", icon: "◉" },
  { href: "/works/", label: "作品", icon: "◆" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href.replace(/\/$/, ""));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cs-border bg-cs-panel/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center border border-cs-accent bg-cs-dark text-sm font-bold text-cs-accent transition group-hover:bg-cs-accent group-hover:text-cs-dark">
            CS
          </span>
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.3em] text-cs-muted">Counter-Strike</p>
            <p className="text-sm font-semibold text-cs-text">CS IDOL</p>
          </div>
        </Link>

        <ul className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium uppercase tracking-wider transition sm:px-4 sm:text-sm ${
                  isActive(item.href)
                    ? "border-b-2 border-cs-accent bg-cs-accent/10 text-cs-accent"
                    : "text-cs-muted hover:bg-cs-hover hover:text-cs-text"
                }`}
              >
                <span className="text-cs-accent/70">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
