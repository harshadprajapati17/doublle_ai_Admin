"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActivateProgram } from "@/hooks/use-activate-program";

export function ProgramDetailActions({ programId }: { programId: string }) {
  const router = useRouter();
  const { activateProgram, isLoading } = useActivateProgram();

  async function handleActivate(force: boolean) {
    const result = await activateProgram(programId, { force });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Program activated");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => handleActivate(false)}
        disabled={isLoading}
        className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-60"
      >
        {isLoading ? "Activating…" : "Activate program"}
      </button>
      <button
        type="button"
        onClick={() => handleActivate(true)}
        disabled={isLoading}
        className="rounded-lg border border-card-border px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
      >
        Activate with force
      </button>
      <p className="w-full text-xs text-ink-muted">
        Only one program can be ACTIVE unless you activate with force (?force=true).
      </p>
    </div>
  );
}
