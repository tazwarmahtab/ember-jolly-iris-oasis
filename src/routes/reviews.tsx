import { createFileRoute } from "@tanstack/react-router";
import { loadReviews, runMonthlyCycle, runWeeklyCycle } from "@/lib/neia/server";
import { AppShell } from "@/components/app-shell";
import { RunCycleButton } from "@/components/run-cycle";
import { formatDate } from "@/lib/neia/format";
import type { Brief } from "@/lib/neia/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  loader: () => loadReviews(),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { desk, weekly, monthly } = Route.useLoaderData();

  return (
    <AppShell desk={desk}>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
          Layer 4 · Strategic conclusions
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Reviews</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Weekly operating cadence and the monthly CEO question: what in the external
          environment should change strategy?
        </p>

        <WeeklyBlock brief={weekly} />
        <MonthlyBlock brief={monthly} />
      </div>
    </AppShell>
  );
}

function WeeklyBlock({ brief }: { brief: Brief | null }) {
  const s = brief?.startStop ?? {};
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl">Weekly intelligence</h2>
          <p className="mt-1 text-sm text-muted">
            {brief ? formatDate(brief.briefDate) : "No weekly report yet"}
          </p>
        </div>
        <RunCycleButton
          label="Write weekly"
          pendingLabel="Synthesising week"
          run={() => runWeeklyCycle()}
          variant="secondary"
        />
      </div>

      {brief ? (
        <div className="mt-6 rounded-xl bg-paper p-6 text-paper-ink sm:p-8">
          <p className="font-display text-xl leading-snug sm:text-2xl">
            {brief.strategicInterpretation}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Prose kicker="Policy" body={s.policy} />
            <Prose kicker="Market" body={s.market} />
            <Prose kicker="Competitors" body={s.competitors} />
            <Prose kicker="Technology" body={s.technology} />
            <Prose kicker="Financing" body={s.financing} />
            <Prose kicker="Customers" body={s.customers} />
            <Prose kicker="Threats" body={s.threats} />
            <Prose kicker="Opportunities" body={s.opportunities} />
          </div>
          {s.implications ? (
            <Prose kicker="Implications" body={s.implications} className="mt-6" />
          ) : null}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <List kicker="Start" items={s.start} />
            <List kicker="Stop" items={s.stop} />
            <List kicker="Defer" items={s.defer} />
            <List kicker="Accelerate" items={s.accelerate} />
          </div>
          <List kicker="Top actions this week" items={s.weeklyActions} className="mt-8" />
        </div>
      ) : null}
    </section>
  );
}

function MonthlyBlock({ brief }: { brief: Brief | null }) {
  const maps = brief?.maps ?? {};
  return (
    <section className="mt-16 mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl">Monthly strategic review</h2>
          <p className="mt-1 text-sm text-muted">
            {brief ? formatDate(brief.briefDate) : "No monthly review yet"}
          </p>
        </div>
        <RunCycleButton
          label="Write monthly"
          pendingLabel="CEO review running"
          run={() => runMonthlyCycle()}
          variant="secondary"
        />
      </div>
      {brief ? (
        <>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
            {brief.strategicInterpretation}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <MapCard title="Market" body={maps.market} />
            <MapCard title="Regulatory" body={maps.regulatory} />
            <MapCard title="Competitor" body={maps.competitor} />
            <MapCard title="Financing" body={maps.financing} />
            <MapCard title="Technology" body={maps.technology} />
            <MapCard title="Customer demand" body={maps.customer} />
            <MapCard title="Opportunity" body={maps.opportunity} />
            <MapCard title="Threat" body={maps.threat} />
          </div>
          {maps.calls && maps.calls.length > 0 ? (
            <div className="mt-8">
              <h3 className="font-display text-2xl">Scale · experiment · shrink · defer · kill</h3>
              <div className="mt-4 space-y-3">
                {maps.calls.map((c) => (
                  <div
                    key={c.initiative}
                    className="flex flex-col gap-2 rounded-lg border border-border bg-bg-elevated p-4 sm:flex-row sm:items-start sm:gap-6"
                  >
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[10px] uppercase tracking-[0.18em]",
                        c.call === "scale"
                          ? "text-verified"
                          : c.call === "kill"
                            ? "text-critical"
                            : "text-important",
                      )}
                    >
                      {c.call}
                    </span>
                    <div>
                      <p className="font-medium">{c.initiative}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{c.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

function Prose({
  kicker,
  body,
  className,
}: {
  kicker: string;
  body?: string;
  className?: string;
}) {
  if (!body) return null;
  return (
    <div className={className}>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted">
        {kicker}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function List({
  kicker,
  items,
  className,
}: {
  kicker: string;
  items?: string[];
  className?: string;
}) {
  if (!items?.length) return null;
  return (
    <div className={className}>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted">
        {kicker}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MapCard({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <article className="rounded-lg border border-border bg-bg-elevated p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-fg">{body}</p>
    </article>
  );
}
