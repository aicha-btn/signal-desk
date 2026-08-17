"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { deleteComment } from "@/app/(workspace)/signals/[id]/comment-actions";
import { PendingMark } from "@/components/ui/pending-feedback";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button className="grid size-11 place-items-center text-[var(--ink-600)] transition-colors hover:bg-[var(--coral-500)] hover:text-[var(--ink-950)] disabled:cursor-wait" type="submit" disabled={pending} aria-label="Delete comment" title="Delete comment">
      {pending ? <PendingMark /> : <Trash2 aria-hidden="true" size={16} />}
    </button>
  );
}

export function DeleteCommentButton({ workspaceId, feedbackId, commentId }: { workspaceId: number; feedbackId: number; commentId: number }) {
  return (
    <form action={deleteComment} onSubmit={(event) => { if (!window.confirm("Delete this comment?")) event.preventDefault(); }}>
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <input type="hidden" name="feedbackId" value={feedbackId} />
      <input type="hidden" name="commentId" value={commentId} />
      <DeleteButton />
    </form>
  );
}
