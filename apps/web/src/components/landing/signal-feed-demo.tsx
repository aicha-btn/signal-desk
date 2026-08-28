"use client";

import { useMemo, useState } from "react";
import { Inbox, ListFilter } from "lucide-react";

const filters = ["All", "Incoming", "In Focus", "On Track"] as const;
type Filter = (typeof filters)[number];

const signals = [
  {
    title: "Client-facing roadmap view",
    source: "Slack",
    account: "Helio · Enterprise",
    status: "In Focus",
    owner: "Nora",
    intensity: 5,
    tone: "bg-[var(--magenta-500)]",
  },
  {
    title: "Export loses column selection",
    source: "Support",
    account: "14 linked signals",
    status: "On Track",
    owner: "Mika",
    intensity: 4,
    tone: "bg-[var(--cobalt-500)]",
  },
  {
    title: "Bulk merge duplicate contacts",
    source: "Email",
    account: "Northstar · Pro",
    status: "Incoming",
    owner: "Unassigned",
    intensity: 3,
    tone: "bg-[var(--coral-500)]",
  },
  {
    title: "Guest permissions are too broad",
    source: "Call",
    account: "Kanso · Enterprise",
    status: "In Focus",
    owner: "Amir",
    intensity: 4,
    tone: "bg-[var(--cyan-400)]",
  },
] as const;

const statusClasses: Record<string, string> = {
  Incoming: "bg-[var(--canvas-50)]",
  "In Focus": "bg-[var(--acid-400)]",
  "On Track": "bg-[var(--mint-500)]",
};

export function SignalFeedDemo() {
  const [filter, setFilter] = useState<Filter>("All");
  const visibleSignals = useMemo(
    () => signals.filter((signal) => filter === "All" || signal.status === filter),
    [filter],
  );

  return (
    <div className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)]" aria-label="Interactive Signal Feed demo">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--ink-950)] px-4 py-3 md:px-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center bg-[var(--ink-950)] text-[var(--paper-0)]">
            <Inbox aria-hidden="true" size={18} />
          </span>
          <div>
            <p className="font-display text-lg font-bold">Signal Feed</p>
            <p className="font-mono text-[10px] text-[var(--ink-600)]">DEMO WORKSPACE · LIVE VIEW</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 md:w-auto md:flex-wrap md:overflow-visible md:pb-0" aria-label="Filter signals">
          <ListFilter aria-hidden="true" className="mr-1 shrink-0" size={17} />
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`min-h-9 shrink-0 border-2 border-[var(--ink-950)] px-3 font-mono text-[10px] font-medium transition-colors ${
                filter === item
                  ? "bg-[var(--ink-950)] text-[var(--paper-0)]"
                  : "bg-[var(--paper-0)] hover:bg-[var(--acid-400)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden grid-cols-[minmax(280px,2fr)_1fr_1fr_1fr_150px] border-b-2 border-[var(--ink-950)] bg-[var(--canvas-50)] px-5 py-3 font-mono text-[10px] font-medium lg:grid">
        <span>SIGNAL</span><span>SOURCE</span><span>STATUS</span><span>OWNER</span><span>INTENSITY</span>
      </div>

      <div className="min-h-[180px] lg:min-h-[392px]">
        {visibleSignals.map((signal) => (
          <article
            key={signal.title}
            className="relative grid grid-cols-2 gap-x-4 gap-y-3 border-b-2 border-[var(--line-200)] px-4 py-4 last:border-b-0 lg:grid-cols-[minmax(280px,2fr)_1fr_1fr_1fr_150px] lg:items-center lg:gap-5 lg:px-5 lg:py-5"
          >
            <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-2 ${signal.tone}`} />
            <div className="col-span-2 lg:col-span-1">
              <h3 className="font-display text-lg font-bold">{signal.title}</h3>
              <p className="mt-1 font-mono text-[10px] text-[var(--ink-600)]">{signal.account}</p>
            </div>
            <DataPoint label="Source" value={signal.source} />
            <div>
              <p className="data-label lg:hidden">Status</p>
              <span className={`inline-flex border border-[var(--ink-950)] px-2 py-1 font-mono text-[10px] font-medium ${statusClasses[signal.status]}`}>
                {signal.status}
              </span>
            </div>
            <DataPoint label="Owner" value={signal.owner} />
            <div>
              <p className="data-label lg:hidden">Intensity</p>
              <div className="flex gap-1" aria-label={`${signal.intensity} out of 5 intensity`}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <span
                    key={level}
                    aria-hidden="true"
                    className={`h-3 flex-1 border border-[var(--ink-950)] ${level <= signal.intensity ? signal.tone : "bg-[var(--paper-0)]"}`}
                  />
                ))}
              </div>
            </div>
          </article>
        ))}
        {visibleSignals.length === 0 && (
          <p className="p-8 text-center text-[var(--ink-600)]">No signals in this view.</p>
        )}
      </div>
    </div>
  );
}

function DataPoint({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="data-label lg:hidden">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
