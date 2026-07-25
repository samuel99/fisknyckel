"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Identifiera" },
  { href: "/arter", label: "Arter" },
  { href: "/om", label: "Om" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-sky-900 text-white shadow-md">
      <nav className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight flex items-center gap-2"
        >
          <span>🐟</span>
          <span>Fisknyckel</span>
        </Link>
        <ul className="flex gap-1">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-sky-700 text-white"
                      : "text-sky-100 hover:bg-sky-800"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
