import type { Metadata } from "next";
import { ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/workspace/page-header";
import { getAccount, getMembers } from "@/lib/rails-api";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage() {
  const account = await getAccount();
  const result = await getMembers(account!.workspaces[0].id);
  const members = result?.members ?? [];
  return (
    <>
      <PageHeader eyebrow="MEMBERS / ACCESS BOUNDARY" title="The people inside the room." description="See exactly who belongs to this workspace and which role defines their access." />
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
        <section className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)]">
          <div className="flex min-h-14 items-center justify-between border-b-2 border-[var(--ink-950)] px-4 md:px-5"><h2 className="font-display text-lg font-bold">Workspace members</h2><span className="font-mono text-[10px] text-[var(--ink-600)]">{members.length} ACTIVE</span></div>
          <div className="divide-y-2 divide-[var(--ink-950)]">
            {members.map((member) => {
              const name = member.user.display_name || member.user.email.split("@")[0];
              const initials = name.split(/\s/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
              return <article key={member.id} className="grid gap-4 px-4 py-5 md:grid-cols-[48px_minmax(0,1fr)_150px_130px] md:items-center md:px-5"><span className="flex size-11 items-center justify-center bg-[var(--magenta-500)] font-mono text-xs font-medium">{initials}</span><div><h3 className="font-display text-lg font-bold">{name}</h3><p className="text-sm text-[var(--ink-600)]">{member.user.email}</p></div><span className="flex w-fit items-center gap-2 border border-[var(--ink-950)] bg-[var(--acid-400)] px-2 py-1 font-mono text-[10px]"><ShieldCheck aria-hidden="true" size={14} /> {member.role.toUpperCase()}</span><time className="font-mono text-[10px] text-[var(--ink-600)]" dateTime={member.joined_at}>JOINED {new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(member.joined_at)).toUpperCase()}</time></article>;
            })}
          </div>
          {!members.length && <div className="grid min-h-[260px] place-items-center p-6 text-center"><Users className="text-[var(--cobalt-500)]" size={42} /><p>No members found.</p></div>}
        </section>
      </div>
    </>
  );
}
