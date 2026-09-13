import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IntelligenceItem } from "@/lib/neia/types";
import { categoryLabel, formatDate } from "@/lib/neia/format";
import { MetaPills, SeverityMark } from "@/components/severity";

export function ItemCard({
  item,
  featured = false,
}: {
  item: IntelligenceItem;
  featured?: boolean;
}) {
  const bar =
    item.severity === "critical"
      ? "bg-critical"
      : item.severity === "important"
        ? "bg-important"
        : "bg-watch";

  return (
    <Link
      to="/item/$id"
      params={{ id: item.id }}
      className={cn(
        "group relative block overflow-hidden rounded-lg bg-paper p-5 text-paper-ink shadow-[0_0_0_1px_rgba(22,22,21,0.06)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5",
        featured ? "p-6 sm:p-7" : "",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-[3px]", bar)} />
      <div className="flex flex-wrap items-center justify-between gap-2 pl-2">
        <SeverityMark severity={item.severity} />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-muted">
          {formatDate(item.eventDate)}
        </span>
      </div>
      <h3
        className={cn(
          "mt-3 pl-2 font-display leading-snug tracking-tight text-paper-ink",
          featured ? "text-2xl sm:text-[1.7rem]" : "text-lg",
        )}
      >
        {item.title}
      </h3>
      <p className="mt-3 pl-2 text-sm leading-relaxed text-paper-muted">
        {featured ? item.netsoMeaning : item.whyItMatters}
      </p>
      {featured && item.conflictAlert ? (
        <div className="mt-4 rounded-md border border-paper-line bg-paper px-3 py-3 pl-3 ml-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-critical">
            Conflict alert
          </p>
          <p className="mt-1 text-sm leading-relaxed text-paper-ink">
            {item.conflictAlert}
          </p>
        </div>
      ) : null}
      <div className="mt-4 pl-2">
        <MetaPills
          onPaper
          confidence={item.confidence}
          level={item.verificationLevel}
          category={categoryLabel(item.category)}
          score={item.priorityScore}
        />
      </div>
      <p className="mt-4 flex items-center gap-1 pl-2 text-sm font-medium text-paper-ink">
        So what for Netso
        <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
      </p>
      {featured ? (
        <p className="mt-1 pl-2 text-sm leading-relaxed text-paper-muted">
          {item.recommendedAction}
        </p>
      ) : null}
    </Link>
  );
}

export function SectionHead({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <header className="mb-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {kicker}
      </p>
      <h2 className="mt-1 font-display text-2xl tracking-tight text-fg">{title}</h2>
    </header>
  );
}
