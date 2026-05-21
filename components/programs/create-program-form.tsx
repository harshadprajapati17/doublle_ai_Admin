"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CurrencyInput,
  Field,
  FieldGroup,
  NumberInput,
  RadioCardGroup,
  SectionCard,
  SegmentedControl,
  SelectInput,
  TextInput,
  ToggleRow,
} from "@/components/ui/form-primitives";
import { useActivateProgram } from "@/hooks/use-activate-program";
import { useCreateProgram } from "@/hooks/use-create-program";
import { useUpdateProgram } from "@/hooks/use-update-program";
import {
  ATTRIBUTION_RULE_OPTIONS,
  CAP_BEHAVIOR_OPTIONS,
  CURRENCY_OPTIONS,
  REFEREE_BENEFIT_OPTIONS,
} from "@/lib/programs/constants";
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
  const router = useRouter();
  const { createProgram, isLoading: isCreating } = useCreateProgram();
  const { updateProgram, isLoading: isUpdating } = useUpdateProgram();
  const { activateProgram, isLoading: isActivating } = useActivateProgram();
  const [createdProgram, setCreatedProgram] = useState<Program | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateProgramFormValues>({
    resolver: zodResolver(createProgramFormSchema),
    defaultValues: program ? programToFormValues(program) : FORM_DEFAULT_VALUES,
    mode: "onBlur",
  });

  const refereeBenefitType = watch("refereeBenefitType");
  const monthlyCapUnlimited = watch("monthlyCapUnlimited");
  const lifetimeCapUnlimited = watch("lifetimeCapUnlimited");
  const currency = watch("currency");

  useEffect(() => {
    if (refereeBenefitType === "NONE") {
      setValue("refereeBenefitValue", null, { shouldValidate: true });
      setValue("refereeBenefitTrialDays", null, { shouldValidate: true });
    } else if (refereeBenefitType === "TRIAL_EXTENSION") {
      setValue("refereeBenefitValue", null, { shouldValidate: true });
    } else if (refereeBenefitType === "CREDIT") {
      setValue("refereeBenefitTrialDays", null, { shouldValidate: true });
    }
  }, [refereeBenefitType, setValue]);

  useEffect(() => {
    if (monthlyCapUnlimited) {
      setValue("monthlyCap", null, { shouldValidate: true });
    }
  }, [monthlyCapUnlimited, setValue]);

  useEffect(() => {
    if (lifetimeCapUnlimited) {
      setValue("lifetimeCap", null, { shouldValidate: true });
    }
  }, [lifetimeCapUnlimited, setValue]);

  async function onSubmit(values: CreateProgramFormValues) {
    if (isEdit && program) {
      const result = await updateProgram(program.id, values);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success("Program updated", {
        description: `${result.program.name} was saved.`,
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

    setCreatedProgram(result.program);
    toast.success("Referral program created as draft", {
      description: `${result.program.name} is ready to review.`,
      action: {
        label: "View program",
        onClick: () => router.push(`/dashboard/programs/${result.program.id}`),
      },
    });
  }

  async function handleActivate(force = false) {
    if (!createdProgram) return;

    const result = await activateProgram(createdProgram.id, { force });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Program activated", {
      description: force
        ? "This program is now active (previous active program was replaced)."
        : "This program is now the active referral program.",
    });
    router.push(`/dashboard/programs/${result.program.id}`);
  }

  function applyRecommendedDefaults() {
    reset(RECOMMENDED_DEFAULTS);
    toast.message("Recommended defaults applied");
  }

  const isBusy = isCreating || isUpdating || isSubmitting || isActivating;
  const showMonthlyCapBehavior = !monthlyCapUnlimited;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-8 pb-28"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent">
            {isEdit ? "Edit program" : "New program"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            {isEdit ? "Edit referral program" : "Create referral program"}
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            {isEdit
              ? "Changes are saved with a PATCH to the program API."
              : "New programs are saved as drafts until you activate them."}
          </p>
        </div>
        {!isEdit ? (
          <button
            type="button"
            onClick={applyRecommendedDefaults}
            className="rounded-lg border border-card-border bg-card px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface"
          >
            Use recommended defaults
          </button>
        ) : null}
      </div>

      {!isEdit && createdProgram ? (
        <CreatedProgramBanner
          program={createdProgram}
          isActivating={isActivating}
          onActivate={() => handleActivate(false)}
          onForceActivate={() => handleActivate(true)}
        />
      ) : null}

      <SectionCard
        title="Program basics"
        description="Name and legal terms for this referral program."
      >
        <FieldGroup>
          <Field
            label="Program name"
            htmlFor="name"
            helpId="name-help"
            required
            error={errors.name?.message}
          >
            <TextInput
              id="name"
              placeholder="Standard Referral"
              invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>
          <Field
            label="Terms version"
            htmlFor="termsVersion"
            helpId="termsVersion-help"
            help="Legal terms version referrers must accept (e.g. v1)"
            required
            error={errors.termsVersion?.message}
          >
            <TextInput
              id="termsVersion"
              placeholder="v1"
              invalid={Boolean(errors.termsVersion)}
              {...register("termsVersion")}
            />
          </Field>
        </FieldGroup>
        <Field
          label="Currency"
          htmlFor="currency"
          className="max-w-xs"
          error={errors.currency?.message}
        >
          <SelectInput
            id="currency"
            invalid={Boolean(errors.currency)}
            {...register("currency")}
          >
            {CURRENCY_OPTIONS.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </SelectInput>
        </Field>
      </SectionCard>

      <SectionCard
        title="Referrer reward"
        description="Commission paid to referrers when their referee generates revenue."
      >
        <FieldGroup>
          <Field
            label="Referrer reward (%)"
            htmlFor="referrerRewardPct"
            helpId="referrerRewardPct-help"
            help="% of referee net revenue paid to referrer"
            required
            error={errors.referrerRewardPct?.message}
          >
            <NumberInput
              id="referrerRewardPct"
              step="0.01"
              min={0}
              max={100}
              suffix="%"
              invalid={Boolean(errors.referrerRewardPct)}
              {...register("referrerRewardPct", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label="Reward duration (months)"
            htmlFor="referrerRewardDurationMonths"
            helpId="referrerRewardDurationMonths-help"
            help="Months of commission after referee’s first paid invoice"
            required
            error={errors.referrerRewardDurationMonths?.message}
          >
            <NumberInput
              id="referrerRewardDurationMonths"
              step={1}
              min={1}
              max={240}
              invalid={Boolean(errors.referrerRewardDurationMonths)}
              {...register("referrerRewardDurationMonths", {
                valueAsNumber: true,
              })}
            />
          </Field>
          <Field
            label="Hold period (days)"
            htmlFor="holdPeriodDays"
            helpId="holdPeriodDays-help"
            help="Days after payment before commission becomes payable"
            required
            error={errors.holdPeriodDays?.message}
          >
            <NumberInput
              id="holdPeriodDays"
              step={1}
              min={0}
              max={365}
              invalid={Boolean(errors.holdPeriodDays)}
              {...register("holdPeriodDays", { valueAsNumber: true })}
            />
          </Field>
        </FieldGroup>
      </SectionCard>

      <SectionCard
        title="Attribution & tracking"
        description="How referral clicks are remembered and credited at signup."
      >
        <Field
          label="Cookie window (days)"
          htmlFor="cookieDays"
          helpId="cookieDays-help"
          help="How long a referral click is remembered"
          required
          className="max-w-xs"
          error={errors.cookieDays?.message}
        >
          <NumberInput
            id="cookieDays"
            step={1}
            min={1}
            max={365}
            invalid={Boolean(errors.cookieDays)}
            {...register("cookieDays", { valueAsNumber: true })}
          />
        </Field>
        <Field
          label="Attribution rule"
          htmlFor="attributionRule"
          required
          error={errors.attributionRule?.message}
        >
          <Controller
            name="attributionRule"
            control={control}
            render={({ field }) => (
              <RadioCardGroup
                name="attributionRule"
                value={field.value}
                onChange={field.onChange}
                options={ATTRIBUTION_RULE_OPTIONS}
                invalid={Boolean(errors.attributionRule)}
              />
            )}
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Referee benefit"
        description="Optional incentive for new customers who sign up via a referral. Account credit is AI product usage, not monetary."
      >
        <Field label="Referee benefit" htmlFor="refereeBenefitType">
          <Controller
            name="refereeBenefitType"
            control={control}
            render={({ field }) => (
              <SegmentedControl
                name="refereeBenefitType"
                value={field.value}
                onChange={field.onChange}
                options={REFEREE_BENEFIT_OPTIONS}
              />
            )}
          />
        </Field>

        {refereeBenefitType === "TRIAL_EXTENSION" ? (
          <Field
            label="Extra trial days"
            htmlFor="refereeBenefitTrialDays"
            required
            className="max-w-xs"
            error={errors.refereeBenefitTrialDays?.message}
          >
            <NumberInput
              id="refereeBenefitTrialDays"
              step={1}
              min={1}
              max={365}
              invalid={Boolean(errors.refereeBenefitTrialDays)}
              {...register("refereeBenefitTrialDays", {
                valueAsNumber: true,
                setValueAs: (value) =>
                  value === "" || Number.isNaN(Number(value))
                    ? null
                    : Number(value),
              })}
            />
          </Field>
        ) : null}

        {refereeBenefitType === "CREDIT" ? (
          <Field
            label="Product credit amount"
            htmlFor="refereeBenefitValue"
            helpId="refereeBenefitValue-help"
            help="Internal AI product credits for the referee — not cash or a currency amount."
            required
            className="max-w-xs"
            error={errors.refereeBenefitValue?.message}
          >
            <NumberInput
              id="refereeBenefitValue"
              step={1}
              min={1}
              suffix="credits"
              invalid={Boolean(errors.refereeBenefitValue)}
              {...register("refereeBenefitValue", {
                valueAsNumber: true,
                setValueAs: (value) =>
                  value === "" || Number.isNaN(Number(value))
                    ? null
                    : Number(value),
              })}
            />
          </Field>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Caps & limits"
        description="Maximum commission a single referrer can earn on this program."
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <ToggleRow
              id="monthlyCapUnlimited"
              label="No monthly limit"
              description="Uncapped monthly earnings per referrer"
              checked={monthlyCapUnlimited}
              onChange={(checked) =>
                setValue("monthlyCapUnlimited", checked, { shouldValidate: true })
              }
            />
            {!monthlyCapUnlimited ? (
              <Field
                label="Monthly cap per referrer"
                htmlFor="monthlyCap"
                helpId="monthlyCap-help"
                help="Max commission one referrer can earn per calendar month"
                error={errors.monthlyCap?.message}
              >
                <CurrencyInput
                  id="monthlyCap"
                  currency={currency}
                  invalid={Boolean(errors.monthlyCap)}
                  {...register("monthlyCap", {
                    valueAsNumber: true,
                    setValueAs: (value) =>
                      value === "" || Number.isNaN(Number(value))
                        ? null
                        : Number(value),
                  })}
                />
              </Field>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <ToggleRow
              id="lifetimeCapUnlimited"
              label="No lifetime limit"
              description="Uncapped total earnings per referrer"
              checked={lifetimeCapUnlimited}
              onChange={(checked) =>
                setValue("lifetimeCapUnlimited", checked, {
                  shouldValidate: true,
                })
              }
            />
            {!lifetimeCapUnlimited ? (
              <Field
                label="Lifetime cap per referrer"
                htmlFor="lifetimeCap"
                helpId="lifetimeCap-help"
                help="Max total commission per referrer on this program"
                error={errors.lifetimeCap?.message}
              >
                <CurrencyInput
                  id="lifetimeCap"
                  currency={currency}
                  invalid={Boolean(errors.lifetimeCap)}
                  {...register("lifetimeCap", {
                    valueAsNumber: true,
                    setValueAs: (value) =>
                      value === "" || Number.isNaN(Number(value))
                        ? null
                        : Number(value),
                  })}
                />
              </Field>
            ) : null}
          </div>

          {showMonthlyCapBehavior ? (
            <Field
              label="When monthly cap is hit"
              htmlFor="capBehavior"
              required
              error={errors.capBehavior?.message}
            >
              <Controller
                name="capBehavior"
                control={control}
                render={({ field }) => (
                  <RadioCardGroup
                    name="capBehavior"
                    value={field.value}
                    onChange={field.onChange}
                    options={CAP_BEHAVIOR_OPTIONS}
                    invalid={Boolean(errors.capBehavior)}
                  />
                )}
              />
            </Field>
          ) : null}
        </div>
      </SectionCard>

      <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-card-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3 px-6 py-4">
          <Link
            href={isEdit && program ? `/dashboard/programs/${program.id}` : "/dashboard"}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-secondary transition hover:bg-surface"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!isValid || isBusy || (!isEdit && Boolean(createdProgram))}
            className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating
              ? "Saving changes…"
              : isCreating
                ? "Creating program…"
                : isEdit
                  ? "Save changes"
                  : "Create program"}
          </button>
        </div>
      </footer>
    </form>
  );
}

function CreatedProgramBanner({
  program,
  isActivating,
  onActivate,
  onForceActivate,
}: {
  program: Program;
  isActivating: boolean;
  onActivate: () => void;
  onForceActivate: () => void;
}) {
  return (
    <div
      className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"
      role="status"
    >
      <p className="text-sm font-medium text-emerald-900">
        Draft created: {program.name}
      </p>
      <p className="mt-1 text-sm text-emerald-800">
        Only one program can be <strong>ACTIVE</strong> at a time. Activating
        this draft will fail if another program is already active unless you use
        force activation.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/dashboard/programs/${program.id}`}
          className="rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100/50"
        >
          View program
        </Link>
        <button
          type="button"
          onClick={onActivate}
          disabled={isActivating}
          className="rounded-md bg-emerald-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:opacity-60"
        >
          {isActivating ? "Activating…" : "Activate program"}
        </button>
        <button
          type="button"
          onClick={onForceActivate}
          disabled={isActivating}
          className="rounded-md px-4 py-2 text-sm font-medium text-emerald-900 underline-offset-2 hover:underline disabled:opacity-60"
        >
          Activate with force
        </button>
      </div>
    </div>
  );
}
