"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Tags, Trash2 } from "lucide-react";
import { createTag, deleteTag, type TagFormState } from "@/app/(workspace)/settings/tag-actions";
import { PendingButtonContent } from "@/components/ui/pending-feedback";
import type { Tag } from "@/lib/rails-api";

const initialState: TagFormState = { status: "idle", message: "" };
const tagColors = [
  "bg-[var(--acid-400)]",
  "bg-[var(--cyan-400)]",
  "bg-[var(--mint-500)]",
  "bg-[var(--paper-0)]",
];

function DeleteTagButton({ name }: { name: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="grid size-11 shrink-0 place-items-center border-l-2 border-[var(--ink-950)] transition-colors hover:bg-[var(--coral-500)] disabled:cursor-wait disabled:opacity-70"
      type="submit"
      disabled={pending}
      aria-label={`Delete ${name} tag`}
      title={`Delete ${name}`}
    >
      {pending ? <span className="signal-pending-mark" aria-hidden="true"><span /><span /><span /></span> : <Trash2 aria-hidden="true" size={17} />}
    </button>
  );
}

export function TagManager({ workspaceId, tags }: { workspaceId: number; tags: Tag[] }) {
  const [state, formAction, pending] = useActionState(createTag, initialState);

  return (
    <div className="grid gap-7">
      <form action={formAction} onReset={(event) => event.preventDefault()} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" noValidate>
        <input type="hidden" name="workspaceId" value={workspaceId} />
        <label>
          <span className="app-form-label">New tag</span>
          <input className="app-form-control" name="name" maxLength={40} placeholder="Retention, Billing, Mobile..." />
          {state.fieldErrors?.name?.[0] && <span className="mt-1 block text-sm text-[var(--coral-500)]">{state.fieldErrors.name[0]}</span>}
        </label>
        <button className="button button-dark min-h-12 self-end" type="submit" disabled={pending} aria-busy={pending}>
          <PendingButtonContent pending={pending} idleLabel="Create tag" pendingLabel="Creating..." idleIcon={<Plus aria-hidden="true" size={18} />} />
        </button>
        {state.message && <p className={`text-sm sm:col-span-2 ${state.status === "error" ? "text-[var(--coral-500)]" : "text-[var(--ink-600)]"}`} role="status">{state.message}</p>}
      </form>

      {tags.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {tags.map((tag, index) => (
            <div key={tag.id} className={`flex min-h-11 items-center border-2 border-[var(--ink-950)] ${tagColors[index % tagColors.length]}`}>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3">
                <span className="truncate font-mono text-xs font-bold">{tag.name}</span>
                <span className="shrink-0 font-mono text-[10px]">{tag.feedbacks_count} SIGNAL{tag.feedbacks_count === 1 ? "" : "S"}</span>
              </div>
              <form
                action={deleteTag}
                onSubmit={(event) => {
                  if (!window.confirm(`Delete the "${tag.name}" tag? Signals will be kept.`)) event.preventDefault();
                }}
              >
                <input type="hidden" name="workspaceId" value={workspaceId} />
                <input type="hidden" name="tagId" value={tag.id} />
                <DeleteTagButton name={tag.name} />
              </form>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-32 items-center gap-4 border-2 border-dashed border-[var(--ink-300)] bg-[var(--canvas-50)] p-5 text-[var(--ink-600)]">
          <Tags aria-hidden="true" size={28} />
          <p className="text-sm font-semibold">No workspace tags yet.</p>
        </div>
      )}
    </div>
  );
}
