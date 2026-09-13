import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route$3, d as runWeeklyCycle, l as runMonthlyCycle } from "./router-B27tHfjl.mjs";
import { i as cn, o as formatDate, t as AppShell } from "./app-shell-D3EIVkmF.mjs";
import { t as RunCycleButton } from "./run-cycle-Bmvn9UP9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-DsVRA06k.js
var import_jsx_runtime = require_jsx_runtime();
function ReviewsPage() {
	const { desk, weekly, monthly } = Route$3.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		desk,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.24em] text-muted",
					children: "Layer 4 · Strategic conclusions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl tracking-tight sm:text-4xl",
					children: "Reviews"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Weekly operating cadence and the monthly CEO question: what in the external environment should change strategy?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeeklyBlock, { brief: weekly }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthlyBlock, { brief: monthly })
			]
		})
	});
}
function WeeklyBlock({ brief }) {
	const s = brief?.startStop ?? {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Weekly intelligence"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: brief ? formatDate(brief.briefDate) : "No weekly report yet"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunCycleButton, {
				label: "Write weekly",
				pendingLabel: "Synthesising week",
				run: () => runWeeklyCycle(),
				variant: "secondary"
			})]
		}), brief ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-xl bg-paper p-6 text-paper-ink sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl leading-snug sm:text-2xl",
					children: brief.strategicInterpretation
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-6 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, {
							kicker: "Policy",
							body: s.policy
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, {
							kicker: "Market",
							body: s.market
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, {
							kicker: "Competitors",
							body: s.competitors
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, {
							kicker: "Technology",
							body: s.technology
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, {
							kicker: "Financing",
							body: s.financing
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, {
							kicker: "Customers",
							body: s.customers
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, {
							kicker: "Threats",
							body: s.threats
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, {
							kicker: "Opportunities",
							body: s.opportunities
						})
					]
				}),
				s.implications ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, {
					kicker: "Implications",
					body: s.implications,
					className: "mt-6"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-6 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
							kicker: "Start",
							items: s.start
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
							kicker: "Stop",
							items: s.stop
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
							kicker: "Defer",
							items: s.defer
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
							kicker: "Accelerate",
							items: s.accelerate
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
					kicker: "Top actions this week",
					items: s.weeklyActions,
					className: "mt-8"
				})
			]
		}) : null]
	});
}
function MonthlyBlock({ brief }) {
	const maps = brief?.maps ?? {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-16 mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Monthly strategic review"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: brief ? formatDate(brief.briefDate) : "No monthly review yet"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunCycleButton, {
				label: "Write monthly",
				pendingLabel: "CEO review running",
				run: () => runMonthlyCycle(),
				variant: "secondary"
			})]
		}), brief ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-3xl text-sm leading-relaxed text-muted",
				children: brief.strategicInterpretation
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCard, {
						title: "Market",
						body: maps.market
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCard, {
						title: "Regulatory",
						body: maps.regulatory
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCard, {
						title: "Competitor",
						body: maps.competitor
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCard, {
						title: "Financing",
						body: maps.financing
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCard, {
						title: "Technology",
						body: maps.technology
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCard, {
						title: "Customer demand",
						body: maps.customer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCard, {
						title: "Opportunity",
						body: maps.opportunity
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCard, {
						title: "Threat",
						body: maps.threat
					})
				]
			}),
			maps.calls && maps.calls.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl",
					children: "Scale · experiment · shrink · defer · kill"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: maps.calls.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 rounded-lg border border-border bg-bg-elevated p-4 sm:flex-row sm:items-start sm:gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("shrink-0 font-mono text-[10px] uppercase tracking-[0.18em]", c.call === "scale" ? "text-verified" : c.call === "kill" ? "text-critical" : "text-important"),
							children: c.call
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: c.initiative
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted",
							children: c.why
						})] })]
					}, c.initiative))
				})]
			}) : null
		] }) : null]
	});
}
function Prose({ kicker, body, className }) {
	if (!body) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted",
			children: kicker
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed",
			children: body
		})]
	});
}
function List({ kicker, items, className }) {
	if (!items?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted",
			children: kicker
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-2",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-sm leading-relaxed",
				children: item
			}, item))
		})]
	});
}
function MapCard({ title, body }) {
	if (!body) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-border bg-bg-elevated p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-[0.16em] text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-fg",
			children: body
		})]
	});
}
//#endregion
export { ReviewsPage as component };
