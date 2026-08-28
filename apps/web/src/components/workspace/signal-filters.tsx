"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PendingButtonContent } from "@/components/ui/pending-feedback";
import { DesignSelect } from "@/components/ui/design-select";
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
  const activeFilterCount = [filters.status, filters.priority, filters.tag_id].filter(Boolean).length +
    (filters.sort && filters.sort !== "newest" ? 1 : 0) +
    (filters.per_page && filters.per_page !== "20" ? 1 : 0);
  const [expanded, setExpanded] = useState(hasFilters);

  return (
    <>
      <Form
        action="/signal-feed"
        className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-3 md:grid-cols-2 md:gap-3 md:p-4 xl:grid-cols-4 2xl:grid-cols-[minmax(240px,1fr)_145px_145px_165px_180px_120px_auto]"
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
        <button
          className={`flex size-11 items-center justify-center border-2 border-[var(--ink-950)] md:hidden ${expanded || activeFilterCount ? "bg-[var(--acid-400)]" : "bg-[var(--paper-0)]"}`}
          type="button"
          aria-label={expanded ? "Hide Signal filters" : "Show Signal filters"}
          aria-expanded={expanded}
          aria-controls="signal-filter-controls"
          onClick={() => setExpanded((current) => !current)}
        >
          <SlidersHorizontal aria-hidden="true" size={18} />
          {activeFilterCount > 0 && <span className="sr-only">{activeFilterCount} active</span>}
        </button>
        <div id="signal-filter-controls" className={`${expanded ? "grid" : "hidden"} col-span-2 gap-3 md:contents`}>
          <div>
            <span className="sr-only">Status</span>
            <DesignSelect ariaLabel="Status" name="status" defaultValue={filters.status ?? ""} options={[{ value: "", label: "All statuses" }, { value: "new", label: "New" }, { value: "reviewing", label: "Reviewing" }, { value: "planned", label: "Planned" }, { value: "resolved", label: "Resolved" }]} />
          </div>
          <div>
            <span className="sr-only">Priority</span>
            <DesignSelect ariaLabel="Priority" name="priority" defaultValue={filters.priority ?? ""} options={[{ value: "", label: "All priorities" }, { value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }, { value: "critical", label: "Critical" }]} />
          </div>
          <div>
            <span className="sr-only">Tag</span>
            <DesignSelect ariaLabel="Tag" name="tag_id" defaultValue={filters.tag_id ?? ""} options={[{ value: "", label: "All tags" }, ...tags.map((tag) => ({ value: String(tag.id), label: tag.name }))]} />
          </div>
          <div>
            <span className="sr-only">Sort Signals</span>
            <DesignSelect ariaLabel="Sort Signals" name="sort" defaultValue={filters.sort ?? "newest"} options={[{ value: "newest", label: "Newest first" }, { value: "oldest", label: "Oldest first" }, { value: "priority_desc", label: "Priority: high first" }, { value: "priority_asc", label: "Priority: low first" }]} />
          </div>
          <div>
            <span className="sr-only">Signals per page</span>
            <DesignSelect ariaLabel="Signals per page" name="per_page" defaultValue={filters.per_page ?? "20"} options={[{ value: "10", label: "10 / page" }, { value: "20", label: "20 / page" }, { value: "50", label: "50 / page" }]} />
          </div>
          <button className="button button-dark min-h-11" type="submit" disabled={pending} aria-busy={pending}>
            <PendingButtonContent pending={pending} idleLabel="Apply" pendingLabel="Filtering..." idleIcon={<SlidersHorizontal aria-hidden="true" size={17} />} />
          </button>
        </div>
      </Form>
      {hasFilters && <Link href="/signal-feed" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4"><X aria-hidden="true" size={16} /> Clear filters</Link>}
    </>
  );
}
