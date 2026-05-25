import type { ReactNode } from "react";
import { DashboardContent } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/ui/dashboard";
import { FLUID_PAGE_X } from "@/lib/dashboard/fluid-spacing";
import { cn } from "@/lib/utils";

export function FluidDashboardLayout({
  eyebrow,
  title,
  description,
  children,
  contentClassName,
  fillViewport = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  /** Extra classes on the white content panel (e.g. flex fill for tables). */
  contentClassName?: string;
  /** When true, the content panel grows to fill remaining viewport height. */
  fillViewport?: boolean;
}) {
  return (
    <DashboardContent variant="fluid" className="bg-card">
      <section
        className={cn(
          "shrink-0 border-b border-accent/10 bg-accent-soft/40 py-3.5 sm:py-4",
          FLUID_PAGE_X,
        )}
      >
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          density="fluid"
          tone={eyebrow ? "accent" : "default"}
        />
      </section>

      <section
        className={cn(
          "flex min-h-0 flex-1 flex-col border-t border-card-border",
          fillViewport ? "overflow-hidden" : "overflow-y-auto overscroll-y-contain",
        )}
      >
        <div
          className={cn(
            "flex flex-col bg-card",
            fillViewport && "min-h-0 flex-1 overflow-hidden",
            contentClassName,
          )}
        >
          {children}
        </div>
      </section>
    </DashboardContent>
  );
}
