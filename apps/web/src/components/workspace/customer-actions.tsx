"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCustomer } from "@/app/(workspace)/customers/actions";

function DeleteCustomerButton({ name }: { name: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="grid size-11 place-items-center border-2 border-[var(--ink-950)] text-[var(--coral-500)] transition-colors hover:bg-[var(--coral-500)] hover:text-[var(--paper-0)] disabled:cursor-wait disabled:opacity-70"
      type="submit"
      disabled={pending}
      aria-label={`Delete ${name}`}
      title={`Delete ${name}`}
    >
      {pending ? <span className="signal-pending-mark" aria-hidden="true"><span /><span /><span /></span> : <Trash2 aria-hidden="true" size={18} />}
    </button>
  );
}

export function CustomerActions({ workspaceId, customerId, name, signalsCount }: { workspaceId: number; customerId: number; name: string; signalsCount: number }) {
  return (
    <div className="flex items-center gap-2 md:justify-end">
      <Link
        className="grid size-11 place-items-center border-2 border-[var(--ink-950)] transition-colors hover:bg-[var(--acid-400)]"
        href={`/customers/${customerId}`}
        aria-label={`Edit ${name}`}
        title={`Edit ${name}`}
      >
        <Pencil aria-hidden="true" size={18} />
      </Link>
      <form
        action={deleteCustomer}
        onSubmit={(event) => {
          const attached = `${signalsCount} attached Signal${signalsCount === 1 ? "" : "s"}`;
          if (!window.confirm(`Delete "${name}"? ${attached} will be kept without a customer.`)) event.preventDefault();
        }}
      >
        <input type="hidden" name="workspaceId" value={workspaceId} />
        <input type="hidden" name="customerId" value={customerId} />
        <DeleteCustomerButton name={name} />
      </form>
    </div>
  );
}
