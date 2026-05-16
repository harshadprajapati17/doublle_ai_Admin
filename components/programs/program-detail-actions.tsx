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
        className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
      >
        {isLoading ? "Activating…" : "Activate program"}
      </button>
      <button
        type="button"
        onClick={() => handleActivate(true)}
        disabled={isLoading}
        className="rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-60"
      >
        Activate with force
      </button>
      <p className="w-full text-xs text-zinc-500">
        Only one program can be ACTIVE unless you activate with force (?force=true).
      </p>
    </div>
  );
}
