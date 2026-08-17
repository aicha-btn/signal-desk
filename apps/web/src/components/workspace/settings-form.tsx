"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateWorkspace, type SettingsFormState } from "@/app/(workspace)/settings/actions";
import type { Workspace } from "@/lib/rails-api";

const initialState: SettingsFormState = { status: "idle", message: "" };

export function SettingsForm({ workspace }: { workspace: Workspace }) {
  const [state, formAction, pending] = useActionState(updateWorkspace, initialState);
  return (
    <form action={formAction} className="grid gap-6" noValidate>
      <input type="hidden" name="workspaceId" value={workspace.id} />
      <div><label className="app-form-label" htmlFor="name">Workspace name</label><input className="app-form-control" id="name" name="name" defaultValue={workspace.name} />{state.fieldErrors?.name?.[0] && <p className="mt-1 text-sm text-[var(--coral-500)]">{state.fieldErrors.name[0]}</p>}</div>
      <div><p className="app-form-label">Workspace slug</p><p className="border-2 border-[var(--ink-300)] bg-[var(--canvas-50)] px-3 py-3 font-mono text-sm text-[var(--ink-600)]">{workspace.slug}</p><p className="mt-2 text-sm text-[var(--ink-600)]">Stable identifier used by integrations and URLs.</p></div>
      {state.message && <p className={`border-l-4 pl-3 text-sm ${state.status === "success" ? "border-[var(--mint-500)]" : "border-[var(--coral-500)]"}`} role="status">{state.message}</p>}
      <button className="button button-primary min-h-12 justify-self-start" type="submit" disabled={pending}><Save aria-hidden="true" size={18} /> {pending ? "Saving…" : "Save settings"}</button>
    </form>
  );
}
