"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  ConfigZone,
  Field,
  MetricNumberField,
  ProgramConfigCard,
  TextInput,
} from "@/components/ui/form-primitives";
import { useCreateProgram } from "@/hooks/use-create-program";
import { useUpdateProgram } from "@/hooks/use-update-program";
import {
  FORM_DEFAULT_VALUES,
  programToFormValues,
  RECOMMENDED_DEFAULTS,
} from "@/lib/programs/defaults";
import {
  createProgramFormSchema,
  type CreateProgramFormValues,
} from "@/lib/programs/schema";
import type { Program } from "@/lib/programs/types";

type ProgramFormProps = {
  program?: Program;
};

export function CreateProgramForm({ program }: ProgramFormProps = {}) {
  const isEdit = Boolean(program);
  const isDraftEdit = isEdit && program?.status === "DRAFT";
  const showCreateProgramAction = !isEdit || isDraftEdit;
  const router = useRouter();
  const { createProgram, isLoading: isCreating } = useCreateProgram();
  const { updateProgram, isLoading: isUpdating } = useUpdateProgram();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateProgramFormValues>({
    resolver: zodResolver(createProgramFormSchema),
    defaultValues: program ? programToFormValues(program) : FORM_DEFAULT_VALUES,
    mode: "onBlur",
  });

  async function saveDraft(values: CreateProgramFormValues) {
    if (isEdit && program) {
      const result = await updateProgram(program.id, values);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(isDraftEdit ? "Draft saved" : "Changes saved", {
        description: `${result.program.name} was updated.`,
      });
      router.push(`/dashboard/programs/${result.program.id}`);
      router.refresh();
      return;
    }

    const result = await createProgram(values);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Draft saved", {
      description: `${result.program.name} is ready to review.`,
    });
    router.push(`/dashboard/programs/${result.program.id}`);
    router.refresh();
  }

  async function saveAndActivate(values: CreateProgramFormValues) {
    if (isEdit && program) {
      const result = await updateProgram(program.id, values, { activate: true });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success("Program activated", {
        description: `${result.program.name} is now visible to users.`,
      });
      router.push(`/dashboard/programs/${result.program.id}`);
      router.refresh();
      return;
    }

    const result = await createProgram(values, { activate: true });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Program created", {
      description: `${result.program.name} is now visible to users.`,
    });
    router.push(`/dashboard/programs/${result.program.id}`);
    router.refresh();
  }

  async function handleSaveDraftClick() {
    await handleSubmit(saveDraft)();
  }

  async function handleCreateProgramClick() {
    const valid = await trigger();
    if (!valid) return;
    setConfirmOpen(true);
  }

  async function handleConfirmActivate() {
    setConfirmOpen(false);
    await saveAndActivate(getValues());
  }

  async function handleConfirmSaveDraft() {
    setConfirmOpen(false);
    await saveDraft(getValues());
  }

  function fillSampleValues() {
    reset(RECOMMENDED_DEFAULTS);
    toast.message("Sample values applied");
  }

  const isBusy = isCreating || isUpdating || isSubmitting;

  return (
    <>
      <form
        onSubmit={(event) => event.preventDefault()}
        noValidate
        className="flex flex-col gap-6 pb-28"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-accent">
              {isEdit ? "Edit program" : "New program"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              {isEdit ? "Edit referral program" : "Create referral program"}
            </h1>
            <p className="mt-2 text-sm text-ink-secondary">
              {isEdit
                ? isDraftEdit
                  ? "Save a draft to keep changes private, or activate when you are ready for users to see this program."
                  : "Update program settings. Changes are saved to the current program."
                : "Save a draft to configure the program first, or create and activate when you are ready for users to see it."}
            </p>
          </div>
          {!isEdit ? (
            <button
              type="button"
              onClick={fillSampleValues}
              className="shrink-0 self-start text-sm text-ink-secondary underline-offset-4 transition hover:text-ink hover:underline"
            >
              Fill sample values
            </button>
          ) : null}
        </div>

        <ProgramConfigCard>
          <Field
            label="Program name"
            htmlFor="name"
            required
            error={errors.name?.message}
          >
            <TextInput
              id="name"
              placeholder="Standard Referral"
              invalid={Boolean(errors.name)}
              className="text-base py-3"
              {...register("name")}
            />
          </Field>

          <ConfigZone
            title="Referrer economics"
            description="Commission paid when a referee generates revenue."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricNumberField
                id="referrerRewardPct"
                label="Commission"
                suffix="%"
                hint="% of net revenue"
                step="0.01"
                min={0}
                max={100}
                required
                invalid={Boolean(errors.referrerRewardPct)}
                error={errors.referrerRewardPct?.message}
                {...register("referrerRewardPct", { valueAsNumber: true })}
              />
              <MetricNumberField
                id="referrerRewardDurationMonths"
                label="Duration"
                suffix="months"
                hint="After referee’s first paid invoice"
                step={1}
                min={1}
                max={240}
                required
                invalid={Boolean(errors.referrerRewardDurationMonths)}
                error={errors.referrerRewardDurationMonths?.message}
                {...register("referrerRewardDurationMonths", {
                  valueAsNumber: true,
                })}
              />
              <MetricNumberField
                id="holdPeriodDays"
                label="Hold"
                suffix="days"
                hint="Before commission is payable"
                step={1}
                min={0}
                max={365}
                required
                invalid={Boolean(errors.holdPeriodDays)}
                error={errors.holdPeriodDays?.message}
                {...register("holdPeriodDays", { valueAsNumber: true })}
              />
            </div>
          </ConfigZone>

          <ConfigZone
            title="Referee benefit"
            description="Product credit for new customers (AI usage, not cash)."
          >
            <input type="hidden" {...register("refereeBenefitType")} />
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricNumberField
                id="refereeBenefitValue"
                label="Credits"
                suffix="credits"
                hint="AI product usage — not cash or currency"
                step={1}
                min={1}
                required
                invalid={Boolean(errors.refereeBenefitValue)}
                error={errors.refereeBenefitValue?.message}
                {...register("refereeBenefitValue", { valueAsNumber: true })}
              />
            </div>
          </ConfigZone>
        </ProgramConfigCard>

        <footer className="fixed bottom-0 left-sidebar right-0 z-10 border-t border-card-border bg-card/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-10 lg:px-12">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-end gap-3 py-4">
            <Link
              href={
                isEdit && program
                  ? `/dashboard/programs/${program.id}`
                  : "/dashboard"
              }
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-secondary transition hover:bg-surface"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSaveDraftClick}
              disabled={!isValid || isBusy}
              className="rounded-lg border border-card-border px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating || isCreating
                ? isEdit
                  ? "Saving changes…"
                  : "Saving draft…"
                : isEdit
                  ? "Save changes"
                  : "Save draft"}
            </button>
            {showCreateProgramAction ? (
              <button
                type="button"
                onClick={handleCreateProgramClick}
                disabled={!isValid || isBusy}
                className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating || isCreating
                  ? isEdit
                    ? "Activating…"
                    : "Creating program…"
                  : isEdit
                    ? "Activate program"
                    : "Create program"}
              </button>
            ) : null}
          </div>
        </footer>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={isEdit ? "Activate this program?" : "Create active program?"}
        description="An active program is shown to users on the referral experience. Only one program can be active at a time. Do you want to continue?"
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            disabled={isBusy}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-secondary transition hover:bg-surface disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmSaveDraft}
            disabled={isBusy}
            className="rounded-lg border border-card-border px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface disabled:opacity-60"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={handleConfirmActivate}
            disabled={isBusy}
            className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 disabled:opacity-60"
          >
            {isBusy
              ? isEdit
                ? "Activating…"
                : "Creating…"
              : isEdit
                ? "Yes, activate"
                : "Yes, create program"}
          </button>
        </div>
      </ConfirmDialog>
    </>
  );
}
