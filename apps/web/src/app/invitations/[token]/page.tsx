import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, KeyRound, ShieldCheck } from "lucide-react";
import { AcceptInvitationForm } from "@/components/workspace/accept-invitation-form";
import { RailsApiError, getInvitation, type WorkspaceInvitation } from "@/lib/rails-api";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Workspace invitation" };

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const nextPath = `/invitations/${encodeURIComponent(token)}`;

  if (!data?.claims) {
    const next = encodeURIComponent(nextPath);
    return (
      <main className="grid min-h-screen bg-[var(--paper-0)] lg:grid-cols-12">
        <section className="flex min-h-[320px] flex-col justify-between border-b-2 border-[var(--ink-950)] bg-[var(--magenta-500)] p-6 md:p-10 lg:col-span-5 lg:min-h-screen lg:border-r-2 lg:border-b-0">
          <Link href="/" className="font-display text-xl font-extrabold">SignalDesk</Link>
          <div><p className="eyebrow mb-4">PRIVATE LINE / INVITATION</p><h1 className="font-display text-5xl font-extrabold leading-[0.92] md:text-6xl">Someone opened a seat for you.</h1></div>
        </section>
        <section className="flex items-center px-4 py-12 md:px-12 lg:col-span-7 lg:px-20">
          <div className="mx-auto w-full max-w-[560px]">
            <KeyRound aria-hidden="true" className="mb-7 text-[var(--cobalt-500)]" size={42} />
            <p className="eyebrow mb-3">IDENTITY CHECK</p>
            <h2 className="font-display text-4xl font-bold leading-none md:text-5xl">Sign in before the workspace reveals itself.</h2>
            <p className="mt-5 max-w-lg leading-6 text-[var(--ink-600)]">Use the exact email address that received the invitation. We verify it before granting any access.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="button button-primary" href={`/login?next=${next}`}>Sign in <ArrowRight aria-hidden="true" size={18} /></Link>
              <Link className="button button-secondary" href={`/login?mode=signup&next=${next}`}>Create account</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  let invitation: WorkspaceInvitation | null = null;
  let invitationError: unknown;
  try {
    invitation = (await getInvitation(token))?.invitation ?? null;
  } catch (error) {
    invitationError = error;
  }

  if (!invitation) {
    const message = invitationError instanceof RailsApiError && invitationError.status === 403
      ? "This invitation belongs to another email address. Sign out and use the address that received it."
      : "This invitation link is invalid or no longer available.";
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--acid-400)] p-6"><section className="max-w-xl border-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-8 shadow-[8px_8px_0_var(--ink-950)]"><KeyRound aria-hidden="true" className="mb-6" size={36} /><p className="eyebrow mb-3">ACCESS DENIED</p><h1 className="font-display text-4xl font-bold leading-none">The key does not fit.</h1><p className="mt-5 leading-6">{message}</p><Link className="button button-dark mt-7" href="/login">Use another account</Link></section></main>
    );
  }

  const accepted = invitation.status === "accepted";
  const expired = invitation.status === "expired";

  return (
      <main className="min-h-screen bg-[var(--paper-0)]">
        <header className="border-b-2 border-[var(--ink-950)] px-4 py-5 md:px-8"><Link href="/" className="font-display text-2xl font-extrabold">SignalDesk</Link></header>
        <div className="mx-auto grid max-w-[1200px] gap-0 border-x-2 border-[var(--ink-950)] lg:grid-cols-12">
          <section className="flex min-h-[360px] flex-col justify-between border-b-2 border-[var(--ink-950)] bg-[var(--cobalt-500)] p-6 text-[var(--paper-0)] md:p-10 lg:col-span-5 lg:min-h-[calc(100vh-76px)] lg:border-r-2 lg:border-b-0">
            <div className="flex size-14 items-center justify-center border-2 border-[var(--paper-0)] bg-[var(--acid-400)] text-[var(--ink-950)]"><ShieldCheck aria-hidden="true" size={28} /></div>
            <div><p className="eyebrow mb-4 text-[var(--acid-400)]">VERIFIED INVITATION / {invitation.role.toUpperCase()}</p><h1 className="font-display text-5xl font-extrabold leading-[0.92]">Your next room is {invitation.workspace?.name}.</h1></div>
          </section>
          <section className="flex items-center p-6 md:p-10 lg:col-span-7 lg:p-16">
            <div className="w-full max-w-xl">
              <p className="eyebrow mb-3">ACCESS PROTOCOL</p>
              <h2 className="font-display text-4xl font-bold leading-none">One click. Explicit access. No ambiguity.</h2>
              <dl className="my-8 grid border-y-2 border-[var(--ink-950)] text-sm">
                <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-[var(--ink-300)] py-4"><dt className="font-mono text-[10px]">WORKSPACE</dt><dd className="font-bold">{invitation.workspace?.name}</dd></div>
                <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-[var(--ink-300)] py-4"><dt className="font-mono text-[10px]">ROLE</dt><dd className="font-bold capitalize">{invitation.role}</dd></div>
                <div className="grid grid-cols-[110px_1fr] gap-4 py-4"><dt className="font-mono text-[10px]">EXPIRES</dt><dd className="flex items-center gap-2 font-bold"><Clock3 aria-hidden="true" size={16} /> {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(invitation.expires_at))}</dd></div>
              </dl>
              {accepted ? <Link className="button button-primary" href="/control-room">Enter the Control Room <ArrowRight aria-hidden="true" size={18} /></Link> : expired ? <p className="border-l-4 border-[var(--coral-500)] pl-4 font-semibold">This link has expired. Ask a workspace admin for a fresh invitation.</p> : <AcceptInvitationForm token={token} />}
            </div>
          </section>
        </div>
      </main>
  );
}
