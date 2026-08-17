"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { PendingButtonContent } from "@/components/ui/pending-feedback";
import {
  createWorkspace,
  type OnboardingState,
} from "@/app/onboarding/actions";

const initialOnboardingState: OnboardingState = { status: "idle", message: "" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-[var(--coral-500)]">{errors[0]}</p>;
}

export function OnboardingForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, pending] = useActionState(
    createWorkspace,
    initialOnboardingState,
  );

  return (
    <form action={formAction} onReset={(event) => event.preventDefault()} className="mt-10 max-w-[560px]" noValidate>
      <div className="grid gap-6">
        <div>
          <label className="app-form-label" htmlFor="displayName">Your name</label>
          <input className="app-form-control" id="displayName" name="displayName" autoComplete="name" defaultValue={defaultName} required />
          <FieldError errors={state.fieldErrors?.displayName} />
        </div>
        <div>
          <label className="app-form-label" htmlFor="workspaceName">Workspace name</label>
          <input className="app-form-control" id="workspaceName" name="workspaceName" autoComplete="organization" placeholder="Acme Product Team" required />
          <FieldError errors={state.fieldErrors?.workspaceName} />
          <p className="mt-2 text-sm leading-5 text-[var(--ink-600)]">
            Usually your company or product team. You can rename it later.
          </p>
        </div>
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p className="mt-5 border-l-4 border-[var(--coral-500)] pl-3 text-sm" role="alert">{state.message}</p>
      )}

      <button className="button button-primary mt-8 min-h-12" type="submit" disabled={pending} aria-busy={pending}>
        <PendingButtonContent pending={pending} idleLabel="Open the Control Room" pendingLabel="Building the room..." idleIcon={<ArrowRight aria-hidden="true" size={19} />} />
      </button>
    </form>
  );
}
