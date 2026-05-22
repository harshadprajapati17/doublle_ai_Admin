"use client";

import { useEffect, useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative w-full max-w-md rounded-xl border border-card-border bg-card p-6 shadow-2xl",
          className,
        )}
      >
        <h2 id={titleId} className="text-lg font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {description ? (
          <p
            id={descriptionId}
            className="mt-2 text-sm leading-relaxed text-ink-secondary"
          >
            {description}
          </p>
        ) : null}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
