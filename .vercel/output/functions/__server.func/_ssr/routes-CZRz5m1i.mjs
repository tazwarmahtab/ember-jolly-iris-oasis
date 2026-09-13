import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TriangleAlert, u as ArrowRight } from "../_libs/lucide-react.mjs";
import { c as runDailyCycle, s as Route$5 } from "./router-B27tHfjl.mjs";
import { i as cn, o as formatDate, r as categoryLabel, t as AppShell } from "./app-shell-D3EIVkmF.mjs";
import { n as SeverityMark, t as MetaPills } from "./severity-DZbKiagA.mjs";
import { t as RunCycleButton } from "./run-cycle-Bmvn9UP9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CZRz5m1i.js
var import_jsx_runtime = require_jsx_runtime();
function ItemCard({ item, featured = false }) {
	const bar = item.severity === "critical" ? "bg-critical" : item.severity === "important" ? "bg-important" : "bg-watch";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/item/$id",
		params: { id: item.id },
		className: cn("group relative block overflow-hidden rounded-lg bg-paper p-5 text-paper-ink shadow-[0_0_0_1px_rgba(22,22,21,0.06)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5", featured ? "p-6 sm:p-7" : ""),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute inset-y-0 left-0 w-[3px]", bar) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 pl-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityMark, { severity: item.severity }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-paper-muted",
					children: formatDate(item.eventDate)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: cn("mt-3 pl-2 font-display leading-snug tracking-tight text-paper-ink", featured ? "text-2xl sm:text-[1.7rem]" : "text-lg"),
				children: item.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 pl-2 text-sm leading-relaxed text-paper-muted",
				children: featured ? item.netsoMeaning : item.whyItMatters
			}),
			featured && item.conflictAlert ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md border border-paper-line bg-paper px-3 py-3 pl-3 ml-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-critical",
					children: "Conflict alert"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-paper-ink",
					children: item.conflictAlert
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 pl-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaPills, {
					onPaper: true,
					confidence: item.confidence,
					level: item.verificationLevel,
					category: categoryLabel(item.category),
					score: item.priorityScore
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 flex items-center gap-1 pl-2 text-sm font-medium text-paper-ink",
				children: ["So what for Netso", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" })]
			}),
			featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 pl-2 text-sm leading-relaxed text-paper-muted",
				children: item.recommendedAction
			}) : null
		]
	});
}
function SectionHead({ kicker, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted",
			children: kicker
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-1 font-display text-2xl tracking-tight text-fg",
			children: title
		})]
	});
}
function DailyBrief() {
	const { desk, items, brief, reviewFlags } = Route$5.useLoaderData();
	const critical = items.filter((i) => i.severity === "critical");
	const important = items.filter((i) => i.severity === "important");
	const watch = items.filter((i) => i.severity === "watch");
	const grouped = groupByCategory(items);
	const numbers = items.flatMap((i) => i.numbers);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		desk,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stagger-in",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] uppercase tracking-[0.24em] text-muted",
									children: "Netso Energy Limited · Operational"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-2 font-display text-2xl tracking-tight text-fg sm:text-4xl lg:text-5xl",
									children: "Daily intelligence"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-muted",
									children: [formatDate(brief?.briefDate ?? desk.briefDate), " · Evidence-disciplined · Not a news feed"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunCycleButton, {
							label: "Run daily cycle",
							pendingLabel: "Searching live sources",
							run: () => runDailyCycle()
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-2xl text-sm leading-relaxed text-muted",
						children: "What changed that could affect Netso’s ability to win customers, deploy capital, finance projects, or build advantage?"
					}),
					reviewFlags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex gap-3 rounded-lg border border-border bg-bg-elevated p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0 text-important" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Model review triggered"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted",
							children: [
								reviewFlags.length,
								" ledger assumption",
								reviewFlags.length === 1 ? "" : "s",
								" flagged. Do not treat outdated unit-economic inputs as canonical."
							]
						})] })]
					}) : null,
					brief ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10 rounded-xl bg-paper p-6 text-paper-ink sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] uppercase tracking-[0.22em] text-paper-muted",
								children: "Strategic interpretation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-xl leading-snug sm:text-2xl",
								children: brief.strategicInterpretation
							}),
							brief.recommendedActions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-6 space-y-3 border-t border-paper-line pt-5",
								children: brief.recommendedActions.map((action, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-3 text-sm leading-relaxed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] tabular-nums text-paper-muted",
										children: String(i + 1).padStart(2, "0")
									}), action]
								}, action))
							}) : null
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
							kicker: "Maximum 3",
							title: "Critical — act now"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4",
							children: critical.length ? critical.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
								item,
								featured: true
							}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyLine, { text: "No critical items on the desk." })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
							kicker: "Maximum 7",
							title: "Important"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: important.length ? important.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, { item }, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyLine, { text: "No important items." })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
							kicker: "Early warning",
							title: "Watch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border rounded-lg border border-border bg-bg-elevated",
							children: watch.length ? watch.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatchRow, { item }, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-4 py-5 text-sm text-muted",
								children: "Nothing on watch."
							})
						})]
					}),
					numbers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
							kicker: "Preserve originals",
							title: "Market data"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: numbers.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border border-border bg-bg-elevated px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] uppercase tracking-[0.14em] text-muted",
										children: n.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-mono text-sm tabular-nums text-fg",
										children: n.original
									}),
									n.converted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted",
										children: [
											"Original → ",
											n.converted,
											n.assumption ? ` · ${n.assumption}` : ""
										]
									}) : n.assumption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted",
										children: n.assumption
									}) : null
								]
							}, `${n.label}-${n.original}`))
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
							kicker: "Desk partitions",
							title: "By domain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: grouped.map(([cat, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-bg-elevated p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
									children: cat
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-1.5",
									children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-sm leading-snug text-fg",
										children: item.title
									}, item.id))
								})]
							}, cat))
						})]
					})
				]
			})
		})
	});
}
function WatchRow({ item }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/item/$id",
		params: { id: item.id },
		className: "flex flex-col gap-1 px-4 py-4 transition-colors duration-150 hover:bg-bg-subtle sm:flex-row sm:items-baseline sm:justify-between sm:gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-fg",
			children: item.title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted",
			children: [
				item.confidence,
				" · L",
				item.verificationLevel
			]
		})]
	});
}
function EmptyLine({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-lg border border-dashed border-border px-4 py-8 text-sm text-muted",
		children: text
	});
}
function groupByCategory(items) {
	const map = /* @__PURE__ */ new Map();
	for (const item of items) {
		const list = map.get(item.category) ?? [];
		list.push(item);
		map.set(item.category, list);
	}
	return [...map.entries()];
}
//#endregion
export { DailyBrief as component };
