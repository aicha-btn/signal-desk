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
            className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-3 px-4 py-4 transition-colors hover:bg-[var(--canvas-50)] lg:grid-cols-[minmax(0,1.55fr)_minmax(120px,0.65fr)_110px_100px_180px_85px] lg:items-center lg:gap-4 lg:px-5 lg:py-5"
          >
            <div className="col-span-2 min-w-0 lg:col-span-1">
              <h3 className="flex items-center gap-2 truncate font-display text-lg font-bold">
                <span className="truncate">{feedback.title}</span>
                <ArrowUpRight aria-hidden="true" className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" size={17} />
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-[var(--ink-600)]">{feedback.description}</p>
            </div>
            <p className="col-start-1 row-start-2 min-w-0 truncate text-sm font-semibold lg:col-auto lg:row-auto">{feedback.customer?.company || feedback.customer?.name || "Internal"}</p>
            <span className="col-start-1 row-start-3 w-fit border border-[var(--ink-950)] px-2 py-1 font-mono text-[10px] lg:col-auto lg:row-auto">{statusLabels[feedback.status].toUpperCase()}</span>
            <span className={`col-start-2 row-start-3 w-fit border border-[var(--ink-950)] px-2 py-1 font-mono text-[10px] lg:col-auto lg:row-auto ${priorityStyles[feedback.priority]}`}>{feedback.priority.toUpperCase()}</span>
            <div className="col-span-2 row-start-4 flex min-w-0 flex-wrap gap-1.5 lg:col-span-1 lg:row-auto">
              {feedback.tags.slice(0, 3).map((tag, index) => (
                <span key={tag.id} className={`max-w-28 truncate border border-[var(--ink-950)] px-2 py-1 font-mono text-[10px] ${index === 0 ? "bg-[var(--acid-400)]" : index === 1 ? "bg-[var(--cyan-400)]" : "bg-[var(--mint-500)]"}`}>{tag.name}</span>
              ))}
              {feedback.tags.length > 3 && <span className="border border-[var(--ink-950)] bg-[var(--canvas-50)] px-2 py-1 font-mono text-[10px]">+{feedback.tags.length - 3}</span>}
              {!feedback.tags.length && <span className="font-mono text-[10px] text-[var(--ink-600)]">UNTAGGED</span>}
            </div>
            <time className="col-start-2 row-start-2 text-right font-mono text-[10px] text-[var(--ink-600)] lg:col-auto lg:row-auto lg:text-left" dateTime={feedback.created_at}>
              {new Intl.DateTimeFormat("en", { day: "2-digit", month: "short" }).format(new Date(feedback.created_at)).toUpperCase()}
            </time>
          </Link>
        ))}
      </div>
    </div>
  );
}
