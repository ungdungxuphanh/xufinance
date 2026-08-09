import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { $ as ArrowRight, H as ChevronLeft, I as Delete, R as Coins, S as Pencil, U as Check, V as ChevronRight, _ as Scale, c as Trash2, n as Wallet, s as TrendingDown, x as PiggyBank, y as Plus } from "../_libs/lucide-react.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as Label, S as Button, _ as useWallets, b as formatVND, f as useSaveNote, g as useTransactions, i as useCategories, l as useNotes, m as useSaveTransaction, r as useAllTransactions, s as useDeleteTransaction, v as VI_WEEKDAYS, w as Icon, x as ymd, y as evalExpression } from "./router-Gk55i8hA.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-B69u1cPq.mjs";
import { a as endOfMonth, i as startOfMonth, n as getDay, o as addMonths, r as format, s as addDays, t as vi } from "../_libs/date-fns.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CdVOPTVg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
var KEYS = [
	"7",
	"8",
	"9",
	"÷",
	"4",
	"5",
	"6",
	"×",
	"1",
	"2",
	"3",
	"-",
	"000",
	"0",
	".",
	"+"
];
function Calculator$1({ value, onChange, tone }) {
	const [preview, setPreview] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setPreview(evalExpression(value));
	}, [value]);
	const push = (k) => onChange(value + k);
	const isOperator = /[+\-×÷]$/.test(value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border bg-muted/40 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-baseline justify-between gap-2 px-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate font-display text-lg text-muted-foreground",
				children: value || "0"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("shrink-0 font-display text-xl font-bold", tone === "income" ? "text-income" : "text-expense"),
				children: formatVND(preview ?? 0)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-4 gap-2",
			children: [
				KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						if ([
							"+",
							"-",
							"×",
							"÷"
						].includes(k)) {
							if (!value) return;
							if (isOperator) return onChange(value.slice(0, -1) + k);
						}
						push(k);
					},
					className: cn("h-11 rounded-xl border bg-card font-display text-base font-semibold transition-colors hover:bg-accent active:scale-[0.97]", [
						"+",
						"-",
						"×",
						"÷"
					].includes(k) && "bg-secondary text-secondary-foreground"),
					children: k
				}, k)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(""),
					className: "h-11 rounded-xl border bg-card font-display text-sm font-semibold transition-colors hover:bg-accent",
					children: "AC"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(value.slice(0, -1)),
					className: "h-11 rounded-xl border bg-card transition-colors hover:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delete, { className: "mx-auto h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => preview !== null && onChange(String(preview)),
					className: "col-span-2 h-11 rounded-xl bg-primary font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
					children: "="
				})
			]
		})]
	});
}
function TransactionDialog({ open, onOpenChange, date, editing }) {
	const { data: categories = [] } = useCategories();
	const { data: wallets = [] } = useWallets();
	const { data: notes = [] } = useNotes();
	const save = useSaveTransaction();
	const saveNote = useSaveNote();
	const [type, setType] = (0, import_react.useState)("expense");
	const [expr, setExpr] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)(null);
	const [walletId, setWalletId] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const [day, setDay] = (0, import_react.useState)(ymd(date));
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (editing) {
			setType(editing.type);
			setExpr(String(editing.amount));
			setCategoryId(editing.category_id);
			setWalletId(editing.wallet_id);
			setNote(editing.note ?? "");
			setDay(editing.occurred_on);
		} else {
			setType("expense");
			setExpr("");
			setCategoryId(null);
			setWalletId(wallets[0]?.id ?? null);
			setNote("");
			setDay(ymd(date));
		}
	}, [
		open,
		editing,
		date,
		wallets
	]);
	const visibleCategories = (0, import_react.useMemo)(() => categories.filter((c) => c.type === type), [categories, type]);
	const categoryNotes = (0, import_react.useMemo)(() => notes.filter((n) => n.category_id === categoryId), [notes, categoryId]);
	const amount = evalExpression(expr);
	async function submit() {
		if (!amount || amount <= 0) {
			toast.error("Nhập số tiền hợp lệ");
			return;
		}
		if (!categoryId) {
			toast.error("Chọn một phân loại");
			return;
		}
		try {
			await save.mutateAsync({
				...editing?.id ? { id: editing.id } : {},
				type,
				amount,
				category_id: categoryId,
				wallet_id: walletId,
				occurred_on: day,
				note: note.trim() || null
			});
			toast.success(editing ? "Đã cập nhật" : "Đã lưu giao dịch");
			onOpenChange(false);
		} catch (e) {
			toast.error(e.message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "border-b px-5 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display",
						children: editing ? "Sửa giao dịch" : "Thêm giao dịch"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "max-h-[70vh]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1",
								children: ["income", "expense"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setType(t);
										setCategoryId(null);
									},
									className: cn("rounded-xl py-2 font-display text-sm font-semibold transition-all", type === t ? t === "income" ? "bg-income text-income-foreground shadow-sm" : "bg-expense text-expense-foreground shadow-sm" : "text-muted-foreground"),
									children: t === "income" ? "Thu nhập" : "Chi tiêu"
								}, t))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator$1, {
								value: expr,
								onChange: setExpr,
								tone: type
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phân loại" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [visibleCategories.map((c) => {
										const active = c.id === categoryId;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setCategoryId(c.id),
											style: active ? {
												backgroundColor: c.color,
												borderColor: c.color
											} : {
												borderColor: `${c.color}55`,
												color: c.color
											},
											className: cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all", active && "text-white shadow-sm"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												name: c.icon,
												className: "h-4 w-4"
											}), c.name]
										}, c.id);
									}), visibleCategories.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Chưa có phân loại — tạo ở mục Phân loại."
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ví" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: wallets.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setWalletId(w.id),
											style: walletId === w.id ? {
												backgroundColor: w.color,
												borderColor: w.color
											} : {
												borderColor: `${w.color}55`,
												color: w.color
											},
											className: cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium", walletId === w.id && "text-white"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												name: w.icon,
												className: "h-4 w-4"
											}), w.name]
										}, w.id))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "tx-date",
										children: "Ngày"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "tx-date",
										type: "date",
										value: day,
										onChange: (e) => setDay(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "tx-note",
										children: "Ghi chú"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "tx-note",
											value: note,
											placeholder: "Ví dụ: mua thịt",
											maxLength: 200,
											onChange: (e) => setNote(e.target.value)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											size: "icon",
											title: "Lưu ghi chú nhanh cho phân loại này",
											disabled: !categoryId || !note.trim(),
											onClick: async () => {
												await saveNote.mutateAsync({
													category_id: categoryId,
													text: note.trim()
												});
												toast.success("Đã lưu ghi chú nhanh");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
										})]
									}),
									categoryNotes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5 pt-1",
										children: categoryNotes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setNote(n.text),
											className: "rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground hover:bg-accent",
											children: n.text
										}, n.id))
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full font-display",
						size: "lg",
						onClick: submit,
						disabled: save.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 h-4 w-4" }), editing ? "Cập nhật" : "Lưu giao dịch"]
					})
				})
			]
		})
	});
}
function Dashboard() {
	const navigate = useNavigate();
	const [view, setView] = (0, import_react.useState)("month");
	const [cursor, setCursor] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [funds, setFunds] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("xu_funds");
		if (saved) try {
			setFunds(JSON.parse(saved));
		} catch (e) {
			console.error("Lỗi đọc dữ liệu quỹ", e);
		}
		else setFunds([{
			id: "1",
			name: "Đi chơi cuối năm",
			targetAmount: 5e6,
			currentAmount: 15e5,
			icon: "🏖️",
			color: "#3B82F6"
		}, {
			id: "2",
			name: "Quỹ dự phòng",
			targetAmount: 1e7,
			currentAmount: 3e6,
			icon: "🛡️",
			color: "#109C7C"
		}]);
	}, []);
	const monthStart = startOfMonth(cursor);
	const monthEnd = endOfMonth(cursor);
	const range = view === "month" ? {
		from: ymd(monthStart),
		to: ymd(monthEnd)
	} : {
		from: ymd(cursor),
		to: ymd(cursor)
	};
	const { data: txs = [] } = useTransactions(range.from, range.to);
	const { data: allTxs = [] } = useAllTransactions();
	const { data: categories = [] } = useCategories();
	const { data: wallets = [] } = useWallets();
	const del = useDeleteTransaction();
	const catMap = (0, import_react.useMemo)(() => new Map(categories.map((c) => [c.id, c])), [categories]);
	const walletMap = (0, import_react.useMemo)(() => new Map(wallets.map((w) => [w.id, w])), [wallets]);
	const totalWalletBalance = (0, import_react.useMemo)(() => {
		return wallets.reduce((sum, w) => sum + (w.initial_balance ?? 0), 0) + allTxs.reduce((sum, t) => {
			if (!t.wallet_id) return sum;
			return sum + (t.type === "income" ? t.amount : -t.amount);
		}, 0);
	}, [wallets, allTxs]);
	const totals = (0, import_react.useMemo)(() => {
		let income = 0;
		let expense = 0;
		for (const t of txs) t.type === "income" ? income += t.amount : expense += t.amount;
		return {
			income: totalWalletBalance,
			expense,
			net: totalWalletBalance - expense
		};
	}, [txs, totalWalletBalance]);
	const byDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of txs) {
			const entry = map.get(t.occurred_on) ?? {
				income: 0,
				expense: 0
			};
			if (t.type === "income") entry.income += t.amount;
			else entry.expense += t.amount;
			map.set(t.occurred_on, entry);
		}
		return map;
	}, [txs]);
	const cells = (0, import_react.useMemo)(() => {
		const lead = (getDay(monthStart) + 6) % 7;
		const total = lead + monthEnd.getDate();
		const rows = Math.ceil(total / 7) * 7;
		return Array.from({ length: rows }, (_, i) => {
			const dayNum = i - lead + 1;
			if (dayNum < 1 || dayNum > monthEnd.getDate()) return null;
			return addDays(monthStart, dayNum - 1);
		});
	}, [monthStart, monthEnd]);
	const step = (dir) => setCursor((c) => view === "month" ? addMonths(c, dir) : addDays(c, dir));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F3F4F1] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex items-center justify-between gap-2 pb-3 border-b border-[#E3E2DC]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => step(-1),
							className: "flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-[#EAE9E3] active:scale-90 transition-all",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5 px-2 min-w-[140px] justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-base sm:text-lg font-extrabold tracking-tight text-primary",
								children: view === "month" ? format(cursor, "'Tháng' M, yyyy", { locale: vi }) : format(cursor, "dd/MM/yyyy", { locale: vi })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => step(1),
							className: "flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-[#EAE9E3] active:scale-90 transition-all",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex rounded-full bg-[#EAE9E3] p-1",
					children: ["day", "month"].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setView(v),
						className: cn("rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold transition-all", view === v ? "bg-primary text-primary-foreground text-white shadow-sm" : "text-[#6B7280] hover:text-primary"),
						children: v === "day" ? "Ngày" : "Tháng"
					}, v))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7 xl:col-span-8 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative rounded-[26px] bg-white border border-[#E7E5DC] shadow-sm pt-6 pb-5 px-6 overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8A8D7A]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4 text-[#D8A13B]" }), "Tổng tài sản"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-['JetBrains_Mono'] text-2xl sm:text-3xl font-bold leading-none tabular-nums text-primary",
									children: formatVND(totals.income)
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBEFD7] rotate-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-5 w-5 text-[#B4832B]" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative my-4 h-px bg-[repeating-linear-gradient(90deg,#E3E2DC_0_6px,transparent_6px_12px)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-9 -top-2.5 h-5 w-5 rounded-full bg-[#F3F4F1]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -right-9 -top-2.5 h-5 w-5 rounded-full bg-[#F3F4F1]" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#8A8D7A]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5 text-[#EF5B45]" }), "Chi tiêu"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-['JetBrains_Mono'] text-base sm:text-lg font-bold tabular-nums text-[#EF5B45]",
									children: formatVND(totals.expense, { compact: true })
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#8A8D7A]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-3.5 w-3.5 text-primary" }), "Còn lại"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("mt-1 font-['JetBrains_Mono'] text-base sm:text-lg font-bold tabular-nums", totals.net >= 0 ? "text-primary" : "text-[#EF5B45]"),
									children: formatVND(totals.net, { compact: true })
								})] })]
							})
						]
					}), view === "month" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-[26px] border border-[#E7E5DC] bg-white p-5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-7 gap-1 pb-3 border-b border-[#EDECE6] text-center",
							children: VI_WEEKDAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-[#8A8D7A]",
								children: d
							}, d))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-7 gap-y-2 pt-3",
							children: cells.map((d, i) => {
								if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 sm:h-14" }, i);
								const key = ymd(d);
								const entry = byDay.get(key);
								const net = entry ? entry.income - entry.expense : 0;
								const isToday = key === ymd(/* @__PURE__ */ new Date());
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setCursor(d);
										setEditing(null);
										setDialogOpen(true);
									},
									className: "flex h-12 sm:h-14 flex-col items-center justify-start gap-1 rounded-xl hover:bg-[#F3F4F1] transition-all active:scale-95 p-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs font-extrabold", isToday ? "bg-[#D8A13B] text-white" : "text-primary"),
										children: d.getDate()
									}), entry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("font-['JetBrains_Mono'] text-[9px] sm:text-[10px] font-bold tabular-nums leading-none", net >= 0 ? "text-primary" : "text-[#EF5B45]"),
										children: [net >= 0 ? "+" : "-", formatVND(Math.abs(net), { compact: true })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[9px]" })]
								}, key);
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-2.5",
						children: [txs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-[26px] border border-dashed border-[#D8D6CC] bg-white p-8 text-center text-sm font-bold text-[#8A8D7A]",
							children: "Chưa có giao dịch nào — bấm nút + để thêm nhé"
						}), txs.map((t) => {
							const c = t.category_id ? catMap.get(t.category_id) : void 0;
							const w = t.wallet_id ? walletMap.get(t.wallet_id) : void 0;
							const tint = c?.color ?? "#94a3b8";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-2xl bg-white border border-[#EDECE6] px-4 py-3 shadow-sm hover:border-[#D8D6CC] transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
										style: {
											backgroundColor: `${tint}1F`,
											color: tint
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											name: c?.icon ?? "Tag",
											className: "h-5 w-5"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-bold text-primary",
											children: c?.name ?? "Khác"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs font-medium text-[#8A8D7A]",
											children: [t.note, w?.name].filter(Boolean).join(" · ") || "—"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: cn("font-['JetBrains_Mono'] text-sm font-bold tabular-nums", t.type === "income" ? "text-primary" : "text-[#EF5B45]"),
											children: [t.type === "income" ? "+" : "-", formatVND(t.amount)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => {
												setEditing(t);
												setDialogOpen(true);
											},
											className: "h-8 w-8 rounded-full text-[#8A8D7A] hover:text-primary hover:bg-[#F3F4F1]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => del.mutate(t.id),
											className: "h-8 w-8 rounded-full text-[#8A8D7A] hover:text-[#EF5B45] hover:bg-[#FCE4E0]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})
									]
								})]
							}, t.id);
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 xl:col-span-4 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-extrabold text-primary flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary" }), "Ví của bạn"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/summary",
								className: "text-xs font-bold text-[#8A8D7A] hover:text-primary flex items-center gap-0.5",
								children: ["Chi tiết ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2.5",
							children: wallets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-[22px] border border-dashed border-[#D8D6CC] bg-white p-5 text-center text-xs font-bold text-[#8A8D7A]",
								children: "Chưa có ví nào trong tài khoản"
							}) : wallets.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => navigate({ to: "/summary" }),
								className: "flex items-center justify-between rounded-[20px] bg-white border border-[#E7E5DC] p-3.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer hover:border-primary/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4.5 w-4.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-extrabold text-primary",
										children: w.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10.5px] font-medium text-[#8A8D7A]",
										children: w.currency || "VND"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-['JetBrains_Mono'] text-xs font-bold text-primary",
									children: formatVND(w.initial_balance ?? 0)
								})]
							}, w.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-extrabold text-primary flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "h-4 w-4 text-[#D8A13B]" }), "Quỹ tiết kiệm"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/budgets",
								className: "text-xs font-bold text-[#8A8D7A] hover:text-primary flex items-center gap-0.5",
								children: ["Quản lý ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2.5",
							children: funds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-[22px] border border-dashed border-[#D8D6CC] bg-white p-5 text-center text-xs font-bold text-[#8A8D7A]",
								children: "Chưa tạo quỹ tiết kiệm nào"
							}) : funds.map((f) => {
								const percent = f.targetAmount > 0 ? Math.min(100, Math.round(f.currentAmount / f.targetAmount * 100)) : 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => navigate({ to: "/budgets" }),
									className: "rounded-[20px] bg-white border border-[#E7E5DC] p-3.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer hover:border-[#D8A13B]/40 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-9 w-9 items-center justify-center rounded-xl text-lg",
												style: { backgroundColor: `${f.color}15` },
												children: f.icon
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-extrabold text-primary",
												children: f.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10.5px] font-medium text-[#8A8D7A]",
												children: ["Mục tiêu: ", f.targetAmount > 0 ? formatVND(f.targetAmount, { compact: true }) : "Không có"]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-['JetBrains_Mono'] text-xs font-bold text-primary",
												children: formatVND(f.currentAmount)
											}), f.targetAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] font-bold text-[#8A8D7A]",
												children: [percent, "%"]
											})]
										})]
									}), f.targetAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 w-full rounded-full bg-[#F3F4F1] overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full transition-all",
											style: {
												width: `${percent}%`,
												backgroundColor: f.color
											}
										})
									})]
								}, f.id);
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					setCursor(/* @__PURE__ */ new Date());
					setEditing(null);
					setDialogOpen(true);
				},
				className: "fixed bottom-24 right-6 md:bottom-8 md:right-8 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-white shadow-[0_8px_24px_rgba(22,24,29,0.3)] hover:scale-105 active:scale-90 transition-all",
				"aria-label": "Thêm giao dịch",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionDialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				date: cursor,
				editing
			})
		]
	});
}
//#endregion
export { Dashboard as component };
