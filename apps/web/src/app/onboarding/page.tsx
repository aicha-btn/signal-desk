import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Check, RadioTower } from "lucide-react";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { getAccount } from "@/lib/rails-api";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create your workspace",
  description: "Set up your SignalDesk workspace.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  const account = await getAccount();
  if (!account) redirect("/login");
  if (!account.onboarding_required) redirect("/control-room");

  const defaultName =
    account.user.display_name ??
    (typeof data.claims.user_metadata?.display_name === "string"
      ? data.claims.user_metadata.display_name
      : "");

  return (
    <main className="min-h-screen bg-[var(--canvas-50)]">
      <a className="skip-link" href="#onboarding-form">Skip to workspace setup</a>
      <header className="flex h-16 items-center justify-between border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)] px-4 md:px-8">
        <span className="font-display text-xl font-extrabold">SignalDesk</span>
        <span className="font-mono text-[11px] text-[var(--ink-600)]">SETUP / 01 OF 01</span>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1600px] lg:grid-cols-12">
        <section className="border-b-2 border-[var(--ink-950)] bg-[var(--acid-400)] px-4 py-12 md:px-8 lg:col-span-4 lg:border-r-2 lg:border-b-0 lg:py-16">
          <RadioTower aria-hidden="true" size={36} strokeWidth={2.2} />
          <p className="eyebrow mt-8">FIRST SIGNAL / YOUR TEAM</p>
          <h1 className="mt-4 max-w-md font-display text-5xl font-extrabold leading-[0.94]">
            Give your work a room of its own.
          </h1>
          <ul className="mt-10 grid gap-4 border-t-2 border-[var(--ink-950)] pt-6 text-sm">
            {["You become the workspace owner", "Every future Signal stays scoped here", "Members can join later"].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check aria-hidden="true" className="mt-0.5 shrink-0" size={18} /> {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="onboarding-form" tabIndex={-1} className="flex items-center bg-[var(--paper-0)] px-4 py-14 md:px-12 lg:col-span-8 lg:px-20">
          <div className="w-full max-w-[720px]">
            <p className="eyebrow mb-5">WORKSPACE IDENTITY</p>
            <h2 className="max-w-2xl font-display text-4xl font-bold leading-[0.98] md:text-6xl">
              One name. One boundary. Clear ownership.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-7 text-[var(--ink-600)]">
              This creates the secure boundary Rails will use for every customer, Signal and decision.
            </p>
            <OnboardingForm defaultName={defaultName} />
          </div>
        </section>
      </div>
    </main>
  );
}
