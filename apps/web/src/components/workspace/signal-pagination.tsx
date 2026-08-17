import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { FeedbackListMeta } from "@/lib/rails-api";
import type { SignalFilterValues } from "@/components/workspace/signal-filters";

export function SignalPagination({
  meta,
  filters,
}: {
  meta: FeedbackListMeta;
  filters: SignalFilterValues;
}) {
  if (meta.total_pages <= 1) return null;

  const pageHref = (page: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (["focus", "created", "deleted", "page"].includes(key) || !value) continue;
      query.set(key, value);
    }
    if (page > 1) query.set("page", String(page));
    return `/signal-feed?${query.toString()}`;
  };

  return (
    <nav className="flex min-h-16 items-center justify-between border-t-2 border-[var(--ink-950)] bg-[var(--canvas-50)] px-4 md:px-5" aria-label="Signal Feed pages">
      {meta.page > 1 ? (
        <Link className="button button-secondary min-h-10 px-3" href={pageHref(meta.page - 1)}>
          <ArrowLeft aria-hidden="true" size={16} /> Previous
        </Link>
      ) : <span className="min-w-24" />}
      <span className="font-mono text-[10px]">PAGE {meta.page} / {meta.total_pages}</span>
      {meta.page < meta.total_pages ? (
        <Link className="button button-secondary min-h-10 px-3" href={pageHref(meta.page + 1)}>
          Next <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : <span className="min-w-24" />}
    </nav>
  );
}
