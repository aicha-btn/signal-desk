import type { Metadata } from "next";
import { PageHeader } from "@/components/workspace/page-header";
import { SignalFilters } from "@/components/workspace/signal-filters";
import { SignalList } from "@/components/workspace/signal-list";
import { SignalPagination } from "@/components/workspace/signal-pagination";
import { getAccount, getFeedbacks, getTags, type FeedbackListMeta } from "@/lib/rails-api";

export const metadata: Metadata = { title: "Signal Feed" };

export default async function SignalFeedPage({ searchParams }: { searchParams: Promise<{ query?: string; status?: string; priority?: string; tag_id?: string; sort?: string; page?: string; per_page?: string; focus?: string; created?: string; deleted?: string }> }) {
  const filters = await searchParams;
  const account = await getAccount();
  const workspaceId = account!.workspaces[0].id;
  const [result, tagResult] = await Promise.all([
    getFeedbacks(workspaceId, filters),
    getTags(workspaceId),
  ]);
  const fallbackMeta: FeedbackListMeta = { page: 1, per_page: 20, total: 0, total_pages: 0, sort: "newest" };

  return (
    <>
      <PageHeader eyebrow="SIGNAL FEED / WORKING QUEUE" title="Every Signal, in context." description="Search the evidence, narrow the pressure and keep every customer observation attached to a decision." action={{ label: "Capture a Signal", href: "/signals/new" }} />
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
        {filters.created === "1" && <p className="mb-5 border-2 border-[var(--ink-950)] bg-[var(--mint-500)] px-4 py-3 text-sm font-bold" role="status">Signal captured. It is now live in the feed.</p>}
        {filters.deleted === "1" && <p className="mb-5 border-2 border-[var(--ink-950)] bg-[var(--cyan-400)] px-4 py-3 text-sm font-bold" role="status">Signal deleted. The feed is up to date.</p>}
        <SignalFilters filters={filters} tags={tagResult?.tags ?? []} />
        <section className="mt-5 border-2 border-[var(--ink-950)] bg-[var(--paper-0)]">
          <div className="flex min-h-14 items-center justify-between border-b-2 border-[var(--ink-950)] px-4 md:px-5">
            <h2 className="font-display text-lg font-bold">Signal Feed</h2>
            <span className="font-mono text-[10px] text-[var(--ink-600)]">{result?.total ?? 0} RESULTS</span>
          </div>
          <SignalList feedbacks={result?.feedbacks ?? []} />
          <SignalPagination meta={result?.meta ?? fallbackMeta} filters={filters} />
        </section>
      </div>
    </>
  );
}
