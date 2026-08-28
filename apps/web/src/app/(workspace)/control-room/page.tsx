import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { PageHeader } from "@/components/workspace/page-header";
import { SignalList } from "@/components/workspace/signal-list";
import { getAccount, getFeedbacks } from "@/lib/rails-api";

export const metadata: Metadata = {
  title: "Control Room",
  description: "Your SignalDesk workspace overview.",
};

export default async function ControlRoomPage() {
  const account = await getAccount();
  const workspace = account!.workspaces[0];
  const result = await getFeedbacks(workspace.id);
  const feedbacks = result?.feedbacks ?? [];
  const active = feedbacks.filter((feedback) => feedback.status !== "resolved").length;
  const urgent = feedbacks.filter((feedback) => ["high", "critical"].includes(feedback.priority)).length;
  const resolved = feedbacks.filter((feedback) => feedback.status === "resolved").length;

  return (
    <>
      <PageHeader
        eyebrow="CONTROL ROOM / CURRENT PULSE"
        title={feedbacks.length ? "The room is listening." : "The room is open."}
        description={feedbacks.length ? "Incoming Signals, priority pressure and resolution progress are visible in one working view." : "Your workspace is ready. Capture the first real Signal to turn this quiet room into a working feed."}
        action={{ label: "Capture a Signal", href: "/signals/new" }}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
        <section className="grid grid-cols-3 border-2 border-[var(--ink-950)] bg-[var(--paper-0)]" aria-label="Workspace pulse">
          <StatusBlock label="ACTIVE SIGNALS" value={String(active)} detail={`${feedbacks.length} captured in total`} tone="bg-[var(--cobalt-500)]" />
          <StatusBlock label="HIGH PRESSURE" value={String(urgent)} detail="High or critical priority" tone="bg-[var(--acid-400)]" />
          <StatusBlock label="CLOSED LOOPS" value={String(resolved)} detail="Resolved Signals" tone="bg-[var(--mint-500)]" />
        </section>

        <section className="mt-8 border-2 border-[var(--ink-950)] bg-[var(--paper-0)]" aria-labelledby="feed-title">
          <div className="flex min-h-16 items-center justify-between border-b-2 border-[var(--ink-950)] px-4 md:px-5">
            <div className="flex items-center gap-3">
              <Inbox aria-hidden="true" size={20} />
              <h2 id="feed-title" className="font-display text-xl font-bold">Latest Signals</h2>
            </div>
            <span className="font-mono text-[10px] text-[var(--ink-600)]">{active} ACTIVE</span>
          </div>
          <SignalList feedbacks={feedbacks} compact />
          {feedbacks.length > 0 && (
            <div className="border-t-2 border-[var(--ink-950)] p-4 text-right">
              <Link href="/signal-feed" className="inline-flex items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4">
                Open the full Signal Feed <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function StatusBlock({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: string }) {
  return (
    <div className="min-w-0 border-r-2 border-[var(--ink-950)] p-3 last:border-r-0 md:p-5">
      <div className="flex min-h-6 items-start justify-between gap-2 md:min-h-0 md:items-center md:gap-4">
        <p className="font-mono text-[8px] leading-3 text-[var(--ink-600)] md:text-[10px]">{label}</p>
        <span aria-hidden="true" className={`mt-0.5 size-2 shrink-0 border border-[var(--ink-950)] md:mt-0 md:size-3 ${tone}`} />
      </div>
      <p className="mt-3 font-display text-2xl font-bold md:mt-8 md:text-3xl">{value}</p>
      <p className="sr-only md:not-sr-only md:mt-1 md:text-sm md:text-[var(--ink-600)]">{detail}</p>
    </div>
  );
}
