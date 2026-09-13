import type {
  Assumption,
  Brief,
  Category,
  Citation,
  Confidence,
  CycleRun,
  ImpactTag,
  IntelligenceItem,
  MarketNumber,
  Severity,
  Signal,
  Source,
  SourceKind,
} from "./types";

export type SourceRow = {
  id: string;
  name: string;
  kind: string;
  url: string | null;
  platform: string | null;
  country: string | null;
  focus: string | null;
  tier: number;
  score: number;
  score_primary: number;
  score_accuracy: number;
  score_expertise: number;
  score_speed: number;
  score_relevance: number;
  score_transparency: number;
  score_independence: number;
  rationale: string;
  last_signal_at: string | null;
};

export type ItemRow = {
  id: string;
  event_key: string;
  title: string;
  what_happened: string;
  evidence: string;
  what_changed: string;
  why_it_matters: string;
  who_benefits: string;
  who_loses: string;
  what_next: string;
  netso_meaning: string;
  recommended_action: string;
  deadline: string | null;
  severity: string;
  category: string;
  impact_tags: string;
  confidence: string;
  verification_level: number;
  conflict_alert: string | null;
  impact: number;
  urgency: number;
  probability: number;
  relevance: number;
  quality: number;
  priority_score: number;
  citations_json: string;
  numbers_json: string;
  event_date: string | null;
  created_at: string;
};

export type BriefRow = {
  id: string;
  kind: string;
  brief_date: string;
  strategic_interpretation: string;
  recommended_actions_json: string;
  start_stop_json: string;
  maps_json: string;
};

export type AssumptionRow = {
  id: string;
  category: string;
  label: string;
  value: string;
  unit: string | null;
  previous_value: string | null;
  original_figure: string | null;
  confidence: string;
  needs_review: boolean | number | string;
  review_reason: string | null;
  source_note: string | null;
  sort_order: number;
  updated_at: string;
};

export type SignalRow = {
  id: string;
  kind: string;
  title: string;
  description: string;
  potential_value: string | null;
  probability: string | null;
  time_sensitivity: string | null;
  execution_difficulty: string | null;
  strategic_fit: string | null;
  rank: number;
};

export type CycleRow = {
  id: string;
  kind: string;
  status: string;
  summary: string | null;
  error: string | null;
  item_count: number;
  created_at: string;
};

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function asBool(v: boolean | number | string): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  return v === "t" || v === "true" || v === "1";
}

export function mapSource(row: SourceRow): Source {
  const tier = row.tier === 1 || row.tier === 2 || row.tier === 3 ? row.tier : 3;
  return {
    id: row.id,
    name: row.name,
    kind: row.kind as SourceKind,
    url: row.url,
    platform: row.platform,
    country: row.country,
    focus: row.focus,
    tier,
    score: row.score,
    scorePrimary: row.score_primary,
    scoreAccuracy: row.score_accuracy,
    scoreExpertise: row.score_expertise,
    scoreSpeed: row.score_speed,
    scoreRelevance: row.score_relevance,
    scoreTransparency: row.score_transparency,
    scoreIndependence: row.score_independence,
    rationale: row.rationale,
    lastSignalAt: row.last_signal_at,
  };
}

export function mapItem(row: ItemRow): IntelligenceItem {
  const level = [1, 2, 3, 4, 5].includes(row.verification_level)
    ? (row.verification_level as 1 | 2 | 3 | 4 | 5)
    : 2;
  return {
    id: row.id,
    eventKey: row.event_key,
    title: row.title,
    whatHappened: row.what_happened,
    evidence: row.evidence,
    whatChanged: row.what_changed,
    whyItMatters: row.why_it_matters,
    whoBenefits: row.who_benefits,
    whoLoses: row.who_loses,
    whatNext: row.what_next,
    netsoMeaning: row.netso_meaning,
    recommendedAction: row.recommended_action,
    deadline: row.deadline,
    severity: row.severity as Severity,
    category: row.category as Category,
    impactTags: parseJson<ImpactTag[]>(row.impact_tags, []),
    confidence: row.confidence as Confidence,
    verificationLevel: level,
    conflictAlert: row.conflict_alert,
    impact: row.impact,
    urgency: row.urgency,
    probability: row.probability,
    relevance: row.relevance,
    quality: row.quality,
    priorityScore: row.priority_score,
    citations: parseJson<Citation[]>(row.citations_json, []),
    numbers: parseJson<MarketNumber[]>(row.numbers_json, []),
    eventDate: row.event_date,
    createdAt: row.created_at,
  };
}

export function mapBrief(row: BriefRow): Brief {
  const kind =
    row.kind === "weekly" || row.kind === "monthly" ? row.kind : "daily";
  return {
    id: row.id,
    kind,
    briefDate: row.brief_date,
    strategicInterpretation: row.strategic_interpretation,
    recommendedActions: parseJson<string[]>(row.recommended_actions_json, []),
    startStop: parseJson(row.start_stop_json, {}),
    maps: parseJson(row.maps_json, {}),
  };
}

export function mapAssumption(row: AssumptionRow): Assumption {
  return {
    id: row.id,
    category: row.category,
    label: row.label,
    value: row.value,
    unit: row.unit,
    previousValue: row.previous_value,
    originalFigure: row.original_figure,
    confidence: row.confidence as Confidence,
    needsReview: asBool(row.needs_review),
    reviewReason: row.review_reason,
    sourceNote: row.source_note,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

export function mapSignal(row: SignalRow): Signal {
  return {
    id: row.id,
    kind: row.kind === "threat" ? "threat" : "opportunity",
    title: row.title,
    description: row.description,
    potentialValue: row.potential_value,
    probability: row.probability,
    timeSensitivity: row.time_sensitivity,
    executionDifficulty: row.execution_difficulty,
    strategicFit: row.strategic_fit,
    rank: row.rank,
  };
}

export function mapCycle(row: CycleRow): CycleRun {
  return {
    id: row.id,
    kind: row.kind,
    status: row.status,
    summary: row.summary,
    error: row.error,
    itemCount: row.item_count,
    createdAt: row.created_at,
  };
}

export function clampScore(n: unknown, max = 10): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(max, Math.round(v)));
}

export function priorityOf(
  impact: number,
  urgency: number,
  probability: number,
  relevance: number,
  quality: number,
): number {
  return Math.round((impact * urgency * probability * relevance * quality) / 1000);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function slugId(prefix: string, key: string): string {
  const clean = key
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${prefix}-${clean || "item"}`;
}
