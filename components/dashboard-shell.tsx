import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-surface">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
