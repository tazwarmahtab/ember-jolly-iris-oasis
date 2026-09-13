import { cn } from "@/lib/utils";
import type { Confidence, Severity } from "@/lib/neia/types";
import { confidenceLabel, verificationLabel } from "@/lib/neia/format";

export function SeverityMark({
  severity,
  compact = false,
}: {
  severity: Severity;
  compact?: boolean;
}) {
  const color =
    severity === "critical"
      ? "bg-critical"
      : severity === "important"
        ? "bg-important"
        : "bg-watch";
  const label =
    severity === "critical" ? "Critical" : severity === "important" ? "Important" : "Watch";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-medium uppercase tracking-[0.14em]",
        compact ? "text-[10px]" : "text-[11px]",
      )}
    >
      <span className={cn("size-1.5 rounded-full", color)} />
      {label}
    </span>
  );
}

export function MetaPills({
  confidence,
  level,
  category,
  score,
  onPaper = false,
}: {
  confidence: Confidence;
  level: number;
  category?: string;
  score?: number;
  onPaper?: boolean;
}) {
  const pill = onPaper
    ? "border-paper-line text-paper-muted"
    : "border-border text-muted";
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className={cn("rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", pill)}>
        {verificationLabel(level)}
      </span>
      <span className={cn("rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", pill)}>
        {confidenceLabel(confidence)}
      </span>
      {category ? (
        <span className={cn("rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", pill)}>
          {category}
        </span>
      ) : null}
      {typeof score === "number" ? (
        <span className={cn("rounded-sm border px-2 py-0.5 font-mono text-[10px] tabular-nums tracking-wider", pill)}>
          {score}
        </span>
      ) : null}
    </div>
  );
}
