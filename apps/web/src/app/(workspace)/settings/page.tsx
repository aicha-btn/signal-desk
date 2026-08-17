import type { Metadata } from "next";
import { PageHeader } from "@/components/workspace/page-header";
import { SettingsForm } from "@/components/workspace/settings-form";
import { TagManager } from "@/components/workspace/tag-manager";
import { getAccount, getTags } from "@/lib/rails-api";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const account = await getAccount();
  const workspace = account!.workspaces[0];
  const tagResult = await getTags(workspace.id);
  return (
    <>
      <PageHeader eyebrow="SETTINGS / WORKSPACE" title="Keep the room legible." description="Manage the stable identity of this workspace. Permission-sensitive controls stay explicit and separate." />
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,720px)_minmax(260px,1fr)]">
        <div className="grid gap-8">
          <section className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-5 md:p-7"><h2 className="mb-7 font-display text-2xl font-bold">Workspace identity</h2><SettingsForm workspace={workspace} /></section>
          <section className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-5 md:p-7"><h2 className="mb-2 font-display text-2xl font-bold">Signal tags</h2><p className="mb-7 text-sm leading-6 text-[var(--ink-600)]">Keep the vocabulary short, shared and useful across the feed.</p><TagManager workspaceId={workspace.id} tags={tagResult?.tags ?? []} /></section>
        </div>
        <aside className="self-start border-2 border-[var(--ink-950)] bg-[var(--canvas-50)] p-5"><p className="eyebrow">CURRENT ACCESS</p><p className="mt-6 font-display text-2xl font-bold capitalize">{workspace.role}</p><p className="mt-2 text-sm leading-6 text-[var(--ink-600)]">Signed in as {account!.user.email}. Owners can update workspace identity and future access controls.</p></aside>
      </div>
    </>
  );
}
