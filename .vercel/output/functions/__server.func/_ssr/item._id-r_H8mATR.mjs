import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-B27tHfjl.mjs";
import { o as formatDate, r as categoryLabel, s as impactLabel, t as AppShell } from "./app-shell-D3EIVkmF.mjs";
import { n as SeverityMark, t as MetaPills } from "./severity-DZbKiagA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/item._id-r_H8mATR.js
var import_jsx_runtime = require_jsx_runtime();
function ItemPage() {
	const { desk, item } = Route.useLoaderData();
	if (!item) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		desk,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "That intelligence item is not on the desk."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-4 inline-block text-sm underline",
				children: "Back to daily brief"
			})]
		})
	});
	const questions = [
		{
			n: "01",
			q: "What happened?",
			a: item.whatHappened
		},
		{
			n: "02",
			q: "Is it verified?",
			a: item.evidence
		},
		{
			n: "03",
			q: "What changed?",
			a: item.whatChanged
		},
		{
			n: "04",
			q: "Why it matters",
			a: item.whyItMatters
		},
		{
			n: "05",
			q: "Who benefits",
			a: item.whoBenefits
		},
		{
			n: "06",
			q: "Who loses",
			a: item.whoLoses
		},
		{
			n: "07",
			q: "What could happen next",
			a: item.whatNext
		},
		{
			n: "08",
			q: "So what for Netso",
			a: item.netsoMeaning
		},
		{
			n: "09",
			q: "What should we do",
			a: item.recommendedAction
		},
		{
			n: "10",
			q: "How urgent",
			a: item.deadline ?? "No hard deadline on the desk — still ranked by urgency score."
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		desk,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Daily brief"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-6 rounded-xl bg-paper p-6 text-paper-ink sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityMark, { severity: item.severity }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-[0.16em] text-paper-muted",
							children: formatDate(item.eventDate)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl",
						children: item.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaPills, {
							onPaper: true,
							confidence: item.confidence,
							level: item.verificationLevel,
							category: categoryLabel(item.category),
							score: item.priorityScore
						})
					}),
					item.impactTags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-muted",
						children: item.impactTags.map(impactLabel).join(" · ")
					}) : null,
					item.conflictAlert ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-md border border-paper-line p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.16em] text-critical",
							children: "Conflict alert"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed",
							children: item.conflictAlert
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-8 space-y-6",
						children: questions.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted",
							children: [
								row.n,
								" · ",
								row.q
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[15px] leading-relaxed",
							children: row.a
						})] }, row.n))
					}),
					item.numbers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-paper-line pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted",
							children: "Extracted figures"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: item.numbers.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-paper-muted",
										children: [n.label, ": "]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono tabular-nums",
										children: n.original
									}),
									n.converted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-paper-muted",
										children: [" → ", n.converted]
									}) : null
								]
							}, `${n.label}-${n.original}`))
						})]
					}) : null,
					item.citations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-paper-line pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted",
							children: "Strongest sources"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: item.citations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm",
								children: c.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: c.url,
									target: "_blank",
									rel: "noreferrer",
									className: "underline decoration-paper-line underline-offset-4 hover:decoration-paper-ink",
									children: c.name
								}) : c.name
							}, c.name))
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-8 grid grid-cols-5 gap-2 border-t border-paper-line pt-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
								n: item.impact,
								l: "Impact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
								n: item.urgency,
								l: "Urgency"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
								n: item.probability,
								l: "Prob."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
								n: item.relevance,
								l: "Netso"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
								n: item.quality,
								l: "Quality"
							})
						]
					})
				]
			})]
		})
	});
}
function Score({ n, l }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "font-mono text-[9px] uppercase tracking-wider text-paper-muted",
		children: l
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 font-mono text-lg tabular-nums",
		children: n
	})] });
}
//#endregion
export { ItemPage as component };
