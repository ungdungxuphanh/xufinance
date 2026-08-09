import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-cESliV4m.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { B as Clock, P as FolderTree, T as LayoutGrid, g as Settings, x as PiggyBank } from "../_libs/lucide-react.mjs";
import { d as useLocation, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-gK2vFtwx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV_ITEMS = [
	{
		to: "/dashboard",
		label: "Trang chủ",
		icon: LayoutGrid
	},
	{
		to: "/summary",
		label: "Tóm tắt",
		icon: Clock
	},
	{
		to: "/budgets",
		label: "Quỹ",
		icon: PiggyBank
	},
	{
		to: "/categories",
		label: "Phân loại",
		icon: FolderTree
	},
	{
		to: "/settings",
		label: "Cài đặt",
		icon: Settings
	}
];
function BottomNav() {
	const location = useLocation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/90 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md border border-[#E7E5DC]",
		children: NAV_ITEMS.map((item) => {
			const Icon = item.icon;
			const isActive = location.pathname === item.to;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				className: cn("flex flex-col items-center gap-1 rounded-full px-3.5 py-2 text-[11px] font-bold transition-all", isActive ? "bg-[#EAE9E3] text-primary" : "text-[#8A8D7A] hover:text-primary"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
			}, item.to);
		})
	});
}
function AppLayout() {
	(0, import_react.useEffect)(() => {
		supabase.rpc("bootstrap_user", {});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen w-full bg-background pb-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg font-black tracking-tight text-foreground",
					children: "Xu"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-w-0 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
//#endregion
export { AppLayout as component };
