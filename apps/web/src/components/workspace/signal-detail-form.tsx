"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateSignal, type SignalDetailFormState } from "@/app/(workspace)/signals/actions";
import { PendingButtonContent } from "@/components/ui/pending-feedback";
import type { Customer, Feedback } from "@/lib/rails-api";

const initialState: SignalDetailFormState = { status: "idle", message: "" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-[var(--coral-500)]">{errors[0]}</p>;
}

export function SignalDetailForm({
  workspaceId,
  feedback,
  customers,
}: {
  workspaceId: number;
  feedback: Feedback;
  customers: Customer[];
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
          <select className="app-form-control" id="signal-status" name="status" defaultValue={feedback.status}>
            <option value="new">New</option><option value="reviewing">Reviewing</option><option value="planned">Planned</option><option value="resolved">Resolved</option>
          </select>
        </div>
        <div>
          <label className="app-form-label" htmlFor="signal-priority">Priority</label>
          <select className="app-form-control" id="signal-priority" name="priority" defaultValue={feedback.priority}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="app-form-label" htmlFor="signal-source">Source</label>
          <select className="app-form-control" id="signal-source" name="source" defaultValue={feedback.source}>
            <option value="internal">Internal note</option><option value="public_form">Public form</option><option value="email">Email</option><option value="support">Support</option><option value="call">Call</option><option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="app-form-label" htmlFor="signal-customer">Customer</label>
          <select className="app-form-control" id="signal-customer" name="customerId" defaultValue={feedback.customer?.id ?? ""}>
            <option value="">No customer attached</option>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.company || customer.name}</option>)}
          </select>
        </div>
      </div>

      {state.message && <p className="border-l-4 border-[var(--coral-500)] pl-3 text-sm" role="alert">{state.message}</p>}

      <button className="button button-primary min-h-12 justify-self-start" type="submit" disabled={pending} aria-busy={pending}>
        <PendingButtonContent pending={pending} idleLabel="Save changes" pendingLabel="Saving Signal..." idleIcon={<Save aria-hidden="true" size={19} />} />
      </button>
    </form>
  );
}
