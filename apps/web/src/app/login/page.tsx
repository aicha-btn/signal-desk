import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Enter the SignalDesk Control Room.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string }>;
}) {
  const { mode: requestedMode, next: requestedNext } = await searchParams;
  const nextPath = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : undefined;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect(nextPath ?? "/control-room");

  const mode = requestedMode === "signup" ? "signup" : "login";

  return (
    <main className="grid min-h-screen bg-[var(--paper-0)] lg:grid-cols-12">
      <a className="skip-link" href="#authentication-form">Skip to authentication</a>
      <section className="relative flex min-h-[330px] flex-col justify-between overflow-hidden border-b-2 border-[var(--ink-950)] bg-[var(--cobalt-500)] p-6 text-[var(--paper-0)] md:p-10 lg:col-span-5 lg:min-h-screen lg:border-r-2 lg:border-b-0">
        <div aria-hidden="true" className="auth-signal-field">
          <span className="auth-signal-shape auth-signal-shape-one" />
          <span className="auth-signal-shape auth-signal-shape-two" />
          <span className="auth-signal-shape auth-signal-shape-three" />
        </div>
        <Link href="/" className="relative z-10 inline-flex items-center gap-2 self-start font-display text-xl font-extrabold">
          <ArrowLeft aria-hidden="true" size={19} /> SignalDesk
        </Link>
        <div className="relative z-10 max-w-xl">
          <p className="eyebrow mb-4 text-[var(--acid-400)]">SECURE LINE / AUTHENTICATION</p>
          <h1 className="font-display text-5xl font-extrabold leading-[0.92] md:text-6xl">
            Decisions need context. Access needs proof.
          </h1>
          <ul className="mt-8 hidden gap-3 text-sm md:grid">
            {["Supabase owns identity", "Rails enforces permissions", "Every workspace stays isolated"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check aria-hidden="true" className="text-[var(--acid-400)]" size={18} /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="authentication-form" tabIndex={-1} className="flex items-center px-4 py-12 md:px-12 lg:col-span-7 lg:px-20">
        <div className="mx-auto w-full max-w-[480px]">
          <p className="eyebrow mb-4">{mode === "login" ? "WELCOME BACK" : "FOUNDING WORKSPACE"}</p>
          <h2 className="font-display text-4xl font-bold leading-none md:text-5xl">
            {mode === "login" ? "Pick up the signal." : "Open your Control Room."}
          </h2>
          <p className="mt-4 mb-8 max-w-md leading-6 text-[var(--ink-600)]">
            {mode === "login"
              ? "Your feed, priorities and team context are waiting."
              : "Create your account first. Your workspace comes next."}
          </p>
          <AuthForm mode={mode} nextPath={nextPath} />
        </div>
      </section>
    </main>
  );
}
