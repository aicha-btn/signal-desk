import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Building2,
  CircleUserRound,
  Inbox,
  LogOut,
  Plus,
  RadioTower,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { signOut } from "@/app/control-room/actions";
import { getAccount } from "@/lib/rails-api";

export const metadata: Metadata = {
  title: "Control Room",
  description: "Your SignalDesk workspace overview.",
};

const navigation = [
  { label: "Control Room", icon: Activity, active: true },
  { label: "Signal Feed", icon: Inbox, active: false },
  { label: "Customers", icon: Building2, active: false },
  { label: "Members", icon: Users, active: false },
] as const;

export default async function ControlRoomPage() {
  const account = await getAccount();
  if (!account) redirect("/login");
  if (account.onboarding_required) redirect("/onboarding");

  const workspace = account.workspaces[0];
  const initials = (account.user.display_name ?? account.user.email)
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <main className="min-h-screen bg-[var(--canvas-50)] text-[var(--ink-950)] lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="hidden min-h-screen border-r-2 border-[var(--ink-950)] bg-[var(--ink-950)] text-[var(--paper-0)] lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-[var(--ink-600)] px-5 font-display text-xl font-extrabold">
          SignalDesk
        </div>
        <nav className="flex-1 px-3 py-5" aria-label="Workspace navigation">
          <p className="mb-3 px-2 font-mono text-[10px] text-[var(--ink-300)]">WORKSPACE</p>
          <div className="grid gap-1">
            {navigation.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                type="button"
                disabled={!active}
                className={`flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm font-semibold ${active ? "bg-[var(--acid-400)] text-[var(--ink-950)]" : "text-[var(--ink-300)]"}`}
              >
                <Icon aria-hidden="true" size={18} /> {label}
              </button>
            ))}
          </div>
        </nav>
        <div className="border-t border-[var(--ink-600)] p-3">
          <button type="button" disabled className="flex min-h-11 w-full items-center gap-3 px-3 text-sm text-[var(--ink-300)]">
            <Settings aria-hidden="true" size={18} /> Settings
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)] px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <RadioTower aria-hidden="true" className="shrink-0 text-[var(--cobalt-500)]" size={22} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{workspace.name}</p>
              <p className="font-mono text-[9px] text-[var(--ink-600)]">{workspace.role.toUpperCase()} / LIVE</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" disabled className="hidden min-h-10 items-center gap-2 border-2 border-[var(--ink-950)] px-3 text-sm font-semibold text-[var(--ink-600)] md:flex">
              <Search aria-hidden="true" size={17} /> Search
            </button>
            <span className="flex size-10 items-center justify-center bg-[var(--magenta-500)] font-mono text-xs font-medium" title={account.user.email}>
              {initials}
            </span>
            <form action={signOut}>
              <button className="flex size-10 items-center justify-center border-2 border-[var(--ink-950)] bg-[var(--paper-0)]" type="submit" aria-label="Sign out" title="Sign out">
                <LogOut aria-hidden="true" size={17} />
              </button>
            </form>
          </div>
        </header>

        <section className="border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)] px-4 py-8 md:px-6 md:py-10">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow mb-3">CONTROL ROOM / CURRENT PULSE</p>
                <h1 className="font-display text-4xl font-bold leading-none md:text-5xl">
                  The room is open.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-6 text-[var(--ink-600)]">
                  Your workspace boundary is active. The first real Signal will turn this quiet room into a working feed.
                </p>
              </div>
              <button type="button" disabled className="button button-primary opacity-60">
                <Plus aria-hidden="true" size={19} /> Capture a Signal
              </button>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
          <section className="grid border-2 border-[var(--ink-950)] bg-[var(--paper-0)] md:grid-cols-3" aria-label="Workspace readiness">
            <StatusBlock label="IDENTITY" value="Verified" detail="Supabase session" tone="bg-[var(--mint-500)]" />
            <StatusBlock label="BOUNDARY" value="Isolated" detail={`${workspace.role} membership`} tone="bg-[var(--acid-400)]" />
            <StatusBlock label="SIGNAL FEED" value="Ready" detail="Waiting for input" tone="bg-[var(--cyan-400)]" />
          </section>

          <section className="mt-8 border-2 border-[var(--ink-950)] bg-[var(--paper-0)]" aria-labelledby="feed-title">
            <div className="flex min-h-16 items-center justify-between border-b-2 border-[var(--ink-950)] px-4 md:px-5">
              <div className="flex items-center gap-3">
                <Inbox aria-hidden="true" size={20} />
                <h2 id="feed-title" className="font-display text-xl font-bold">Signal Feed</h2>
              </div>
              <span className="font-mono text-[10px] text-[var(--ink-600)]">0 ACTIVE SIGNALS</span>
            </div>
            <div className="grid min-h-[300px] place-items-center p-6 text-center">
              <div className="max-w-md">
                <CircleUserRound aria-hidden="true" className="mx-auto text-[var(--cobalt-500)]" size={44} strokeWidth={1.8} />
                <h3 className="mt-5 font-display text-2xl font-bold">No Signals yet.</h3>
                <p className="mt-3 leading-6 text-[var(--ink-600)]">
                  The next vertical slice will connect capture, priority and status to this feed.
                </p>
                <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4">
                  Return to the landing page <ArrowRight aria-hidden="true" size={17} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatusBlock({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="border-b-2 border-[var(--ink-950)] p-5 last:border-b-0 md:border-r-2 md:border-b-0 md:last:border-r-0">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-[var(--ink-600)]">{label}</p>
        <span aria-hidden="true" className={`size-3 border border-[var(--ink-950)] ${tone}`} />
      </div>
      <p className="mt-8 font-display text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-[var(--ink-600)]">{detail}</p>
    </div>
  );
}
