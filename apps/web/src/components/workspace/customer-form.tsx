"use client";

import { useActionState } from "react";
import { Building2 } from "lucide-react";
import { createCustomer, type CustomerFormState } from "@/app/(workspace)/customers/actions";

const initialState: CustomerFormState = { status: "idle", message: "" };

export function CustomerForm({ workspaceId }: { workspaceId: number }) {
  const [state, formAction, pending] = useActionState(createCustomer, initialState);
  return (
    <form action={formAction} className="grid gap-6" noValidate>
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <Field label="Customer name" name="name" placeholder="Maya Chen" errors={state.fieldErrors?.name} />
      <Field label="Company" name="company" placeholder="Northstar" errors={state.fieldErrors?.company} />
      <Field label="Email (optional)" name="email" type="email" placeholder="maya@northstar.com" errors={state.fieldErrors?.email} />
      {state.status === "error" && <p className="border-l-4 border-[var(--coral-500)] pl-3 text-sm" role="alert">{state.message}</p>}
      <button className="button button-primary min-h-12 justify-self-start" type="submit" disabled={pending}><Building2 aria-hidden="true" size={19} /> {pending ? "Creating customer…" : "Create customer"}</button>
    </form>
  );
}

function Field({ label, name, placeholder, type = "text", errors }: { label: string; name: string; placeholder: string; type?: string; errors?: string[] }) {
  return <div><label className="app-form-label" htmlFor={name}>{label}</label><input className="app-form-control" id={name} name={name} type={type} placeholder={placeholder} />{errors?.[0] && <p className="mt-1 text-sm text-[var(--coral-500)]">{errors[0]}</p>}</div>;
}
