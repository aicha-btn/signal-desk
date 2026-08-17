import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RadioTower, ShieldCheck } from "lucide-react";
import { PublicFeedbackForm } from "@/components/public/public-feedback-form";
import { RailsApiError, publicRailsRequest, type PublicFeedbackForm as PublicFeedbackFormData } from "@/lib/rails-api";

export const metadata: Metadata = {
  title: "Send a Signal",
  description: "Send structured product feedback directly to a SignalDesk workspace.",
  robots: { index: false, follow: false },
};

export default async function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let form: PublicFeedbackFormData;
  try {
    const result = await publicRailsRequest<{ form: PublicFeedbackFormData }>(`/api/v1/public/forms/${encodeURIComponent(slug)}`);
    form = result.form;
  } catch (error) {
    if (error instanceof RailsApiError && error.status === 404) notFound();
    throw error;
  }

  const apiUrl = process.env.NEXT_PUBLIC_RAILS_API_URL ?? process.env.RAILS_API_URL ?? "http://127.0.0.1:3001";

  return (
    <main className="min-h-screen bg-[var(--paper-0)]">
      <header className="border-b-2 border-[var(--ink-950)] px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4"><Link href="/" className="font-display text-xl font-extrabold">SignalDesk</Link><span className="font-mono text-[10px]">PUBLIC SIGNAL LINE</span></div>
      </header>

      <section className="border-b-2 border-[var(--ink-950)] bg-[var(--cobalt-500)] px-4 py-10 text-[var(--paper-0)] md:px-8 md:py-14">
        <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-end">
          <div><p className="eyebrow mb-4 text-[var(--acid-400)]">DIRECT TO {form.workspace_name.toUpperCase()}</p><h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[0.9] md:text-7xl">What should the team hear next?</h1></div>
          <div className="border-t-2 border-[var(--paper-0)] pt-5"><RadioTower aria-hidden="true" className="mb-4 text-[var(--acid-400)]" size={32} /><p className="text-sm leading-6">One clear Signal enters the team&apos;s working feed. No account required.</p></div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 md:px-8 md:py-14 lg:grid-cols-[minmax(0,720px)_minmax(220px,1fr)]">
        <section aria-labelledby="public-form-heading">
          <p className="eyebrow mb-3">CAPTURE / PUBLIC</p>
          <h2 id="public-form-heading" className="mb-8 font-display text-3xl font-bold leading-none md:text-4xl">Useful detail beats loud urgency.</h2>
          <PublicFeedbackForm apiUrl={apiUrl.replace(/\/$/, "")} slug={form.slug} />
        </section>
        <aside className="self-start border-y-2 border-[var(--ink-950)] bg-[var(--acid-400)] py-6 lg:px-5">
          <ShieldCheck aria-hidden="true" className="mb-5" size={28} />
          <h2 className="font-display text-xl font-bold">A controlled entry point.</h2>
          <p className="mt-3 text-sm leading-6">Submissions are size-limited and rate-limited. Contact details remain optional.</p>
          <p className="mt-6 font-mono text-[10px]">POWERED BY SIGNALDESK / NO LOGIN</p>
        </aside>
      </div>
    </main>
  );
}
