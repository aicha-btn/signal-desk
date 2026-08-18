"use client";

import { useActionState } from "react";
import { Building2, Save } from "lucide-react";
import { createCustomer, updateCustomer, type CustomerFormState } from "@/app/(workspace)/customers/actions";
import { PendingButtonContent } from "@/components/ui/pending-feedback";
import type { Customer } from "@/lib/rails-api";

const initialState: CustomerFormState = { status: "idle", message: "" };

export function CustomerForm({ workspaceId, customer }: { workspaceId: number; customer?: Customer }) {
  const [state, formAction, pending] = useActionState(customer ? updateCustomer : createCustomer, initialState);
  return (
    <form action={formAction} onReset={(event) => event.preventDefault()} className="grid gap-6" noValidate>
      <input type="hidden" name="workspaceId" value={workspaceId} />
      {customer && <input type="hidden" name="customerId" value={customer.id} />}
      <Field label="Customer name" name="name" placeholder="Maya Chen" defaultValue={customer?.name} errors={state.fieldErrors?.name} />
      <Field label="Company" name="company" placeholder="Northstar" defaultValue={customer?.company ?? ""} errors={state.fieldErrors?.company} />
      <Field label="Email (optional)" name="email" type="email" placeholder="maya@northstar.com" defaultValue={customer?.email ?? ""} errors={state.fieldErrors?.email} />
      {state.status === "error" && <p className="border-l-4 border-[var(--coral-500)] pl-3 text-sm" role="alert">{state.message}</p>}
      <button className="button button-primary min-h-12 justify-self-start" type="submit" disabled={pending} aria-busy={pending}><PendingButtonContent pending={pending} idleLabel={customer ? "Save customer" : "Create customer"} pendingLabel={customer ? "Saving customer..." : "Creating customer..."} idleIcon={customer ? <Save aria-hidden="true" size={19} /> : <Building2 aria-hidden="true" size={19} />} /></button>
    </form>
  );
}

function Field({ label, name, placeholder, type = "text", defaultValue, errors }: { label: string; name: string; placeholder: string; type?: string; defaultValue?: string; errors?: string[] }) {
  return <div><label className="app-form-label" htmlFor={name}>{label}</label><input className="app-form-control" id={name} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} />{errors?.[0] && <p className="mt-1 text-sm text-[var(--coral-500)]">{errors[0]}</p>}</div>;
}
