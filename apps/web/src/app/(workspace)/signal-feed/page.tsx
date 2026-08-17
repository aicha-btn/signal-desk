import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PageHeader } from "@/components/workspace/page-header";
import { SignalList } from "@/components/workspace/signal-list";
import { getAccount, getFeedbacks } from "@/lib/rails-api";

export const metadata: Metadata = { title: "Signal Feed" };

export default async function SignalFeedPage({ searchParams }: { searchParams: Promise<{ query?: string; status?: string; priority?: string; focus?: string; created?: string }> }) {
  const filters = await searchParams;
  const account = await getAccount();
  const result = await getFeedbacks(account!.workspaces[0].id, filters);
  const hasFilters = Boolean(filters.query || filters.status || filters.priority);

  return (
    <>
      <PageHeader eyebrow="SIGNAL FEED / WORKING QUEUE" title="Every Signal, in context." description="Search the evidence, narrow the pressure and keep every customer observation attached to a decision." action={{ label: "Capture a Signal", href: "/signals/new" }} />
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
        {filters.created === "1" && <p className="mb-5 border-2 border-[var(--ink-950)] bg-[var(--mint-500)] px-4 py-3 text-sm font-bold" role="status">Signal captured. It is now live in the feed.</p>}
        <form className="grid gap-3 border-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-4 md:grid-cols-[minmax(240px,1fr)_180px_180px_auto]" method="get">
          <label className="relative">
            <span className="sr-only">Search Signals</span>
            <Search aria-hidden="true" className="absolute top-1/2 left-3 -translate-y-1/2" size={17} />
            <input className="app-form-control pl-10" name="query" defaultValue={filters.query} placeholder="Search title or description" autoFocus={filters.focus === "search"} />
          </label>
          <label>
            <span className="sr-only">Status</span>
            <select className="app-form-control" name="status" defaultValue={filters.status ?? ""}>
              <option value="">All statuses</option><option value="new">New</option><option value="reviewing">Reviewing</option><option value="planned">Planned</option><option value="resolved">Resolved</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Priority</span>
            <select className="app-form-control" name="priority" defaultValue={filters.priority ?? ""}>
              <option value="">All priorities</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
            </select>
          </label>
          <button className="button button-dark min-h-11" type="submit"><SlidersHorizontal aria-hidden="true" size={17} /> Apply</button>
        </form>
        {hasFilters && <Link href="/signal-feed" className="mt-3 inline-flex items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4"><X aria-hidden="true" size={16} /> Clear filters</Link>}
        <section className="mt-5 border-2 border-[var(--ink-950)] bg-[var(--paper-0)]">
          <div className="flex min-h-14 items-center justify-between border-b-2 border-[var(--ink-950)] px-4 md:px-5">
            <h2 className="font-display text-lg font-bold">Signal Feed</h2>
            <span className="font-mono text-[10px] text-[var(--ink-600)]">{result?.total ?? 0} RESULTS</span>
          </div>
          <SignalList feedbacks={result?.feedbacks ?? []} />
        </section>
      </div>
    </>
  );
}
