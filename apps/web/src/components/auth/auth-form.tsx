"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { PendingButtonContent } from "@/components/ui/pending-feedback";
import {
  signIn,
  signUp,
  type AuthFormState,
} from "@/app/login/actions";

type Mode = "login" | "signup";
const initialAuthFormState: AuthFormState = { status: "idle", message: "" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-[var(--coral-500)]">{errors[0]}</p>;
}

export function AuthForm({ mode, nextPath }: { mode: Mode; nextPath?: string }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initialAuthFormState);

  if (state.status === "success") {
    return (
      <div className="border-y-2 border-[var(--ink-950)] bg-[var(--acid-400)] py-8" role="status">
        <Check aria-hidden="true" className="mb-6" size={32} strokeWidth={2.4} />
        <h2 className="font-display text-3xl font-bold">Signal sent.</h2>
        <p className="mt-3 max-w-md leading-6">{state.message}</p>
        <Link className="button button-dark mt-6" href={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login"}>
          Return to sign in <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} onReset={(event) => event.preventDefault()} noValidate>
      {nextPath && <input type="hidden" name="nextPath" value={nextPath} />}
      <div className="mb-8 flex border-2 border-[var(--ink-950)]" aria-label="Authentication mode">
        <Link
          href={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login"}
          className={`flex min-h-11 flex-1 items-center justify-center border-r-2 border-[var(--ink-950)] text-sm font-bold ${mode === "login" ? "bg-[var(--ink-950)] text-[var(--paper-0)]" : "bg-[var(--paper-0)]"}`}
        >
          Sign in
        </Link>
        <Link
          href={nextPath ? `/login?mode=signup&next=${encodeURIComponent(nextPath)}` : "/login?mode=signup"}
          className={`flex min-h-11 flex-1 items-center justify-center text-sm font-bold ${mode === "signup" ? "bg-[var(--ink-950)] text-[var(--paper-0)]" : "bg-[var(--paper-0)]"}`}
        >
          Create account
        </Link>
      </div>

      <div className="grid gap-5">
        {mode === "signup" && (
          <div>
            <label className="app-form-label" htmlFor="displayName">Your name</label>
            <input className="app-form-control" id="displayName" name="displayName" autoComplete="name" placeholder="Aicha Ben" required />
            <FieldError errors={state.fieldErrors?.displayName} />
          </div>
        )}

        <div>
          <label className="app-form-label" htmlFor="email">Work email</label>
          <input className="app-form-control" id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
          <FieldError errors={state.fieldErrors?.email} />
        </div>

        <div>
          <label className="app-form-label" htmlFor="password">Password</label>
          <input className="app-form-control" id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="8 characters minimum" required />
          <FieldError errors={state.fieldErrors?.password} />
        </div>

        {mode === "signup" && (
          <div>
            <label className="app-form-label" htmlFor="passwordConfirmation">Confirm password</label>
            <input className="app-form-control" id="passwordConfirmation" name="passwordConfirmation" type="password" autoComplete="new-password" placeholder="Repeat your password" required />
            <FieldError errors={state.fieldErrors?.passwordConfirmation} />
          </div>
        )}
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p className="mt-5 border-l-4 border-[var(--coral-500)] pl-3 text-sm leading-5" role="alert">{state.message}</p>
      )}

      <button className="button button-primary mt-7 w-full" type="submit" disabled={pending} aria-busy={pending}>
        <PendingButtonContent
          pending={pending}
          idleLabel={mode === "login" ? "Enter the Control Room" : "Create my workspace"}
          pendingLabel={mode === "login" ? "Opening the line..." : "Creating workspace..."}
          idleIcon={<ArrowRight aria-hidden="true" size={19} />}
        />
      </button>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[var(--ink-600)]">
        <LockKeyhole aria-hidden="true" size={14} />
        Authentication secured by Supabase
      </p>
    </form>
  );
}
