import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { Q as ArrowUpRight, S as Pencil, c as Trash2, nt as ArrowDownLeft, t as X, y as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as Label, S as Button, T as PALETTE, a as useDeleteCategory, d as useSaveCategory, f as useSaveNote, i as useCategories, l as useNotes, n as IconColorPicker, o as useDeleteNote, w as Icon } from "./router-Gk55i8hA.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-B69u1cPq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories-D42QY31K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoriesPage() {
	const { data: categories = [] } = useCategories();
	const { data: notes = [] } = useNotes();
	const del = useDeleteCategory();
	const delNote = useDeleteNote();
	const saveNote = useSaveNote();
	const [tab, setTab] = (0, import_react.useState)("expense");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [noteDrafts, setNoteDrafts] = (0, import_react.useState)({});
	const list = categories.filter((c) => c.type === tab);
	const handleDeleteCategory = (id, name) => {
		if (confirm(`Bạn có chắc chắn muốn xóa phân loại "${name}" không?`)) del.mutate(id, {
			onSuccess: () => toast.success("Đã xóa phân loại"),
			onError: (err) => toast.error(err.message)
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F3F4F1] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex items-center justify-between pb-3 border-b border-[#E3E2DC]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg sm:text-xl font-extrabold tracking-tight text-[#16181D]",
					children: "Phân loại thu chi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-[#8A8D7A]",
					children: "Quản lý danh mục và thẻ ghi chú chi tiết"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing(null);
						setOpen(true);
					},
					className: "rounded-full bg-[#16181D] hover:bg-[#2A2E37] text-white font-bold text-xs sm:text-sm px-4 py-2 h-auto shadow-sm transition-all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Thêm danh mục"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex justify-center sm:justify-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full sm:w-auto p-1 bg-[#EAE8E0] rounded-full border border-[#E3E2DC]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setTab("expense"),
						className: cn("flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all", tab === "expense" ? "bg-[#16181D] text-white shadow-sm" : "text-[#8A8D7A] hover:text-[#16181D]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: cn("h-4 w-4", tab === "expense" ? "text-[#EF5B45]" : "") }), "Khoản chi tiêu"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setTab("income"),
						className: cn("flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all", tab === "income" ? "bg-[#16181D] text-white shadow-sm" : "text-[#8A8D7A] hover:text-[#16181D]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: cn("h-4 w-4", tab === "income" ? "text-[#109C7C]" : "") }), "Khoản thu nhập"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start",
				children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-span-full rounded-[26px] border border-dashed border-[#D8D6CC] bg-white p-8 text-center text-xs sm:text-sm font-bold text-[#8A8D7A]",
					children: "Chưa có phân loại nào cho mục này — Bấm \"+ Thêm danh mục\" để tạo nhé"
				}) : list.map((c) => {
					const catNotes = notes.filter((n) => n.category_id === c.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[22px] bg-white border border-[#E7E5DC] p-4 shadow-sm hover:border-[#D8D6CC] transition-all space-y-3.5 flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm",
									style: { backgroundColor: c.color || "#109C7C" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										name: c.icon || "Tag",
										className: "h-5.5 w-5.5"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm sm:text-base font-extrabold text-[#16181D]",
									children: c.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-0.5 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => {
										setEditing(c);
										setOpen(true);
									},
									className: "h-8 w-8 rounded-full text-[#8A8D7A] hover:text-[#16181D] hover:bg-[#F3F4F1]",
									"aria-label": "Sửa",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => handleDeleteCategory(c.id, c.name),
									className: "h-8 w-8 rounded-full text-[#8A8D7A] hover:text-[#EF5B45] hover:bg-[#FCE4E0]",
									"aria-label": "Xoá",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-[#EF5B45]" })
								})]
							})]
						}), catNotes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-[#F3F4F1]",
							children: catNotes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F1] border border-[#E7E5DC] px-2.5 py-1 text-xs font-semibold text-[#16181D] group transition-all",
								children: [n.text, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => delNote.mutate(n.id),
									className: "text-[#8A8D7A] hover:text-[#EF5B45] transition-colors",
									"aria-label": "Xoá ghi chú",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								})]
							}, n.id))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex items-center gap-2 pt-2",
							onSubmit: async (e) => {
								e.preventDefault();
								const text = (noteDrafts[c.id] ?? "").trim();
								if (!text) return;
								await saveNote.mutateAsync({
									category_id: c.id,
									text
								});
								setNoteDrafts((d) => ({
									...d,
									[c.id]: ""
								}));
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: noteDrafts[c.id] ?? "",
								maxLength: 100,
								placeholder: `Thêm thẻ ví dụ: Cơm trưa...`,
								onChange: (e) => setNoteDrafts((d) => ({
									...d,
									[c.id]: e.target.value
								})),
								className: "rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-[#16181D] text-xs font-medium h-9"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "icon",
								className: "h-9 w-9 shrink-0 rounded-xl bg-[#16181D] hover:bg-[#2A2E37] text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
							})]
						})]
					}, c.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryDialog, {
				open,
				onOpenChange: setOpen,
				editing,
				defaultType: tab
			})
		]
	});
}
function CategoryDialog({ open, onOpenChange, editing, defaultType }) {
	const save = useSaveCategory();
	const [name, setName] = (0, import_react.useState)("");
	const [icon, setIcon] = (0, import_react.useState)("Tag");
	const [color, setColor] = (0, import_react.useState)(PALETTE[0]);
	const [type, setType] = (0, import_react.useState)(defaultType);
	const [ready, setReady] = (0, import_react.useState)(false);
	if (open && !ready) {
		setName(editing?.name ?? "");
		setIcon(editing?.icon ?? "Tag");
		setColor(editing?.color ?? PALETTE[0]);
		setType(editing?.type ?? defaultType);
		setReady(true);
	}
	if (!open && ready) setReady(false);
	const key = `${open}-${editing?.id ?? "new"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md rounded-[26px] bg-white p-6 font-['Be_Vietnam_Pro'] border-[#E7E5DC]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-base font-extrabold text-[#16181D]",
					children: editing ? "Sửa phân loại" : "Tạo phân loại mới"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex rounded-full bg-[#F3F4F1] p-1 border border-[#EDECE6]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setType("expense"),
								className: cn("flex-1 py-1.5 rounded-full text-xs font-bold transition-all", type === "expense" ? "bg-[#16181D] text-white shadow-sm" : "text-[#8A8D7A]"),
								children: "Chi tiêu"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setType("income"),
								className: cn("flex-1 py-1.5 rounded-full text-xs font-bold transition-all", type === "income" ? "bg-[#16181D] text-white shadow-sm" : "text-[#8A8D7A]"),
								children: "Thu nhập"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "c-name",
								className: "text-xs font-bold text-[#16181D]",
								children: "Tên phân loại"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "c-name",
								value: name,
								maxLength: 40,
								placeholder: "Ăn uống, Lương hàng tháng, Giải trí...",
								onChange: (e) => setName(e.target.value),
								className: "rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-[#16181D] font-medium text-xs sm:text-sm"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconColorPicker, {
							icon,
							color,
							setIcon,
							setColor
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full rounded-full bg-[#16181D] hover:bg-[#2A2E37] text-white font-bold py-2.5 h-auto transition-all mt-2",
					onClick: async () => {
						if (!name.trim()) {
							toast.error("Vui lòng nhập tên phân loại");
							return;
						}
						try {
							await save.mutateAsync({
								...editing?.id ? { id: editing.id } : {},
								name: name.trim(),
								type,
								icon,
								color
							});
							toast.success("Đã lưu phân loại");
							onOpenChange(false);
						} catch (e) {
							toast.error(e.message);
						}
					},
					children: "Lưu phân loại"
				})
			]
		}, key)
	});
}
//#endregion
export { CategoriesPage as component };
