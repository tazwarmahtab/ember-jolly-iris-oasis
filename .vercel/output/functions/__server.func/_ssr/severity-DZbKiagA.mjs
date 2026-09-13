import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as confidenceLabel, c as verificationLabel, i as cn } from "./app-shell-D3EIVkmF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/severity-DZbKiagA.js
var import_jsx_runtime = require_jsx_runtime();
function SeverityMark({ severity, compact = false }) {
	const color = severity === "critical" ? "bg-critical" : severity === "important" ? "bg-important" : "bg-watch";
	const label = severity === "critical" ? "Critical" : severity === "important" ? "Important" : "Watch";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2 font-medium uppercase tracking-[0.14em]", compact ? "text-[10px]" : "text-[11px]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", color) }), label]
	});
}
function MetaPills({ confidence, level, category, score, onPaper = false }) {
	const pill = onPaper ? "border-paper-line text-paper-muted" : "border-border text-muted";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", pill),
				children: verificationLabel(level)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", pill),
				children: confidenceLabel(confidence)
			}),
			category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", pill),
				children: category
			}) : null,
			typeof score === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("rounded-sm border px-2 py-0.5 font-mono text-[10px] tabular-nums tracking-wider", pill),
				children: score
			}) : null
		]
	});
}
//#endregion
export { SeverityMark as n, MetaPills as t };
