import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { R as Coins, S as Pencil, W as ChartPie, c as Trash2, n as Wallet, y as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as ICON_NAMES, E as Label, S as Button, T as PALETTE, _ as useWallets, b as formatVND, c as useDeleteWallet, h as useSaveWallet, i as useCategories, r as useAllTransactions, w as Icon } from "./router-Gk55i8hA.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-B69u1cPq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/summary-C67vt18e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SummaryPage() {
	const { data: wallets = [] } = useWallets();
	const { data: txs = [] } = useAllTransactions();
	const { data: categories = [] } = useCategories();
	const del = useDeleteWallet();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const balances = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const w of wallets) map.set(w.id, w.initial_balance ?? 0);
		for (const t of txs) {
			if (!t.wallet_id) continue;
			map.set(t.wallet_id, (map.get(t.wallet_id) ?? 0) + (t.type === "income" ? t.amount : -t.amount));
		}
		return map;
	}, [wallets, txs]);
	const total = (0, import_react.useMemo)(() => wallets.reduce((sum, w) => sum + (balances.get(w.id) ?? 0), 0), [wallets, balances]);
	const byCategory = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of txs) {
			if (t.type !== "expense" || !t.category_id) continue;
			map.set(t.category_id, (map.get(t.category_id) ?? 0) + t.amount);
		}
		const list = [...map.entries()].map(([id, amount]) => ({
			category: categories.find((c) => c.id === id),
			amount
		})).filter((x) => x.category).sort((a, b) => b.amount - a.amount);
		return {
			list,
			max: list[0]?.amount ?? 1
		};
	}, [txs, categories]);
	const handleDeleteWallet = (id, name) => {
		if (confirm(`Bạn có chắc chắn muốn xóa ví "${name}" không?`)) del.mutate(id, {
			onSuccess: () => toast.success("Đã xóa ví thành công"),
			onError: (err) => toast.error(err.message)
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F3F4F1] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex items-center justify-between pb-3 border-b border-[#E3E2DC]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg sm:text-xl font-extrabold tracking-tight text-primary",
					children: "Tóm tắt tài chính"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-[#8A8D7A]",
					children: "Quản lý ví và phân tích chi tiêu"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing(null);
						setOpen(true);
					},
					className: "rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-white font-bold text-xs sm:text-sm px-4 py-2 h-auto shadow-sm transition-all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Thêm ví"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative rounded-[26px] bg-white border border-[#E7E5DC] shadow-sm pt-6 pb-5 px-6 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8A8D7A]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4 text-[#D8A13B]" }), "Tổng tài sản thực tế"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-['JetBrains_Mono'] text-3xl sm:text-4xl font-bold leading-none tabular-nums text-primary",
						children: formatVND(total)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFD7] rotate-6 text-[#B4832B]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-6 w-6" })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "lg:col-span-7 xl:col-span-7 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between px-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm sm:text-base font-extrabold text-primary flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4.5 w-4.5 text-primary" }),
								"Ví của bạn (",
								wallets.length,
								")"
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3",
						children: wallets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-full rounded-[22px] border border-dashed border-[#D8D6CC] bg-white p-8 text-center text-xs font-bold text-[#8A8D7A]",
							children: "Chưa có ví nào trong tài khoản — Bấm \"+ Thêm ví\" để bắt đầu"
						}) : wallets.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-[22px] bg-white border border-[#E7E5DC] p-4 shadow-sm hover:border-[#D8D6CC] transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm",
									style: { backgroundColor: w.color || "#109C7C" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										name: w.icon || "Wallet",
										className: "h-5.5 w-5.5"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs sm:text-sm font-extrabold text-primary",
										children: w.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-['JetBrains_Mono'] text-sm sm:text-base font-bold tabular-nums text-primary",
										children: formatVND(balances.get(w.id) ?? 0)
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 shrink-0 ml-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => {
										setEditing(w);
										setOpen(true);
									},
									className: "h-8 w-8 rounded-full text-[#8A8D7A] hover:text-primary hover:bg-[#F3F4F1]",
									"aria-label": "Sửa ví",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => handleDeleteWallet(w.id, w.name),
									className: "h-8 w-8 rounded-full text-[#8A8D7A] hover:text-[#EF5B45] hover:bg-[#FCE4E0]",
									"aria-label": "Xoá ví",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-[#EF5B45]" })
								})]
							})]
						}, w.id))
					})]
				}), byCategory.list.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "lg:col-span-5 xl:col-span-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between px-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm sm:text-base font-extrabold text-primary flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "h-4.5 w-4.5 text-[#EF5B45]" }), "Chi tiêu theo phân loại"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-[26px] border border-[#E7E5DC] bg-white p-5 shadow-sm space-y-4",
						children: byCategory.list.map(({ category, amount }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs sm:text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 font-bold text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-6 w-6 items-center justify-center rounded-lg",
										style: {
											backgroundColor: `${category.color}20`,
											color: category.color
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											name: category.icon,
											className: "h-3.5 w-3.5"
										})
									}), category.name]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-['JetBrains_Mono'] font-bold text-primary tabular-nums",
									children: formatVND(amount)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 w-full overflow-hidden rounded-full bg-[#F3F4F1]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full transition-all duration-500",
									style: {
										width: `${Math.max(4, amount / byCategory.max * 100)}%`,
										backgroundColor: category.color
									}
								})
							})]
						}, category.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletDialog, {
				open,
				onOpenChange: setOpen,
				editing
			})
		]
	});
}
function WalletDialog({ open, onOpenChange, editing }) {
	const save = useSaveWallet();
	const [name, setName] = (0, import_react.useState)("");
	const [icon, setIcon] = (0, import_react.useState)("Wallet");
	const [color, setColor] = (0, import_react.useState)(PALETTE[0]);
	const [initial, setInitial] = (0, import_react.useState)("0");
	const key = `${open}-${editing?.id ?? "new"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md rounded-[26px] bg-white p-6 font-['Be_Vietnam_Pro'] border-[#E7E5DC]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-base font-extrabold text-primary",
					children: editing ? "Sửa ví" : "Thêm ví mới"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletForm, {
					initialValues: editing,
					name,
					setName,
					icon,
					setIcon,
					color,
					setColor,
					initial,
					setInitial
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-white font-bold py-2.5 h-auto transition-all mt-2",
					onClick: async () => {
						if (!name.trim()) {
							toast.error("Nhập tên ví");
							return;
						}
						try {
							await save.mutateAsync({
								...editing?.id ? { id: editing.id } : {},
								name: name.trim(),
								icon,
								color,
								initial_balance: Number(initial) || 0
							});
							toast.success("Đã lưu ví");
							onOpenChange(false);
						} catch (e) {
							toast.error(e.message);
						}
					},
					children: "Lưu ví"
				})
			]
		}, key)
	});
}
function WalletForm(props) {
	const { initialValues } = props;
	const [ready, setReady] = (0, import_react.useState)(false);
	if (!ready) {
		props.setName(initialValues?.name ?? "");
		props.setIcon(initialValues?.icon ?? "Wallet");
		props.setColor(initialValues?.color ?? PALETTE[0]);
		props.setInitial(String(initialValues?.initial_balance ?? 0));
		setReady(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "w-name",
					className: "text-xs font-bold text-primary",
					children: "Tên ví"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "w-name",
					value: props.name,
					maxLength: 40,
					placeholder: "Tiền mặt, Momo, BIDV...",
					onChange: (e) => props.setName(e.target.value),
					className: "rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-primary font-medium text-xs sm:text-sm"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "w-init",
					className: "text-xs font-bold text-primary",
					children: "Số dư ban đầu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "w-init",
					type: "number",
					value: props.initial,
					onChange: (e) => props.setInitial(e.target.value),
					className: "rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-primary font-['JetBrains_Mono'] font-bold text-xs sm:text-sm"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconColorPicker, {
				icon: props.icon,
				color: props.color,
				setIcon: props.setIcon,
				setColor: props.setColor
			})
		]
	});
}
function IconColorPicker({ icon, color, setIcon, setColor }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs font-bold text-primary",
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
			className: "text-xs font-bold text-primary",
			children: "Biểu tượng"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid max-h-32 grid-cols-8 gap-1.5 overflow-y-auto p-1 bg-[#F3F4F1] rounded-xl border border-[#EDECE6]",
			children: ICON_NAMES.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setIcon(n),
				className: cn("flex h-9 items-center justify-center rounded-lg border transition-all active:scale-90", icon === n ? "border-[#16181D] bg-white text-primary shadow-sm" : "border-transparent text-[#8A8D7A] hover:bg-white/50"),
				"aria-label": n,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					name: n,
					className: "h-4 w-4"
				})
			}, n))
		})]
	})] });
}
//#endregion
export { IconColorPicker, SummaryPage as component };
