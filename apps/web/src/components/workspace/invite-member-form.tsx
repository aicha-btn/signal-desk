"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { inviteMember, type InvitationFormState } from "@/app/(workspace)/members/actions";
import { DesignSelect } from "@/components/ui/design-select";
import { PendingButtonContent } from "@/components/ui/pending-feedback";

const initialState: InvitationFormState = { status: "idle", message: "" };

export function InviteMemberForm({ workspaceId, currentRole }: { workspaceId: number; currentRole: "owner" | "admin" }) {
  const [state, formAction, pending] = useActionState(inviteMember, initialState);
  const roleOptions = currentRole === "owner"
    ? [{ value: "member", label: "Member" }, { value: "admin", label: "Admin" }]
    : [{ value: "member", label: "Member" }];

  return (
    <form action={formAction} className="grid gap-4 lg:grid-cols-[minmax(260px,1fr)_220px_auto] lg:items-end" noValidate>
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <div>
        <label className="app-form-label" htmlFor="invitation-email">Work email</label>
        <input id="invitation-email" className="app-form-control" name="email" type="email" autoComplete="email" placeholder="colleague@company.com" required />
        {state.fieldErrors?.email?.[0] && <p className="mt-1 text-sm text-[var(--coral-500)]">{state.fieldErrors.email[0]}</p>}
      </div>
      <div>
        <label className="app-form-label" htmlFor="invitation-role">Access role</label>
        <DesignSelect id="invitation-role" name="role" defaultValue="member" options={roleOptions} ariaLabel="Invitation role" />
      </div>
      <button className="button button-primary min-w-[190px]" type="submit" disabled={pending} aria-busy={pending}>
        <PendingButtonContent pending={pending} idleLabel="Send invitation" pendingLabel="Sending signal..." idleIcon={<Send aria-hidden="true" size={18} />} />
      </button>
      {state.status === "error" && (
        <p className="border-l-4 border-[var(--coral-500)] pl-3 text-sm lg:col-span-3" role="alert">{state.message}</p>
      )}
    </form>
  );
}
