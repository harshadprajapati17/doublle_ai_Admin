import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">
      <DashboardSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

/** Page-level width and scroll: contained (forms) vs fluid (data tables). */
export function DashboardContent({
  children,
  variant = "contained",
  className,
}: {
  children: ReactNode;
  variant?: "contained" | "fluid";
  className?: string;
}) {
  if (variant === "fluid") {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden bg-card",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-8 overflow-y-auto overscroll-y-contain px-6 py-8 sm:px-10 sm:py-10 lg:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
