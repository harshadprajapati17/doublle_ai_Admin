"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    match: (pathname: string) => pathname === "/dashboard",
  },
  {
    href: "/dashboard/referrals",
    label: "Referrals",
    match: (pathname: string) => pathname.startsWith("/dashboard/referrals"),
  },
  {
    href: "/dashboard/programs/new",
    label: "Create program",
    match: (pathname: string) =>
      pathname === "/dashboard/programs/new" ||
      pathname.endsWith("/edit"),
  },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-52 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-4 py-4">
        <Link href="/dashboard" className="block">
          <span className="text-sm font-semibold tracking-tight text-zinc-900">
            Doublle AI Admin
          </span>
        </Link>
      </div>

      <nav aria-label="Main" className="flex flex-col gap-0.5 px-2 py-3">
        {navItems.map((item) => {
          const isActive = item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "rounded-md px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
