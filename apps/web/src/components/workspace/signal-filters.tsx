"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PendingButtonContent } from "@/components/ui/pending-feedback";
import type { Tag } from "@/lib/rails-api";

export type SignalFilterValues = {
  query?: string;
  status?: string;
  priority?: string;
  tag_id?: string;
  sort?: string;
  page?: string;
  per_page?: string;
  focus?: string;
  created?: string;
  deleted?: string;
};

export function SignalFilters({ filters, tags }: { filters: SignalFilterValues; tags: Tag[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const hasFilters = Boolean(
    filters.query || filters.status || filters.priority || filters.tag_id ||
    (filters.sort && filters.sort !== "newest") ||
    (filters.per_page && filters.per_page !== "20"),
  );

  return (
    <>
      <Form
        action="/signal-feed"
        className="grid gap-3 border-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-4 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_145px_145px_165px_180px_120px_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const query = new URLSearchParams();
          for (const [key, value] of formData.entries()) {
            if (typeof value === "string" && value) query.set(key, value);
          }
          const destination = query.size ? `/signal-feed?${query.toString()}` : "/signal-feed";
          startTransition(() => router.push(destination));
        }}
      >
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
        <label>
          <span className="sr-only">Tag</span>
          <select className="app-form-control" name="tag_id" defaultValue={filters.tag_id ?? ""}>
            <option value="">All tags</option>
            {tags.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Sort Signals</span>
          <select className="app-form-control" name="sort" defaultValue={filters.sort ?? "newest"}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority_desc">Priority: high first</option>
            <option value="priority_asc">Priority: low first</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Signals per page</span>
          <select className="app-form-control" name="per_page" defaultValue={filters.per_page ?? "20"}>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
          </select>
        </label>
        <button className="button button-dark min-h-11" type="submit" disabled={pending} aria-busy={pending}>
          <PendingButtonContent pending={pending} idleLabel="Apply" pendingLabel="Filtering..." idleIcon={<SlidersHorizontal aria-hidden="true" size={17} />} />
        </button>
      </Form>
      {hasFilters && <Link href="/signal-feed" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4"><X aria-hidden="true" size={16} /> Clear filters</Link>}
    </>
  );
}
