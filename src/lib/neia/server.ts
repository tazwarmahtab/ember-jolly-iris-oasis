import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import {
  MONTHLY_INSTRUCTIONS,
  NEIA_INSTRUCTIONS,
  SOURCE_SCOUT_INSTRUCTIONS,
  WEEKLY_INSTRUCTIONS,
} from "./prompts";
import { dailySchema, monthlySchema, scoutSchema, weeklySchema } from "./schemas";
import {
  SEED_ASSUMPTIONS,
  SEED_BRIEF_DAILY,
  SEED_BRIEF_MONTHLY,
  SEED_BRIEF_WEEKLY,
  SEED_ITEMS,
  SEED_SIGNALS,
  SEED_SOURCES,
} from "./seed-data";
import {
  clampScore,
  mapAssumption,
  mapBrief,
  mapCycle,
  mapItem,
  mapSignal,
  mapSource,
  priorityOf,
  slugId,
  todayISO,
  type AssumptionRow,
  type BriefRow,
  type CycleRow,
  type ItemRow,
  type SignalRow,
  type SourceRow,
} from "./mappers";
import { grokJson } from "./xai";
import type {
  Assumption,
  Brief,
  CycleResult,
  DeskState,
  IntelligenceItem,
  Signal,
  Source,
} from "./types";

let seeding: Promise<void> | null = null;

async function seedIfEmpty(): Promise<void> {
  if (seeding) return seeding;
  seeding = (async () => {
    const sql = await getSql();
    const [{ n }] = await sql<{ n: number }>`select count(*)::int as n from sources`;
    if (n > 0) return;

    for (const s of SEED_SOURCES) {
      await sql`
        insert into sources (
          id, name, kind, url, platform, country, focus, tier, score,
          score_primary, score_accuracy, score_expertise, score_speed,
          score_relevance, score_transparency, score_independence, rationale, last_signal_at
        ) values (
          ${s.id}, ${s.name}, ${s.kind}, ${s.url}, ${s.platform}, ${s.country}, ${s.focus},
          ${s.tier}, ${s.score}, ${s.scorePrimary}, ${s.scoreAccuracy}, ${s.scoreExpertise},
          ${s.scoreSpeed}, ${s.scoreRelevance}, ${s.scoreTransparency}, ${s.scoreIndependence},
          ${s.rationale}, ${s.lastSignalAt}
        ) on conflict (id) do nothing
      `;
    }
    for (const i of SEED_ITEMS) {
      await sql`
        insert into intelligence_items (
          id, event_key, title, what_happened, evidence, what_changed, why_it_matters,
          who_benefits, who_loses, what_next, netso_meaning, recommended_action, deadline,
          severity, category, impact_tags, confidence, verification_level, conflict_alert,
          impact, urgency, probability, relevance, quality, priority_score,
          citations_json, numbers_json, event_date
        ) values (
          ${i.id}, ${i.eventKey}, ${i.title}, ${i.whatHappened}, ${i.evidence}, ${i.whatChanged},
          ${i.whyItMatters}, ${i.whoBenefits}, ${i.whoLoses}, ${i.whatNext}, ${i.netsoMeaning},
          ${i.recommendedAction}, ${i.deadline}, ${i.severity}, ${i.category},
          ${JSON.stringify(i.impactTags)}, ${i.confidence}, ${i.verificationLevel}, ${i.conflictAlert},
          ${i.impact}, ${i.urgency}, ${i.probability}, ${i.relevance}, ${i.quality}, ${i.priorityScore},
          ${JSON.stringify(i.citations)}, ${JSON.stringify(i.numbers)}, ${i.eventDate}
        ) on conflict (id) do nothing
      `;
    }
    for (const b of [SEED_BRIEF_DAILY, SEED_BRIEF_WEEKLY, SEED_BRIEF_MONTHLY]) {
      await sql`
        insert into briefs (
          id, kind, brief_date, strategic_interpretation, recommended_actions_json, start_stop_json, maps_json
        ) values (
          ${b.id}, ${b.kind}, ${b.briefDate}, ${b.strategicInterpretation},
          ${JSON.stringify(b.recommendedActions)}, ${JSON.stringify(b.startStop)}, ${JSON.stringify(b.maps)}
        ) on conflict (id) do nothing
      `;
    }
    for (const a of SEED_ASSUMPTIONS) {
      await sql`
        insert into assumptions (
          id, category, label, value, unit, previous_value, original_figure, confidence,
          needs_review, review_reason, source_note, sort_order
        ) values (
          ${a.id}, ${a.category}, ${a.label}, ${a.value}, ${a.unit}, ${a.previousValue},
          ${a.originalFigure}, ${a.confidence}, ${a.needsReview}, ${a.reviewReason},
          ${a.sourceNote}, ${a.sortOrder}
        ) on conflict (id) do nothing
      `;
    }
    for (const s of SEED_SIGNALS) {
      await sql`
        insert into signals (
          id, kind, title, description, potential_value, probability, time_sensitivity,
          execution_difficulty, strategic_fit, rank
        ) values (
          ${s.id}, ${s.kind}, ${s.title}, ${s.description}, ${s.potentialValue}, ${s.probability},
          ${s.timeSensitivity}, ${s.executionDifficulty}, ${s.strategicFit}, ${s.rank}
        ) on conflict (id) do nothing
      `;
    }
    await sql`
      insert into cycle_runs (id, kind, status, summary, item_count)
      values (
        ${"seed-desk"}, ${"seed"}, ${"ok"},
        ${"Desk seeded from verified 1–3 September 2026 rooftop-solar package reporting."},
        ${SEED_ITEMS.length}
      ) on conflict (id) do nothing
    `;
  })().finally(() => {
    seeding = null;
  });
  return seeding;
}

async function deskState(): Promise<DeskState> {
  const sql = await getSql();
  const [counts] = await sql<{
    source_count: number;
    tier1_count: number;
    critical_count: number;
    review_count: number;
  }>`
    select
      (select count(*)::int from sources) as source_count,
      (select count(*)::int from sources where tier = 1) as tier1_count,
      (select count(*)::int from intelligence_items where severity = 'critical') as critical_count,
      (select count(*)::int from assumptions where needs_review = true) as review_count
  `;
  const cycles = await sql<CycleRow>`
    select id, kind, status, summary, error, item_count, created_at::text as created_at
    from cycle_runs order by created_at desc limit 1
  `;
  return {
    sourceCount: counts?.source_count ?? 0,
    tier1Count: counts?.tier1_count ?? 0,
    criticalCount: counts?.critical_count ?? 0,
    reviewCount: counts?.review_count ?? 0,
    lastCycle: cycles[0] ? mapCycle(cycles[0]) : null,
    briefDate: todayISO(),
  };
}

export const loadDesk = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfEmpty();
  return deskState();
});

export const loadDaily = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfEmpty();
  const sql = await getSql();
  const items = await sql<ItemRow>`
    select * from intelligence_items
    order by
      case severity when 'critical' then 0 when 'important' then 1 else 2 end,
      priority_score desc, created_at desc
  `;
  const briefs = await sql<BriefRow>`
    select * from briefs where kind = 'daily' order by brief_date desc limit 1
  `;
  const assumptions = await sql<AssumptionRow>`
    select * from assumptions where needs_review = true order by sort_order
  `;
  return {
    desk: await deskState(),
    items: items.map(mapItem),
    brief: briefs[0] ? mapBrief(briefs[0]) : null,
    reviewFlags: assumptions.map(mapAssumption),
  };
});

export const loadSources = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfEmpty();
  const sql = await getSql();
  const rows = await sql<SourceRow>`
    select * from sources order by tier asc, score desc, name asc
  `;
  return { desk: await deskState(), sources: rows.map(mapSource) };
});

export const loadLedger = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfEmpty();
  const sql = await getSql();
  const rows = await sql<AssumptionRow>`select * from assumptions order by sort_order, label`;
  return { desk: await deskState(), assumptions: rows.map(mapAssumption) };
});

export const loadSignals = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfEmpty();
  const sql = await getSql();
  const rows = await sql<SignalRow>`select * from signals order by kind, rank, title`;
  return { desk: await deskState(), signals: rows.map(mapSignal) };
});

export const loadReviews = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfEmpty();
  const sql = await getSql();
  const weekly = await sql<BriefRow>`
    select * from briefs where kind = 'weekly' order by brief_date desc limit 1
  `;
  const monthly = await sql<BriefRow>`
    select * from briefs where kind = 'monthly' order by brief_date desc limit 1
  `;
  return {
    desk: await deskState(),
    weekly: weekly[0] ? mapBrief(weekly[0]) : null,
    monthly: monthly[0] ? mapBrief(monthly[0]) : null,
  };
});

export const loadItem = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await seedIfEmpty();
    const sql = await getSql();
    const rows = await sql<ItemRow>`select * from intelligence_items where id = ${data.id} limit 1`;
    return { desk: await deskState(), item: rows[0] ? mapItem(rows[0]) : null };
  });

async function recordCycle(
  kind: string,
  status: string,
  summary: string | null,
  error: string | null,
  itemCount: number,
) {
  const sql = await getSql();
  const id = `${kind}-${Date.now()}`;
  await sql`
    insert into cycle_runs (id, kind, status, summary, error, item_count)
    values (${id}, ${kind}, ${status}, ${summary}, ${error}, ${itemCount})
  `;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringOrNull(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

async function upsertItem(raw: unknown): Promise<boolean> {
  const o = asRecord(raw);
  if (!o) return false;
  const eventKey = asString(o.event_key).trim();
  const title = asString(o.title).trim();
  if (!eventKey || !title) return false;
  const impact = clampScore(o.impact);
  const urgency = clampScore(o.urgency);
  const probability = clampScore(o.probability);
  const relevance = clampScore(o.relevance);
  const quality = clampScore(o.quality);
  const severity = ["critical", "important", "watch"].includes(asString(o.severity))
    ? asString(o.severity)
    : "watch";
  const confidence = ["high", "medium", "low", "speculation"].includes(asString(o.confidence))
    ? asString(o.confidence)
    : "low";
  const verification = clampScore(o.verification_level, 5) || 1;
  const id = slugId("evt", eventKey);
  const sql = await getSql();
  await sql`
    insert into intelligence_items (
      id, event_key, title, what_happened, evidence, what_changed, why_it_matters,
      who_benefits, who_loses, what_next, netso_meaning, recommended_action, deadline,
      severity, category, impact_tags, confidence, verification_level, conflict_alert,
      impact, urgency, probability, relevance, quality, priority_score,
      citations_json, numbers_json, event_date
    ) values (
      ${id}, ${eventKey}, ${title}, ${asString(o.what_happened)}, ${asString(o.evidence)},
      ${asString(o.what_changed)}, ${asString(o.why_it_matters)}, ${asString(o.who_benefits)},
      ${asString(o.who_loses)}, ${asString(o.what_next)}, ${asString(o.netso_meaning)},
      ${asString(o.recommended_action)}, ${asStringOrNull(o.deadline)}, ${severity},
      ${asString(o.category, "policy")}, ${JSON.stringify(asArray(o.impact_tags))}, ${confidence},
      ${verification}, ${asStringOrNull(o.conflict_alert)}, ${impact}, ${urgency}, ${probability},
      ${relevance}, ${quality}, ${priorityOf(impact, urgency, probability, relevance, quality)},
      ${JSON.stringify(asArray(o.citations))}, ${JSON.stringify(asArray(o.numbers))},
      ${asStringOrNull(o.event_date)}
    )
    on conflict (event_key) do update set
      title = excluded.title,
      what_happened = excluded.what_happened,
      evidence = excluded.evidence,
      what_changed = excluded.what_changed,
      why_it_matters = excluded.why_it_matters,
      who_benefits = excluded.who_benefits,
      who_loses = excluded.who_loses,
      what_next = excluded.what_next,
      netso_meaning = excluded.netso_meaning,
      recommended_action = excluded.recommended_action,
      deadline = excluded.deadline,
      severity = excluded.severity,
      category = excluded.category,
      impact_tags = excluded.impact_tags,
      confidence = excluded.confidence,
      verification_level = excluded.verification_level,
      conflict_alert = excluded.conflict_alert,
      impact = excluded.impact,
      urgency = excluded.urgency,
      probability = excluded.probability,
      relevance = excluded.relevance,
      quality = excluded.quality,
      priority_score = excluded.priority_score,
      citations_json = excluded.citations_json,
      numbers_json = excluded.numbers_json,
      event_date = excluded.event_date
  `;
  return true;
}

export const runSourceScout = createServerFn({ method: "POST" }).handler(async (): Promise<CycleResult> => {
  await seedIfEmpty();
  const sql = await getSql();
  const existing = await sql<SourceRow>`select * from sources order by tier, score desc`;
  const result = await grokJson({
    instructions: SOURCE_SCOUT_INSTRUCTIONS,
    schema: scoutSchema as unknown as Record<string, unknown>,
    maxOutputTokens: 4500,
    input: `Today is ${todayISO()}. Existing source registry (do not invent replacements; upgrade/downgrade with evidence; add only verified new sources):\n${JSON.stringify(
      existing.map(mapSource).map((s) => ({
        id: s.id,
        name: s.name,
        kind: s.kind,
        url: s.url,
        tier: s.tier,
        score: s.score,
      })),
    )}\n\nDiscover and score high-value sources for Netso Energy Limited. Bangladesh rooftop solar, BESS, C&I PPA/RESCO, policy, finance, RMG energy.`,
  });
  if (!result.ok) {
    await recordCycle("scout", "error", null, result.error, 0);
    return result;
  }
  const rec = asRecord(result.value);
  const sources = asArray(rec?.sources);
  let count = 0;
  for (const raw of sources) {
    const o = asRecord(raw);
    if (!o) continue;
    const name = asString(o.name).trim();
    if (!name) continue;
    const id = asString(o.id).trim() || slugId("src", name);
    const primary = clampScore(o.score_primary, 25);
    const accuracy = clampScore(o.score_accuracy, 20);
    const expertise = clampScore(o.score_expertise, 15);
    const speed = clampScore(o.score_speed, 10);
    const relevance = clampScore(o.score_relevance, 15);
    const transparency = clampScore(o.score_transparency, 10);
    const independence = clampScore(o.score_independence, 5);
    const score = Math.min(
      100,
      primary + accuracy + expertise + speed + relevance + transparency + independence,
    );
    const tierRaw = asNumber(o.tier, 3);
    const tier = tierRaw === 1 || tierRaw === 2 ? tierRaw : 3;
    await sql`
      insert into sources (
        id, name, kind, url, platform, country, focus, tier, score,
        score_primary, score_accuracy, score_expertise, score_speed,
        score_relevance, score_transparency, score_independence, rationale, last_signal_at
      ) values (
        ${id}, ${name}, ${asString(o.kind, "media")}, ${asStringOrNull(o.url)},
        ${asStringOrNull(o.platform)}, ${asStringOrNull(o.country)}, ${asStringOrNull(o.focus)},
        ${tier}, ${score}, ${primary}, ${accuracy}, ${expertise}, ${speed}, ${relevance},
        ${transparency}, ${independence}, ${asString(o.rationale)}, ${todayISO()}
      )
      on conflict (id) do update set
        name = excluded.name,
        kind = excluded.kind,
        url = coalesce(excluded.url, sources.url),
        platform = excluded.platform,
        country = excluded.country,
        focus = excluded.focus,
        tier = excluded.tier,
        score = excluded.score,
        score_primary = excluded.score_primary,
        score_accuracy = excluded.score_accuracy,
        score_expertise = excluded.score_expertise,
        score_speed = excluded.score_speed,
        score_relevance = excluded.score_relevance,
        score_transparency = excluded.score_transparency,
        score_independence = excluded.score_independence,
        rationale = excluded.rationale,
        last_signal_at = excluded.last_signal_at
    `;
    count += 1;
  }
  const notes = asString(rec?.notes, `Scout updated ${count} sources.`);
  await recordCycle("scout", "ok", notes, null, count);
  return { ok: true, summary: notes, itemCount: count };
});

export const runDailyCycle = createServerFn({ method: "POST" }).handler(async (): Promise<CycleResult> => {
  await seedIfEmpty();
  const sql = await getSql();
  const sources = await sql<SourceRow>`select id, name, kind, url, tier, score from sources order by tier, score desc`;
  const known = await sql<{ event_key: string; title: string }>`select event_key, title from intelligence_items`;
  const assumptions = await sql<AssumptionRow>`select id, label, value, unit, confidence, needs_review from assumptions`;
  const result = await grokJson({
    instructions: NEIA_INSTRUCTIONS,
    schema: dailySchema as unknown as Record<string, unknown>,
    maxOutputTokens: 7000,
    input: `Today is ${todayISO()}.
Known event_keys (collapse duplicates; only emit if NEW facts exist, otherwise omit):
${JSON.stringify(known)}
Source registry:
${JSON.stringify(sources)}
Assumption ledger:
${JSON.stringify(assumptions)}
Search Bangladesh and international sources NOW for material developments since 1 September 2026 affecting Netso. Prefer primary documents. Return at most 3 critical and 7 important items. Include conflict_alert when numbers disagree.`,
  });
  if (!result.ok) {
    await recordCycle("daily", "error", null, result.error, 0);
    return result;
  }
  const rec = asRecord(result.value);
  let itemCount = 0;
  for (const raw of asArray(rec?.items)) {
    if (await upsertItem(raw)) itemCount += 1;
  }
  for (const raw of asArray(rec?.assumption_flags)) {
    const o = asRecord(raw);
    if (!o) continue;
    const id = asString(o.assumption_id);
    if (!id) continue;
    await sql`
      update assumptions
      set previous_value = value,
          value = ${asString(o.new_value, "FLAGGED")},
          needs_review = true,
          review_reason = ${asString(o.reason, "Flagged by NEIA cycle")},
          updated_at = now()
      where id = ${id}
    `;
  }
  for (const raw of asArray(rec?.opportunities)) {
    const o = asRecord(raw);
    if (!o) continue;
    const title = asString(o.title).trim();
    if (!title) continue;
    const id = asString(o.id).trim() || slugId("sig", title);
    const kind = asString(o.kind) === "threat" ? "threat" : "opportunity";
    await sql`
      insert into signals (
        id, kind, title, description, potential_value, probability, time_sensitivity,
        execution_difficulty, strategic_fit, rank
      ) values (
        ${id}, ${kind}, ${title}, ${asString(o.description)}, ${asStringOrNull(o.potential_value)},
        ${asStringOrNull(o.probability)}, ${asStringOrNull(o.time_sensitivity)},
        ${asStringOrNull(o.execution_difficulty)}, ${asStringOrNull(o.strategic_fit)},
        ${asNumber(o.rank, 99)}
      )
      on conflict (id) do update set
        title = excluded.title,
        description = excluded.description,
        potential_value = excluded.potential_value,
        probability = excluded.probability,
        time_sensitivity = excluded.time_sensitivity,
        execution_difficulty = excluded.execution_difficulty,
        strategic_fit = excluded.strategic_fit,
        rank = excluded.rank
    `;
  }
  const briefId = `brief-daily-${todayISO()}`;
  await sql`
    insert into briefs (
      id, kind, brief_date, strategic_interpretation, recommended_actions_json, start_stop_json, maps_json
    ) values (
      ${briefId}, ${"daily"}, ${todayISO()}, ${asString(rec?.strategic_interpretation)},
      ${JSON.stringify(asArray(rec?.recommended_actions).map((x) => asString(x)).filter(Boolean).slice(0, 5))},
      ${"{}"}, ${"{}"}
    )
    on conflict (id) do update set
      strategic_interpretation = excluded.strategic_interpretation,
      recommended_actions_json = excluded.recommended_actions_json
  `;
  const summary = asString(
    rec?.strategic_interpretation,
    `Daily cycle wrote ${itemCount} items.`,
  ).slice(0, 400);
  await recordCycle("daily", "ok", summary, null, itemCount);
  return { ok: true, summary, itemCount };
});

export const runWeeklyCycle = createServerFn({ method: "POST" }).handler(async (): Promise<CycleResult> => {
  await seedIfEmpty();
  const sql = await getSql();
  const items = await sql<ItemRow>`
    select title, severity, category, netso_meaning, recommended_action, confidence, verification_level
    from intelligence_items order by priority_score desc limit 24
  `;
  const result = await grokJson({
    instructions: WEEKLY_INSTRUCTIONS,
    schema: weeklySchema as unknown as Record<string, unknown>,
    maxOutputTokens: 5000,
    input: `Today is ${todayISO()}. Desk items:\n${JSON.stringify(items)}\nWrite the weekly strategic report. Search only to fill gaps. Do not invent.`,
  });
  if (!result.ok) {
    await recordCycle("weekly", "error", null, result.error, 0);
    return result;
  }
  const rec = asRecord(result.value) ?? {};
  const startStop = {
    biggest: asArray(rec.biggest).map((x) => asString(x)),
    policy: asString(rec.policy),
    market: asString(rec.market),
    competitors: asString(rec.competitors),
    technology: asString(rec.technology),
    financing: asString(rec.financing),
    customers: asString(rec.customers),
    threats: asString(rec.threats),
    opportunities: asString(rec.opportunities),
    numbers: asArray(rec.numbers).map((x) => asString(x)),
    implications: asString(rec.implications),
    start: asArray(rec.start).map((x) => asString(x)),
    stop: asArray(rec.stop).map((x) => asString(x)),
    defer: asArray(rec.defer).map((x) => asString(x)),
    accelerate: asArray(rec.accelerate).map((x) => asString(x)),
    weeklyActions: asArray(rec.weekly_actions).map((x) => asString(x)),
  };
  const id = `brief-weekly-${todayISO()}`;
  await sql`
    insert into briefs (
      id, kind, brief_date, strategic_interpretation, recommended_actions_json, start_stop_json, maps_json
    ) values (
      ${id}, ${"weekly"}, ${todayISO()}, ${asString(rec.strategic_interpretation)},
      ${JSON.stringify(asArray(rec.recommended_actions).map((x) => asString(x)).slice(0, 8))},
      ${JSON.stringify(startStop)}, ${"{}"}
    )
    on conflict (id) do update set
      strategic_interpretation = excluded.strategic_interpretation,
      recommended_actions_json = excluded.recommended_actions_json,
      start_stop_json = excluded.start_stop_json
  `;
  await recordCycle("weekly", "ok", asString(rec.strategic_interpretation).slice(0, 400), null, 1);
  return { ok: true, summary: "Weekly strategic report updated.", itemCount: 1 };
});

export const runMonthlyCycle = createServerFn({ method: "POST" }).handler(async (): Promise<CycleResult> => {
  await seedIfEmpty();
  const sql = await getSql();
  const items = await sql<ItemRow>`
    select title, severity, netso_meaning, recommended_action from intelligence_items
    order by priority_score desc limit 24
  `;
  const result = await grokJson({
    instructions: MONTHLY_INSTRUCTIONS,
    schema: monthlySchema as unknown as Record<string, unknown>,
    maxOutputTokens: 4000,
    input: `Today is ${todayISO()}. Desk items:\n${JSON.stringify(items)}\nWrite the monthly CEO review.`,
  });
  if (!result.ok) {
    await recordCycle("monthly", "error", null, result.error, 0);
    return result;
  }
  const rec = asRecord(result.value) ?? {};
  const maps = {
    market: asString(rec.market),
    regulatory: asString(rec.regulatory),
    competitor: asString(rec.competitor),
    financing: asString(rec.financing),
    technology: asString(rec.technology),
    customer: asString(rec.customer),
    opportunity: asString(rec.opportunity),
    threat: asString(rec.threat),
    calls: asArray(rec.calls),
  };
  const id = `brief-monthly-${todayISO().slice(0, 7)}`;
  await sql`
    insert into briefs (
      id, kind, brief_date, strategic_interpretation, recommended_actions_json, start_stop_json, maps_json
    ) values (
      ${id}, ${"monthly"}, ${todayISO()}, ${asString(rec.strategic_interpretation)},
      ${JSON.stringify(asArray(rec.recommended_actions).map((x) => asString(x)).slice(0, 8))},
      ${"{}"}, ${JSON.stringify(maps)}
    )
    on conflict (id) do update set
      strategic_interpretation = excluded.strategic_interpretation,
      recommended_actions_json = excluded.recommended_actions_json,
      maps_json = excluded.maps_json
  `;
  await recordCycle("monthly", "ok", asString(rec.strategic_interpretation).slice(0, 400), null, 1);
  return { ok: true, summary: "Monthly strategic review updated.", itemCount: 1 };
});

export type DailyPayload = {
  desk: DeskState;
  items: IntelligenceItem[];
  brief: Brief | null;
  reviewFlags: Assumption[];
};
export type SourcesPayload = { desk: DeskState; sources: Source[] };
export type LedgerPayload = { desk: DeskState; assumptions: Assumption[] };
export type SignalsPayload = { desk: DeskState; signals: Signal[] };
export type ReviewsPayload = { desk: DeskState; weekly: Brief | null; monthly: Brief | null };
