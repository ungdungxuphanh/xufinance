import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-cESliV4m.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { O as KeyRound, U as Check, h as ShieldAlert, i as User, w as LogOut } from "../_libs/lucide-react.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as Label, S as Button, p as useSaveProfile, u as useProfile } from "./router-Gk55i8hA.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-Cj2_v4Xs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: profile } = useProfile();
	const saveProfile = useSaveProfile();
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (profile) {
			setDisplayName(profile.display_name || "");
			setUsername(profile.username || "");
		}
	}, [profile]);
	async function handleSignOut() {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	async function changePassword(e) {
		e.preventDefault();
		if (password.length < 6) {
			toast.error("Mật khẩu tối thiểu 6 kí tự");
			return;
		}
		if (password !== confirm) {
			toast.error("Mật khẩu nhập lại không khớp");
			return;
		}
		const { error } = await supabase.auth.updateUser({ password });
		if (error) {
			toast.error(error.message);
			return;
		}
		setPassword("");
		setConfirm("");
		toast.success("Đã đổi mật khẩu thành công");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F3F4F1] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex items-center justify-between pb-3 border-b border-[#E3E2DC]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg sm:text-xl font-extrabold tracking-tight text-primary",
					children: "Cài đặt tài khoản"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-[#8A8D7A]",
					children: "Quản lý thông tin cá nhân và bảo mật"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-[26px] bg-white border border-[#E7E5DC] p-5 sm:p-6 shadow-sm space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 pb-3 border-b border-[#F3F4F1]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EAE8E0] text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-extrabold text-primary",
							children: "Hồ sơ cá nhân"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-[#8A8D7A] font-['JetBrains_Mono'] truncate max-w-[200px] sm:max-w-xs",
							children: profile?.email || "Đang tải..."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "dn",
									className: "text-xs font-bold text-primary",
									children: "Tên hiển thị"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "dn",
									value: displayName,
									maxLength: 60,
									placeholder: "Nhập tên người dùng",
									onChange: (e) => setDisplayName(e.target.value),
									className: "rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-primary text-xs sm:text-sm font-medium h-10"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "un",
									className: "text-xs font-bold text-primary",
									children: "Tên đăng nhập (Username)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "un",
									value: username,
									maxLength: 30,
									placeholder: "vd: phuneng",
									onChange: (e) => setUsername(e.target.value),
									className: "rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-primary font-['JetBrains_Mono'] text-xs sm:text-sm font-medium h-10"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: async () => {
									await saveProfile.mutateAsync({
										display_name: displayName.trim(),
										username: username.trim()
									});
									toast.success("Đã lưu thông tin cá nhân");
								},
								className: "w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-white font-bold text-xs sm:text-sm py-2.5 h-auto transition-all gap-1.5 shadow-sm mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Lưu thay đổi"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-[26px] bg-white border border-[#E7E5DC] p-5 sm:p-6 shadow-sm space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 pb-3 border-b border-[#F3F4F1]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFD7] text-[#B4832B]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-extrabold text-primary",
								children: "Bảo mật & Mật khẩu"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-[#8A8D7A]",
								children: "Cập nhật mật khẩu đăng nhập tài khoản"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: changePassword,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pw",
										className: "text-xs font-bold text-primary",
										children: "Mật khẩu mới"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pw",
										type: "password",
										placeholder: "Tối thiểu 6 ký tự",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-primary text-xs sm:text-sm font-medium h-10"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pw2",
										className: "text-xs font-bold text-primary",
										children: "Xác nhận mật khẩu mới"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pw2",
										type: "password",
										placeholder: "Nhập lại mật khẩu vừa gõ",
										value: confirm,
										onChange: (e) => setConfirm(e.target.value),
										className: "rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-primary text-xs sm:text-sm font-medium h-10"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full rounded-full bg-[#EAE8E0] hover:bg-[#E3E2DC] text-primary font-bold text-xs sm:text-sm py-2.5 h-auto transition-all mt-2",
									children: "Cập nhật mật khẩu"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 rounded-2xl bg-[#F9F9F8] border border-[#EDECE6] p-3 text-[11px] font-medium text-[#8A8D7A]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-[#D8A13B] shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nếu bạn đăng nhập bằng Google, đặt mật khẩu tại đây sẽ giúp bạn đăng nhập bổ sung qua Email + Mật khẩu." })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleSignOut,
					variant: "outline",
					className: "w-full rounded-full border-[#FCE4E0] bg-white hover:bg-[#FCE4E0]/50 text-[#EF5B45] font-bold text-xs sm:text-sm py-3 h-auto shadow-sm transition-all justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), " Đăng xuất khỏi tài khoản"]
				})
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
