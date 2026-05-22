"use client";

import { toast } from "sonner";
import { useActivateProgram } from "@/hooks/use-activate-program";

export function ProgramDetailActions({
  programId,
  onActivated,
}: {
  programId: string;
  onActivated: () => void | Promise<void>;
}) {
  const { activateProgram, isLoading } = useActivateProgram();

  async function handleActivate() {
    const result = await activateProgram(programId);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Program activated");
    await onActivated();
  }

  return (
    <button
      type="button"
      onClick={handleActivate}
      disabled={isLoading}
      className="w-fit rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-60"
    >
      {isLoading ? "Activating…" : "Activate program"}
    </button>
  );
}
