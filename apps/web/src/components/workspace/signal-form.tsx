"use client";

import { useActionState } from "react";
import { RadioTower } from "lucide-react";
import { createSignal, type SignalFormState } from "@/app/(workspace)/signals/new/actions";
import { PendingButtonContent } from "@/components/ui/pending-feedback";
import { DesignSelect } from "@/components/ui/design-select";
import { TagSelector } from "@/components/workspace/tag-selector";
import type { Customer, Tag } from "@/lib/rails-api";

const initialState: SignalFormState = { status: "idle", message: "" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-[var(--coral-500)]">{errors[0]}</p>;
}

export function SignalForm({ workspaceId, customers, tags }: { workspaceId: number; customers: Customer[]; tags: Tag[] }) {
  const [state, formAction, pending] = useActionState(createSignal, initialState);

  return (
    <form action={formAction} onReset={(event) => event.preventDefault()} className="grid gap-6" noValidate>
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
          <DesignSelect id="priority" name="priority" defaultValue="medium" options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }, { value: "critical", label: "Critical" }]} />
        </div>
        <div>
          <label className="app-form-label" htmlFor="source">Source</label>
          <DesignSelect id="source" name="source" defaultValue="internal" options={[{ value: "internal", label: "Internal note" }, { value: "email", label: "Email" }, { value: "support", label: "Support" }, { value: "call", label: "Call" }, { value: "other", label: "Other" }]} />
        </div>
        <div>
          <label className="app-form-label" htmlFor="customerId">Customer</label>
          <DesignSelect id="customerId" name="customerId" defaultValue="" options={[{ value: "", label: "No customer attached" }, ...customers.map((customer) => ({ value: String(customer.id), label: customer.company || customer.name }))]} />
        </div>
      </div>
      <TagSelector tags={tags} />
      {state.status === "error" && <p className="border-l-4 border-[var(--coral-500)] pl-3 text-sm" role="alert">{state.message}</p>}
      <button className="button button-primary min-h-12 justify-self-start" type="submit" disabled={pending} aria-busy={pending}>
        <PendingButtonContent pending={pending} idleLabel="Publish to Signal Feed" pendingLabel="Capturing Signal..." idleIcon={<RadioTower aria-hidden="true" size={19} />} />
      </button>
    </form>
  );
}
