import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Dm0WEJhU.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_neia_default = "create table if not exists sources (\n  id text primary key,\n  name text not null,\n  kind text not null,\n  url text,\n  platform text,\n  country text,\n  focus text,\n  tier integer not null,\n  score integer not null,\n  score_primary integer not null default 0,\n  score_accuracy integer not null default 0,\n  score_expertise integer not null default 0,\n  score_speed integer not null default 0,\n  score_relevance integer not null default 0,\n  score_transparency integer not null default 0,\n  score_independence integer not null default 0,\n  rationale text not null default '',\n  last_signal_at timestamptz,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists intelligence_items (\n  id text primary key,\n  event_key text not null,\n  title text not null,\n  what_happened text not null,\n  evidence text not null,\n  what_changed text not null default '',\n  why_it_matters text not null,\n  who_benefits text not null default '',\n  who_loses text not null default '',\n  what_next text not null default '',\n  netso_meaning text not null,\n  recommended_action text not null,\n  deadline text,\n  severity text not null,\n  category text not null,\n  impact_tags text not null default '[]',\n  confidence text not null,\n  verification_level integer not null,\n  conflict_alert text,\n  impact integer not null default 0,\n  urgency integer not null default 0,\n  probability integer not null default 0,\n  relevance integer not null default 0,\n  quality integer not null default 0,\n  priority_score integer not null default 0,\n  citations_json text not null default '[]',\n  numbers_json text not null default '[]',\n  event_date date,\n  created_at timestamptz not null default now()\n);\n\ncreate unique index if not exists intelligence_items_event_key_idx\n  on intelligence_items (event_key);\n\ncreate table if not exists briefs (\n  id text primary key,\n  kind text not null,\n  brief_date date not null,\n  strategic_interpretation text not null default '',\n  recommended_actions_json text not null default '[]',\n  start_stop_json text not null default '{}',\n  maps_json text not null default '{}',\n  created_at timestamptz not null default now()\n);\n\ncreate unique index if not exists briefs_kind_date_idx\n  on briefs (kind, brief_date);\n\ncreate table if not exists assumptions (\n  id text primary key,\n  category text not null,\n  label text not null,\n  value text not null,\n  unit text,\n  previous_value text,\n  original_figure text,\n  confidence text not null,\n  needs_review boolean not null default false,\n  review_reason text,\n  source_note text,\n  sort_order integer not null default 0,\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists signals (\n  id text primary key,\n  kind text not null,\n  title text not null,\n  description text not null,\n  potential_value text,\n  probability text,\n  time_sensitivity text,\n  execution_difficulty text,\n  strategic_fit text,\n  rank integer not null default 0,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists cycle_runs (\n  id text primary key,\n  kind text not null,\n  status text not null,\n  summary text,\n  error text,\n  item_count integer not null default 0,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists cycle_runs_created_at_idx on cycle_runs (created_at desc);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_neia.sql": _0002_neia_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var SOURCE_SCOUT_INSTRUCTIONS = `You are SOURCE SCOUT, Agent 1 of the Netso Energy Intelligence system (NEIA).

Netso Energy Limited is a Bangladesh-focused distributed-energy infrastructure company developing rooftop solar, battery-backed solar, zero-CAPEX solar / PPA / RESCO models, and related energy infrastructure for commercial and institutional customers (RMG, factories, hospitals, campuses, commercial buildings).

Your job is NOT to write news. Your job is to discover and score the actual sources NEIA must monitor.

## Discovery method
1. Search broadly across Bangladesh government, regulators, utilities, gazettes, tenders, business media, energy journals, DFIs, research houses, and relevant executives.
2. Identify recurring high-quality sources, officials who make consequential statements, organisations publishing primary data, and companies leading C&I solar / storage / RESCO in Bangladesh and comparable markets.
3. Do NOT invent accounts, URLs, executives, or handles. If a URL is not verified in search results, set url to null.
4. Do NOT assume follower count equals importance.
5. Rank: Decision relevance × information quality × information speed × credibility × Netso strategic relevance.

## Tiers
- TIER 1: Information could directly change Netso's decisions this quarter.
- TIER 2: High-value strategic intelligence.
- TIER 3: Useful signal, lower frequency or confidence.

## Score 0–100 using these weights (must sum conceptually to 100)
- Primary-source status: 25
- Historical accuracy: 20
- Expertise: 15
- Information speed: 10
- Relevance to Netso: 15
- Transparency/evidence: 10
- Independence: 5

Never treat a viral post as equivalent to a government notification.

## Output
Return JSON only matching the schema. Prefer 12–20 sources. Mix: Bangladesh government/regulators/utilities, local quality media, DFIs, research, 2–4 actual competitors if found with evidence. Upgrade/downgrade existing sources when you have evidence.

If you cannot verify a source, omit it.`;
var NEIA_INSTRUCTIONS = `You are NEIA (Netso Energy Intelligence Agent), Agent 2 — the dedicated intelligence layer for Netso Energy Limited.

Netso is a Bangladesh-focused distributed-energy infrastructure company: rooftop solar, battery-backed solar, zero-CAPEX / PPA / RESCO, for commercial and institutional customers.

You are NOT a news aggregator.

Operating question:
"What changed that could materially affect Netso Energy's ability to win customers, deploy capital, finance projects, generate returns, or build strategic advantage?"

## Never confuse information with intelligence
Information: "Bangladesh announced a new rooftop solar incentive."
Intelligence: what changed in economics, who the beneficiary of record is, the deployment window, PPA vs ownership effects, and the decision Netso must take.

Every material item must answer:
1. What happened?
2. Is it verified?
3. What changed?
4. Why it matters
5. Who benefits
6. Who loses
7. What could happen next
8. What this means specifically for Netso
9. What Netso should do
10. How urgent

## Verification levels
1 social claim · 2 one credible outlet · 3 multiple independent media · 4 primary institutional source · 5 primary + independent confirmation.
For strategic decisions prefer 4–5. If conflicting: set conflict_alert with Source A, Source B, difference, likely explanation, confidence, what to check next. Do NOT pick the convenient number.

## Confidence
high = primary or multiple strong sources
medium = credible but incomplete
low = early signal
speculation = hypothesis, not fact

Label UNVERIFIED claims explicitly in evidence. Never invent tariffs, dates, executives, companies, quotes, funding programs, or gazettes. Preserve original figures (Tk, %, MW, dates). If you convert, provide original AND converted AND the assumption.

## Duplicate collapsing
Many outlets on one gazette = ONE event, list strongest sources.

## Impact tags
revenue, margin, capex, financing, demand, regulation, competition, technology, strategy, risk, fundraising

## Severity
critical = act now (max 3)
important = this week (max 7)
watch = potentially important

## Priority inputs (each 0–10)
impact, urgency, probability, netso_relevance, information_quality

## Signal vs noise
Ignore motivational posts, recycled solar stats, AI-generated roundups, promo posts, unverified rumours, celebrity content, and rewrites of old news with no new fact.

## Netso-specific watch
Rooftop solar, net metering, battery storage, tariffs, wheeling, grid connection, captive power, industrial electricity, demand charges, solar equipment tax/VAT/customs, green finance, IDCOL, Bangladesh Bank, RMG energy/ESG, carbon/I-REC, PPAs, local manufacturing, import rules, BSTI/SREDA standards.

Special current context: Bangladesh announced a battery-backed rooftop-solar incentive around Tk 10.50/kWh for eligible surplus electricity, with an installation window toward 28 February 2027. Treat this as known; hunt for NEW facts, gazette text, eligibility (especially whether RESCO/PPA/third-party owned systems qualify), implementation rules, and DISCOM payment mechanics — not restatements.

## Output
JSON only. Collapse to what changed. Every item must end in a Netso action. Bad news faster than good news. If search cannot verify, do not include as fact.`;
var WEEKLY_INSTRUCTIONS = `You are NEIA producing the WEEKLY STRATEGIC INTELLIGENCE REPORT for Netso Energy Limited (Bangladesh C&I rooftop solar, battery-backed solar, zero-CAPEX PPA/RESCO).

Use the supplied desk items plus live search only to fill genuine gaps. Do not invent.

Produce JSON for a weekly report covering:
1 biggest developments
2 policy changes
3 market changes
4 competitor movements (only evidenced)
5 technology changes
6 financing opportunities
7 customer-demand signals
8 emerging threats
9 emerging opportunities
10 important numbers that changed (preserve originals)
11 strategic implications
12 START
13 STOP
14 DEFER
15 ACCELERATE
16 top 5 actions for the coming week

Be commercially minded. Every section must answer SO WHAT FOR NETSO.`;
var MONTHLY_INSTRUCTIONS = `You are NEIA producing the MONTHLY STRATEGIC REVIEW for the CEO of Netso Energy Limited.

Question: "If I were Netso's CEO, what has changed in the external environment that should change my strategy?"

Use supplied desk items plus live search for gaps. Do not invent.

Return JSON with short maps (2–4 sentences each): market, regulatory, competitor, financing, technology, customer, opportunity, threat.

Then calls for major initiatives using ONLY: scale | experiment | shrink | defer | kill
Initiatives to judge (do not invent others unless evidenced):
- Battery-backed C&I rooftop as default product
- Zero-CAPEX PPA / RESCO origination
- RMG / export-factory focus
- Public-building / one-stop-service origination
- Balance-sheet light financing (IDCOL / green refinance / DFI)
- Module-inverter-battery SKU standardisation to BSTI/SREDA

Each call needs a why.`;
var citationSchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		name: { type: "string" },
		url: { type: ["string", "null"] }
	},
	required: ["name", "url"]
};
var scoutSchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		notes: { type: "string" },
		sources: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					id: { type: "string" },
					name: { type: "string" },
					kind: {
						type: "string",
						enum: [
							"institution",
							"regulator",
							"utility",
							"media",
							"research",
							"financier",
							"company",
							"journalist",
							"database",
							"newsletter"
						]
					},
					url: { type: ["string", "null"] },
					platform: { type: ["string", "null"] },
					country: { type: ["string", "null"] },
					focus: { type: ["string", "null"] },
					tier: { type: "integer" },
					score_primary: { type: "integer" },
					score_accuracy: { type: "integer" },
					score_expertise: { type: "integer" },
					score_speed: { type: "integer" },
					score_relevance: { type: "integer" },
					score_transparency: { type: "integer" },
					score_independence: { type: "integer" },
					rationale: { type: "string" }
				},
				required: [
					"id",
					"name",
					"kind",
					"url",
					"platform",
					"country",
					"focus",
					"tier",
					"score_primary",
					"score_accuracy",
					"score_expertise",
					"score_speed",
					"score_relevance",
					"score_transparency",
					"score_independence",
					"rationale"
				]
			}
		}
	},
	required: ["notes", "sources"]
};
var dailySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		strategic_interpretation: { type: "string" },
		recommended_actions: {
			type: "array",
			items: { type: "string" }
		},
		items: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					event_key: { type: "string" },
					title: { type: "string" },
					what_happened: { type: "string" },
					evidence: { type: "string" },
					what_changed: { type: "string" },
					why_it_matters: { type: "string" },
					who_benefits: { type: "string" },
					who_loses: { type: "string" },
					what_next: { type: "string" },
					netso_meaning: { type: "string" },
					recommended_action: { type: "string" },
					deadline: { type: ["string", "null"] },
					severity: {
						type: "string",
						enum: [
							"critical",
							"important",
							"watch"
						]
					},
					category: {
						type: "string",
						enum: [
							"policy",
							"regulation",
							"finance",
							"solar",
							"storage",
							"technology",
							"customer",
							"competitor",
							"global",
							"market"
						]
					},
					impact_tags: {
						type: "array",
						items: { type: "string" }
					},
					confidence: {
						type: "string",
						enum: [
							"high",
							"medium",
							"low",
							"speculation"
						]
					},
					verification_level: { type: "integer" },
					conflict_alert: { type: ["string", "null"] },
					impact: { type: "integer" },
					urgency: { type: "integer" },
					probability: { type: "integer" },
					relevance: { type: "integer" },
					quality: { type: "integer" },
					citations: {
						type: "array",
						items: citationSchema
					},
					numbers: {
						type: "array",
						items: {
							type: "object",
							additionalProperties: false,
							properties: {
								label: { type: "string" },
								original: { type: "string" },
								converted: { type: ["string", "null"] },
								assumption: { type: ["string", "null"] }
							},
							required: [
								"label",
								"original",
								"converted",
								"assumption"
							]
						}
					},
					event_date: { type: ["string", "null"] }
				},
				required: [
					"event_key",
					"title",
					"what_happened",
					"evidence",
					"what_changed",
					"why_it_matters",
					"who_benefits",
					"who_loses",
					"what_next",
					"netso_meaning",
					"recommended_action",
					"deadline",
					"severity",
					"category",
					"impact_tags",
					"confidence",
					"verification_level",
					"conflict_alert",
					"impact",
					"urgency",
					"probability",
					"relevance",
					"quality",
					"citations",
					"numbers",
					"event_date"
				]
			}
		},
		assumption_flags: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					assumption_id: { type: "string" },
					new_value: { type: "string" },
					reason: { type: "string" }
				},
				required: [
					"assumption_id",
					"new_value",
					"reason"
				]
			}
		},
		opportunities: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					id: { type: "string" },
					kind: {
						type: "string",
						enum: ["opportunity", "threat"]
					},
					title: { type: "string" },
					description: { type: "string" },
					potential_value: { type: ["string", "null"] },
					probability: { type: ["string", "null"] },
					time_sensitivity: { type: ["string", "null"] },
					execution_difficulty: { type: ["string", "null"] },
					strategic_fit: { type: ["string", "null"] },
					rank: { type: "integer" }
				},
				required: [
					"id",
					"kind",
					"title",
					"description",
					"potential_value",
					"probability",
					"time_sensitivity",
					"execution_difficulty",
					"strategic_fit",
					"rank"
				]
			}
		}
	},
	required: [
		"strategic_interpretation",
		"recommended_actions",
		"items",
		"assumption_flags",
		"opportunities"
	]
};
var weeklySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		strategic_interpretation: { type: "string" },
		recommended_actions: {
			type: "array",
			items: { type: "string" }
		},
		biggest: {
			type: "array",
			items: { type: "string" }
		},
		policy: { type: "string" },
		market: { type: "string" },
		competitors: { type: "string" },
		technology: { type: "string" },
		financing: { type: "string" },
		customers: { type: "string" },
		threats: { type: "string" },
		opportunities: { type: "string" },
		numbers: {
			type: "array",
			items: { type: "string" }
		},
		implications: { type: "string" },
		start: {
			type: "array",
			items: { type: "string" }
		},
		stop: {
			type: "array",
			items: { type: "string" }
		},
		defer: {
			type: "array",
			items: { type: "string" }
		},
		accelerate: {
			type: "array",
			items: { type: "string" }
		},
		weekly_actions: {
			type: "array",
			items: { type: "string" }
		}
	},
	required: [
		"strategic_interpretation",
		"recommended_actions",
		"biggest",
		"policy",
		"market",
		"competitors",
		"technology",
		"financing",
		"customers",
		"threats",
		"opportunities",
		"numbers",
		"implications",
		"start",
		"stop",
		"defer",
		"accelerate",
		"weekly_actions"
	]
};
var monthlySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		strategic_interpretation: { type: "string" },
		recommended_actions: {
			type: "array",
			items: { type: "string" }
		},
		market: { type: "string" },
		regulatory: { type: "string" },
		competitor: { type: "string" },
		financing: { type: "string" },
		technology: { type: "string" },
		customer: { type: "string" },
		opportunity: { type: "string" },
		threat: { type: "string" },
		calls: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					initiative: { type: "string" },
					call: {
						type: "string",
						enum: [
							"scale",
							"experiment",
							"shrink",
							"defer",
							"kill"
						]
					},
					why: { type: "string" }
				},
				required: [
					"initiative",
					"call",
					"why"
				]
			}
		}
	},
	required: [
		"strategic_interpretation",
		"recommended_actions",
		"market",
		"regulatory",
		"competitor",
		"financing",
		"technology",
		"customer",
		"opportunity",
		"threat",
		"calls"
	]
};
var SEED_SOURCES = [
	{
		id: "src-sreda",
		name: "SREDA",
		kind: "regulator",
		url: "http://www.sreda.gov.bd",
		platform: "web",
		country: "Bangladesh",
		focus: "Renewable policy, net metering, rooftop solar standards",
		tier: 1,
		score: 92,
		scorePrimary: 25,
		scoreAccuracy: 18,
		scoreExpertise: 15,
		scoreSpeed: 7,
		scoreRelevance: 15,
		scoreTransparency: 8,
		scoreIndependence: 4,
		rationale: "Primary regulator for rooftop solar, net metering and equipment standards. Directly changes Netso eligibility.",
		lastSignalAt: "2026-09-01"
	},
	{
		id: "src-power-division",
		name: "Power Division, MPEMR",
		kind: "institution",
		url: "https://powerdivision.gov.bd",
		platform: "web",
		country: "Bangladesh",
		focus: "Gazettes, circulars, rooftop incentive design, one-stop service",
		tier: 1,
		score: 95,
		scorePrimary: 25,
		scoreAccuracy: 19,
		scoreExpertise: 14,
		scoreSpeed: 8,
		scoreRelevance: 15,
		scoreTransparency: 9,
		scoreIndependence: 5,
		rationale: "Issued the rooftop solar incentive package. Primary source for policy text.",
		lastSignalAt: "2026-09-01"
	},
	{
		id: "src-berc",
		name: "Bangladesh Energy Regulatory Commission",
		kind: "regulator",
		url: "http://www.berc.org.bd",
		platform: "web",
		country: "Bangladesh",
		focus: "Tariffs, licensing, net metering orders",
		tier: 1,
		score: 90,
		scorePrimary: 25,
		scoreAccuracy: 18,
		scoreExpertise: 14,
		scoreSpeed: 6,
		scoreRelevance: 15,
		scoreTransparency: 8,
		scoreIndependence: 4,
		rationale: "Tariff and licensing authority. Changes industrial electricity economics.",
		lastSignalAt: null
	},
	{
		id: "src-bpdb",
		name: "Bangladesh Power Development Board",
		kind: "utility",
		url: "https://bpdb.gov.bd",
		platform: "web",
		country: "Bangladesh",
		focus: "Generation, offtake, system data",
		tier: 1,
		score: 84,
		scorePrimary: 22,
		scoreAccuracy: 17,
		scoreExpertise: 13,
		scoreSpeed: 6,
		scoreRelevance: 14,
		scoreTransparency: 8,
		scoreIndependence: 4,
		rationale: "System operator/offtaker context for surplus injection and capacity.",
		lastSignalAt: null
	},
	{
		id: "src-idcol",
		name: "IDCOL",
		kind: "financier",
		url: "https://idcol.org",
		platform: "web",
		country: "Bangladesh",
		focus: "RE project finance, rooftop solar credit lines",
		tier: 1,
		score: 88,
		scorePrimary: 20,
		scoreAccuracy: 18,
		scoreExpertise: 14,
		scoreSpeed: 7,
		scoreRelevance: 15,
		scoreTransparency: 9,
		scoreIndependence: 5,
		rationale: "Principal domestic RE financier. Changes Netso capital stack.",
		lastSignalAt: null
	},
	{
		id: "src-bb",
		name: "Bangladesh Bank",
		kind: "institution",
		url: "https://www.bb.org.bd",
		platform: "web",
		country: "Bangladesh",
		focus: "Green refinance, sustainable finance taxonomy",
		tier: 1,
		score: 86,
		scorePrimary: 22,
		scoreAccuracy: 18,
		scoreExpertise: 12,
		scoreSpeed: 6,
		scoreRelevance: 14,
		scoreTransparency: 9,
		scoreIndependence: 5,
		rationale: "Green refinance and bank guidance bind commercial lenders Netso needs.",
		lastSignalAt: null
	},
	{
		id: "src-bsti",
		name: "Bangladesh Standards and Testing Institution",
		kind: "institution",
		url: "https://bsti.gov.bd",
		platform: "web",
		country: "Bangladesh",
		focus: "Equipment standards for panels, batteries, inverters, meters",
		tier: 1,
		score: 87,
		scorePrimary: 24,
		scoreAccuracy: 17,
		scoreExpertise: 14,
		scoreSpeed: 5,
		scoreRelevance: 15,
		scoreTransparency: 8,
		scoreIndependence: 4,
		rationale: "Incentive package makes BSTI compliance mandatory. SKU gate for Netso.",
		lastSignalAt: "2026-09-01"
	},
	{
		id: "src-dailystar",
		name: "The Daily Star",
		kind: "media",
		url: "https://www.thedailystar.net",
		platform: "web",
		country: "Bangladesh",
		focus: "Business and energy policy reporting",
		tier: 1,
		score: 78,
		scorePrimary: 8,
		scoreAccuracy: 17,
		scoreExpertise: 12,
		scoreSpeed: 9,
		scoreRelevance: 14,
		scoreTransparency: 13,
		scoreIndependence: 5,
		rationale: "High-quality national paper; first detailed write-up of the Tk 10.50 package.",
		lastSignalAt: "2026-09-02"
	},
	{
		id: "src-tbs",
		name: "The Business Standard",
		kind: "media",
		url: "https://www.tbsnews.net",
		platform: "web",
		country: "Bangladesh",
		focus: "Energy, policy, industrial competitiveness",
		tier: 1,
		score: 77,
		scorePrimary: 8,
		scoreAccuracy: 16,
		scoreExpertise: 12,
		scoreSpeed: 9,
		scoreRelevance: 14,
		scoreTransparency: 13,
		scoreIndependence: 5,
		rationale: "Independent confirmation of gazette mechanics and 4,000 MW rooftop ambition.",
		lastSignalAt: "2026-09-01"
	},
	{
		id: "src-reuters",
		name: "Reuters",
		kind: "media",
		url: "https://www.reuters.com",
		platform: "web",
		country: "International",
		focus: "Wire confirmation of Bangladesh energy policy",
		tier: 2,
		score: 74,
		scorePrimary: 6,
		scoreAccuracy: 18,
		scoreExpertise: 10,
		scoreSpeed: 10,
		scoreRelevance: 12,
		scoreTransparency: 13,
		scoreIndependence: 5,
		rationale: "International confirmation; useful for investors, not a substitute for the gazette.",
		lastSignalAt: "2026-09-02"
	},
	{
		id: "src-ieefa",
		name: "IEEFA",
		kind: "research",
		url: "https://ieefa.org",
		platform: "web",
		country: "International",
		focus: "Bangladesh RE transition, fuel-import savings, rooftop economics",
		tier: 2,
		score: 72,
		scorePrimary: 10,
		scoreAccuracy: 16,
		scoreExpertise: 14,
		scoreSpeed: 5,
		scoreRelevance: 13,
		scoreTransparency: 10,
		scoreIndependence: 4,
		rationale: "Serious energy-finance research on Bangladesh rooftop solar barriers.",
		lastSignalAt: "2026-02-03"
	},
	{
		id: "src-ifc",
		name: "IFC / World Bank",
		kind: "financier",
		url: "https://www.ifc.org",
		platform: "web",
		country: "International",
		focus: "Climate finance, C&I solar, emerging-market distributed energy",
		tier: 2,
		score: 80,
		scorePrimary: 15,
		scoreAccuracy: 17,
		scoreExpertise: 14,
		scoreSpeed: 5,
		scoreRelevance: 13,
		scoreTransparency: 11,
		scoreIndependence: 5,
		rationale: "Potential DFI capital and market diagnostics for C&I solar.",
		lastSignalAt: null
	},
	{
		id: "src-iea",
		name: "International Energy Agency",
		kind: "research",
		url: "https://www.iea.org",
		platform: "web",
		country: "International",
		focus: "Solar PV costs, storage, distributed energy, energy reviews",
		tier: 2,
		score: 81,
		scorePrimary: 18,
		scoreAccuracy: 18,
		scoreExpertise: 15,
		scoreSpeed: 5,
		scoreRelevance: 10,
		scoreTransparency: 11,
		scoreIndependence: 4,
		rationale: "Primary global energy statistics; use for CAPEX and storage cost trends.",
		lastSignalAt: null
	},
	{
		id: "src-irena",
		name: "IRENA",
		kind: "research",
		url: "https://www.irena.org",
		platform: "web",
		country: "International",
		focus: "RE costs, distributed generation, policy catalogues",
		tier: 2,
		score: 79,
		scorePrimary: 18,
		scoreAccuracy: 17,
		scoreExpertise: 14,
		scoreSpeed: 5,
		scoreRelevance: 10,
		scoreTransparency: 11,
		scoreIndependence: 4,
		rationale: "Authoritative RE cost and policy dataset.",
		lastSignalAt: null
	},
	{
		id: "src-adb",
		name: "Asian Development Bank",
		kind: "financier",
		url: "https://www.adb.org",
		platform: "web",
		country: "International",
		focus: "Bangladesh power sector, climate finance",
		tier: 2,
		score: 76,
		scorePrimary: 15,
		scoreAccuracy: 16,
		scoreExpertise: 13,
		scoreSpeed: 5,
		scoreRelevance: 12,
		scoreTransparency: 10,
		scoreIndependence: 5,
		rationale: "Active in Bangladesh power; possible blended-finance counterpart.",
		lastSignalAt: null
	},
	{
		id: "src-nbr",
		name: "National Board of Revenue",
		kind: "institution",
		url: "https://nbr.gov.bd",
		platform: "web",
		country: "Bangladesh",
		focus: "Customs, VAT, SROs on solar equipment",
		tier: 1,
		score: 83,
		scorePrimary: 23,
		scoreAccuracy: 17,
		scoreExpertise: 10,
		scoreSpeed: 6,
		scoreRelevance: 14,
		scoreTransparency: 8,
		scoreIndependence: 5,
		rationale: "Tax and duty changes move Netso CAPEX immediately.",
		lastSignalAt: null
	},
	{
		id: "src-fe",
		name: "The Financial Express",
		kind: "media",
		url: "https://thefinancialexpress.com.bd",
		platform: "web",
		country: "Bangladesh",
		focus: "Banking, energy, industrial policy",
		tier: 2,
		score: 68,
		scorePrimary: 6,
		scoreAccuracy: 15,
		scoreExpertise: 11,
		scoreSpeed: 8,
		scoreRelevance: 13,
		scoreTransparency: 11,
		scoreIndependence: 4,
		rationale: "Reliable business daily for financing and industrial electricity.",
		lastSignalAt: null
	},
	{
		id: "src-textile-today",
		name: "Textile Today",
		kind: "media",
		url: "https://textiletoday.com.bd",
		platform: "web",
		country: "Bangladesh",
		focus: "RMG energy costs, green factory, buyer ESG",
		tier: 2,
		score: 70,
		scorePrimary: 8,
		scoreAccuracy: 14,
		scoreExpertise: 13,
		scoreSpeed: 7,
		scoreRelevance: 15,
		scoreTransparency: 9,
		scoreIndependence: 4,
		rationale: "Customer-market primary for RMG energy pain and buyer requirements.",
		lastSignalAt: null
	},
	{
		id: "src-solar-sreda",
		name: "SREDA Solar Portal",
		kind: "database",
		url: "https://solar.sreda.gov.bd",
		platform: "web",
		country: "Bangladesh",
		focus: "Net-metered rooftop statistics, certified equipment",
		tier: 1,
		score: 89,
		scorePrimary: 25,
		scoreAccuracy: 17,
		scoreExpertise: 14,
		scoreSpeed: 6,
		scoreRelevance: 15,
		scoreTransparency: 8,
		scoreIndependence: 4,
		rationale: "Primary installed-capacity and certification database.",
		lastSignalAt: null
	},
	{
		id: "src-ember",
		name: "Ember",
		kind: "research",
		url: "https://ember-energy.org",
		platform: "web",
		country: "International",
		focus: "Electricity data, solar deployment, emerging Asia",
		tier: 3,
		score: 64,
		scorePrimary: 12,
		scoreAccuracy: 15,
		scoreExpertise: 12,
		scoreSpeed: 6,
		scoreRelevance: 8,
		scoreTransparency: 8,
		scoreIndependence: 3,
		rationale: "Useful global electricity dataset; lower Bangladesh specificity.",
		lastSignalAt: null
	}
];
function pri(impact, urgency, probability, relevance, quality) {
	return Math.round(impact * urgency * probability * relevance * quality / 1e3);
}
var SEED_ITEMS = [
	{
		id: "evt-bd-rts-incentive-2026",
		eventKey: "bd-rooftop-solar-battery-incentive-2026",
		title: "Battery-backed rooftop solar incentive set at Tk 10.50/kWh",
		whatHappened: "The Ministry of Power, Energy and Mineral Resources announced a special incentive for rooftop solar systems with battery storage. Eligible surplus electricity supplied to the national grid is priced at Tk 10.50 per unit. Multiple national and wire outlets reported a government circular/gazette around 1–2 September 2026. The package is described as operating under the Net Metering Guidelines 2025.",
		evidence: "The Daily Star (2 Sep 2026), The Business Standard (1–2 Sep 2026) and Reuters (2 Sep 2026) independently report the Tk 10.50 figure, battery requirement, 28 Feb 2027 installation cutoff, three-year payment window to 28 Feb 2030, BSTI/SREDA equipment standards, and bank/MFS-only settlement. Power Division circular cited by TBS: max generation cost Tk 8/unit + 20% profit + 11.25% premium = Tk 10.50. Gazette PDF has not been ingested by NEIA — treat beneficiary-of-record and RESCO eligibility as unverified.",
		whatChanged: "Bangladesh moved from a net-metering / avoided-cost logic toward a time-limited, battery-mandatory, cash-settled surplus tariff above the stated average retail grid price (Tk 10.40/unit per Daily Star). Battery storage is no longer optional for this incentive. There is now a hard origination/installation clock.",
		whyItMatters: "This is the largest rooftop-solar commercial rule change in Bangladesh this year. It can reprice surplus kWh, force battery into the default C&I design, and compress Netso's sales-to-COD cycle into the period before 28 February 2027.",
		whoBenefits: "Owners of battery-backed rooftop systems installed by the cutoff who can export surplus and receive DISCOM-administered payments; compliant equipment suppliers; developers who can close interconnection fast.",
		whoLoses: "Solar-only (no battery) designs chasing this tariff; slow-moving developers; any PPA/RESCO structure that is later found ineligible as 'customer-installed'.",
		whatNext: "Expect implementation circulars from distribution utilities, queueing at one-stop service centres, and a fight over whether third-party-owned systems qualify. Equipment certification lists will become a bottleneck.",
		netsoMeaning: "Netso's unit-economic model, product mix and PPA contracts must be re-tested against a battery-mandatory, 3-year kicker — not a 20-year tariff. The window is real; the legal beneficiary is not yet proven from primary text.",
		recommendedAction: "Obtain the gazette PDF today. Counsel to confirm whether RESCO/PPA/BOO systems qualify, or only customer-owned. Re-run battery-backed vs solar-only IRRs with Tk 10.50 as a scenario, not the base case. Freeze BSTI/SREDA-compliant SKUs.",
		deadline: "2026-09-10 gazette/eligibility; 2027-02-28 installation cutoff",
		severity: "critical",
		category: "policy",
		impactTags: [
			"revenue",
			"margin",
			"capex",
			"regulation",
			"demand",
			"financing",
			"strategy"
		],
		confidence: "high",
		verificationLevel: 4,
		conflictAlert: "EFFECTIVE DATE CONFLICT. Reuters and several local recaps: 1 September 2026. Daily Star: scheme effective 2 September 2026. TBS: gazette issued 1 September 2026 and 'came into effect yesterday' (wording that points at 30–31 August depending on TBS's clock). Tariff (Tk 10.50), cutoff (28 Feb 2027) and battery requirement agree across outlets. Likely explanation: gazette publication vs. force-date vs. press date. Check next: the gazette's 'come into force' clause. Do not use a single effective date in customer contracts until the PDF is read.",
		impact: 9,
		urgency: 10,
		probability: 9,
		relevance: 10,
		quality: 8,
		priorityScore: pri(9, 10, 9, 10, 8),
		citations: [
			{
				name: "The Daily Star",
				url: "https://www.thedailystar.net/business/economy/news/rooftop-solar-gets-new-incentive-package-4262426"
			},
			{
				name: "The Business Standard",
				url: "https://www.tbsnews.net/bangladesh/energy/solar-producers-get-tk1050-unit-under-new-rooftop-incentive-scheme-1530446"
			},
			{
				name: "Reuters",
				url: "https://www.reuters.com/business/energy/bangladesh-offers-rooftop-solar-incentives-ease-power-shortages-2026-09-02/"
			}
		],
		numbers: [
			{
				label: "Surplus tariff",
				original: "Tk 10.50 / kWh",
				converted: "≈ USD 0.086 / kWh",
				assumption: "Reuters USD conversion as published 2 Sep 2026"
			},
			{
				label: "Stated generation-cost cap",
				original: "Tk 8.00 / kWh",
				converted: null,
				assumption: null
			},
			{
				label: "Profit margin in tariff build-up",
				original: "20%",
				converted: null,
				assumption: null
			},
			{
				label: "Premium in tariff build-up",
				original: "11.25%",
				converted: null,
				assumption: null
			},
			{
				label: "Average retail grid price (reported)",
				original: "Tk 10.40 / kWh",
				converted: null,
				assumption: "Daily Star, 2 Sep 2026"
			}
		],
		eventDate: "2026-09-01",
		createdAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "evt-eligibility-resco-gap",
		eventKey: "bd-rts-incentive-beneficiary-of-record",
		title: "Beneficiary of record for Tk 10.50 is not confirmed for RESCO/PPA",
		whatHappened: "All major recaps describe 'customers' or 'consumers' who install rooftop systems by 28 February 2027 and export surplus after self-consumption. None of the secondary sources quote a clause that clearly includes or excludes third-party ownership, PPA, BOO or RESCO structures.",
		evidence: "Daily Star, TBS and Reuters language is consumer/customer-centric. Gazette text not in NEIA. Treat as LEVEL 2–3 on the reporting, LEVEL 1 on the legal conclusion. UNVERIFIED — DO NOT USE FOR CONTRACT DRAFTING.",
		whatChanged: "A high-value tariff now exists whose capture by a zero-CAPEX developer is legally ambiguous.",
		whyItMatters: "If only the on-site customer is the beneficiary, Netso's PPA product either cannot monetise the kicker, must pass it through, or must be re-papered so the customer is owner of record. That is a product-architecture issue, not a marketing issue.",
		whoBenefits: "Customer-owned / capex-outlay buyers, if the gazette is consumer-centric.",
		whoLoses: "Unadapted RESCO/PPA originators if third-party systems are ineligible.",
		whatNext: "Power Division FAQ, DISCOM implementation guideline, or a law-firm read of the gazette will resolve this. Until then, two product tracks.",
		netsoMeaning: "Do not sell 'we will get you Tk 10.50' under a PPA until counsel signs off. Prepare an owner-of-record variant and a pass-through variant.",
		recommendedAction: "Legal memo in 5 days: (a) who is paid, (b) can rights be assigned, (c) does Netso-as-operator still qualify if the customer is the net-metering account holder.",
		deadline: "2026-09-08",
		severity: "critical",
		category: "regulation",
		impactTags: [
			"revenue",
			"regulation",
			"financing",
			"strategy",
			"risk"
		],
		confidence: "medium",
		verificationLevel: 2,
		conflictAlert: null,
		impact: 9,
		urgency: 9,
		probability: 7,
		relevance: 10,
		quality: 6,
		priorityScore: pri(9, 9, 7, 10, 6),
		citations: [{
			name: "The Daily Star",
			url: "https://www.thedailystar.net/business/economy/news/rooftop-solar-gets-new-incentive-package-4262426"
		}, {
			name: "The Business Standard",
			url: "https://www.tbsnews.net/bangladesh/energy/solar-producers-get-tk1050-unit-under-new-rooftop-incentive-scheme-1530446"
		}],
		numbers: [],
		eventDate: "2026-09-02",
		createdAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "evt-4000mw-target",
		eventKey: "bd-4000mw-rooftop-ambition-2026",
		title: "Power Division ambition: up to 4,000 MW rooftop solar within a year",
		whatHappened: "TBS, citing Power Division materials tied to an 19 August meeting, reports a scheme aim of adding up to 4,000 MW of rooftop solar capacity within one year, inside a broader 5,500 MW / 20% renewable-electricity plan by 2030.",
		evidence: "The Business Standard, 1–2 September 2026, referencing Power Division meeting minutes of 19 August. Not independently confirmed in the Daily Star recap. Treat the 4,000 MW figure as LEVEL 2 until a public target document is filed.",
		whatChanged: "Political appetite for rooftop scale is being stated in gigawatt language, not rooftop-pilot language.",
		whyItMatters: "A 4,000 MW year would overwhelm interconnection, certified equipment and skilled EPC. First movers with standardised designs capture disproportionate origination.",
		whoBenefits: "Prepared C&I platforms, certified suppliers, DISCOMs that staff one-stop centres.",
		whoLoses: "Bespoke, slow, uncertified EPC shops.",
		whatNext: "Watch whether 4,000 MW appears in a formal SREDA/Power Division target or remains meeting-minute language.",
		netsoMeaning: "Origination capacity, not panel price, is the binding constraint if even a fraction of 4,000 MW is real. Netso should industrialise a battery-backed C&I block, not custom-engineer every roof.",
		recommendedAction: "Set a 90-day origination machine: standard 200–500 kWp + BESS block, DISCOM one-stop playbook, RMG/industrial park list.",
		deadline: "2026-09-30",
		severity: "important",
		category: "policy",
		impactTags: [
			"demand",
			"strategy",
			"competition",
			"fundraising"
		],
		confidence: "medium",
		verificationLevel: 2,
		conflictAlert: "4,000 MW / 1-year figure is reported by TBS from Power Division minutes, not yet seen in Daily Star or Reuters. Do not treat as gazetted target.",
		impact: 8,
		urgency: 7,
		probability: 6,
		relevance: 9,
		quality: 6,
		priorityScore: pri(8, 7, 6, 9, 6),
		citations: [{
			name: "The Business Standard",
			url: "https://www.tbsnews.net/bangladesh/energy/solar-producers-get-tk1050-unit-under-new-rooftop-incentive-scheme-1530446"
		}],
		numbers: [{
			label: "Reported rooftop ambition",
			original: "4,000 MW in one year",
			converted: null,
			assumption: "TBS citing Power Division; unverified as formal target"
		}, {
			label: "2030 RE plan (reported)",
			original: "5,500 MW / 20% of electricity",
			converted: null,
			assumption: "TBS citing 19 Aug Power Division meeting"
		}],
		eventDate: "2026-08-19",
		createdAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "evt-bsti-sreda-mandate",
		eventKey: "bd-rts-bsti-sreda-equipment-mandate",
		title: "BSTI + SREDA standards are now a commercial gate, not a quality nice-to-have",
		whatHappened: "The incentive recaps make BSTI and SREDA technical standards mandatory for panels, batteries, inverters and meters. Non-compliant kits are ineligible.",
		evidence: "Daily Star, TBS, Reuters — consistent. Primary standards lists live on SREDA/BSTI sites; NEIA has not yet diffed the current certified SKU list against typical C&I bills of materials.",
		whatChanged: "Equipment selection is now an eligibility risk, not only a performance/warranty choice.",
		whyItMatters: "A cheaper uncertified battery that saves CAPEX can destroy the Tk 10.50 kicker and possibly interconnection.",
		whoBenefits: "Bankable, certified manufacturers already on SREDA lists.",
		whoLoses: "Grey-market modules and uncertified BESS packs.",
		whatNext: "Certification queues; possible shortages of listed LFP commercial batteries.",
		netsoMeaning: "SKU standardisation is now a financing and incentive-eligibility decision. Procurement must lock listed products.",
		recommendedAction: "Publish an internal certified BOM this week. Ban non-listed batteries from any incentive-track proposal.",
		deadline: "2026-09-12",
		severity: "important",
		category: "technology",
		impactTags: [
			"capex",
			"technology",
			"regulation",
			"risk"
		],
		confidence: "high",
		verificationLevel: 3,
		conflictAlert: null,
		impact: 7,
		urgency: 8,
		probability: 9,
		relevance: 9,
		quality: 7,
		priorityScore: pri(7, 8, 9, 9, 7),
		citations: [{
			name: "The Daily Star",
			url: "https://www.thedailystar.net/business/economy/news/rooftop-solar-gets-new-incentive-package-4262426"
		}, {
			name: "The Business Standard",
			url: "https://www.tbsnews.net/bangladesh/energy/solar-producers-get-tk1050-unit-under-new-rooftop-incentive-scheme-1530446"
		}],
		numbers: [],
		eventDate: "2026-09-01",
		createdAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "evt-three-year-kicker",
		eventKey: "bd-rts-incentive-tenor-3y",
		title: "The kicker is three years, not a 20-year PPA substitute",
		whatHappened: "Payments for surplus at Tk 10.50 are described as running until 28 February 2030 — a three-year window for systems installed by 28 February 2027. Cash is forbidden; settlement is bank or MFS, administered with DISCOM metering records.",
		evidence: "Consistent across Daily Star, TBS, Reuters. Primary gazette not in hand for the exact start of the three-year clock (commissioning date vs. gazette date).",
		whatChanged: "A time-bounded export credit appeared. It does not, on reported facts, replace long-term offtake or net-metering for the rest of system life.",
		whyItMatters: "Lenders will not underwrite 15-year DSCR on a 3-year incentive. Using Tk 10.50 as the life-of-project tariff in a customer proposal is a misselling risk.",
		whoBenefits: "Projects that COD early in the window and can monetise years 1–3 as upside.",
		whoLoses: "Sales narratives that treat 10.50 as perpetual.",
		whatNext: "Banks will haircut the kicker; sophisticated customers will ask what happens on 1 March 2030.",
		netsoMeaning: "Model three layers: (1) behind-the-meter avoided tariff, (2) residual net-metering/export after 2030, (3) 2027–2030 kicker as upside. Never collapse them.",
		recommendedAction: "Update the assumption ledger and every live proposal template: kicker = scenario, base case = avoided retail + post-2030 rules.",
		deadline: "2026-09-07",
		severity: "important",
		category: "finance",
		impactTags: [
			"financing",
			"margin",
			"fundraising",
			"risk"
		],
		confidence: "high",
		verificationLevel: 3,
		conflictAlert: null,
		impact: 8,
		urgency: 8,
		probability: 8,
		relevance: 10,
		quality: 7,
		priorityScore: pri(8, 8, 8, 10, 7),
		citations: [{
			name: "Reuters",
			url: "https://www.reuters.com/business/energy/bangladesh-offers-rooftop-solar-incentives-ease-power-shortages-2026-09-02/"
		}, {
			name: "The Daily Star",
			url: "https://www.thedailystar.net/business/economy/news/rooftop-solar-gets-new-incentive-package-4262426"
		}],
		numbers: [{
			label: "Incentive tenor (reported)",
			original: "until 28 February 2030",
			converted: "3 years from the installation cutoff",
			assumption: "Clock alignment with COD is unverified"
		}],
		eventDate: "2026-09-01",
		createdAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "evt-grid-price-parity",
		eventKey: "bd-retail-tariff-vs-incentive-10-40",
		title: "Reported retail grid price Tk 10.40 vs incentive Tk 10.50",
		whatHappened: "Daily Star states the average retail price of grid electricity is Tk 10.40 per unit, 10 poisha below the new surplus incentive.",
		evidence: "Single-outlet figure (Daily Star, 2 Sep 2026). Industrial tariffs vary by voltage, time-of-use and demand charge — 'average retail' is not a C&I bill. LEVEL 2. Do not use 10.40 as Netso's customer tariff without BERC schedule and the actual bill.",
		whatChanged: "On the reported averages, exporting surplus is roughly at retail parity, not a deep discount to grid.",
		whyItMatters: "For C&I, value is still dominated by behind-the-meter displacement, demand charges, diesel/backup and reliability — not a 10-poisha export spread.",
		whoBenefits: "Honest origination (reliability + avoided energy).",
		whoLoses: "Pitch decks that lead with 'sell to grid at a premium' without bill analysis.",
		whatNext: "Pull BERC C&I schedules and 5 sample RMG bills.",
		netsoMeaning: "Keep the primary sales argument on reliability and behind-the-meter savings. Treat export credit as a sweetener.",
		recommendedAction: "Replace any generic 'Tk/kWh savings' slide with bill-true C&I tariffs; store them on the ledger.",
		deadline: "2026-09-15",
		severity: "important",
		category: "market",
		impactTags: [
			"demand",
			"margin",
			"strategy"
		],
		confidence: "medium",
		verificationLevel: 2,
		conflictAlert: null,
		impact: 6,
		urgency: 6,
		probability: 7,
		relevance: 9,
		quality: 6,
		priorityScore: pri(6, 6, 7, 9, 6),
		citations: [{
			name: "The Daily Star",
			url: "https://www.thedailystar.net/business/economy/news/rooftop-solar-gets-new-incentive-package-4262426"
		}],
		numbers: [{
			label: "Reported average retail grid",
			original: "Tk 10.40 / kWh",
			converted: null,
			assumption: "Daily Star average; not a C&I tariff schedule"
		}, {
			label: "Incentive surplus tariff",
			original: "Tk 10.50 / kWh",
			converted: null,
			assumption: null
		}],
		eventDate: "2026-09-02",
		createdAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "evt-disco-payment-ops",
		eventKey: "bd-rts-disco-payment-administration",
		title: "DISCOMs will meter, record and pay — implementation is the silent risk",
		whatHappened: "Recaps assign power distribution companies to maintain customer information, measure import/export, and route incentive payments to bank or MFS accounts. Power Division one-stop service centres and district/upazila utility offices are named as support.",
		evidence: "Daily Star and TBS. No SLA, settlement lag, or dispute process published in those recaps.",
		whatChanged: "Cash-flow of the kicker sits with utility administration, not a bilateral PPA with a corporate offtaker.",
		whyItMatters: "Bangladesh DISCOM payment culture is a known project-finance risk. A 3-year incentive that pays 90 days late has a different NPV.",
		whoBenefits: "Projects in DISCOMs with working net-metering ops.",
		whoLoses: "Projects that underwrite month-1 cash.",
		whatNext: "Watch first settlement circulars from DPDC, DESCO, WZPDCL, BREB, C-area utilities.",
		netsoMeaning: "Haircut incentive cash-flow in the model. Map which DISCOMs Netso will actually file in first.",
		recommendedAction: "Build a DISCOM scorecard (net-metering cycle time, payment lag) before picking the first 20 roofs.",
		deadline: "2026-09-20",
		severity: "watch",
		category: "finance",
		impactTags: [
			"financing",
			"risk",
			"regulation"
		],
		confidence: "medium",
		verificationLevel: 2,
		conflictAlert: null,
		impact: 7,
		urgency: 5,
		probability: 7,
		relevance: 8,
		quality: 5,
		priorityScore: pri(7, 5, 7, 8, 5),
		citations: [{
			name: "The Daily Star",
			url: "https://www.thedailystar.net/business/economy/news/rooftop-solar-gets-new-incentive-package-4262426"
		}],
		numbers: [],
		eventDate: "2026-09-02",
		createdAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "evt-ieefa-barriers",
		eventKey: "ieefa-bd-rooftop-barriers-2026-02",
		title: "IEEFA still flags duty on accessories and slow rooftop credit as binding constraints",
		whatHappened: "IEEFA's February 2026 note argued Bangladesh could save ~Tk 22.4 million per year in fuel imports per 1 MW of rooftop solar (their assumptions), and recommended a time-limited duty waiver on rooftop accessories plus a Bangladesh Bank dedicated rooftop fund with single-stage approval.",
		evidence: "IEEFA, 3 February 2026. Primary research. This week's incentive does not, in the press recaps, waive duties or create a dedicated BB window. Those recommendations remain open.",
		whatChanged: "Policy moved on surplus tariff and batteries; not obviously on customs or refinance plumbing.",
		whyItMatters: "CAPEX and debt delay can erase a 3-year kicker. Netso still needs cheaper kit and faster debt.",
		whoBenefits: "If duty waiver appears: importers of BOS/accessories.",
		whoLoses: "Status quo if only the tariff moves and CAPEX stays sticky.",
		whatNext: "Watch NBR SROs and Bangladesh Bank sustainable-finance circulars.",
		netsoMeaning: "Do not assume the incentive solved bankability. Parallel workstream on green refinance and duties.",
		recommendedAction: "Keep an NBR/BB watch. Do not stop IDCOL/commercial-bank conversations because a surplus tariff exists.",
		deadline: null,
		severity: "watch",
		category: "finance",
		impactTags: ["capex", "financing"],
		confidence: "medium",
		verificationLevel: 4,
		conflictAlert: null,
		impact: 6,
		urgency: 4,
		probability: 6,
		relevance: 8,
		quality: 8,
		priorityScore: pri(6, 4, 6, 8, 8),
		citations: [{
			name: "IEEFA",
			url: "https://ieefa.org/resources/getting-bangladeshs-renewable-energy-transition-track"
		}],
		numbers: [{
			label: "IEEFA fuel-import saving per 1 MW rooftop",
			original: "≈ Tk 22.4 million / year",
			converted: "≈ USD 0.18 million / year",
			assumption: "IEEFA: furnace oil Tk 16/kWh, 4 hours/day, 350 days; excludes capacity charges"
		}],
		eventDate: "2026-02-03",
		createdAt: "2026-09-03T00:00:00.000Z"
	}
];
var SEED_BRIEF_DAILY = {
	id: "brief-daily-2026-09-03",
	kind: "daily",
	briefDate: "2026-09-03",
	strategicInterpretation: "The information environment around Netso shifted this week from 'rooftop solar is policy-supported' to 'battery-backed rooftop has a dated commercial window.' The Tk 10.50 surplus tariff, the 28 February 2027 installation cutoff, and mandatory BSTI/SREDA kit are the three facts that survive cross-source checks. What did not survive: a single effective date, a gazetted 4,000 MW target, and any proof that a RESCO/PPA vehicle is the payee. The correct founder posture is not celebration. It is a 72-hour legal read, a model review, and an origination sprint that still works if the kicker is treated as a 3-year upside rather than a new business model.",
	recommendedActions: [
		"Get the gazette PDF and a written opinion on beneficiary-of-record (customer vs RESCO/PPA) by 8 September.",
		"Re-cut unit economics: battery-backed vs solar-only; kicker as scenario; base case = behind-the-meter + post-2030 rules.",
		"Lock a BSTI/SREDA-compliant module / hybrid inverter / LFP SKU list; remove uncertified batteries from incentive-track offers.",
		"Stand up a 28 February 2027 COD clock on every live roof, with interconnection slack.",
		"Do not rewrite long-term PPA prices solely off a three-year credit administered by DISCOMs."
	],
	startStop: {},
	maps: {}
};
var SEED_BRIEF_WEEKLY = {
	id: "brief-weekly-2026-09-01",
	kind: "weekly",
	briefDate: "2026-09-01",
	strategicInterpretation: "Week of 1 September 2026: the external rulebook for Bangladeshi rooftop solar changed more than it had in the prior year. Battery is now on the critical path for the headline incentive. Time is now a product feature.",
	recommendedActions: [
		"Legal: gazette + RESCO eligibility.",
		"Finance: three-layer model (BTM, kicker, residual).",
		"Procurement: certified BOM.",
		"Sales: stop leading with grid-export premium.",
		"Ops: DISCOM one-stop map for first 20 sites."
	],
	startStop: {
		biggest: [
			"Battery-backed rooftop incentive at Tk 10.50/kWh for eligible surplus.",
			"Installation cutoff 28 February 2027; payments described through 28 February 2030.",
			"Equipment standards (BSTI/SREDA) made mandatory for the scheme."
		],
		policy: "Special incentive via Power Division circular/gazette, described as sitting on Net Metering Guidelines 2025. Effective-date wording conflicts across outlets. 4,000 MW rooftop-in-a-year language is meeting-minute grade, not confirmed gazetted target.",
		market: "Reported average retail grid Tk 10.40 vs incentive Tk 10.50 — export is not a juicy spread. C&I value remains BTM energy, demand charges, diesel and uptime.",
		competitors: "No evidenced competitor product launch this week. The race is implicit: anyone who can deliver certified battery-backed C&I before the cutoff.",
		technology: "Hybrid inverters, listed LFP, and compliant meters become eligibility hardware. Solar-only designs are off this particular tariff.",
		financing: "Three-year DISCOM-administered credit will be haircut by lenders. IDCOL / Bangladesh Bank refinance still required. IEEFA's duty-waiver and dedicated-fund recommendations are unaddressed in the press recaps of this package.",
		customers: "C&I and household consumers are the named beneficiaries in recaps. RMG/export factories remain the strategic offtake for Netso but must be sold on bills and reliability, with the kicker as a structured maybe.",
		threats: "Legal mismatch with PPA ownership; DISCOM payment lag; certified-BESS shortage; sales teams over-claiming a perpetual 10.50 tariff; compressed COD creating quality/safety risk on batteries.",
		opportunities: "Origination sprint; standardised 200–500 kWp + BESS block; owner-of-record contract variant; investor story ('policy window') if eligibility is clean.",
		numbers: [
			"Tk 10.50 / kWh surplus (reported)",
			"Tk 8.00 / kWh stated cost cap + 20% + 11.25%",
			"Tk 10.40 / kWh reported average retail",
			"28 Feb 2027 install cutoff",
			"28 Feb 2030 kicker end",
			"4,000 MW rooftop ambition (TBS / Power Division minutes — unverified as target)"
		],
		implications: "Netso should operate as if a dated battery-backed window is real, and as if the PPA product might not automatically capture it.",
		start: [
			"Gazette capture and counsel memo on beneficiary-of-record.",
			"Certified battery-backed C&I BOM.",
			"COD-by-Feb-2027 pipeline flag in CRM."
		],
		stop: [
			"Selling solar-only systems into the incentive narrative.",
			"Using Tk 10.50 as a 15–20 year PPA price.",
			"Uncertified battery options on incentive-track quotes."
		],
		defer: ["Repositioning the whole company around grid-export.", "Waiting for a dedicated Bangladesh Bank rooftop fund before originating."],
		accelerate: [
			"RMG/industrial origination with battery-backed designs.",
			"DISCOM one-stop relationships.",
			"Model review of every live proposal."
		],
		weeklyActions: [
			"Gazette + legal memo.",
			"Ledger update and proposal-template rewrite.",
			"Certified SKU lock.",
			"Top-30 roof list with interconnection estimate.",
			"Investor note: window, not a new perpetual tariff."
		]
	},
	maps: {}
};
var SEED_BRIEF_MONTHLY = {
	id: "brief-monthly-2026-09",
	kind: "monthly",
	briefDate: "2026-09-01",
	strategicInterpretation: "If I were Netso's CEO: the external environment now prices time and batteries. Strategy should not pivot to 'we are a grid-export company.' It should pivot to 'we can deliver certified battery-backed C&I before a known date, without betting the balance sheet on a three-year DISCOM credit.'",
	recommendedActions: [
		"SCALE certified battery-backed C&I origination against the February 2027 clock.",
		"EXPERIMENT with an owner-of-record contract so customers, not Netso, are the payee if that is what the gazette requires.",
		"DEFER any plan that needs the kicker to clear DSCR."
	],
	startStop: {},
	maps: {
		market: "C&I rooftop demand is still driven by tariffs, diesel and uptime. The new surplus price sits near reported retail average, so export is not the product. Reliability and BTM remain the purchase argument.",
		regulatory: "A dated, battery-mandatory incentive is the new rule. Gazette text, RESCO eligibility and DISCOM settlement are the open regulatory risks. Net Metering Guidelines 2025 are the legal wrapper according to recaps.",
		competitor: "No evidenced new platform launch this week. Competitive threat is speed-to-COD on certified BESS, not a pricing war yet.",
		financing: "Green refinance, IDCOL and DFI capital still matter more than the kicker. Lenders will treat Tk 10.50 as short-dated upside.",
		technology: "Hybrid inverter + listed LFP + compliant meter is the default stack for incentive-track. Solar-only remains valid only for customers who do not need the kicker.",
		customer: "RMG and export manufacturers still fit: ESG buyers, painful power, large roofs. They will ask who gets paid Tk 10.50. Answer must be precise.",
		opportunity: "A 5.5-month installation window creates scarcity. Standard blocks, certified SKUs, and a clean legal structure are the capture mechanism.",
		threat: "Selling a PPA that silently assumes incentive capture; battery safety/quality under schedule pressure; DISCOM payment lag; duty/refinance still unresolved.",
		calls: [
			{
				initiative: "Battery-backed C&I rooftop as default product",
				call: "scale",
				why: "The incentive and standards now make BESS the eligibility path, and C&I BTM value was already the core."
			},
			{
				initiative: "Zero-CAPEX PPA / RESCO origination",
				call: "experiment",
				why: "Core model, but capture of Tk 10.50 is legally unverified. Run an owner-of-record variant in parallel."
			},
			{
				initiative: "RMG / export-factory focus",
				call: "scale",
				why: "Unchanged customer economics plus ESG pressure; roofs that can actually COD by Feb 2027 should be first."
			},
			{
				initiative: "Public-building / one-stop-service origination",
				call: "experiment",
				why: "Power Division one-stop language is real; public procurement cycles may miss the cutoff."
			},
			{
				initiative: "Balance-sheet light financing (IDCOL / green refinance / DFI)",
				call: "scale",
				why: "A 3-year kicker does not replace project finance. Capital stack is still the constraint."
			},
			{
				initiative: "Module-inverter-battery SKU standardisation to BSTI/SREDA",
				call: "scale",
				why: "Now a binary eligibility gate, not a QA preference."
			}
		]
	}
};
var SEED_ASSUMPTIONS = [
	{
		id: "asm-surplus-tariff",
		category: "tariff",
		label: "Incentive surplus tariff (battery-backed RTS)",
		value: "10.50",
		unit: "Tk/kWh",
		previousValue: "n/a",
		originalFigure: "Tk 10.50 per unit",
		confidence: "high",
		needsReview: true,
		reviewReason: "New canonical export credit. Re-test PPA and IRR scenarios. Do not use as life-of-project tariff.",
		sourceNote: "Power Division circular as reported by Daily Star, TBS, Reuters — 1–2 Sep 2026",
		sortOrder: 1,
		updatedAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "asm-cost-cap",
		category: "tariff",
		label: "Stated generation-cost cap (with batteries)",
		value: "8.00",
		unit: "Tk/kWh",
		previousValue: null,
		originalFigure: "Tk 8 per unit",
		confidence: "high",
		needsReview: true,
		reviewReason: "Government benchmark, not Netso's actual LCOE. Compare to live EPC quotes.",
		sourceNote: "TBS quoting Power Division circular",
		sortOrder: 2,
		updatedAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "asm-retail-avg",
		category: "tariff",
		label: "Reported average retail grid price",
		value: "10.40",
		unit: "Tk/kWh",
		previousValue: null,
		originalFigure: "Tk 10.40 per unit",
		confidence: "medium",
		needsReview: true,
		reviewReason: "Average retail ≠ C&I bill. Replace with BERC schedule + sample RMG bills.",
		sourceNote: "The Daily Star, 2 Sep 2026",
		sortOrder: 3,
		updatedAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "asm-install-cutoff",
		category: "regulation",
		label: "Installation cutoff for incentive",
		value: "2027-02-28",
		unit: "date",
		previousValue: null,
		originalFigure: "28 February 2027",
		confidence: "high",
		needsReview: true,
		reviewReason: "COD/interconnection definition unverified (install vs. commission vs. net-meter live).",
		sourceNote: "Daily Star, TBS, Reuters",
		sortOrder: 4,
		updatedAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "asm-kicker-end",
		category: "regulation",
		label: "Incentive payment window end",
		value: "2030-02-28",
		unit: "date",
		previousValue: null,
		originalFigure: "28 February 2030",
		confidence: "high",
		needsReview: false,
		reviewReason: null,
		sourceNote: "Daily Star, TBS, Reuters",
		sortOrder: 5,
		updatedAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "asm-battery-required",
		category: "technology",
		label: "Battery required for incentive eligibility",
		value: "yes",
		unit: null,
		previousValue: "optional for most C&I offers",
		originalFigure: "rooftop solar power systems with battery storage",
		confidence: "high",
		needsReview: true,
		reviewReason: "Default product mix must include BESS on incentive-track. CAPEX/kWh assumption now material.",
		sourceNote: "All major recaps",
		sortOrder: 6,
		updatedAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "asm-resco-eligible",
		category: "regulation",
		label: "RESCO / PPA / third-party ownership eligible",
		value: "UNVERIFIED",
		unit: null,
		previousValue: null,
		originalFigure: "Recaps say 'customers/consumers'",
		confidence: "low",
		needsReview: true,
		reviewReason: "TRIGGER MODEL REVIEW and legal review. Do not originate incentive-led PPAs on an assumption.",
		sourceNote: "Secondary reporting only — gazette not ingested",
		sortOrder: 7,
		updatedAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "asm-effective-date",
		category: "regulation",
		label: "Scheme effective date",
		value: "CONFLICT",
		unit: "date",
		previousValue: null,
		originalFigure: "1 Sep vs 2 Sep vs ~30 Aug 2026",
		confidence: "medium",
		needsReview: true,
		reviewReason: "Conflict alert. Read gazette come-into-force clause.",
		sourceNote: "Reuters / Daily Star / TBS disagreement",
		sortOrder: 8,
		updatedAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "asm-capex-kwp",
		category: "capex",
		label: "C&I rooftop solar CAPEX (working)",
		value: "PENDING LIVE QUOTE",
		unit: "USD/kWp",
		previousValue: null,
		originalFigure: null,
		confidence: "low",
		needsReview: true,
		reviewReason: "No canonical Netso figure in NEIA. Do not invent. Pull last three EPC quotes.",
		sourceNote: "Internal — empty on purpose",
		sortOrder: 9,
		updatedAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "asm-bess-kwh",
		category: "capex",
		label: "Commercial BESS CAPEX (working)",
		value: "PENDING LIVE QUOTE",
		unit: "USD/kWh",
		previousValue: null,
		originalFigure: null,
		confidence: "low",
		needsReview: true,
		reviewReason: "Battery is now on the critical path. Empty until procurement returns listed LFP quotes.",
		sourceNote: "Internal — empty on purpose",
		sortOrder: 10,
		updatedAt: "2026-09-03T00:00:00.000Z"
	},
	{
		id: "asm-fx",
		category: "macro",
		label: "USD/BDT used in conversions",
		value: "as published",
		unit: "BDT per USD",
		previousValue: null,
		originalFigure: "Reuters implied ~Tk 122 / USD from Tk 10.50 = USD 0.086",
		confidence: "medium",
		needsReview: false,
		reviewReason: null,
		sourceNote: "Never silently convert; show Original → Converted",
		sortOrder: 11,
		updatedAt: "2026-09-03T00:00:00.000Z"
	}
];
var SEED_SIGNALS = [
	{
		id: "opp-cod-sprint",
		kind: "opportunity",
		title: "Installation-window origination sprint",
		description: "Systems installed by 28 February 2027 are the ones that can even be discussed for Tk 10.50. A standardised battery-backed C&I block plus DISCOM one-stop choreography is the capture mechanism.",
		potentialValue: "High — dated national window",
		probability: "High if execution is industrialised",
		timeSensitivity: "Extreme — cutoff 28 Feb 2027",
		executionDifficulty: "High (interconnection, batteries, crew)",
		strategicFit: "Directly on Netso's C&I rooftop mandate",
		rank: 1
	},
	{
		id: "opp-owner-variant",
		kind: "opportunity",
		title: "Owner-of-record contract variant",
		description: "If the gazette pays the customer, Netso can still deploy zero-CAPEX by making the customer the net-metering account holder and structuring a services/lease around it. That is a product experiment, not a press release.",
		potentialValue: "Preserves PPA origination if RESCO is ineligible",
		probability: "Medium — legal unknown",
		timeSensitivity: "This month",
		executionDifficulty: "Medium-high (legal + sales retrain)",
		strategicFit: "Protects the zero-CAPEX motion",
		rank: 2
	},
	{
		id: "opp-certified-bom",
		kind: "opportunity",
		title: "Certified SKU lock as a sales weapon",
		description: "Competitors who quote uncertified batteries will be ineligible. A published compliant BOM is both risk control and differentiation.",
		potentialValue: "Win rate + bankability",
		probability: "High",
		timeSensitivity: "This week",
		executionDifficulty: "Low-medium",
		strategicFit: "High",
		rank: 3
	},
	{
		id: "thr-resco-gap",
		kind: "threat",
		title: "PPA/RESCO may not be the payee",
		description: "Press language is consumer-centric. If third-party ownership is out, Netso's core offer cannot claim the kicker without a restructure.",
		potentialValue: "Could strand incentive-led pipeline",
		probability: "Unknown — treat as material",
		timeSensitivity: "Immediate",
		executionDifficulty: "n/a",
		strategicFit: "Hits core model",
		rank: 1
	},
	{
		id: "thr-overclaim",
		kind: "threat",
		title: "Misselling a 3-year credit as a perpetual tariff",
		description: "Tk 10.50 through Feb 2030 is not a 20-year offtake. Customer and lender trust dies if proposals collapse the layers.",
		potentialValue: "Reputational and legal",
		probability: "High if templates are not rewritten",
		timeSensitivity: "Immediate",
		executionDifficulty: "n/a",
		strategicFit: "Culture/process threat",
		rank: 2
	},
	{
		id: "thr-disco-lag",
		kind: "threat",
		title: "DISCOM-administered settlement lag",
		description: "Incentive cash sits with distribution utilities. No SLA in the recaps. Model haircuts required.",
		potentialValue: "NPV leakage on the kicker",
		probability: "Medium-high historically",
		timeSensitivity: "Before first COD",
		executionDifficulty: "n/a",
		strategicFit: "Finance",
		rank: 3
	},
	{
		id: "thr-bess-quality",
		kind: "threat",
		title: "Battery quality under schedule pressure",
		description: "A six-month COD race on BESS in a cyclone/heat/corrosion environment is a safety and warranty event waiting to happen if procurement chases any listed cell.",
		potentialValue: "Site failure, claims, incentive claw-back risk (unverified)",
		probability: "Material if rushed",
		timeSensitivity: "Procurement cycle",
		executionDifficulty: "n/a",
		strategicFit: "Technology/ops",
		rank: 4
	}
];
function parseJson(raw, fallback) {
	try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function asBool(v) {
	if (typeof v === "boolean") return v;
	if (typeof v === "number") return v !== 0;
	return v === "t" || v === "true" || v === "1";
}
function mapSource(row) {
	const tier = row.tier === 1 || row.tier === 2 || row.tier === 3 ? row.tier : 3;
	return {
		id: row.id,
		name: row.name,
		kind: row.kind,
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
		lastSignalAt: row.last_signal_at
	};
}
function mapItem(row) {
	const level = [
		1,
		2,
		3,
		4,
		5
	].includes(row.verification_level) ? row.verification_level : 2;
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
		severity: row.severity,
		category: row.category,
		impactTags: parseJson(row.impact_tags, []),
		confidence: row.confidence,
		verificationLevel: level,
		conflictAlert: row.conflict_alert,
		impact: row.impact,
		urgency: row.urgency,
		probability: row.probability,
		relevance: row.relevance,
		quality: row.quality,
		priorityScore: row.priority_score,
		citations: parseJson(row.citations_json, []),
		numbers: parseJson(row.numbers_json, []),
		eventDate: row.event_date,
		createdAt: row.created_at
	};
}
function mapBrief(row) {
	const kind = row.kind === "weekly" || row.kind === "monthly" ? row.kind : "daily";
	return {
		id: row.id,
		kind,
		briefDate: row.brief_date,
		strategicInterpretation: row.strategic_interpretation,
		recommendedActions: parseJson(row.recommended_actions_json, []),
		startStop: parseJson(row.start_stop_json, {}),
		maps: parseJson(row.maps_json, {})
	};
}
function mapAssumption(row) {
	return {
		id: row.id,
		category: row.category,
		label: row.label,
		value: row.value,
		unit: row.unit,
		previousValue: row.previous_value,
		originalFigure: row.original_figure,
		confidence: row.confidence,
		needsReview: asBool(row.needs_review),
		reviewReason: row.review_reason,
		sourceNote: row.source_note,
		sortOrder: row.sort_order,
		updatedAt: row.updated_at
	};
}
function mapSignal(row) {
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
		rank: row.rank
	};
}
function mapCycle(row) {
	return {
		id: row.id,
		kind: row.kind,
		status: row.status,
		summary: row.summary,
		error: row.error,
		itemCount: row.item_count,
		createdAt: row.created_at
	};
}
function clampScore(n, max = 10) {
	const v = typeof n === "number" ? n : Number(n);
	if (!Number.isFinite(v)) return 0;
	return Math.max(0, Math.min(max, Math.round(v)));
}
function priorityOf(impact, urgency, probability, relevance, quality) {
	return Math.round(impact * urgency * probability * relevance * quality / 1e3);
}
function todayISO() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function slugId(prefix, key) {
	return `${prefix}-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "item"}`;
}
var MODEL = "grok-4.5";
function extractText(payload) {
	if (!payload || typeof payload !== "object") return "";
	const rec = payload;
	if (typeof rec.output_text === "string" && rec.output_text.trim()) return rec.output_text;
	const output = rec.output;
	if (Array.isArray(output)) {
		const chunks = [];
		for (const item of output) {
			if (!item || typeof item !== "object") continue;
			const node = item;
			const content = node.content;
			if (Array.isArray(content)) for (const part of content) {
				if (!part || typeof part !== "object") continue;
				const p = part;
				if (typeof p.text === "string") chunks.push(p.text);
			}
			if (typeof node.text === "string") chunks.push(node.text);
		}
		if (chunks.length) return chunks.join("\n");
	}
	const choices = rec.choices;
	if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
		const msg = choices[0].message;
		if (msg && typeof msg === "object") {
			const content = msg.content;
			if (typeof content === "string") return content;
		}
	}
	return "";
}
function extractCitations(payload) {
	if (!payload || typeof payload !== "object") return [];
	const raw = payload.citations;
	if (!Array.isArray(raw)) return [];
	return raw.map((c) => {
		if (typeof c === "string") return c;
		if (c && typeof c === "object") {
			const o = c;
			if (typeof o.url === "string") return o.url;
			if (typeof o.uri === "string") return o.uri;
		}
		return null;
	}).filter((x) => Boolean(x));
}
function parseJsonObject(text) {
	const trimmed = text.trim();
	const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
	const candidate = (fenced ? fenced[1] : trimmed).trim();
	const start = candidate.indexOf("{");
	const end = candidate.lastIndexOf("}");
	if (start === -1 || end === -1 || end <= start) throw new Error("Model did not return JSON");
	return JSON.parse(candidate.slice(start, end + 1));
}
async function grokJson(opts) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment"
	};
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 11e4);
	const body = {
		model: MODEL,
		input: [{
			role: "system",
			content: opts.instructions
		}, {
			role: "user",
			content: opts.input
		}],
		max_output_tokens: opts.maxOutputTokens ?? 6e3,
		tools: opts.search === false ? void 0 : [{ type: "web_search" }],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "neia_result",
				strict: true,
				schema: opts.schema
			}
		}
	};
	try {
		const res = await fetch("https://api.x.ai/v1/responses", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify(body),
			signal: controller.signal
		});
		if (!res.ok) {
			const fallback = await grokChatFallback(apiKey, opts, controller.signal);
			if (fallback.ok) return fallback;
			return {
				ok: false,
				error: `xAI API error ${res.status}`
			};
		}
		const payload = await res.json();
		const text = extractText(payload);
		if (!text) return {
			ok: false,
			error: "Empty model response"
		};
		return {
			ok: true,
			value: parseJsonObject(text),
			citations: extractCitations(payload)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.name === "AbortError" ? "The intelligence cycle timed out. Try again." : err.message : "Unknown AI error"
		};
	} finally {
		clearTimeout(timer);
	}
}
async function grokChatFallback(apiKey, opts, signal) {
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [{
				role: "system",
				content: opts.instructions
			}, {
				role: "user",
				content: `${opts.input}\n\nReturn ONLY JSON matching this schema:\n${JSON.stringify(opts.schema)}`
			}],
			max_tokens: opts.maxOutputTokens ?? 5e3,
			response_format: { type: "json_object" }
		}),
		signal
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	const text = extractText(await res.json());
	if (!text) return {
		ok: false,
		error: "Empty model response"
	};
	return {
		ok: true,
		value: parseJsonObject(text),
		citations: []
	};
}
var seeding = null;
async function seedIfEmpty() {
	if (seeding) return seeding;
	seeding = (async () => {
		const sql = await getSql();
		const [{ n }] = await sql`select count(*)::int as n from sources`;
		if (n > 0) return;
		for (const s of SEED_SOURCES) await sql`
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
		for (const i of SEED_ITEMS) await sql`
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
		for (const b of [
			SEED_BRIEF_DAILY,
			SEED_BRIEF_WEEKLY,
			SEED_BRIEF_MONTHLY
		]) await sql`
        insert into briefs (
          id, kind, brief_date, strategic_interpretation, recommended_actions_json, start_stop_json, maps_json
        ) values (
          ${b.id}, ${b.kind}, ${b.briefDate}, ${b.strategicInterpretation},
          ${JSON.stringify(b.recommendedActions)}, ${JSON.stringify(b.startStop)}, ${JSON.stringify(b.maps)}
        ) on conflict (id) do nothing
      `;
		for (const a of SEED_ASSUMPTIONS) await sql`
        insert into assumptions (
          id, category, label, value, unit, previous_value, original_figure, confidence,
          needs_review, review_reason, source_note, sort_order
        ) values (
          ${a.id}, ${a.category}, ${a.label}, ${a.value}, ${a.unit}, ${a.previousValue},
          ${a.originalFigure}, ${a.confidence}, ${a.needsReview}, ${a.reviewReason},
          ${a.sourceNote}, ${a.sortOrder}
        ) on conflict (id) do nothing
      `;
		for (const s of SEED_SIGNALS) await sql`
        insert into signals (
          id, kind, title, description, potential_value, probability, time_sensitivity,
          execution_difficulty, strategic_fit, rank
        ) values (
          ${s.id}, ${s.kind}, ${s.title}, ${s.description}, ${s.potentialValue}, ${s.probability},
          ${s.timeSensitivity}, ${s.executionDifficulty}, ${s.strategicFit}, ${s.rank}
        ) on conflict (id) do nothing
      `;
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
async function deskState() {
	const sql = await getSql();
	const [counts] = await sql`
    select
      (select count(*)::int from sources) as source_count,
      (select count(*)::int from sources where tier = 1) as tier1_count,
      (select count(*)::int from intelligence_items where severity = 'critical') as critical_count,
      (select count(*)::int from assumptions where needs_review = true) as review_count
  `;
	const cycles = await sql`
    select id, kind, status, summary, error, item_count, created_at::text as created_at
    from cycle_runs order by created_at desc limit 1
  `;
	return {
		sourceCount: counts?.source_count ?? 0,
		tier1Count: counts?.tier1_count ?? 0,
		criticalCount: counts?.critical_count ?? 0,
		reviewCount: counts?.review_count ?? 0,
		lastCycle: cycles[0] ? mapCycle(cycles[0]) : null,
		briefDate: todayISO()
	};
}
var loadDesk_createServerFn_handler = createServerRpc({
	id: "c066d094c7df43077d4c32f8b979358155e9bc4ee1ba3effc821935002c7bd96",
	name: "loadDesk",
	filename: "src/lib/neia/server.ts"
}, (opts) => loadDesk.__executeServer(opts));
var loadDesk = createServerFn({ method: "GET" }).handler(loadDesk_createServerFn_handler, async () => {
	await seedIfEmpty();
	return deskState();
});
var loadDaily_createServerFn_handler = createServerRpc({
	id: "1afb853b38c2fcca4ab5539ed7e4c176b8f940a0c2b9889c8a0a661a057407d5",
	name: "loadDaily",
	filename: "src/lib/neia/server.ts"
}, (opts) => loadDaily.__executeServer(opts));
var loadDaily = createServerFn({ method: "GET" }).handler(loadDaily_createServerFn_handler, async () => {
	await seedIfEmpty();
	const sql = await getSql();
	const items = await sql`
    select * from intelligence_items
    order by
      case severity when 'critical' then 0 when 'important' then 1 else 2 end,
      priority_score desc, created_at desc
  `;
	const briefs = await sql`
    select * from briefs where kind = 'daily' order by brief_date desc limit 1
  `;
	const assumptions = await sql`
    select * from assumptions where needs_review = true order by sort_order
  `;
	return {
		desk: await deskState(),
		items: items.map(mapItem),
		brief: briefs[0] ? mapBrief(briefs[0]) : null,
		reviewFlags: assumptions.map(mapAssumption)
	};
});
var loadSources_createServerFn_handler = createServerRpc({
	id: "20cef0f5b91dbdebd1399a84aeb05fcfdf3d315efbfdf104f065c4728b4e2463",
	name: "loadSources",
	filename: "src/lib/neia/server.ts"
}, (opts) => loadSources.__executeServer(opts));
var loadSources = createServerFn({ method: "GET" }).handler(loadSources_createServerFn_handler, async () => {
	await seedIfEmpty();
	const rows = await (await getSql())`
    select * from sources order by tier asc, score desc, name asc
  `;
	return {
		desk: await deskState(),
		sources: rows.map(mapSource)
	};
});
var loadLedger_createServerFn_handler = createServerRpc({
	id: "6648dc66a16d60e5a91c3a8865aa6acd79213dfa86e14f7541c148bce6930e17",
	name: "loadLedger",
	filename: "src/lib/neia/server.ts"
}, (opts) => loadLedger.__executeServer(opts));
var loadLedger = createServerFn({ method: "GET" }).handler(loadLedger_createServerFn_handler, async () => {
	await seedIfEmpty();
	const rows = await (await getSql())`select * from assumptions order by sort_order, label`;
	return {
		desk: await deskState(),
		assumptions: rows.map(mapAssumption)
	};
});
var loadSignals_createServerFn_handler = createServerRpc({
	id: "6859ab011e81a35f3cb650337ce12d24899bbbc607ecebbb2d59ea697d3a75f1",
	name: "loadSignals",
	filename: "src/lib/neia/server.ts"
}, (opts) => loadSignals.__executeServer(opts));
var loadSignals = createServerFn({ method: "GET" }).handler(loadSignals_createServerFn_handler, async () => {
	await seedIfEmpty();
	const rows = await (await getSql())`select * from signals order by kind, rank, title`;
	return {
		desk: await deskState(),
		signals: rows.map(mapSignal)
	};
});
var loadReviews_createServerFn_handler = createServerRpc({
	id: "d293c769204cd554591a2c22fe3b3d6cfba083587a9fa8b6a62ae3309add547a",
	name: "loadReviews",
	filename: "src/lib/neia/server.ts"
}, (opts) => loadReviews.__executeServer(opts));
var loadReviews = createServerFn({ method: "GET" }).handler(loadReviews_createServerFn_handler, async () => {
	await seedIfEmpty();
	const sql = await getSql();
	const weekly = await sql`
    select * from briefs where kind = 'weekly' order by brief_date desc limit 1
  `;
	const monthly = await sql`
    select * from briefs where kind = 'monthly' order by brief_date desc limit 1
  `;
	return {
		desk: await deskState(),
		weekly: weekly[0] ? mapBrief(weekly[0]) : null,
		monthly: monthly[0] ? mapBrief(monthly[0]) : null
	};
});
var loadItem_createServerFn_handler = createServerRpc({
	id: "b988f1dfb415e7199c5eda413ae704857df385e8f6498222ca2a31510eb03803",
	name: "loadItem",
	filename: "src/lib/neia/server.ts"
}, (opts) => loadItem.__executeServer(opts));
var loadItem = createServerFn({ method: "GET" }).validator(object({ id: string() })).handler(loadItem_createServerFn_handler, async ({ data }) => {
	await seedIfEmpty();
	const rows = await (await getSql())`select * from intelligence_items where id = ${data.id} limit 1`;
	return {
		desk: await deskState(),
		item: rows[0] ? mapItem(rows[0]) : null
	};
});
async function recordCycle(kind, status, summary, error, itemCount) {
	await (await getSql())`
    insert into cycle_runs (id, kind, status, summary, error, item_count)
    values (${`${kind}-${Date.now()}`}, ${kind}, ${status}, ${summary}, ${error}, ${itemCount})
  `;
}
function asRecord(v) {
	return v && typeof v === "object" && !Array.isArray(v) ? v : null;
}
function asString(v, fallback = "") {
	return typeof v === "string" ? v : fallback;
}
function asStringOrNull(v) {
	return typeof v === "string" && v.trim() ? v : null;
}
function asNumber(v, fallback = 0) {
	return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function asArray(v) {
	return Array.isArray(v) ? v : [];
}
async function upsertItem(raw) {
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
	const severity = [
		"critical",
		"important",
		"watch"
	].includes(asString(o.severity)) ? asString(o.severity) : "watch";
	const confidence = [
		"high",
		"medium",
		"low",
		"speculation"
	].includes(asString(o.confidence)) ? asString(o.confidence) : "low";
	const verification = clampScore(o.verification_level, 5) || 1;
	const id = slugId("evt", eventKey);
	await (await getSql())`
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
var runSourceScout_createServerFn_handler = createServerRpc({
	id: "47a2a992fbd5204aa2f70db07efe5c8838bfdd4ff41ca47eadd61fbead7f3242",
	name: "runSourceScout",
	filename: "src/lib/neia/server.ts"
}, (opts) => runSourceScout.__executeServer(opts));
var runSourceScout = createServerFn({ method: "POST" }).handler(runSourceScout_createServerFn_handler, async () => {
	await seedIfEmpty();
	const sql = await getSql();
	const existing = await sql`select * from sources order by tier, score desc`;
	const result = await grokJson({
		instructions: SOURCE_SCOUT_INSTRUCTIONS,
		schema: scoutSchema,
		maxOutputTokens: 4500,
		input: `Today is ${todayISO()}. Existing source registry (do not invent replacements; upgrade/downgrade with evidence; add only verified new sources):\n${JSON.stringify(existing.map(mapSource).map((s) => ({
			id: s.id,
			name: s.name,
			kind: s.kind,
			url: s.url,
			tier: s.tier,
			score: s.score
		})))}\n\nDiscover and score high-value sources for Netso Energy Limited. Bangladesh rooftop solar, BESS, C&I PPA/RESCO, policy, finance, RMG energy.`
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
		const score = Math.min(100, primary + accuracy + expertise + speed + relevance + transparency + independence);
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
	return {
		ok: true,
		summary: notes,
		itemCount: count
	};
});
var runDailyCycle_createServerFn_handler = createServerRpc({
	id: "727f3bc3981f4593d0867063c5acff74b490c35e14d29b4b187b50625040b9c2",
	name: "runDailyCycle",
	filename: "src/lib/neia/server.ts"
}, (opts) => runDailyCycle.__executeServer(opts));
var runDailyCycle = createServerFn({ method: "POST" }).handler(runDailyCycle_createServerFn_handler, async () => {
	await seedIfEmpty();
	const sql = await getSql();
	const sources = await sql`select id, name, kind, url, tier, score from sources order by tier, score desc`;
	const known = await sql`select event_key, title from intelligence_items`;
	const assumptions = await sql`select id, label, value, unit, confidence, needs_review from assumptions`;
	const result = await grokJson({
		instructions: NEIA_INSTRUCTIONS,
		schema: dailySchema,
		maxOutputTokens: 7e3,
		input: `Today is ${todayISO()}.
Known event_keys (collapse duplicates; only emit if NEW facts exist, otherwise omit):
${JSON.stringify(known)}
Source registry:
${JSON.stringify(sources)}
Assumption ledger:
${JSON.stringify(assumptions)}
Search Bangladesh and international sources NOW for material developments since 1 September 2026 affecting Netso. Prefer primary documents. Return at most 3 critical and 7 important items. Include conflict_alert when numbers disagree.`
	});
	if (!result.ok) {
		await recordCycle("daily", "error", null, result.error, 0);
		return result;
	}
	const rec = asRecord(result.value);
	let itemCount = 0;
	for (const raw of asArray(rec?.items)) if (await upsertItem(raw)) itemCount += 1;
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
		await sql`
      insert into signals (
        id, kind, title, description, potential_value, probability, time_sensitivity,
        execution_difficulty, strategic_fit, rank
      ) values (
        ${asString(o.id).trim() || slugId("sig", title)}, ${asString(o.kind) === "threat" ? "threat" : "opportunity"}, ${title}, ${asString(o.description)}, ${asStringOrNull(o.potential_value)},
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
	await sql`
    insert into briefs (
      id, kind, brief_date, strategic_interpretation, recommended_actions_json, start_stop_json, maps_json
    ) values (
      ${`brief-daily-${todayISO()}`}, ${"daily"}, ${todayISO()}, ${asString(rec?.strategic_interpretation)},
      ${JSON.stringify(asArray(rec?.recommended_actions).map((x) => asString(x)).filter(Boolean).slice(0, 5))},
      ${"{}"}, ${"{}"}
    )
    on conflict (id) do update set
      strategic_interpretation = excluded.strategic_interpretation,
      recommended_actions_json = excluded.recommended_actions_json
  `;
	const summary = asString(rec?.strategic_interpretation, `Daily cycle wrote ${itemCount} items.`).slice(0, 400);
	await recordCycle("daily", "ok", summary, null, itemCount);
	return {
		ok: true,
		summary,
		itemCount
	};
});
var runWeeklyCycle_createServerFn_handler = createServerRpc({
	id: "c93f5507c7d4dcac982da2d4ebc9c90d437e7b9d61ba8ef69b8ba355069727e7",
	name: "runWeeklyCycle",
	filename: "src/lib/neia/server.ts"
}, (opts) => runWeeklyCycle.__executeServer(opts));
var runWeeklyCycle = createServerFn({ method: "POST" }).handler(runWeeklyCycle_createServerFn_handler, async () => {
	await seedIfEmpty();
	const sql = await getSql();
	const items = await sql`
    select title, severity, category, netso_meaning, recommended_action, confidence, verification_level
    from intelligence_items order by priority_score desc limit 24
  `;
	const result = await grokJson({
		instructions: WEEKLY_INSTRUCTIONS,
		schema: weeklySchema,
		maxOutputTokens: 5e3,
		input: `Today is ${todayISO()}. Desk items:\n${JSON.stringify(items)}\nWrite the weekly strategic report. Search only to fill gaps. Do not invent.`
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
		weeklyActions: asArray(rec.weekly_actions).map((x) => asString(x))
	};
	await sql`
    insert into briefs (
      id, kind, brief_date, strategic_interpretation, recommended_actions_json, start_stop_json, maps_json
    ) values (
      ${`brief-weekly-${todayISO()}`}, ${"weekly"}, ${todayISO()}, ${asString(rec.strategic_interpretation)},
      ${JSON.stringify(asArray(rec.recommended_actions).map((x) => asString(x)).slice(0, 8))},
      ${JSON.stringify(startStop)}, ${"{}"}
    )
    on conflict (id) do update set
      strategic_interpretation = excluded.strategic_interpretation,
      recommended_actions_json = excluded.recommended_actions_json,
      start_stop_json = excluded.start_stop_json
  `;
	await recordCycle("weekly", "ok", asString(rec.strategic_interpretation).slice(0, 400), null, 1);
	return {
		ok: true,
		summary: "Weekly strategic report updated.",
		itemCount: 1
	};
});
var runMonthlyCycle_createServerFn_handler = createServerRpc({
	id: "9f2095299095ff246a6cd2c1d6c86f964675e21f895c89aac5672a9fd6b1c1a3",
	name: "runMonthlyCycle",
	filename: "src/lib/neia/server.ts"
}, (opts) => runMonthlyCycle.__executeServer(opts));
var runMonthlyCycle = createServerFn({ method: "POST" }).handler(runMonthlyCycle_createServerFn_handler, async () => {
	await seedIfEmpty();
	const sql = await getSql();
	const items = await sql`
    select title, severity, netso_meaning, recommended_action from intelligence_items
    order by priority_score desc limit 24
  `;
	const result = await grokJson({
		instructions: MONTHLY_INSTRUCTIONS,
		schema: monthlySchema,
		maxOutputTokens: 4e3,
		input: `Today is ${todayISO()}. Desk items:\n${JSON.stringify(items)}\nWrite the monthly CEO review.`
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
		calls: asArray(rec.calls)
	};
	await sql`
    insert into briefs (
      id, kind, brief_date, strategic_interpretation, recommended_actions_json, start_stop_json, maps_json
    ) values (
      ${`brief-monthly-${todayISO().slice(0, 7)}`}, ${"monthly"}, ${todayISO()}, ${asString(rec.strategic_interpretation)},
      ${JSON.stringify(asArray(rec.recommended_actions).map((x) => asString(x)).slice(0, 8))},
      ${"{}"}, ${JSON.stringify(maps)}
    )
    on conflict (id) do update set
      strategic_interpretation = excluded.strategic_interpretation,
      recommended_actions_json = excluded.recommended_actions_json,
      maps_json = excluded.maps_json
  `;
	await recordCycle("monthly", "ok", asString(rec.strategic_interpretation).slice(0, 400), null, 1);
	return {
		ok: true,
		summary: "Monthly strategic review updated.",
		itemCount: 1
	};
});
//#endregion
export { loadDaily_createServerFn_handler, loadDesk_createServerFn_handler, loadItem_createServerFn_handler, loadLedger_createServerFn_handler, loadReviews_createServerFn_handler, loadSignals_createServerFn_handler, loadSources_createServerFn_handler, runDailyCycle_createServerFn_handler, runMonthlyCycle_createServerFn_handler, runSourceScout_createServerFn_handler, runWeeklyCycle_createServerFn_handler };
