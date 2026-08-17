"use client";

import { useActionState } from "react";
import { RadioTower } from "lucide-react";
import { createSignal, type SignalFormState } from "@/app/(workspace)/signals/new/actions";
import type { Customer } from "@/lib/rails-api";

const initialState: SignalFormState = { status: "idle", message: "" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-[var(--coral-500)]">{errors[0]}</p>;
}

export function SignalForm({ workspaceId, customers }: { workspaceId: number; customers: Customer[] }) {
  const [state, formAction, pending] = useActionState(createSignal, initialState);

  return (
    <form action={formAction} className="grid gap-6" noValidate>
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <div>
        <label className="app-form-label" htmlFor="title">Signal title</label>
        <input className="app-form-control" id="title" name="title" placeholder="Customers cannot export filtered reports" required />
        <FieldError errors={state.fieldErrors?.title} />
      </div>
      <div>
        <label className="app-form-label" htmlFor="description">Evidence and context</label>
        <textarea className="app-form-control min-h-36 resize-y" id="description" name="description" placeholder="What happened, who reported it, and why does it matter?" required />
        <FieldError errors={state.fieldErrors?.description} />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="app-form-label" htmlFor="priority">Priority</label>
          <select className="app-form-control" id="priority" name="priority" defaultValue="medium">
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="app-form-label" htmlFor="source">Source</label>
          <select className="app-form-control" id="source" name="source" defaultValue="internal">
            <option value="internal">Internal note</option><option value="email">Email</option><option value="support">Support</option><option value="call">Call</option><option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="app-form-label" htmlFor="customerId">Customer</label>
          <select className="app-form-control" id="customerId" name="customerId" defaultValue="">
            <option value="">No customer attached</option>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.company || customer.name}</option>)}
          </select>
        </div>
      </div>
      {state.status === "error" && <p className="border-l-4 border-[var(--coral-500)] pl-3 text-sm" role="alert">{state.message}</p>}
      <button className="button button-primary min-h-12 justify-self-start" type="submit" disabled={pending}>
        <RadioTower aria-hidden="true" size={19} /> {pending ? "Capturing Signal…" : "Publish to Signal Feed"}
      </button>
    </form>
  );
}
