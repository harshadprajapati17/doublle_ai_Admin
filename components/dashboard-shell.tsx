import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-zinc-50">
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
