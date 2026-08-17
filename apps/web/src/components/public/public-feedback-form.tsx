"use client";

import { useState, type FormEvent } from "react";
import { Check, RotateCcw, Send } from "lucide-react";
import { PendingButtonContent } from "@/components/ui/pending-feedback";

type SubmissionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const initialState: SubmissionState = { status: "idle", message: "" };

export function PublicFeedbackForm({ apiUrl, slug }: { apiUrl: string; slug: string }) {
  const [state, setState] = useState(initialState);
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    setPending(true);
    setState(initialState);

    try {
      const response = await fetch(`${apiUrl}/api/v1/public/forms/${encodeURIComponent(slug)}/feedbacks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json() as { error?: { message?: string; details?: Record<string, string[]> } };

      if (!response.ok) {
        setState({
          status: "error",
          message: body.error?.message ?? "Your Signal could not be sent. Try again.",
          fieldErrors: body.error?.details,
        });
        return;
      }

      setState({ status: "success", message: "Your Signal is now inside the room." });
    } catch {
      setState({ status: "error", message: "The Signal line is temporarily unavailable. Try again shortly." });
    } finally {
      setPending(false);
    }
  };

  if (state.status === "success") {
    return (
      <div className="border-y-2 border-[var(--ink-950)] bg-[var(--acid-400)] py-8" role="status">
        <span className="mb-6 flex size-12 items-center justify-center border-2 border-[var(--ink-950)] bg-[var(--paper-0)]"><Check aria-hidden="true" size={26} strokeWidth={3} /></span>
        <p className="eyebrow mb-3">SIGNAL RECEIVED</p>
        <h2 className="max-w-md font-display text-4xl font-bold leading-none">Thank you. The team can act on it now.</h2>
        <p className="mt-4 max-w-md leading-6">{state.message}</p>
        <button className="button button-dark mt-7" type="button" onClick={() => setState(initialState)}><RotateCcw aria-hidden="true" size={17} /> Send another Signal</button>
      </div>
    );
  }

  return (
    <form className="grid gap-6" onSubmit={submit} noValidate>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      </div>

      <div>
        <label className="app-form-label" htmlFor="public-title">What happened? *</label>
        <input className="app-form-control" id="public-title" name="title" minLength={5} maxLength={160} placeholder="A short, specific summary" required aria-invalid={Boolean(state.fieldErrors?.title)} />
        {state.fieldErrors?.title?.[0] && <p className="mt-1 text-sm text-[var(--coral-500)]">{state.fieldErrors.title[0]}</p>}
      </div>

      <div>
        <label className="app-form-label" htmlFor="public-description">Give us the useful context. *</label>
        <textarea className="app-form-control min-h-40 resize-y py-3" id="public-description" name="description" minLength={20} maxLength={4000} placeholder="What were you trying to do, what got in the way, and what would better look like?" required aria-invalid={Boolean(state.fieldErrors?.description)} />
        {state.fieldErrors?.description?.[0] && <p className="mt-1 text-sm text-[var(--coral-500)]">{state.fieldErrors.description[0]}</p>}
      </div>

      <fieldset className="grid gap-4 border-t-2 border-[var(--ink-950)] pt-6 sm:grid-cols-2">
        <legend className="mb-4 font-display text-lg font-bold">Stay reachable <span className="font-normal text-[var(--ink-600)]">(optional)</span></legend>
        <div><label className="app-form-label" htmlFor="public-name">Your name</label><input className="app-form-control" id="public-name" name="name" maxLength={100} autoComplete="name" placeholder="Maya Chen" />{state.fieldErrors?.name?.[0] && <p className="mt-1 text-sm text-[var(--coral-500)]">{state.fieldErrors.name[0]}</p>}</div>
        <div><label className="app-form-label" htmlFor="public-company">Company</label><input className="app-form-control" id="public-company" name="company" maxLength={100} autoComplete="organization" placeholder="Northstar" />{state.fieldErrors?.company?.[0] && <p className="mt-1 text-sm text-[var(--coral-500)]">{state.fieldErrors.company[0]}</p>}</div>
        <div className="sm:col-span-2"><label className="app-form-label" htmlFor="public-email">Work email</label><input className="app-form-control" id="public-email" name="email" type="email" maxLength={254} autoComplete="email" placeholder="maya@company.com" aria-invalid={Boolean(state.fieldErrors?.email)} />{state.fieldErrors?.email?.[0] && <p className="mt-1 text-sm text-[var(--coral-500)]">{state.fieldErrors.email[0]}</p>}<p className="mt-2 text-xs leading-5 text-[var(--ink-600)]">Only provide an email if the team may contact you about this Signal.</p></div>
      </fieldset>

      {state.status === "error" && <p className="border-l-4 border-[var(--coral-500)] pl-3 text-sm" role="alert">{state.message}</p>}
      <button className="button button-primary min-h-12 w-full sm:w-auto sm:justify-self-start" type="submit" disabled={pending} aria-busy={pending}>
        <PendingButtonContent pending={pending} idleLabel="Send the Signal" pendingLabel="Sending Signal..." idleIcon={<Send aria-hidden="true" size={18} />} />
      </button>
    </form>
  );
}
