import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-cESliV4m.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { A as HeartPulse, C as PawPrint, D as Landmark, E as Laptop, F as Dumbbell, G as Car, K as Calendar, L as CreditCard, M as Gift, N as Gamepad2, Q as ArrowUpRight, S as Pencil, X as Briefcase, Y as Bus, Z as Banknote, a as TriangleAlert, b as Plane, c as Trash2, d as Sparkles, et as ArrowRightLeft, f as Smartphone, j as GraduationCap, k as House, l as Target, m as ShoppingBag, n as Wallet, o as TrendingUp, p as ShoppingCart, r as UtensilsCrossed, tt as ArrowDownRight, u as Tag, v as ReceiptText, x as PiggyBank, y as Plus, z as Coffee } from "../_libs/lucide-react.mjs";
import { L as redirect, _ as createRootRouteWithContext, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as useQueryClient, n as useQuery, r as QueryClientProvider, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/label-DBD1bRRP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/icons-CbjNbZf6.js
var ICONS = {
	Tag,
	Wallet,
	Banknote,
	Briefcase,
	Gift,
	TrendingUp,
	PiggyBank,
	Laptop,
	UtensilsCrossed,
	Coffee,
	ShoppingBag,
	ShoppingCart,
	Car,
	Bus,
	Plane,
	Home: House,
	ReceiptText,
	CreditCard,
	Gamepad2,
	HeartPulse,
	Dumbbell,
	GraduationCap,
	PawPrint,
	Sparkles,
	Smartphone,
	Landmark
};
var ICON_NAMES = Object.keys(ICONS);
function Icon({ name, className }) {
	const Cmp = ICONS[name] ?? Tag;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cmp, { className });
}
var PALETTE = [
	"#22c55e",
	"#14b8a6",
	"#0ea5e9",
	"#6366f1",
	"#a855f7",
	"#ec4899",
	"#ef4444",
	"#f97316",
	"#eab308",
	"#84cc16",
	"#06b6d4",
	"#64748b"
];
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Gk55i8hA.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-Db-QvIp6.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Xu — Quản lí tiền bạc" },
			{
				name: "description",
				content: "Ghi thu chi, quản lí ví và xem báo cáo theo ngày, tháng, năm."
			},
			{
				property: "og:title",
				content: "Xu — Quản lí tiền bạc"
			},
			{
				property: "og:description",
				content: "Ghi thu chi, quản lí ví và xem báo cáo theo ngày, tháng, năm."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-center",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-Dyet7Tks.mjs");
var Route$7 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Xu — Quản lí tiền bạc đơn giản, nhiều màu sắc" },
		{
			name: "description",
			content: "Xu giúp bạn ghi thu nhập, chi tiêu, quản lí nhiều ví và xem báo cáo theo ngày, tháng, năm — giao diện tối giản, trẻ trung."
		},
		{
			property: "og:title",
			content: "Xu — Quản lí tiền bạc đơn giản"
		},
		{
			property: "og:description",
			content: "Ghi thu chi kèm máy tính, tự tạo phân loại và ví, xem lịch chi tiêu theo tháng."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./route-gK2vFtwx.mjs");
var Route$6 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./auth-CUDLBwu0.mjs");
var Route$5 = createFileRoute("/auth")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Đăng nhập — Xu" },
		{
			name: "description",
			content: "Đăng nhập hoặc tạo tài khoản Xu để quản lí thu chi của bạn."
		},
		{
			property: "og:title",
			content: "Đăng nhập — Xu"
		},
		{
			property: "og:description",
			content: "Đăng nhập bằng Google hoặc email để bắt đầu."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function formatVND(value, opts = {}) {
	const abs = Math.abs(value);
	const formatted = opts.compact ? new Intl.NumberFormat("vi-VN", {
		notation: "compact",
		maximumFractionDigits: 1
	}).format(abs) : new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(abs);
	return `${opts.sign ? value < 0 ? "-" : "+" : value < 0 ? "-" : ""}${formatted}\u00A0₫`;
}
/** Evaluate a simple calculator expression: digits, + - × ÷ . ( ) */
function evalExpression(raw) {
	const expr = raw.replace(/×/g, "*").replace(/÷/g, "/").replace(/,/g, ".").trim();
	if (!expr) return null;
	if (!/^[0-9+\-*/().\s]+$/.test(expr)) return null;
	try {
		const result = Function(`"use strict";return (${expr})`)();
		if (typeof result !== "number" || !Number.isFinite(result)) return null;
		return Math.round(result * 100) / 100;
	} catch {
		return null;
	}
}
var VI_WEEKDAYS = [
	"T2",
	"T3",
	"T4",
	"T5",
	"T6",
	"T7",
	"CN"
];
function ymd(date) {
	return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
}
async function uid() {
	const { data } = await supabase.auth.getUser();
	if (!data.user) throw new Error("Chưa đăng nhập");
	return data.user.id;
}
function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const { data, error } = await supabase.from("categories").select("id,name,type,icon,color,sort_order").order("sort_order");
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useWallets() {
	return useQuery({
		queryKey: ["wallets"],
		queryFn: async () => {
			const { data, error } = await supabase.from("wallets").select("id,name,icon,color,initial_balance,sort_order").order("sort_order");
			if (error) throw error;
			return (data ?? []).map((w) => ({
				...w,
				initial_balance: Number(w.initial_balance)
			}));
		}
	});
}
function useNotes() {
	return useQuery({
		queryKey: ["category_notes"],
		queryFn: async () => {
			const { data, error } = await supabase.from("category_notes").select("id,category_id,text").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
}
/** Transactions inside an inclusive date range (yyyy-mm-dd). */
function useTransactions(from, to) {
	return useQuery({
		queryKey: [
			"transactions",
			from,
			to
		],
		queryFn: async () => {
			const { data, error } = await supabase.from("transactions").select("id,wallet_id,category_id,type,amount,occurred_on,note").gte("occurred_on", from).lte("occurred_on", to).order("created_at", { ascending: false });
			if (error) throw error;
			return (data ?? []).map((t) => ({
				...t,
				amount: Number(t.amount)
			}));
		}
	});
}
function useAllTransactions() {
	return useQuery({
		queryKey: ["transactions", "all"],
		queryFn: async () => {
			const { data, error } = await supabase.from("transactions").select("id,wallet_id,category_id,type,amount,occurred_on,note");
			if (error) throw error;
			return (data ?? []).map((t) => ({
				...t,
				amount: Number(t.amount)
			}));
		}
	});
}
function useInvalidate() {
	const qc = useQueryClient();
	return (keys) => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}
function useSaveTransaction() {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (input) => {
			const user_id = await uid();
			const payload = {
				...input,
				user_id
			};
			const { error } = input.id ? await supabase.from("transactions").update(payload).eq("id", input.id) : await supabase.from("transactions").insert(payload);
			if (error) throw error;
		},
		onSuccess: () => invalidate(["transactions"])
	});
}
function useDeleteTransaction() {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("transactions").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => invalidate(["transactions"])
	});
}
function useSaveCategory() {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (input) => {
			const user_id = await uid();
			const { error } = input.id ? await supabase.from("categories").update({
				...input,
				user_id
			}).eq("id", input.id) : await supabase.from("categories").insert({
				...input,
				user_id
			});
			if (error) throw error;
		},
		onSuccess: () => invalidate(["categories"])
	});
}
function useDeleteCategory() {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("categories").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => invalidate([
			"categories",
			"transactions",
			"category_notes"
		])
	});
}
function useSaveWallet() {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (input) => {
			const user_id = await uid();
			const { error } = input.id ? await supabase.from("wallets").update({
				...input,
				user_id
			}).eq("id", input.id) : await supabase.from("wallets").insert({
				...input,
				user_id
			});
			if (error) throw error;
		},
		onSuccess: () => invalidate(["wallets"])
	});
}
function useDeleteWallet() {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("wallets").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => invalidate(["wallets", "transactions"])
	});
}
function useSaveNote() {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (input) => {
			const user_id = await uid();
			const { error } = await supabase.from("category_notes").insert({
				...input,
				user_id
			});
			if (error) throw error;
		},
		onSuccess: () => invalidate(["category_notes"])
	});
}
function useDeleteNote() {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("category_notes").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => invalidate(["category_notes"])
	});
}
function useProfile() {
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const { data: userRes } = await supabase.auth.getUser();
			const user = userRes.user;
			if (!user) throw new Error("Chưa đăng nhập");
			const { data } = await supabase.from("profiles").select("id,display_name,username").eq("id", user.id).maybeSingle();
			return {
				id: user.id,
				email: user.email ?? "",
				display_name: data?.display_name ?? user.user_metadata?.["full_name"] ?? "",
				username: data?.username ?? ""
			};
		}
	});
}
function useSaveProfile() {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (input) => {
			const id = await uid();
			const { error } = await supabase.from("profiles").upsert({
				id,
				...input
			});
			if (error) throw error;
		},
		onSuccess: () => invalidate(["profile"])
	});
}
var Route$4 = createFileRoute("/_authenticated/budgets")({
	head: () => ({ meta: [{ title: "Quỹ tiết kiệm — Xu" }, {
		name: "description",
		content: "Quản lý các Quỹ riêng và phân bổ tiền từ Ví."
	}] }),
	component: BudgetsPage
});
var PRESET_ICONS = [
	"🏖️",
	"💻",
	"🛡️",
	"🚗",
	"🏠",
	"✈️",
	"🎓",
	"💎",
	"🎯",
	"🎮"
];
var PRESET_COLORS = [
	"#109C7C",
	"#3B82F6",
	"#8B5CF6",
	"#EC4899",
	"#F59E0B",
	"#EF4444"
];
function BudgetsPage() {
	const { data: wallets = [] } = useWallets();
	const [funds, setFunds] = (0, import_react.useState)(() => {
		const saved = localStorage.getItem("xu_funds");
		if (saved) try {
			return JSON.parse(saved);
		} catch (e) {
			console.error("Lỗi đọc dữ liệu quỹ từ localStorage", e);
		}
		return [{
			id: "1",
			name: "Đi chơi cuối năm",
			targetAmount: 5e6,
			currentAmount: 15e5,
			icon: "🏖️",
			color: "#3B82F6",
			deadline: "2026-12-31"
		}, {
			id: "2",
			name: "Quỹ dự phòng",
			targetAmount: 1e7,
			currentAmount: 3e6,
			icon: "🛡️",
			color: "#109C7C"
		}];
	});
	(0, import_react.useEffect)(() => {
		localStorage.setItem("xu_funds", JSON.stringify(funds));
	}, [funds]);
	const [fundModalOpen, setFundModalOpen] = (0, import_react.useState)(false);
	const [transferOpen, setTransferOpen] = (0, import_react.useState)(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = (0, import_react.useState)(false);
	const [editingFund, setEditingFund] = (0, import_react.useState)(null);
	const [selectedFundForTransfer, setSelectedFundForTransfer] = (0, import_react.useState)(null);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formTarget, setFormTarget] = (0, import_react.useState)("");
	const [formIcon, setFormIcon] = (0, import_react.useState)("🎯");
	const [formColor, setFormColor] = (0, import_react.useState)("#109C7C");
	const [formDeadline, setFormDeadline] = (0, import_react.useState)("");
	const [transferType, setTransferType] = (0, import_react.useState)("in");
	const [selectedWalletId, setSelectedWalletId] = (0, import_react.useState)("");
	const [amountInput, setAmountInput] = (0, import_react.useState)("");
	const totalInFunds = (0, import_react.useMemo)(() => {
		return funds.reduce((sum, f) => sum + f.currentAmount, 0);
	}, [funds]);
	const totalTarget = (0, import_react.useMemo)(() => {
		return funds.reduce((sum, f) => sum + f.targetAmount, 0);
	}, [funds]);
	const overallProgress = (0, import_react.useMemo)(() => {
		if (totalTarget === 0) return 0;
		return Math.min(100, Math.round(totalInFunds / totalTarget * 100));
	}, [totalInFunds, totalTarget]);
	const handleOpenCreateModal = () => {
		setEditingFund(null);
		setFormName("");
		setFormTarget("");
		setFormIcon("🎯");
		setFormColor("#109C7C");
		setFormDeadline("");
		setFundModalOpen(true);
	};
	const handleOpenEditModal = (fund) => {
		setEditingFund(fund);
		setFormName(fund.name);
		setFormTarget(fund.targetAmount ? fund.targetAmount.toString() : "");
		setFormIcon(fund.icon);
		setFormColor(fund.color || "#109C7C");
		setFormDeadline(fund.deadline || "");
		setFundModalOpen(true);
	};
	const handleSaveFund = (e) => {
		e.preventDefault();
		if (!formName) return;
		if (editingFund) setFunds((prev) => prev.map((f) => {
			if (f.id === editingFund.id) {
				const updated = {
					...f,
					name: formName,
					targetAmount: Number(formTarget) || 0,
					icon: formIcon,
					color: formColor
				};
				if (formDeadline) updated.deadline = formDeadline;
				else delete updated.deadline;
				return updated;
			}
			return f;
		}));
		else {
			const newFund = {
				id: Date.now().toString(),
				name: formName,
				targetAmount: Number(formTarget) || 0,
				currentAmount: 0,
				icon: formIcon,
				color: formColor,
				...formDeadline ? { deadline: formDeadline } : {}
			};
			setFunds((prev) => [...prev, newFund]);
		}
		setFundModalOpen(false);
	};
	const handleConfirmDelete = () => {
		if (editingFund) {
			setFunds((prev) => prev.filter((f) => f.id !== editingFund.id));
			setDeleteConfirmOpen(false);
			setFundModalOpen(false);
			setEditingFund(null);
		}
	};
	const handleTransfer = (e) => {
		e.preventDefault();
		if (!selectedFundForTransfer || !amountInput || !selectedWalletId) return;
		const amount = Number(amountInput);
		if (amount <= 0) return;
		setFunds((prev) => prev.map((f) => {
			if (f.id === selectedFundForTransfer.id) {
				const updatedAmount = transferType === "in" ? f.currentAmount + amount : f.currentAmount - amount;
				return {
					...f,
					currentAmount: Math.max(0, updatedAmount)
				};
			}
			return f;
		}));
		setTransferOpen(false);
		setAmountInput("");
		setSelectedFundForTransfer(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F3F4F1] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex items-center justify-between pb-3 border-b border-[#E3E2DC]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg sm:text-xl font-extrabold tracking-tight text-[#16181D]",
					children: "Quỹ & Ngân sách"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-[#8A8D7A]",
					children: "Tích lũy mục tiêu và quản lý khoản tiết kiệm"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleOpenCreateModal,
					className: "rounded-full bg-[#16181D] hover:bg-[#2A2E37] text-white font-bold text-xs sm:text-sm px-4 py-2 h-auto shadow-sm transition-all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Tạo quỹ"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-5 xl:col-span-4 space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative rounded-[26px] bg-white border border-[#E7E5DC] shadow-sm pt-6 pb-5 px-6 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8A8D7A]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "h-4 w-4 text-[#D8A13B]" }), "Tổng tiền cất trong Quỹ"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-['JetBrains_Mono'] text-3xl sm:text-4xl font-bold leading-none tabular-nums text-[#16181D]",
								children: formatVND(totalInFunds)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFD7] rotate-6 text-[#B4832B]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "h-6 w-6" })
							})]
						}), totalTarget > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 pt-4 border-t border-[#EDECE6] space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[#8A8D7A] flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5" }), " Tổng mục tiêu"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-['JetBrains_Mono'] text-[#16181D]",
										children: formatVND(totalTarget)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 w-full rounded-full bg-[#F3F4F1] overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-[#109C7C] transition-all duration-500",
										style: { width: `${overallProgress}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] font-semibold text-right text-[#109C7C]",
									children: [
										"Đã đạt ",
										overallProgress,
										"% kế hoạch"
									]
								})
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7 xl:col-span-8 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between px-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm sm:text-base font-extrabold text-[#16181D]",
							children: [
								"Danh sách quỹ (",
								funds.length,
								")"
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3",
						children: funds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-full rounded-[26px] border border-dashed border-[#D8D6CC] bg-white p-8 text-center text-xs sm:text-sm font-bold text-[#8A8D7A]",
							children: "Chưa có quỹ nào — Bấm nút \"Tạo quỹ\" để bắt đầu tích lũy nhé"
						}) : funds.map((fund) => {
							const percent = fund.targetAmount > 0 ? Math.min(100, Math.round(fund.currentAmount / fund.targetAmount * 100)) : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[22px] bg-white border border-[#E7E5DC] p-4 shadow-sm hover:border-[#D8D6CC] transition-all space-y-3 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm",
											style: { backgroundColor: `${fund.color}15` },
											children: fund.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "truncate text-xs sm:text-sm font-extrabold text-[#16181D]",
														children: fund.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleOpenEditModal(fund),
														className: "text-[#8A8D7A] hover:text-[#16181D] transition-colors p-0.5",
														"aria-label": "Sửa quỹ",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] font-semibold text-[#8A8D7A] truncate",
													children: ["Mục tiêu: ", fund.targetAmount > 0 ? formatVND(fund.targetAmount) : "Không giới hạn"]
												}),
												fund.deadline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] font-medium text-[#8A8D7A] flex items-center gap-1 mt-0.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
														" Hạn: ",
														fund.deadline
													]
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => {
											setSelectedFundForTransfer(fund);
											setTransferOpen(true);
										},
										variant: "outline",
										size: "sm",
										className: "rounded-full border-[#E3E2DC] bg-[#F9F9F8] hover:bg-[#EAE9E3] text-[11px] sm:text-xs font-bold text-[#16181D] gap-1 shrink-0 h-8 px-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-3.5 w-3.5 text-[#8A8D7A]" }), " Chuyển"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs font-['JetBrains_Mono'] font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { color: fund.color },
											children: formatVND(fund.currentAmount)
										}), fund.targetAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[#8A8D7A]",
											children: [percent, "%"]
										})]
									}), fund.targetAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 w-full rounded-full bg-[#F3F4F1] overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full transition-all duration-300",
											style: {
												width: `${percent}%`,
												backgroundColor: fund.color
											}
										})
									})]
								})]
							}, fund.id);
						})
					})]
				})]
			}),
			fundModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveFund,
					className: "w-full max-w-sm rounded-[26px] bg-white p-6 space-y-4 shadow-xl border border-[#E7E5DC] max-h-[90vh] overflow-y-auto font-['Be_Vietnam_Pro']",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b pb-3 border-[#E3E2DC]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-extrabold text-[#16181D]",
								children: editingFund ? "Chỉnh sửa Quỹ" : "Tạo Quỹ mới"
							}), editingFund && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setDeleteConfirmOpen(true),
								className: "text-xs font-bold text-[#EF4444] flex items-center gap-1 hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Xoá"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-[#16181D]",
								children: "Biểu tượng (Icon)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: formIcon,
									onChange: (e) => setFormIcon(e.target.value),
									className: "w-12 h-10 rounded-xl border border-[#EDECE6] text-center text-xl bg-[#F3F4F1] focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1.5 overflow-x-auto pb-1 max-w-[220px]",
									children: PRESET_ICONS.map((icon) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setFormIcon(icon),
										className: `h-9 w-9 rounded-xl text-base flex items-center justify-center shrink-0 border transition-all ${formIcon === icon ? "border-[#16181D] bg-[#F3F4F1]" : "border-transparent hover:bg-[#F3F4F1]/50"}`,
										children: icon
									}, icon))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-[#16181D]",
								children: "Tên Quỹ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "Ví dụ: Đi chơi, Mua iPad...",
								value: formName,
								onChange: (e) => setFormName(e.target.value),
								required: true,
								className: "w-full rounded-xl border border-[#EDECE6] p-2.5 text-xs sm:text-sm font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-[#16181D]",
								children: "Mục tiêu (VNĐ)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								placeholder: "0",
								value: formTarget,
								onChange: (e) => setFormTarget(e.target.value),
								className: "w-full rounded-xl border border-[#EDECE6] p-2.5 font-['JetBrains_Mono'] text-xs sm:text-sm font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-[#16181D]",
								children: "Thời hạn hoàn thành (Không bắt buộc)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: formDeadline,
								onChange: (e) => setFormDeadline(e.target.value),
								className: "w-full rounded-xl border border-[#EDECE6] p-2.5 text-xs font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-[#16181D]",
								children: "Màu sắc chủ đạo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2.5",
								children: PRESET_COLORS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFormColor(color),
									className: `h-7 w-7 rounded-full border-2 transition-transform active:scale-90 ${formColor === color ? "scale-110 border-[#16181D]" : "border-transparent"}`,
									style: { backgroundColor: color }
								}, color))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setFundModalOpen(false),
								className: "flex-1 rounded-full text-xs font-bold text-[#8A8D7A] hover:bg-[#F3F4F1]",
								children: "Hủy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "flex-1 rounded-full bg-[#16181D] text-xs font-bold text-white hover:bg-[#2A2E37]",
								children: editingFund ? "Cập nhật" : "Tạo quỹ"
							})]
						})
					]
				})
			}),
			deleteConfirmOpen && editingFund && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-xs rounded-[26px] bg-white p-5 text-center space-y-4 shadow-2xl border border-[#E7E5DC] font-['Be_Vietnam_Pro']",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FCE4E0] text-[#EF5B45]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-base font-extrabold text-[#16181D]",
								children: [
									"Xoá quỹ \"",
									editingFund.name,
									"\"?"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-[#8A8D7A]",
								children: "Thao tác này không thể hoàn tác. Bạn có chắc chắn muốn xoá?"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setDeleteConfirmOpen(false),
								className: "flex-1 rounded-full text-xs font-bold text-[#8A8D7A] bg-[#F3F4F1] hover:bg-[#EAE9E3]",
								children: "Hủy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: handleConfirmDelete,
								className: "flex-1 rounded-full bg-[#EF5B45] text-xs font-bold text-white hover:bg-[#DC4C37]",
								children: "Xác nhận xoá"
							})]
						})
					]
				})
			}),
			transferOpen && selectedFundForTransfer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleTransfer,
					className: "w-full max-w-sm rounded-[26px] bg-white p-6 space-y-4 shadow-xl border border-[#E7E5DC] font-['Be_Vietnam_Pro']",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between border-b pb-3 border-[#E3E2DC]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-base font-extrabold text-[#16181D]",
								children: ["Chuyển tiền — ", selectedFundForTransfer.name]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex rounded-full bg-[#F3F4F1] p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTransferType("in"),
								className: `flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-xs font-bold transition-all ${transferType === "in" ? "bg-[#16181D] text-white shadow-sm" : "text-[#8A8D7A]"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3.5 w-3.5 text-[#109C7C]" }), " Cất vào Quỹ"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTransferType("out"),
								className: `flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-xs font-bold transition-all ${transferType === "out" ? "bg-[#16181D] text-white shadow-sm" : "text-[#8A8D7A]"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5 text-[#EF5B45]" }), " Rút về Ví"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-bold text-[#16181D] flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3.5 w-3.5 text-[#109C7C]" }), " Chọn Ví giao dịch"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: selectedWalletId,
								onChange: (e) => setSelectedWalletId(e.target.value),
								required: true,
								className: "w-full rounded-xl border border-[#EDECE6] p-2.5 text-xs sm:text-sm font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "-- Chọn Ví --"
								}), wallets.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: w.id,
									children: [
										w.name,
										" (",
										formatVND(w.initial_balance ?? 0),
										")"
									]
								}, w.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-[#16181D]",
								children: "Số tiền (VNĐ)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								placeholder: "0",
								value: amountInput,
								onChange: (e) => setAmountInput(e.target.value),
								required: true,
								className: "w-full rounded-xl border border-[#EDECE6] p-2.5 font-['JetBrains_Mono'] text-base font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setTransferOpen(false),
								className: "flex-1 rounded-full text-xs font-bold text-[#8A8D7A] hover:bg-[#F3F4F1]",
								children: "Hủy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "flex-1 rounded-full bg-[#109C7C] text-xs font-bold text-white hover:bg-[#0E8569]",
								children: "Xác nhận"
							})]
						})
					]
				})
			})
		]
	});
}
var $$splitComponentImporter$3 = () => import("./categories-D42QY31K.mjs");
var Route$3 = createFileRoute("/_authenticated/categories")({
	head: () => ({ meta: [
		{ title: "Phân loại — Xu" },
		{
			name: "description",
			content: "Tạo phân loại thu chi riêng với tên, icon, màu và ghi chú."
		},
		{
			property: "og:title",
			content: "Phân loại — Xu"
		},
		{
			property: "og:description",
			content: "Tạo phân loại thu chi riêng với tên, icon, màu và ghi chú."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./dashboard-CdVOPTVg.mjs");
var Route$2 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Trang chủ — Xu" }, {
		name: "description",
		content: "Xem thu chi theo ngày hoặc theo lịch tháng."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./settings-Cj2_v4Xs.mjs");
var Route$1 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [
		{ title: "Cài đặt — Xu" },
		{
			name: "description",
			content: "Đổi tên hiển thị, tên đăng nhập, mật khẩu và đăng xuất."
		},
		{
			property: "og:title",
			content: "Cài đặt — Xu"
		},
		{
			property: "og:description",
			content: "Đổi tên hiển thị, tên đăng nhập, mật khẩu và đăng xuất."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./summary-C67vt18e.mjs");
var Route = createFileRoute("/_authenticated/summary")({
	head: () => ({ meta: [
		{ title: "Tóm tắt — Xu" },
		{
			name: "description",
			content: "Số dư từng ví và tổng quan thu chi của bạn."
		},
		{
			property: "og:title",
			content: "Tóm tắt — Xu"
		},
		{
			property: "og:description",
			content: "Số dư từng ví và tổng quan thu chi của bạn."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function IconColorPicker({ icon, color, setIcon, setColor }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs font-bold text-[#16181D]",
			children: "Màu sắc"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: PALETTE.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setColor(c),
				style: { backgroundColor: c },
				className: cn("h-7 w-7 rounded-full ring-offset-2 ring-offset-background transition-all active:scale-90", color === c && "ring-2 ring-[#16181D]"),
				"aria-label": `Màu ${c}`
			}, c))
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs font-bold text-[#16181D]",
			children: "Biểu tượng"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid max-h-32 grid-cols-8 gap-1.5 overflow-y-auto p-1 bg-[#F3F4F1] rounded-xl border border-[#EDECE6]",
			children: ICON_NAMES.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setIcon(n),
				className: cn("flex h-9 items-center justify-center rounded-lg border transition-all active:scale-90", icon === n ? "border-[#16181D] bg-white text-[#16181D] shadow-sm" : "border-transparent text-[#8A8D7A] hover:bg-white/50"),
				"aria-label": n,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					name: n,
					className: "h-4 w-4"
				})
			}, n))
		})]
	})] });
}
var IndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$8
});
var AuthenticatedRouteRoute = Route$6.update({
	id: "/_authenticated",
	getParentRoute: () => Route$8
});
var AuthRoute = Route$5.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$8
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedBudgetsRoute: Route$4.update({
		id: "/budgets",
		path: "/budgets",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedCategoriesRoute: Route$3.update({
		id: "/categories",
		path: "/categories",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedDashboardRoute: Route$2.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedSettingsRoute: Route$1.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedSummaryRoute: Route.update({
		id: "/summary",
		path: "/summary",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { ICON_NAMES as C, Label as E, Button as S, PALETTE as T, useWallets as _, useDeleteCategory as a, formatVND as b, useDeleteWallet as c, useSaveCategory as d, useSaveNote as f, useTransactions as g, useSaveWallet as h, useCategories as i, useNotes as l, useSaveTransaction as m, IconColorPicker as n, useDeleteNote as o, useSaveProfile as p, useAllTransactions as r, useDeleteTransaction as s, router_exports as t, useProfile as u, VI_WEEKDAYS as v, Icon as w, ymd as x, evalExpression as y };
