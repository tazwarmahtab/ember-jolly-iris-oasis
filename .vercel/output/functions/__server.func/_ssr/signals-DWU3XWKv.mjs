import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Route$2 } from "./router-B27tHfjl.mjs";
import { t as AppShell } from "./app-shell-D3EIVkmF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signals-DWU3XWKv.js
var import_jsx_runtime = require_jsx_runtime();
function SignalsPage() {
	const { desk, signals } = Route$2.useLoaderData();
	const opportunities = signals.filter((s) => s.kind === "opportunity");
	const threats = signals.filter((s) => s.kind === "threat");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		desk,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.24em] text-muted",
					children: "Opportunity · threat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl tracking-tight sm:text-4xl",
					children: "Signals"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Ranked by time sensitivity and strategic fit. Bad news is not buried. Hypotheses stay labelled as such."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid gap-10 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
						title: "Opportunities",
						items: opportunities
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
						title: "Threats",
						items: threats,
						tone: "threat"
					})]
				})
			]
		})
	});
}
function Column({ title, items, tone = "opp" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "font-display text-2xl",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 space-y-3",
		children: items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-lg border border-border bg-bg-elevated p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium leading-snug",
						children: s.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] tabular-nums text-muted",
						children: String(s.rank).padStart(2, "0")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: s.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid grid-cols-2 gap-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							label: "Value",
							value: s.potentialValue
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							label: "Probability",
							value: s.probability
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							label: "Time",
							value: s.timeSensitivity,
							warn: tone === "threat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							label: "Fit",
							value: s.strategicFit
						})
					]
				})
			]
		}, s.id))
	})] });
}
function Fact({ label, value, warn = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "font-mono text-[10px] uppercase tracking-wider text-subtle",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: warn ? "mt-0.5 text-important" : "mt-0.5 text-fg",
		children: value ?? "—"
	})] });
}
//#endregion
export { SignalsPage as component };
