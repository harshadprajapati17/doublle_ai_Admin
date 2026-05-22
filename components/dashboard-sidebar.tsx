"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Programs",
    description: "Rewards & rules",
    match: (pathname: string) =>
      pathname === "/dashboard" ||
      (pathname.startsWith("/dashboard/programs") &&
        !pathname.startsWith("/dashboard/referrals")),
  },
  {
    href: "/dashboard/referrals",
    label: "Referrals",
    description: "Attribution & payouts",
    match: (pathname: string) => pathname.startsWith("/dashboard/referrals"),
  },
] as const;

function NavSlash() {
  return (
    <span
      aria-hidden
      className="text-lg font-light leading-none text-sidebar-muted/60"
    >
      /
    </span>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)admin-email=([^;]+)/);
    if (match?.[1]) {
      setAdminEmail(decodeURIComponent(match[1]));
    }
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  const displayName = adminEmail?.split("@")[0] ?? "Admin";

  return (
    <aside className="sticky top-0 z-20 flex h-screen w-sidebar shrink-0 flex-col bg-sidebar text-sidebar-text">
      <div className="flex flex-1 flex-col px-5 pb-5 pt-7">
        <Link href="/dashboard" className="block">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sidebar-muted">
            Doublle
          </p>
          <h1 className="mt-3 text-[1.65rem] font-semibold leading-tight tracking-tight">
            Admin
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-sidebar-muted">
            Manage referral programs, rewards, and attribution from one place.
          </p>
        </Link>

        <nav aria-label="Main" className="mt-10 flex flex-col gap-2">
          <p className="px-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sidebar-muted">
            Navigation
          </p>
          {navItems.map((item) => {
            const isActive = item.match(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition",
                  isActive
                    ? "border-sidebar-border bg-sidebar-elevated text-white"
                    : "border-transparent text-sidebar-text hover:border-sidebar-border hover:bg-sidebar-elevated/60",
                )}
              >
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-sidebar-muted">
                    {item.description}
                  </span>
                </span>
                <NavSlash />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-sidebar-border px-5 py-5">
        <div className="rounded-xl border border-sidebar-border bg-sidebar-elevated px-4 py-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sidebar-muted">
            Signed in as
          </p>
          <p className="mt-2 truncate text-sm font-medium text-white">
            {displayName}
          </p>
          {adminEmail ? (
            <p className="mt-0.5 truncate text-xs text-sidebar-muted">
              {adminEmail}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="mt-4 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-white/90 disabled:opacity-60"
          >
            {isSigningOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      </div>
    </aside>
  );
}
