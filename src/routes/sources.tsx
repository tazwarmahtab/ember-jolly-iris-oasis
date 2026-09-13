import { createFileRoute } from "@tanstack/react-router";
import { loadSources, runSourceScout } from "@/lib/neia/server";
import { AppShell } from "@/components/app-shell";
import { RunCycleButton } from "@/components/run-cycle";
import type { Source } from "@/lib/neia/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sources")({
  loader: () => loadSources(),
  component: SourcesPage,
});

function SourcesPage() {
  const { desk, sources } = Route.useLoaderData();
  const t1 = sources.filter((s) => s.tier === 1);
  const t2 = sources.filter((s) => s.tier === 2);
  const t3 = sources.filter((s) => s.tier === 3);

  return (
    <AppShell desk={desk}>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
              Agent 1
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Source scout</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Discovers and scores institutions, regulators, media, financiers and
              researchers before NEIA monitors them. Rank is decision relevance, not
              follower count. Viral posts are not gazettes.
            </p>
          </div>
          <RunCycleButton
            label="Discover sources"
            pendingLabel="Scouting live web"
            run={() => runSourceScout()}
            variant="secondary"
          />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Must monitor" value={t1.length} hint="Tier 1" />
          <Stat label="High value" value={t2.length} hint="Tier 2" />
          <Stat label="Signal" value={t3.length} hint="Tier 3" />
        </div>

        <TierBlock title="Tier 1 — must monitor" sources={t1} />
        <TierBlock title="Tier 2 — high value" sources={t2} />
        <TierBlock title="Tier 3 — signal" sources={t3} />
      </div>
    </AppShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl tabular-nums">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-subtle">{hint}</p>
    </div>
  );
}

function TierBlock({ title, sources }: { title: string; sources: Source[] }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl tracking-tight">{title}</h2>
      <div className="mt-4 grid gap-3">
        {sources.map((s) => (
          <article
            key={s.id}
            className="rounded-lg border border-border bg-bg-elevated p-4 sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-fg">{s.name}</h3>
                  <span className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                    {s.kind}
                  </span>
                </div>
                {s.focus ? (
                  <p className="mt-1 text-sm text-muted">{s.focus}</p>
                ) : null}
                <p className="mt-2 text-sm leading-relaxed text-subtle">{s.rationale}</p>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-fg underline decoration-border underline-offset-4 hover:decoration-fg"
                  >
                    {s.url.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <p className="mt-2 text-xs text-subtle">URL unverified — not invented</p>
                )}
              </div>
              <ScoreRing score={s.score} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4 lg:grid-cols-7">
              <ScoreCell label="Primary" value={s.scorePrimary} max={25} />
              <ScoreCell label="Accuracy" value={s.scoreAccuracy} max={20} />
              <ScoreCell label="Expertise" value={s.scoreExpertise} max={15} />
              <ScoreCell label="Speed" value={s.scoreSpeed} max={10} />
              <ScoreCell label="Relevance" value={s.scoreRelevance} max={15} />
              <ScoreCell label="Evidence" value={s.scoreTransparency} max={10} />
              <ScoreCell label="Independence" value={s.scoreIndependence} max={5} />
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-full border border-border">
      <span className="font-mono text-lg tabular-nums leading-none">{score}</span>
      <span className="text-[9px] uppercase tracking-wider text-muted">/100</span>
    </div>
  );
}

function ScoreCell({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-fg">
          {value}/{max}
        </span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-bg-subtle">
        <div
          className={cn("h-full rounded-full bg-accent")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
