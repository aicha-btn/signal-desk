"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { createComment, type CommentFormState } from "@/app/(workspace)/signals/[id]/comment-actions";
import { PendingButtonContent } from "@/components/ui/pending-feedback";

const initialState: CommentFormState = { status: "idle", message: "" };

export function CommentComposer({ workspaceId, feedbackId }: { workspaceId: number; feedbackId: number }) {
  const [state, formAction, pending] = useActionState(createComment, initialState);

  return (
    <form action={formAction} onReset={(event) => event.preventDefault()} className="mt-6 grid gap-3" noValidate>
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <input type="hidden" name="feedbackId" value={feedbackId} />
      <label className="app-form-label" htmlFor="signal-comment">Add context</label>
      <textarea
        className="app-form-control min-h-28 resize-y"
        id="signal-comment"
        name="body"
        maxLength={5_000}
        placeholder="Share a decision, validation or useful detail with the room."
        required
      />
      {state.fieldErrors?.body?.[0] && <p className="text-sm text-[var(--coral-500)]">{state.fieldErrors.body[0]}</p>}
      {state.status === "error" && !state.fieldErrors?.body && <p className="text-sm text-[var(--coral-500)]" role="alert">{state.message}</p>}
      <button className="button button-dark min-h-11 justify-self-start" type="submit" disabled={pending} aria-busy={pending}>
        <PendingButtonContent pending={pending} idleLabel="Post comment" pendingLabel="Posting comment..." idleIcon={<Send aria-hidden="true" size={17} />} />
      </button>
    </form>
  );
}
