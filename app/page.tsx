import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full">
      <div className="hidden w-[42%] max-w-xl flex-col bg-sidebar px-10 py-12 text-sidebar-text lg:flex">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sidebar-muted">
          Doublle
        </p>
        <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight">
          Admin workspace
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-sidebar-muted">
          Sign in to manage referral programs, review attribution, and
          monitor payouts from one structured dashboard.
        </p>
      </div>

      <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <p className="text-sm font-medium text-accent lg:hidden">Doublle Admin</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            Sign in
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Use your admin email and password to access the workspace.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
