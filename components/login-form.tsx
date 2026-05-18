"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { ApiErrorBody } from "@/lib/programs/types";

export function LoginForm() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: adminId.trim().toLowerCase(),
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as ApiErrorBody & {
        message?: string;
      };

      if (!response.ok) {
        setError(
          data.error?.message ??
            (typeof data.message === "string" ? data.message : undefined) ??
            "Sign-in failed. Check your admin ID and password.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <FormField
        id="adminId"
        label="Admin ID"
        type="email"
        value={adminId}
        onChange={setAdminId}
        placeholder="admin@company.com"
        help="Use the email registered for your admin account."
        required
        autoComplete="username"
      />

      <FormField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        required
        autoComplete="current-password"
      />

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

function FormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  help,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  help?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-900/10 transition focus:border-zinc-900 focus:ring-2"
      />
      {help ? <span className="text-xs text-zinc-500">{help}</span> : null}
    </label>
  );
}
