import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Route$4 } from "./router-B27tHfjl.mjs";
import { a as confidenceLabel, i as cn, t as AppShell } from "./app-shell-D3EIVkmF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger-CWD-s1UK.js
var import_jsx_runtime = require_jsx_runtime();
function LedgerPage() {
	const { desk, assumptions } = Route$4.useLoaderData();
	const flagged = assumptions.filter((a) => a.needsReview);
	const rest = assumptions.filter((a) => !a.needsReview);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		desk,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.24em] text-muted",
					children: "Layer 3 · Netso assumptions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl tracking-tight sm:text-4xl",
					children: "Assumption ledger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Canonical operating numbers. When the external world moves a tariff, duty, cutoff or cost, the row is flagged — never allowed to remain silently “true.” Empty cells are honest. Invented CAPEX is worse than a blank."
				}),
				flagged.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Trigger model review"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-3",
						children: flagged.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssumptionRow, {
							item: a,
							flagged: true
						}, a.id))
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Working book"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-3",
						children: rest.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssumptionRow, { item: a }, a.id))
					})]
				})
			]
		})
	});
}
function AssumptionRow({ item, flagged = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: cn("rounded-lg border p-4 sm:p-5", flagged ? "border-important/40 bg-bg-elevated" : "border-border bg-bg-elevated"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-muted",
					children: [item.category, flagged ? " · model review" : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 text-base font-medium",
					children: item.label
				}),
				item.reviewReason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: item.reviewReason
				}) : null,
				item.sourceNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-subtle",
					children: item.sourceNote
				}) : null
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sm:text-right",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xl tabular-nums tracking-tight text-fg",
						children: [item.value, item.unit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 text-xs text-muted",
							children: item.unit
						}) : null]
					}),
					item.originalFigure ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: ["Original · ", item.originalFigure]
					}) : null,
					item.previousValue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-subtle",
						children: ["Was · ", item.previousValue]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-[10px] uppercase tracking-wider text-muted",
						children: confidenceLabel(item.confidence)
					})
				]
			})]
		})
	});
}
//#endregion
export { LedgerPage as component };
