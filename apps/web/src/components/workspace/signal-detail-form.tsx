"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateSignal, type SignalDetailFormState } from "@/app/(workspace)/signals/actions";
import { PendingButtonContent } from "@/components/ui/pending-feedback";
import { DesignSelect } from "@/components/ui/design-select";
import { TagSelector } from "@/components/workspace/tag-selector";
import type { Customer, Feedback, Tag } from "@/lib/rails-api";

const initialState: SignalDetailFormState = { status: "idle", message: "" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-[var(--coral-500)]">{errors[0]}</p>;
}

export function SignalDetailForm({
  workspaceId,
  feedback,
  customers,
  tags,
}: {
  workspaceId: number;
  feedback: Feedback;
  customers: Customer[];
  tags: Tag[];
}) {
  const [state, formAction, pending] = useActionState(updateSignal, initialState);

  return (
    <form action={formAction} onReset={(event) => event.preventDefault()} className="grid gap-7" noValidate>
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <input type="hidden" name="feedbackId" value={feedback.id} />

      <div>
        <label className="app-form-label" htmlFor="signal-title">Signal title</label>
        <input className="app-form-control" id="signal-title" name="title" defaultValue={feedback.title} required />
        <FieldError errors={state.fieldErrors?.title} />
      </div>

      <div>
        <label className="app-form-label" htmlFor="signal-description">Evidence and context</label>
        <textarea className="app-form-control min-h-48 resize-y" id="signal-description" name="description" defaultValue={feedback.description} required />
        <FieldError errors={state.fieldErrors?.description} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="app-form-label" htmlFor="signal-status">Status</label>
          <DesignSelect id="signal-status" name="status" defaultValue={feedback.status} options={[{ value: "new", label: "New" }, { value: "reviewing", label: "Reviewing" }, { value: "planned", label: "Planned" }, { value: "resolved", label: "Resolved" }]} />
        </div>
        <div>
          <label className="app-form-label" htmlFor="signal-priority">Priority</label>
          <DesignSelect id="signal-priority" name="priority" defaultValue={feedback.priority} options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }, { value: "critical", label: "Critical" }]} />
        </div>
        <div>
          <label className="app-form-label" htmlFor="signal-source">Source</label>
          <DesignSelect id="signal-source" name="source" defaultValue={feedback.source} options={[{ value: "internal", label: "Internal note" }, { value: "public_form", label: "Public form" }, { value: "email", label: "Email" }, { value: "support", label: "Support" }, { value: "call", label: "Call" }, { value: "other", label: "Other" }]} />
        </div>
        <div>
          <label className="app-form-label" htmlFor="signal-customer">Customer</label>
          <DesignSelect id="signal-customer" name="customerId" defaultValue={feedback.customer?.id ?? ""} options={[{ value: "", label: "No customer attached" }, ...customers.map((customer) => ({ value: String(customer.id), label: customer.company || customer.name }))]} />
        </div>
      </div>

      <TagSelector tags={tags} selectedIds={feedback.tags.map((tag) => tag.id)} />

      {state.message && <p className="border-l-4 border-[var(--coral-500)] pl-3 text-sm" role="alert">{state.message}</p>}

      <button className="button button-primary min-h-12 justify-self-start" type="submit" disabled={pending} aria-busy={pending}>
        <PendingButtonContent pending={pending} idleLabel="Save changes" pendingLabel="Saving Signal..." idleIcon={<Save aria-hidden="true" size={19} />} />
      </button>
    </form>
  );
}
