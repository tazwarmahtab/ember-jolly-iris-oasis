import { createFileRoute } from "@tanstack/react-router";
import { loadLedger } from "@/lib/neia/server";
import { AppShell } from "@/components/app-shell";
import { confidenceLabel } from "@/lib/neia/format";
import type { Assumption } from "@/lib/neia/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ledger")({
  loader: () => loadLedger(),
  component: LedgerPage,
});

function LedgerPage() {
  const { desk, assumptions } = Route.useLoaderData();
  const flagged = assumptions.filter((a) => a.needsReview);
  const rest = assumptions.filter((a) => !a.needsReview);

  return (
    <AppShell desk={desk}>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
          Layer 3 · Netso assumptions
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Assumption ledger</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Canonical operating numbers. When the external world moves a tariff, duty,
          cutoff or cost, the row is flagged — never allowed to remain silently
          “true.” Empty cells are honest. Invented CAPEX is worse than a blank.
        </p>

        {flagged.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-2xl">Trigger model review</h2>
            <div className="mt-4 grid gap-3">
              {flagged.map((a) => (
                <AssumptionRow key={a.id} item={a} flagged />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="font-display text-2xl">Working book</h2>
          <div className="mt-4 grid gap-3">
            {rest.map((a) => (
              <AssumptionRow key={a.id} item={a} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function AssumptionRow({
  item,
  flagged = false,
}: {
  item: Assumption;
  flagged?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-lg border p-4 sm:p-5",
        flagged ? "border-important/40 bg-bg-elevated" : "border-border bg-bg-elevated",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {item.category}
            {flagged ? " · model review" : ""}
          </p>
          <h3 className="mt-1 text-base font-medium">{item.label}</h3>
          {item.reviewReason ? (
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.reviewReason}</p>
          ) : null}
          {item.sourceNote ? (
            <p className="mt-2 text-xs text-subtle">{item.sourceNote}</p>
          ) : null}
        </div>
        <div className="sm:text-right">
          <p className="font-mono text-xl tabular-nums tracking-tight text-fg">
            {item.value}
            {item.unit ? (
              <span className="ml-1 text-xs text-muted">{item.unit}</span>
            ) : null}
          </p>
          {item.originalFigure ? (
            <p className="mt-1 text-xs text-muted">Original · {item.originalFigure}</p>
          ) : null}
          {item.previousValue ? (
            <p className="mt-1 text-xs text-subtle">Was · {item.previousValue}</p>
          ) : null}
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted">
            {confidenceLabel(item.confidence)}
          </p>
        </div>
      </div>
    </article>
  );
}
