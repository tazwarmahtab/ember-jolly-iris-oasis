import { createFileRoute } from "@tanstack/react-router";
import { loadSignals } from "@/lib/neia/server";
import { AppShell } from "@/components/app-shell";
import type { Signal } from "@/lib/neia/types";

export const Route = createFileRoute("/signals")({
  loader: () => loadSignals(),
  component: SignalsPage,
});

function SignalsPage() {
  const { desk, signals } = Route.useLoaderData();
  const opportunities = signals.filter((s) => s.kind === "opportunity");
  const threats = signals.filter((s) => s.kind === "threat");

  return (
    <AppShell desk={desk}>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
          Opportunity · threat
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Signals</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Ranked by time sensitivity and strategic fit. Bad news is not buried.
          Hypotheses stay labelled as such.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <Column title="Opportunities" items={opportunities} />
          <Column title="Threats" items={threats} tone="threat" />
        </div>
      </div>
    </AppShell>
  );
}

function Column({
  title,
  items,
  tone = "opp",
}: {
  title: string;
  items: Signal[];
  tone?: "opp" | "threat";
}) {
  return (
    <section>
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((s) => (
          <article
            key={s.id}
            className="rounded-lg border border-border bg-bg-elevated p-4 sm:p-5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-medium leading-snug">{s.title}</h3>
              <span className="font-mono text-[10px] tabular-nums text-muted">
                {String(s.rank).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <Fact label="Value" value={s.potentialValue} />
              <Fact label="Probability" value={s.probability} />
              <Fact
                label="Time"
                value={s.timeSensitivity}
                warn={tone === "threat"}
              />
              <Fact label="Fit" value={s.strategicFit} />
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function Fact({
  label,
  value,
  warn = false,
}: {
  label: string;
  value: string | null;
  warn?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-subtle">{label}</dt>
      <dd className={warn ? "mt-0.5 text-important" : "mt-0.5 text-fg"}>{value ?? "—"}</dd>
    </div>
  );
}
