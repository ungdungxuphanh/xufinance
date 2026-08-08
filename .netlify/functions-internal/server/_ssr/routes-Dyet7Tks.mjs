import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { $ as ArrowRight, J as Calculator, W as ChartPie, n as Wallet, q as CalendarDays } from "../_libs/lucide-react.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Button } from "./router-Gk55i8hA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dyet7Tks.js
var import_jsx_runtime = require_jsx_runtime();
var features = [
	{
		icon: Calculator,
		title: "Máy tính tích hợp",
		desc: "Cộng trừ nhanh ngay khi nhập tiền."
	},
	{
		icon: CalendarDays,
		title: "Lịch thu chi",
		desc: "Xem theo ngày hoặc cả tháng trên mọi thiết bị."
	},
	{
		icon: Wallet,
		title: "Nhiều ví",
		desc: "Tiền mặt, Momo, ngân hàng — tách bạch rõ ràng."
	},
	{
		icon: ChartPie,
		title: "Tóm tắt",
		desc: "Biết tiền đi đâu chỉ trong một cái nhìn."
	}
];
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mesh-bg min-h-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-5xl flex-col gap-16 px-6 py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground",
						children: "Quản lí tiền bạc cá nhân"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-6 text-5xl font-bold leading-[1.05] sm:text-7xl",
						children: [
							"Tiền của bạn,",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "gọn gàng mỗi ngày."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-6 max-w-xl text-lg text-muted-foreground",
						children: "Ghi thu nhập và chi tiêu trong vài giây. Tự tạo phân loại với icon và màu riêng, quản lí nhiều ví, xem lại theo ngày · tháng · năm."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex justify-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "font-display",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auth",
								children: ["Bắt đầu miễn phí ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-6 w-6 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-display text-base font-semibold",
							children: f.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: f.desc
						})
					]
				}, f.title))
			})]
		})
	});
}
//#endregion
export { Landing as component };
