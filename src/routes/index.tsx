import { createFileRoute, Link } from "@tanstack/react-router";
import { loadDaily, runDailyCycle } from "@/lib/neia/server";
import { AppShell } from "@/components/app-shell";
import { ItemCard, SectionHead } from "@/components/item-card";
import { RunCycleButton } from "@/components/run-cycle";
import { formatDate } from "@/lib/neia/format";
import type { IntelligenceItem } from "@/lib/neia/types";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/")({
  loader: () => loadDaily(),
  component: DailyBrief,
});

function DailyBrief() {
  const { desk, items, brief, reviewFlags } = Route.useLoaderData();
  const critical = items.filter((i) => i.severity === "critical");
  const important = items.filter((i) => i.severity === "important");
  const watch = items.filter((i) => i.severity === "watch");
  const grouped = groupByCategory(items);
  const numbers = items.flatMap((i) => i.numbers);

  return (
    <AppShell desk={desk}>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="stagger-in">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                Netso Energy Limited · Operational
              </p>
              <h1 className="mt-2 font-display text-2xl tracking-tight text-fg sm:text-4xl lg:text-5xl">
                Daily intelligence
              </h1>
              <p className="mt-2 text-sm text-muted">
                {formatDate(brief?.briefDate ?? desk.briefDate)} · Evidence-disciplined · Not a news feed
              </p>
            </div>
            <RunCycleButton
              label="Run daily cycle"
              pendingLabel="Searching live sources"
              run={() => runDailyCycle()}
            />
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
            What changed that could affect Netso’s ability to win customers, deploy capital,
            finance projects, or build advantage?
          </p>

          {reviewFlags.length > 0 ? (
            <div className="mt-6 flex gap-3 rounded-lg border border-border bg-bg-elevated p-4">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-important" />
              <div>
                <p className="text-sm font-medium">Model review triggered</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {reviewFlags.length} ledger assumption{reviewFlags.length === 1 ? "" : "s"} flagged.
                  Do not treat outdated unit-economic inputs as canonical.
                </p>
              </div>
            </div>
          ) : null}

          {brief ? (
            <section className="mt-10 rounded-xl bg-paper p-6 text-paper-ink sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper-muted">
                Strategic interpretation
              </p>
              <p className="mt-3 font-display text-xl leading-snug sm:text-2xl">
                {brief.strategicInterpretation}
              </p>
              {brief.recommendedActions.length > 0 ? (
                <ol className="mt-6 space-y-3 border-t border-paper-line pt-5">
                  {brief.recommendedActions.map((action, i) => (
                    <li key={action} className="flex gap-3 text-sm leading-relaxed">
                      <span className="font-mono text-[11px] tabular-nums text-paper-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {action}
                    </li>
                  ))}
                </ol>
              ) : null}
            </section>
          ) : null}

          <section className="mt-12">
            <SectionHead kicker="Maximum 3" title="Critical — act now" />
            <div className="grid gap-4">
              {critical.length ? (
                critical.map((item) => <ItemCard key={item.id} item={item} featured />)
              ) : (
                <EmptyLine text="No critical items on the desk." />
              )}
            </div>
          </section>

          <section className="mt-12">
            <SectionHead kicker="Maximum 7" title="Important" />
            <div className="grid gap-4 md:grid-cols-2">
              {important.length ? (
                important.map((item) => <ItemCard key={item.id} item={item} />)
              ) : (
                <EmptyLine text="No important items." />
              )}
            </div>
          </section>

          <section className="mt-12">
            <SectionHead kicker="Early warning" title="Watch" />
            <div className="divide-y divide-border rounded-lg border border-border bg-bg-elevated">
              {watch.length ? (
                watch.map((item) => (
                  <WatchRow key={item.id} item={item} />
                ))
              ) : (
                <p className="px-4 py-5 text-sm text-muted">Nothing on watch.</p>
              )}
            </div>
          </section>

          {numbers.length > 0 ? (
            <section className="mt-12">
              <SectionHead kicker="Preserve originals" title="Market data" />
              <div className="grid gap-2 sm:grid-cols-2">
                {numbers.map((n) => (
                  <div
                    key={`${n.label}-${n.original}`}
                    className="rounded-md border border-border bg-bg-elevated px-4 py-3"
                  >
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{n.label}</p>
                    <p className="mt-1 font-mono text-sm tabular-nums text-fg">{n.original}</p>
                    {n.converted ? (
                      <p className="mt-1 text-xs text-muted">
                        Original → {n.converted}
                        {n.assumption ? ` · ${n.assumption}` : ""}
                      </p>
                    ) : n.assumption ? (
                      <p className="mt-1 text-xs text-muted">{n.assumption}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-12 mb-8">
            <SectionHead kicker="Desk partitions" title="By domain" />
            <div className="grid gap-3 sm:grid-cols-2">
              {grouped.map(([cat, list]) => (
                <div key={cat} className="rounded-lg border border-border bg-bg-elevated p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {cat}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {list.map((item) => (
                      <li key={item.id} className="text-sm leading-snug text-fg">
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function WatchRow({ item }: { item: IntelligenceItem }) {
  return (
    <Link
      to="/item/$id"
      params={{ id: item.id }}
      className="flex flex-col gap-1 px-4 py-4 transition-colors duration-150 hover:bg-bg-subtle sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
    >
      <span className="text-sm text-fg">{item.title}</span>
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">
        {item.confidence} · L{item.verificationLevel}
      </span>
    </Link>
  );
}

function EmptyLine({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-8 text-sm text-muted">
      {text}
    </p>
  );
}

function groupByCategory(items: IntelligenceItem[]) {
  const map = new Map<string, IntelligenceItem[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return [...map.entries()];
}
