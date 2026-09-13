import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useRouter, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./app-shell-D3EIVkmF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/run-cycle-Bmvn9UP9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RunCycleButton({ label, pendingLabel, run, variant = "default" }) {
	const router = useRouter();
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onClick() {
		if (pending) return;
		setPending(true);
		try {
			const result = await run();
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			toast.success(result.summary || "Cycle complete");
			await router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Cycle failed");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant,
		onClick: () => void onClick(),
		disabled: pending,
		"aria-busy": pending,
		children: [pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : null, pending ? pendingLabel : label]
	});
}
//#endregion
export { RunCycleButton as t };
