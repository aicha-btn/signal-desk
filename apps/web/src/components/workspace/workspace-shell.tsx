"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Building2,
  Inbox,
  LogOut,
  Plus,
  RadioTower,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { signOut } from "@/app/(workspace)/actions";
import type { Account, Workspace } from "@/lib/rails-api";

const navigation = [
  { label: "Control Room", href: "/control-room", icon: Activity },
  { label: "Signal Feed", href: "/signal-feed", icon: Inbox },
  { label: "Customers", href: "/customers", icon: Building2 },
  { label: "Members", href: "/members", icon: Users },
] as const;

function isCurrentPath(pathname: string, href: string) {
  if (href === "/signal-feed" && pathname.startsWith("/signals/")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function WorkspaceShell({
  account,
  workspace,
  children,
}: {
  account: Account;
  workspace: Workspace;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const initials = (account.user.display_name ?? account.user.email)
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <main className="min-h-screen bg-[var(--canvas-50)] text-[var(--ink-950)] lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="hidden border-r-2 border-[var(--ink-950)] bg-[var(--ink-950)] text-[var(--paper-0)] lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <Link href="/control-room" className="flex h-16 shrink-0 items-center border-b border-[var(--ink-600)] px-5 font-display text-xl font-extrabold">
          SignalDesk
        </Link>
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5" aria-label="Workspace navigation">
          <p className="mb-3 px-2 font-mono text-[10px] text-[var(--ink-300)]">WORKSPACE</p>
          <div className="grid gap-1">
            {navigation.map(({ label, href, icon: Icon }) => {
              const active = isCurrentPath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 px-3 text-sm font-semibold transition-colors ${active ? "bg-[var(--acid-400)] text-[var(--ink-950)]" : "text-[var(--ink-300)] hover:bg-[var(--ink-800)] hover:text-[var(--paper-0)]"}`}
                >
                  <Icon aria-hidden="true" size={18} /> {label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="shrink-0 border-t border-[var(--ink-600)] p-3">
          <Link
            href="/settings"
            aria-current={pathname === "/settings" ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 px-3 text-sm font-semibold transition-colors ${pathname === "/settings" ? "bg-[var(--paper-0)] text-[var(--ink-950)]" : "text-[var(--ink-300)] hover:bg-[var(--ink-800)] hover:text-[var(--paper-0)]"}`}
          >
            <Settings aria-hidden="true" size={18} /> Settings
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="sticky top-0 z-40">
          <header className="flex h-16 items-center justify-between border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)] px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <RadioTower aria-hidden="true" className="shrink-0 text-[var(--cobalt-500)]" size={22} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{workspace.name}</p>
                <p className="font-mono text-[9px] text-[var(--ink-600)]">{workspace.role.toUpperCase()} / LIVE</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/signals/new"
                className="flex size-10 items-center justify-center bg-[var(--cobalt-500)] text-[var(--paper-0)]"
                aria-label="Capture a Signal"
                title="Capture a Signal"
              >
                <Plus aria-hidden="true" size={18} />
              </Link>
              <Link
                href="/signal-feed?focus=search"
                className="hidden min-h-10 items-center gap-2 border-2 border-[var(--ink-950)] px-3 text-sm font-semibold md:flex"
              >
                <Search aria-hidden="true" size={17} /> Search
              </Link>
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

          <nav className="grid min-h-12 grid-cols-5 border-b-2 border-[var(--ink-950)] bg-[var(--ink-950)] text-[var(--paper-0)] lg:hidden" aria-label="Mobile workspace navigation">
            {[...navigation, { label: "Settings", href: "/settings", icon: Settings }].map(({ label, href, icon: Icon }) => {
              const active = isCurrentPath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  title={label}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-w-0 items-center justify-center gap-2 px-2 text-[11px] font-semibold ${active ? "bg-[var(--acid-400)] text-[var(--ink-950)]" : "text-[var(--ink-300)]"}`}
                >
                  <Icon aria-hidden="true" size={17} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {children}
      </div>
    </main>
  );
}
