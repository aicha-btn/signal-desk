import type { Metadata } from "next";
import { Clock3, MailCheck, ShieldCheck, Users } from "lucide-react";
import { cancelInvitation } from "@/app/(workspace)/members/actions";
import { CancelInvitationButton } from "@/components/workspace/cancel-invitation-button";
import { InviteMemberForm } from "@/components/workspace/invite-member-form";
import { PageHeader } from "@/components/workspace/page-header";
import { getAccount, getInvitations, getMembers } from "@/lib/rails-api";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ invited?: string; cancelled?: string }>;
}) {
  const account = await getAccount();
  const workspace = account!.workspaces[0];
  const canManage = workspace.role === "owner" || workspace.role === "admin";
  const managerRole = workspace.role === "owner" ? "owner" : workspace.role === "admin" ? "admin" : null;
  const [memberResult, invitationResult, notices] = await Promise.all([
    getMembers(workspace.id),
    canManage ? getInvitations(workspace.id) : Promise.resolve(null),
    searchParams,
  ]);
  const members = memberResult?.members ?? [];
  const invitations = invitationResult?.invitations ?? [];

  return (
    <>
      <PageHeader
        eyebrow="MEMBERS / ACCESS BOUNDARY"
        title="The people inside the room."
        description="Invite the right voices, assign explicit roles and keep workspace access inspectable."
      />
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
        {notices.invited === "1" && (
          <p className="flex items-center gap-3 border-2 border-[var(--ink-950)] bg-[var(--acid-400)] px-4 py-3 font-semibold" role="status">
            <MailCheck aria-hidden="true" size={20} /> Invitation sent. The private link remains valid for seven days.
          </p>
        )}
        {notices.cancelled === "1" && (
          <p className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)] px-4 py-3 font-semibold" role="status">Invitation cancelled.</p>
        )}

        {canManage ? (
          <section className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)]">
            <div className="border-b-2 border-[var(--ink-950)] bg-[var(--cobalt-500)] px-4 py-5 text-[var(--paper-0)] md:px-5">
              <p className="eyebrow mb-2 text-[var(--acid-400)]">OPEN A SEAT</p>
              <h2 className="font-display text-2xl font-bold">Invite someone into the signal.</h2>
            </div>
            <div className="p-4 md:p-5">
              <InviteMemberForm workspaceId={workspace.id} currentRole={managerRole!} />
              <p className="mt-4 font-mono text-[10px] text-[var(--ink-600)]">
                {workspace.role === "owner" ? "OWNERS CAN INVITE ADMINS OR MEMBERS" : "ADMINS CAN INVITE MEMBERS"} / EMAIL VERIFIED ON ACCEPTANCE
              </p>
            </div>
          </section>
        ) : (
          <section className="flex items-start gap-4 border-y-2 border-[var(--ink-950)] bg-[var(--acid-400)] px-4 py-5 md:px-5">
            <ShieldCheck aria-hidden="true" className="shrink-0" size={28} />
            <div><h2 className="font-display text-xl font-bold">Access stays deliberate.</h2><p className="mt-1 text-sm">Owners and admins manage invitations. Your member access remains unchanged.</p></div>
          </section>
        )}

        {canManage && (
          <section className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)]">
            <div className="flex min-h-14 items-center justify-between border-b-2 border-[var(--ink-950)] px-4 md:px-5">
              <h2 className="font-display text-lg font-bold">Pending invitations</h2>
              <span className="font-mono text-[10px] text-[var(--ink-600)]">{invitations.length} OPEN</span>
            </div>
            {invitations.length ? (
              <div className="divide-y-2 divide-[var(--ink-950)]">
                {invitations.map((invitation) => (
                  <article key={invitation.id} className="grid gap-4 px-4 py-5 md:grid-cols-[minmax(0,1fr)_140px_190px_auto] md:items-center md:px-5">
                    <div className="min-w-0"><p className="truncate font-display text-lg font-bold">{invitation.email}</p><p className="mt-1 font-mono text-[10px] text-[var(--ink-600)]">INVITED BY {(invitation.invited_by.display_name || invitation.invited_by.email).toUpperCase()}</p></div>
                    <span className="flex w-fit items-center gap-2 border border-[var(--ink-950)] bg-[var(--magenta-500)] px-2 py-1 font-mono text-[10px]"><ShieldCheck aria-hidden="true" size={14} /> {invitation.role.toUpperCase()}</span>
                    <time className="flex items-center gap-2 font-mono text-[10px] text-[var(--ink-600)]" dateTime={invitation.expires_at}><Clock3 aria-hidden="true" size={14} /> EXPIRES {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(invitation.expires_at)).toUpperCase()}</time>
                    <form action={cancelInvitation}>
                      <input type="hidden" name="workspaceId" value={workspace.id} />
                      <input type="hidden" name="invitationId" value={invitation.id} />
                      <CancelInvitationButton />
                    </form>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[150px] items-center justify-center gap-3 p-6 text-center text-[var(--ink-600)]"><MailCheck aria-hidden="true" size={24} /><p>No invitation is waiting.</p></div>
            )}
          </section>
        )}

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
