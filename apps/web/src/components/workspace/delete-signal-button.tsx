"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { deleteSignal } from "@/app/(workspace)/signals/actions";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button className="button bg-[var(--paper-0)] text-[var(--coral-500)] hover:bg-[var(--coral-500)] hover:text-[var(--paper-0)]" type="submit" disabled={pending}>
      <Trash2 aria-hidden="true" size={18} /> {pending ? "Deleting..." : "Delete Signal"}
    </button>
  );
}

export function DeleteSignalButton({ workspaceId, feedbackId }: { workspaceId: number; feedbackId: number }) {
  return (
    <form
      action={deleteSignal}
      onSubmit={(event) => {
        if (!window.confirm("Delete this Signal permanently? This action cannot be undone.")) event.preventDefault();
      }}
    >
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <input type="hidden" name="feedbackId" value={feedbackId} />
      <DeleteButton />
    </form>
  );
}
