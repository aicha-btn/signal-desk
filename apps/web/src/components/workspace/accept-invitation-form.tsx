"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { acceptInvitation, type AcceptanceState } from "@/app/invitations/[token]/actions";
import { PendingButtonContent } from "@/components/ui/pending-feedback";

const initialState: AcceptanceState = { status: "idle", message: "" };

export function AcceptInvitationForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(acceptInvitation, initialState);
  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />
      <button className="button button-primary w-full md:w-auto" type="submit" disabled={pending} aria-busy={pending}>
        <PendingButtonContent pending={pending} idleLabel="Join the workspace" pendingLabel="Opening your seat..." idleIcon={<ArrowRight aria-hidden="true" size={19} />} />
      </button>
      {state.status === "error" && <p className="mt-4 border-l-4 border-[var(--coral-500)] pl-3 text-sm" role="alert">{state.message}</p>}
    </form>
  );
}
