"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Check, Copy, ExternalLink, RadioTower } from "lucide-react";
import { updatePublicForm, type SettingsFormState } from "@/app/(workspace)/settings/actions";
import { PendingButtonContent } from "@/components/ui/pending-feedback";
import type { Workspace } from "@/lib/rails-api";

const initialState: SettingsFormState = { status: "idle", message: "" };

export function PublicFormSettings({ workspace, publicFormUrl, canManage }: { workspace: Workspace; publicFormUrl: string; canManage: boolean }) {
  const [state, formAction, pending] = useActionState(updatePublicForm, initialState);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicFormUrl);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  };

  return (
    <div className="grid gap-6">
      <form action={formAction} className="grid gap-6">
        <input type="hidden" name="workspaceId" value={workspace.id} />
        <input type="hidden" name="publicFormEnabled" value="false" />
        <label className="flex min-h-20 cursor-pointer items-center justify-between gap-5 border-2 border-[var(--ink-950)] bg-[var(--canvas-50)] p-4 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-[var(--cobalt-500)]">
          <span><span className="flex items-center gap-2 font-display text-lg font-bold"><RadioTower aria-hidden="true" size={20} /> Public Signal line</span><span className="mt-1 block text-sm text-[var(--ink-600)]">Allow anyone with the link to send a Signal without an account.</span></span>
          <span className="relative h-8 w-14 shrink-0 border-2 border-[var(--ink-950)] bg-[var(--paper-0)]">
            <input className="peer sr-only" type="checkbox" name="publicFormEnabled" value="true" defaultChecked={workspace.public_form_enabled} disabled={!canManage} />
            <span className="absolute top-0.5 left-0.5 size-6 bg-[var(--ink-950)] transition-transform peer-checked:translate-x-6 peer-checked:bg-[var(--cobalt-500)]" />
          </span>
        </label>
        {state.message && <p className={`border-l-4 pl-3 text-sm ${state.status === "success" ? "border-[var(--mint-500)]" : "border-[var(--coral-500)]"}`} role="status">{state.message}</p>}
        {canManage && <button className="button button-primary min-h-12 justify-self-start" type="submit" disabled={pending} aria-busy={pending}><PendingButtonContent pending={pending} idleLabel="Save public access" pendingLabel="Updating access..." idleIcon={<RadioTower aria-hidden="true" size={18} />} /></button>}
      </form>

      <div className="border-t-2 border-[var(--ink-950)] pt-6">
        <p className="app-form-label">Public URL</p>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_44px_auto]">
          <p className="min-w-0 truncate border-2 border-[var(--ink-300)] bg-[var(--paper-0)] px-3 py-3 font-mono text-xs">{publicFormUrl}</p>
          <button className="button button-secondary size-11 p-0" type="button" onClick={copyUrl} title="Copy public form URL" aria-label={copyStatus === "copied" ? "Public form URL copied" : "Copy public form URL"}>{copyStatus === "copied" ? <Check aria-hidden="true" size={18} /> : <Copy aria-hidden="true" size={18} />}</button>
          {workspace.public_form_enabled ? <Link className="button button-secondary min-h-11" href={`/forms/${workspace.slug}`} target="_blank">Preview <ExternalLink aria-hidden="true" size={17} /></Link> : <span className="button button-secondary min-h-11 cursor-not-allowed opacity-50" aria-disabled="true" title="Enable public access before previewing">Preview <ExternalLink aria-hidden="true" size={17} /></span>}
        </div>
        <p className={`mt-2 min-h-5 text-xs ${copyStatus === "error" ? "text-[var(--coral-500)]" : "text-[var(--ink-600)]"}`} role="status" aria-live="polite">{copyStatus === "copied" ? "Public URL copied." : copyStatus === "error" ? "The URL could not be copied." : ""}</p>
        <p className="mt-3 font-mono text-[10px] text-[var(--ink-600)]">HONEYPOT + STRICT LIMITS + 5 SUBMISSIONS / 10 MINUTES / CONNECTION</p>
      </div>
    </div>
  );
}
