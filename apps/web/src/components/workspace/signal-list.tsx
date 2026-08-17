import Link from "next/link";
import { ArrowUpRight, Inbox } from "lucide-react";
import type { Feedback } from "@/lib/rails-api";

const statusLabels: Record<Feedback["status"], string> = {
  new: "New",
  reviewing: "Reviewing",
  planned: "Planned",
  resolved: "Resolved",
};

const priorityStyles: Record<Feedback["priority"], string> = {
  low: "bg-[var(--mint-500)]",
  medium: "bg-[var(--cyan-400)]",
  high: "bg-[var(--acid-400)]",
  critical: "bg-[var(--coral-500)]",
};

export function SignalList({ feedbacks, compact = false }: { feedbacks: Feedback[]; compact?: boolean }) {
  if (!feedbacks.length) {
    return (
      <div className="grid min-h-[260px] place-items-center p-6 text-center">
        <div className="max-w-md">
          <Inbox aria-hidden="true" className="mx-auto text-[var(--cobalt-500)]" size={42} strokeWidth={1.8} />
          <h3 className="mt-5 font-display text-2xl font-bold">No Signals yet.</h3>
          <p className="mt-3 leading-6 text-[var(--ink-600)]">
            Capture the first customer observation, request or friction point to start the feed.
          </p>
        </div>
      </div>
    );
  }

  const visibleFeedbacks = compact ? feedbacks.slice(0, 5) : feedbacks;

  return (
    <div>
      <div className="hidden grid-cols-[minmax(0,1.55fr)_minmax(120px,0.65fr)_110px_100px_180px_85px] border-b border-[var(--ink-300)] bg-[var(--canvas-50)] px-5 py-3 font-mono text-[10px] text-[var(--ink-600)] lg:grid">
        <span>SIGNAL</span><span>CUSTOMER</span><span>STATUS</span><span>PRIORITY</span><span>TAGS</span><span>CAPTURED</span>
      </div>
      <div className="divide-y-2 divide-[var(--ink-950)]">
        {visibleFeedbacks.map((feedback) => (
          <Link
            key={feedback.id}
            href={`/signals/${feedback.id}`}
            aria-label={`Open Signal: ${feedback.title}`}
            className="group grid gap-4 px-4 py-5 transition-colors hover:bg-[var(--canvas-50)] lg:grid-cols-[minmax(0,1.55fr)_minmax(120px,0.65fr)_110px_100px_180px_85px] lg:items-center lg:px-5"
          >
            <div className="min-w-0">
              <h3 className="flex items-center gap-2 truncate font-display text-lg font-bold">
                <span className="truncate">{feedback.title}</span>
                <ArrowUpRight aria-hidden="true" className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" size={17} />
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-[var(--ink-600)]">{feedback.description}</p>
            </div>
            <p className="text-sm font-semibold">{feedback.customer?.company || feedback.customer?.name || "Internal"}</p>
            <span className="w-fit border border-[var(--ink-950)] px-2 py-1 font-mono text-[10px]">{statusLabels[feedback.status].toUpperCase()}</span>
            <span className={`w-fit border border-[var(--ink-950)] px-2 py-1 font-mono text-[10px] ${priorityStyles[feedback.priority]}`}>{feedback.priority.toUpperCase()}</span>
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {feedback.tags.slice(0, 3).map((tag, index) => (
                <span key={tag.id} className={`max-w-28 truncate border border-[var(--ink-950)] px-2 py-1 font-mono text-[10px] ${index === 0 ? "bg-[var(--acid-400)]" : index === 1 ? "bg-[var(--cyan-400)]" : "bg-[var(--mint-500)]"}`}>{tag.name}</span>
              ))}
              {feedback.tags.length > 3 && <span className="border border-[var(--ink-950)] bg-[var(--canvas-50)] px-2 py-1 font-mono text-[10px]">+{feedback.tags.length - 3}</span>}
              {!feedback.tags.length && <span className="font-mono text-[10px] text-[var(--ink-600)]">UNTAGGED</span>}
            </div>
            <time className="font-mono text-[10px] text-[var(--ink-600)]" dateTime={feedback.created_at}>
              {new Intl.DateTimeFormat("en", { day: "2-digit", month: "short" }).format(new Date(feedback.created_at)).toUpperCase()}
            </time>
          </Link>
        ))}
      </div>
    </div>
  );
}
