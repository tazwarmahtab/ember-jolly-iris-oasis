import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { loadItem } from "@/lib/neia/server";
import { AppShell } from "@/components/app-shell";
import { MetaPills, SeverityMark } from "@/components/severity";
import { categoryLabel, formatDate, impactLabel } from "@/lib/neia/format";

export const Route = createFileRoute("/item/$id")({
  loader: ({ params }) => loadItem({ data: { id: params.id } }),
  component: ItemPage,
});

function ItemPage() {
  const { desk, item } = Route.useLoaderData();

  if (!item) {
    return (
      <AppShell desk={desk}>
        <div className="px-6 py-16">
          <p className="text-muted">That intelligence item is not on the desk.</p>
          <Link to="/" className="mt-4 inline-block text-sm underline">
            Back to daily brief
          </Link>
        </div>
      </AppShell>
    );
  }

  const questions: { n: string; q: string; a: string }[] = [
    { n: "01", q: "What happened?", a: item.whatHappened },
    { n: "02", q: "Is it verified?", a: item.evidence },
    { n: "03", q: "What changed?", a: item.whatChanged },
    { n: "04", q: "Why it matters", a: item.whyItMatters },
    { n: "05", q: "Who benefits", a: item.whoBenefits },
    { n: "06", q: "Who loses", a: item.whoLoses },
    { n: "07", q: "What could happen next", a: item.whatNext },
    { n: "08", q: "So what for Netso", a: item.netsoMeaning },
    { n: "09", q: "What should we do", a: item.recommendedAction },
    { n: "10", q: "How urgent", a: item.deadline ?? "No hard deadline on the desk — still ranked by urgency score." },
  ];

  return (
    <AppShell desk={desk}>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Daily brief
        </Link>

        <article className="mt-6 rounded-xl bg-paper p-6 text-paper-ink sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SeverityMark severity={item.severity} />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-muted">
              {formatDate(item.eventDate)}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {item.title}
          </h1>
          <div className="mt-4">
            <MetaPills
              onPaper
              confidence={item.confidence}
              level={item.verificationLevel}
              category={categoryLabel(item.category)}
              score={item.priorityScore}
            />
          </div>
          {item.impactTags.length > 0 ? (
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-muted">
              {item.impactTags.map(impactLabel).join(" · ")}
            </p>
          ) : null}

          {item.conflictAlert ? (
            <div className="mt-6 rounded-md border border-paper-line p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-critical">
                Conflict alert
              </p>
              <p className="mt-2 text-sm leading-relaxed">{item.conflictAlert}</p>
            </div>
          ) : null}

          <ol className="mt-8 space-y-6">
            {questions.map((row) => (
              <li key={row.n}>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted">
                  {row.n} · {row.q}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed">{row.a}</p>
              </li>
            ))}
          </ol>

          {item.numbers.length > 0 ? (
            <div className="mt-8 border-t border-paper-line pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted">
                Extracted figures
              </p>
              <ul className="mt-3 space-y-2">
                {item.numbers.map((n) => (
                  <li key={`${n.label}-${n.original}`} className="text-sm">
                    <span className="text-paper-muted">{n.label}: </span>
                    <span className="font-mono tabular-nums">{n.original}</span>
                    {n.converted ? (
                      <span className="text-paper-muted"> → {n.converted}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {item.citations.length > 0 ? (
            <div className="mt-8 border-t border-paper-line pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted">
                Strongest sources
              </p>
              <ul className="mt-3 space-y-2">
                {item.citations.map((c) => (
                  <li key={c.name} className="text-sm">
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-paper-line underline-offset-4 hover:decoration-paper-ink"
                      >
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <dl className="mt-8 grid grid-cols-5 gap-2 border-t border-paper-line pt-6 text-center">
            <Score n={item.impact} l="Impact" />
            <Score n={item.urgency} l="Urgency" />
            <Score n={item.probability} l="Prob." />
            <Score n={item.relevance} l="Netso" />
            <Score n={item.quality} l="Quality" />
          </dl>
        </article>
      </div>
    </AppShell>
  );
}

function Score({ n, l }: { n: number; l: string }) {
  return (
    <div>
      <dt className="font-mono text-[9px] uppercase tracking-wider text-paper-muted">{l}</dt>
      <dd className="mt-1 font-mono text-lg tabular-nums">{n}</dd>
    </div>
  );
}
