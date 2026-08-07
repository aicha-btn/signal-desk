"use client";

import { useActionState } from "react";
import { ArrowRight, Check } from "lucide-react";
import {
  initialLeadFormState,
  joinEarlyAccess,
} from "@/app/actions/early-access";

function FieldError({ errors, id }: { errors?: string[]; id?: string }) {
  if (!errors?.length) return null;

  return <p id={id} className="mt-1 text-sm text-[var(--acid-400)]">{errors[0]}</p>;
}

export function LeadForm() {
  const [state, formAction, pending] = useActionState(
    joinEarlyAccess,
    initialLeadFormState,
  );

  if (state.status === "success") {
    return (
      <div className="border-2 border-[var(--paper-0)] bg-[var(--acid-400)] p-6 text-[var(--ink-950)]" role="status">
        <span className="mb-8 flex size-11 items-center justify-center border-2 border-[var(--ink-950)]">
          <Check aria-hidden="true" size={24} strokeWidth={2.6} />
        </span>
        <p className="font-mono text-xs font-medium">SIGNAL RECEIVED</p>
        <p className="mt-3 font-display text-3xl font-bold leading-tight">You&apos;re on the list.</p>
        <p className="mt-3 leading-6">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="border-t-2 border-[var(--paper-0)] pt-6" noValidate>
      <p className="mb-6 text-lg leading-7">
        Join the founding list. No payment, no commitment, no automated sales sequence.
      </p>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5">
        <div>
          <label className="form-label" htmlFor="email">Work email *</label>
          <input
            className="form-control"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
            required
          />
          <FieldError id="email-error" errors={state.fieldErrors?.email} />
        </div>

        <div>
          <label className="form-label" htmlFor="company">Company</label>
          <input
            className="form-control"
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Your company"
          />
          <FieldError errors={state.fieldErrors?.company} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="role">Your role</label>
            <select className="form-control" id="role" name="role" defaultValue="">
              <option value="">Choose</option>
              <option value="product">Product</option>
              <option value="support">Support</option>
              <option value="leadership">Leadership</option>
              <option value="founder">Founder</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="teamSize">Team size</label>
            <select className="form-control" id="teamSize" name="teamSize" defaultValue="">
              <option value="">Choose</option>
              <option value="1-10">1–10</option>
              <option value="11-50">11–50</option>
              <option value="51-200">51–200</option>
              <option value="201-1000">201–1,000</option>
              <option value="1000+">1,000+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-5" htmlFor="consent">
            <input className="mt-1 size-4 shrink-0 accent-[var(--acid-400)]" id="consent" name="consent" type="checkbox" required />
            <span>I agree that SignalDesk may contact me about early access. *</span>
          </label>
          <FieldError errors={state.fieldErrors?.consent} />
        </div>
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p className="mt-5 border-l-4 border-[var(--acid-400)] pl-3 text-sm" role="alert">{state.message}</p>
      )}

      <button className="button mt-6 min-h-12 w-full bg-[var(--acid-400)] text-[var(--ink-950)] hover:bg-[var(--paper-0)]" type="submit" disabled={pending}>
        {pending ? "Sending signal…" : "Join early access"}
        {!pending && <ArrowRight aria-hidden="true" size={19} strokeWidth={2.4} />}
      </button>
      <p className="mt-3 font-mono text-[10px] leading-4 text-[var(--paper-0)]">
        FOUNDING ACCESS · UNSUBSCRIBE ANYTIME
      </p>
    </form>
  );
}
