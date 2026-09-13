import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$1, u as runSourceScout } from "./router-B27tHfjl.mjs";
import { i as cn, t as AppShell } from "./app-shell-D3EIVkmF.mjs";
import { t as RunCycleButton } from "./run-cycle-Bmvn9UP9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sources-BL24geNt.js
var import_jsx_runtime = require_jsx_runtime();
function SourcesPage() {
	const { desk, sources } = Route$1.useLoaderData();
	const t1 = sources.filter((s) => s.tier === 1);
	const t2 = sources.filter((s) => s.tier === 2);
	const t3 = sources.filter((s) => s.tier === 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		desk,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.24em] text-muted",
							children: "Agent 1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl tracking-tight sm:text-4xl",
							children: "Source scout"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
							children: "Discovers and scores institutions, regulators, media, financiers and researchers before NEIA monitors them. Rank is decision relevance, not follower count. Viral posts are not gazettes."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunCycleButton, {
						label: "Discover sources",
						pendingLabel: "Scouting live web",
						run: () => runSourceScout(),
						variant: "secondary"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Must monitor",
							value: t1.length,
							hint: "Tier 1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "High value",
							value: t2.length,
							hint: "Tier 2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Signal",
							value: t3.length,
							hint: "Tier 3"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierBlock, {
					title: "Tier 1 — must monitor",
					sources: t1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierBlock, {
					title: "Tier 2 — high value",
					sources: t2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierBlock, {
					title: "Tier 3 — signal",
					sources: t3
				})
			]
		})
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-bg-elevated px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.16em] text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-3xl tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-[10px] uppercase tracking-wider text-subtle",
				children: hint
			})
		]
	});
}
function TierBlock({ title, sources }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl tracking-tight",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3",
			children: sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-lg border border-border bg-bg-elevated p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-medium text-fg",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted",
									children: s.kind
								})]
							}),
							s.focus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: s.focus
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-subtle",
								children: s.rationale
							}),
							s.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: s.url,
								target: "_blank",
								rel: "noreferrer",
								className: "mt-2 inline-block text-xs text-fg underline decoration-border underline-offset-4 hover:decoration-fg",
								children: s.url.replace(/^https?:\/\//, "")
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-subtle",
								children: "URL unverified — not invented"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, { score: s.score })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4 lg:grid-cols-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, {
							label: "Primary",
							value: s.scorePrimary,
							max: 25
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, {
							label: "Accuracy",
							value: s.scoreAccuracy,
							max: 20
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, {
							label: "Expertise",
							value: s.scoreExpertise,
							max: 15
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, {
							label: "Speed",
							value: s.scoreSpeed,
							max: 10
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, {
							label: "Relevance",
							value: s.scoreRelevance,
							max: 15
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, {
							label: "Evidence",
							value: s.scoreTransparency,
							max: 10
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, {
							label: "Independence",
							value: s.scoreIndependence,
							max: 5
						})
					]
				})]
			}, s.id))
		})]
	});
}
function ScoreRing({ score }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex size-16 shrink-0 flex-col items-center justify-center rounded-full border border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-lg tabular-nums leading-none",
			children: score
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[9px] uppercase tracking-wider text-muted",
			children: "/100"
		})]
	});
}
function ScoreCell({ label, value, max }) {
	const pct = Math.max(0, Math.min(100, value / max * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between text-[10px] uppercase tracking-wider text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-mono tabular-nums text-fg",
			children: [
				value,
				"/",
				max
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 h-1 overflow-hidden rounded-full bg-bg-subtle",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full bg-accent"),
			style: { width: `${pct}%` }
		})
	})] });
}
//#endregion
export { SourcesPage as component };
