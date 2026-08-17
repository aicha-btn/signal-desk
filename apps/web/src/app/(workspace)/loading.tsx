export default function WorkspaceLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <section className="border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)] px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="loading-line h-3 w-40" />
          <div className="loading-line mt-5 h-12 max-w-2xl" />
          <div className="loading-line mt-4 h-5 max-w-xl" />
        </div>
      </section>
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="loading-surface min-h-[360px] p-5 md:p-7">
          <div className="loading-line h-5 w-36" />
          <div className="mt-8 grid gap-4">
            <div className="loading-line h-16" />
            <div className="loading-line h-16" />
            <div className="loading-line h-16" />
          </div>
        </section>
        <aside className="loading-surface min-h-56 p-5">
          <div className="loading-line h-4 w-28" />
          <div className="loading-line mt-6 h-24" />
        </aside>
      </div>
      <span className="sr-only" role="status">Loading workspace data</span>
    </div>
  );
}
