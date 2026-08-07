type ApiHealth = {
  status: "ok" | "error";
  service: string;
  database: "connected" | "unavailable";
};

type HealthResult =
  | { available: true; data: ApiHealth }
  | { available: false; data: null };

const railsApiUrl = process.env.RAILS_API_URL ?? "http://127.0.0.1:3001";

async function getApiHealth(): Promise<HealthResult> {
  try {
    const response = await fetch(`${railsApiUrl}/api/v1/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return { available: false, data: null };
    }

    return { available: true, data: (await response.json()) as ApiHealth };
  } catch {
    return { available: false, data: null };
  }
}

export default async function Home() {
  const apiHealth = await getApiHealth();

  return (
    <main className="min-h-screen bg-[var(--paper-0)] text-[var(--ink-950)]">
      <header className="flex h-16 items-center justify-between border-b-2 border-[var(--ink-950)] px-4 md:px-8">
        <span className="font-display text-xl font-extrabold">SignalDesk</span>
        <span className="font-mono text-xs text-[var(--ink-600)]">
          FOUNDATION / 01
        </span>
      </header>

      <section className="grid min-h-[calc(100vh-4rem)] grid-rows-[1fr_auto]">
        <div className="grid content-between gap-12 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-6 font-mono text-sm font-medium">SYSTEM CHECK</p>
            <h1 className="max-w-5xl font-display text-6xl font-extrabold leading-[0.98] md:text-7xl md:leading-[0.96] lg:text-8xl">
              The desk is
              <span className="block text-[var(--cobalt-500)]">
                {apiHealth.available ? "listening." : "warming up."}
              </span>
            </h1>
          </div>

          <p className="max-w-xl self-end text-lg leading-7 text-[var(--ink-800)] md:text-xl md:leading-8 lg:col-span-4">
            Next.js and Rails now share a verified path to the same product.
            The business work starts from here.
          </p>
        </div>

        <div className="grid border-t-2 border-[var(--ink-950)] md:grid-cols-3">
          <StatusCell label="Web" value="Next.js online" tone="cobalt" />
          <StatusCell
            label="API"
            value={apiHealth.available ? "Rails online" : "Rails unavailable"}
            tone={apiHealth.available ? "mint" : "coral"}
          />
          <StatusCell
            label="Database"
            value={
              apiHealth.data?.database === "connected"
                ? "PostgreSQL connected"
                : "Connection pending"
            }
            tone={apiHealth.data?.database === "connected" ? "acid" : "coral"}
          />
        </div>
      </section>
    </main>
  );
}

function StatusCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cobalt" | "mint" | "acid" | "coral";
}) {
  const tones = {
    cobalt: "bg-[var(--cobalt-500)] text-[var(--paper-0)]",
    mint: "bg-[var(--mint-500)] text-[var(--ink-950)]",
    acid: "bg-[var(--acid-400)] text-[var(--ink-950)]",
    coral: "bg-[var(--coral-500)] text-[var(--ink-950)]",
  };

  return (
    <div
      className={`min-h-32 border-b-2 border-[var(--ink-950)] p-4 last:border-b-0 md:border-r-2 md:border-b-0 md:p-6 md:last:border-r-0 ${tones[tone]}`}
    >
      <p className="font-mono text-xs font-medium">{label}</p>
      <p className="mt-8 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
