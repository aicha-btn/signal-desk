import { Activity, MessageSquareText } from "lucide-react";
import { CommentComposer } from "@/components/workspace/comment-composer";
import { DeleteCommentButton } from "@/components/workspace/delete-comment-button";
import type { ActivityEvent, Comment } from "@/lib/rails-api";

type TimelineItem =
  | { kind: "comment"; id: number; createdAt: string; comment: Comment }
  | { kind: "activity"; id: number; createdAt: string; event: ActivityEvent };

export function SignalTimeline({
  workspaceId,
  feedbackId,
  comments,
  activityEvents,
  commentPosted,
}: {
  workspaceId: number;
  feedbackId: number;
  comments: Comment[];
  activityEvents: ActivityEvent[];
  commentPosted: boolean;
}) {
  const items: TimelineItem[] = [
    ...comments.map((comment) => ({ kind: "comment" as const, id: comment.id, createdAt: comment.created_at, comment })),
    ...activityEvents
      .filter((event) => event.action !== "comment_created")
      .map((event) => ({ kind: "activity" as const, id: event.id, createdAt: event.created_at, event })),
  ].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  return (
    <section id="collaboration" className="mt-10 border-t-2 border-[var(--ink-950)] pt-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">ROOM LOG</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Decisions leave a trace.</h2>
        </div>
        <span className="font-mono text-[10px] text-[var(--ink-600)]">{comments.length} COMMENT{comments.length === 1 ? "" : "S"}</span>
      </div>

      {commentPosted && <p className="mt-5 border-2 border-[var(--ink-950)] bg-[var(--mint-500)] px-4 py-3 text-sm font-bold" role="status">Comment posted. The room log is up to date.</p>}
      <CommentComposer workspaceId={workspaceId} feedbackId={feedbackId} />

      <div className="mt-7 border-t-2 border-[var(--ink-950)]">
        {items.length ? items.map((item) => item.kind === "comment" ? (
          <CommentRow key={`comment-${item.id}`} workspaceId={workspaceId} feedbackId={feedbackId} comment={item.comment} />
        ) : (
          <ActivityRow key={`activity-${item.id}`} event={item.event} />
        )) : (
          <div className="flex min-h-32 items-center gap-4 bg-[var(--canvas-50)] p-5 text-[var(--ink-600)]">
            <MessageSquareText aria-hidden="true" size={30} strokeWidth={1.8} />
            <p className="text-sm font-semibold">No discussion or recorded changes yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function CommentRow({ workspaceId, feedbackId, comment }: { workspaceId: number; feedbackId: number; comment: Comment }) {
  const author = comment.author.display_name || comment.author.email;
  return (
    <article className="grid grid-cols-[44px_minmax(0,1fr)] gap-4 border-b border-[var(--ink-300)] py-5 last:border-b-0">
      <span className="grid size-11 place-items-center border-2 border-[var(--ink-950)] bg-[var(--cobalt-500)] font-display text-sm font-bold text-[var(--paper-0)]" aria-hidden="true">{initials(author)}</span>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{author}</p>
            <TimelineTime value={comment.created_at} />
          </div>
          {comment.can_delete && <DeleteCommentButton workspaceId={workspaceId} feedbackId={feedbackId} commentId={comment.id} />}
        </div>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--ink-800)]">{comment.body}</p>
      </div>
    </article>
  );
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  const actor = event.actor?.display_name || event.actor?.email || "SignalDesk";
  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-4 border-b border-[var(--ink-300)] bg-[var(--canvas-50)] py-4 last:border-b-0">
      <span className="grid size-11 place-items-center text-[var(--cobalt-500)]"><Activity aria-hidden="true" size={20} /></span>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 pr-4">
        <p className="text-sm"><strong>{actor}</strong> {activityLabel(event)}</p>
        <TimelineTime value={event.created_at} />
      </div>
    </div>
  );
}

function activityLabel(event: ActivityEvent) {
  const from = String(event.metadata.from ?? "");
  const to = String(event.metadata.to ?? "");
  if (event.action === "feedback_status_changed") return <>moved status from <strong>{labelize(from)}</strong> to <strong>{labelize(to)}</strong>.</>;
  if (event.action === "feedback_priority_changed") return <>changed priority from <strong>{labelize(from)}</strong> to <strong>{labelize(to)}</strong>.</>;
  return <>captured this Signal.</>;
}

function TimelineTime({ value }: { value: string }) {
  return <time className="shrink-0 font-mono text-[10px] text-[var(--ink-600)]" dateTime={value}>{new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value)).toUpperCase()}</time>;
}

function initials(value: string) {
  return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function labelize(value: string) {
  return value.replaceAll("_", " ").replace(/^./, (character) => character.toUpperCase());
}
