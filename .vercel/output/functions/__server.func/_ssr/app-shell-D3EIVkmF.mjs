import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as useRouterState, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Menu, c as Crosshair, i as Radar, l as BookOpen, r as Scale, s as FileText, t as X } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-D3EIVkmF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function formatDate(iso) {
	if (!iso) return "—";
	const [y, m, day] = iso.slice(0, 10).split("-").map(Number);
	if (!y || !m || !day) return iso;
	return `${day} ${MONTHS[m - 1]} ${y}`;
}
function formatDateTime(iso) {
	if (!iso) return "—";
	const date = formatDate(iso);
	const time = iso.length > 10 ? iso.slice(11, 16) : "";
	return time ? `${date} ${time}` : date;
}
function confidenceLabel(c) {
	if (c === "high") return "High confidence";
	if (c === "medium") return "Medium confidence";
	if (c === "low") return "Low confidence";
	return "Speculation";
}
function verificationLabel(n) {
	return {
		1: "L1 social claim",
		2: "L2 single outlet",
		3: "L3 multi-source",
		4: "L4 primary",
		5: "L5 primary + confirm"
	}[n] ?? `L${n}`;
}
function categoryLabel(c) {
	return {
		policy: "Policy",
		regulation: "Regulation",
		finance: "Finance",
		solar: "Solar",
		storage: "Storage",
		technology: "Technology",
		customer: "Customer market",
		competitor: "Competitors",
		global: "Global",
		market: "Market data"
	}[c] ?? c;
}
function impactLabel(tag) {
	return tag.replace(/_/g, " ");
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-bg-subtle text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-muted hover:text-fg hover:bg-bg-subtle",
			paper: "bg-paper-ink text-paper hover:opacity-90",
			danger: "bg-critical text-fg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var NAV = [
	{
		to: "/",
		label: "Daily brief",
		icon: FileText
	},
	{
		to: "/sources",
		label: "Source scout",
		icon: Radar
	},
	{
		to: "/ledger",
		label: "Assumption ledger",
		icon: Scale
	},
	{
		to: "/signals",
		label: "Signals",
		icon: Crosshair
	},
	{
		to: "/reviews",
		label: "Reviews",
		icon: BookOpen
	}
];
function AppShell({ desk, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-dvh",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col border-r border-border bg-bg-elevated lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, {
						pathname,
						onNavigate: () => setOpen(false)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskMeta, { desk })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/92 px-4 backdrop-blur-sm lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg tracking-tight",
								children: "NEIA"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": open ? "Close menu" : "Open menu",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
						})]
					}),
					open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border bg-bg-elevated px-3 py-3 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, {
							pathname,
							onNavigate: () => setOpen(false)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskMeta, { desk })]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-w-0 flex-1",
						children
					})
				]
			})]
		})
	});
}
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-start gap-3 px-5 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-display text-2xl leading-none tracking-tight",
			children: "NEIA"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 block text-[10px] uppercase tracking-[0.22em] text-muted",
			children: "Netso intelligence"
		})] })]
	});
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": true,
		className: "mt-0.5 grid size-8 place-items-center rounded-sm bg-paper text-[13px] font-semibold text-paper-ink",
		children: "N"
	});
}
function NavList({ pathname, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-1 flex-col gap-0.5 px-3",
		children: NAV.map((item) => {
			const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-bg-subtle text-fg" : "text-muted hover:bg-bg-subtle/60 hover:text-fg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), item.label]
			}, item.to);
		})
	});
}
function DeskMeta({ desk }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 border-t border-border px-5 py-4 text-[11px] text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tier 1 sources" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono tabular-nums text-fg",
					children: desk.tier1Count
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Critical live" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono tabular-nums text-fg",
					children: desk.criticalCount
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Model reviews" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono tabular-nums text-fg",
					children: desk.reviewCount
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "pt-2 leading-relaxed",
				children: [
					"Last cycle",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: desk.lastCycle ? `${desk.lastCycle.kind} · ${formatDateTime(desk.lastCycle.createdAt)}` : "Not yet run"
					})
				]
			})
		]
	});
}
//#endregion
export { confidenceLabel as a, verificationLabel as c, cn as i, Button as n, formatDate as o, categoryLabel as r, impactLabel as s, AppShell as t };
