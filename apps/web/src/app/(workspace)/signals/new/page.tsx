import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/workspace/page-header";
import { SignalForm } from "@/components/workspace/signal-form";
import { getAccount, getCustomers } from "@/lib/rails-api";

export const metadata: Metadata = { title: "Capture a Signal" };

export default async function NewSignalPage() {
  const account = await getAccount();
  const workspace = account!.workspaces[0];
  const customerResult = await getCustomers(workspace.id);

  return (
    <>
      <PageHeader eyebrow="CAPTURE / NEW SIGNAL" title="Put the evidence on the table." description="Record the observation while the context is still sharp. Status starts as New and stays visible to the whole workspace." backHref="/signal-feed" />
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,760px)_minmax(260px,1fr)]">
        <section className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-5 md:p-7">
          <SignalForm workspaceId={workspace.id} customers={customerResult?.customers ?? []} />
        </section>
        <aside className="self-start border-2 border-[var(--ink-950)] bg-[var(--acid-400)] p-5">
          <p className="eyebrow">CAPTURE STANDARD</p>
          <p className="mt-6 font-display text-2xl font-bold leading-tight">Specific beats dramatic.</p>
          <p className="mt-3 text-sm leading-6">Name the friction, preserve the evidence and choose priority from impact, not volume.</p>
          {!customerResult?.customers.length && <Link href="/customers/new" className="mt-6 inline-flex items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4">Create your first customer <ArrowRight aria-hidden="true" size={16} /></Link>}
        </aside>
      </div>
    </>
  );
}
