import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CalendarDays, CircleUserRound, Link2, RadioTower } from "lucide-react";
import { DeleteSignalButton } from "@/components/workspace/delete-signal-button";
import { PageHeader } from "@/components/workspace/page-header";
import { SignalDetailForm } from "@/components/workspace/signal-detail-form";
import { SignalTimeline } from "@/components/workspace/signal-timeline";
import { getAccount, getActivityEvents, getComments, getCustomers, getFeedback, getTags, RailsApiError } from "@/lib/rails-api";

export const metadata: Metadata = { title: "Signal Detail" };

const sourceLabels = {
  internal: "Internal note",
  public_form: "Public form",
  email: "Email",
  support: "Support",
  call: "Call",
  other: "Other",
} as const;

export default async function SignalDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string; commented?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const feedbackId = Number(id);
  if (!Number.isInteger(feedbackId) || feedbackId <= 0) notFound();

  const account = await getAccount();
  const workspace = account!.workspaces[0];
  const [feedbackResult, customerResult, tagResult, commentResult, activityResult] = await loadSignalData(workspace.id, feedbackId);
  if (!feedbackResult) notFound();

  const feedback = feedbackResult.feedback;
  const capturedAt = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(feedback.created_at));

  return (
    <>
        <PageHeader
          eyebrow={`SIGNAL / #${feedback.id} / ${feedback.status.toUpperCase()}`}
          title={feedback.title}
          description="Keep the evidence sharp, move its priority with intent and make the next decision visible to the workspace."
          backHref="/signal-feed"
        />
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 md:px-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-5 md:p-7">
            {query.updated === "1" && <p className="mb-6 border-2 border-[var(--ink-950)] bg-[var(--mint-500)] px-4 py-3 text-sm font-bold" role="status">Signal updated. The workspace now has the latest context.</p>}
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--ink-950)] pb-5">
              <div>
                <p className="eyebrow">WORKING RECORD</p>
                <h2 className="mt-2 font-display text-2xl font-bold">Shape the Signal.</h2>
              </div>
              <span className="border-2 border-[var(--ink-950)] bg-[var(--acid-400)] px-3 py-2 font-mono text-[10px]">
                {feedback.priority.toUpperCase()} PRIORITY
              </span>
            </div>
            <SignalDetailForm workspaceId={workspace.id} feedback={feedback} customers={customerResult?.customers ?? []} tags={tagResult?.tags ?? []} />
            <SignalTimeline
              workspaceId={workspace.id}
              feedbackId={feedback.id}
              comments={commentResult?.comments ?? []}
              activityEvents={activityResult?.activity_events ?? []}
              commentPosted={query.commented === "1"}
            />
          </section>

          <aside className="self-start border-2 border-[var(--ink-950)] bg-[var(--paper-0)]">
            <div className="border-b-2 border-[var(--ink-950)] bg-[var(--cyan-400)] p-5">
              <p className="eyebrow">SIGNAL CONTEXT</p>
              <p className="mt-3 font-display text-2xl font-bold leading-tight">Evidence with an address.</p>
            </div>
            <dl className="divide-y-2 divide-[var(--ink-950)]">
              <ContextRow icon={<CircleUserRound aria-hidden="true" size={19} />} label="Customer" value={feedback.customer?.company || feedback.customer?.name || "Internal"} />
              <ContextRow icon={<RadioTower aria-hidden="true" size={19} />} label="Source" value={sourceLabels[feedback.source]} />
              <ContextRow icon={<CalendarDays aria-hidden="true" size={19} />} label="Captured" value={capturedAt} />
              <ContextRow icon={<Link2 aria-hidden="true" size={19} />} label="Captured by" value={feedback.created_by?.display_name || feedback.created_by?.email || "Public intake"} />
            </dl>
            <div className="border-t-2 border-[var(--ink-950)] bg-[var(--canvas-50)] p-5">
              <p className="eyebrow mb-3">DANGER ZONE</p>
              <p className="mb-4 text-sm leading-5 text-[var(--ink-600)]">Remove this record only when it should no longer exist in the workspace.</p>
              <DeleteSignalButton workspaceId={workspace.id} feedbackId={feedback.id} />
            </div>
          </aside>
        </div>
    </>
  );
}

async function loadSignalData(workspaceId: number, feedbackId: number) {
  try {
    return await Promise.all([
      getFeedback(workspaceId, feedbackId),
      getCustomers(workspaceId),
      getTags(workspaceId),
      getComments(workspaceId, feedbackId),
      getActivityEvents(workspaceId, feedbackId),
    ]);
  } catch (error) {
    if (error instanceof RailsApiError && error.status === 404) notFound();
    throw error;
  }
}

function ContextRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[24px_1fr] gap-3 p-5">
      <span className="mt-0.5 text-[var(--cobalt-500)]">{icon}</span>
      <div className="min-w-0">
        <dt className="eyebrow text-[var(--ink-600)]">{label.toUpperCase()}</dt>
        <dd className="mt-1 break-words text-sm font-bold">{value}</dd>
      </div>
    </div>
  );
}
