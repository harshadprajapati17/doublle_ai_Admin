import { DashboardShell } from "@/components/dashboard-shell";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh overflow-hidden">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
