import { i as previewMatchScenarios, r as getRankTier, t as RANK_TIERS } from "./elo-bNM48V2Z.js";
import { a as createPlayerFn, c as recordMatchFn, d as Button, f as cn, i as changePasscodeFn, l as resetLeaderboardFn, n as Route, o as deleteMatchFn, r as useAdmin, s as deletePlayerFn, u as updatePlayerFn } from "./router-BONGaSre.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, AlertTriangle, ArrowUpDown, Award, Calculator, Calendar, CheckCircle2, CircleDot, Crown, Edit2, Eye, FileText, Flame, History, Key, KeyRound, Lock, LogOut, Medal, RotateCcw, Search, Shield, ShieldCheck, SlidersHorizontal, Sparkles, Star, Swords, Trash2, TrendingDown, TrendingUp, Trophy, UserPlus, UserX, Users, XIcon, Zap } from "lucide-react";
import { toast } from "sonner";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LabelPrimitive from "@radix-ui/react-label";
//#region src/components/ui/dialog.tsx
function Dialog({ ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Root, {
		"data-slot": "dialog",
		...props
	});
}
function DialogPortal({ ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Portal, {
		"data-slot": "dialog-portal",
		...props
	});
}
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
		"data-slot": "dialog-overlay",
		className: cn("fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, showCloseButton = true, ...props }) {
	return /* @__PURE__ */ jsxs(DialogPortal, {
		"data-slot": "dialog-portal",
		children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
			"data-slot": "dialog-content",
			className: cn("fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg", className),
			...props,
			children: [children, showCloseButton && /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
				"data-slot": "dialog-close",
				className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				children: [/* @__PURE__ */ jsx(XIcon, {}), /* @__PURE__ */ jsx("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		})]
	});
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "dialog-header",
		className: cn("flex flex-col gap-2 text-center sm:text-left", className),
		...props
	});
}
function DialogFooter({ className, showCloseButton = false, children, ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "dialog-footer",
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ jsx(DialogPrimitive.Close, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				children: "Close"
			})
		})]
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Title, {
		"data-slot": "dialog-title",
		className: cn("text-lg leading-none font-semibold", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Description, {
		"data-slot": "dialog-description",
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
//#endregion
//#region src/components/ui/input.tsx
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ jsx("input", {
		type,
		"data-slot": "input",
		className: cn("h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30", "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40", className),
		...props
	});
}
//#endregion
//#region src/components/ui/label.tsx
function Label({ className, ...props }) {
	return /* @__PURE__ */ jsx(LabelPrimitive.Root, {
		"data-slot": "label",
		className: cn("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
//#endregion
//#region src/components/AdminLoginDialog.tsx
function AdminLoginDialog({ open, onOpenChange }) {
	const { login, isVerifying } = useAdmin();
	const [passcode, setPasscode] = useState("");
	const [error, setError] = useState("");
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!passcode.trim()) {
			setError("Please enter the admin passcode");
			return;
		}
		if (await login(passcode)) {
			setPasscode("");
			onOpenChange(false);
		} else setError("Invalid passcode. Default passcode is \"spinmaster\"");
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-md border-border bg-card",
			children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [
				/* @__PURE__ */ jsx("div", {
					className: "mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2",
					children: /* @__PURE__ */ jsx(Lock, { className: "w-6 h-6 text-emerald-400" })
				}),
				/* @__PURE__ */ jsx(DialogTitle, {
					className: "text-xl text-center",
					children: "Admin Access"
				}),
				/* @__PURE__ */ jsx(DialogDescription, {
					className: "text-center text-sm text-muted-foreground",
					children: "Enter the admin passcode to record match results, add new players, or manage leaderboard settings."
				})
			] }), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 pt-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "admin-passcode",
								className: "text-sm font-medium",
								children: "Admin Passcode"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(KeyRound, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
									id: "admin-passcode",
									type: "password",
									placeholder: "Enter passcode...",
									value: passcode,
									onChange: (e) => {
										setPasscode(e.target.value);
										setError("");
									},
									className: "pl-9 bg-background/50 border-input",
									autoFocus: true
								})]
							}),
							error && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-rose-400 font-medium",
								children: error
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground space-y-1",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 font-medium text-foreground",
								children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "Leaderboard Security" })]
							}),
							/* @__PURE__ */ jsx("p", { children: "Visitors can freely view ranks and simulate matches. Only authenticated admins can modify leaderboard data." }),
							/* @__PURE__ */ jsxs("p", {
								className: "pt-1 text-emerald-400 font-mono text-[11px]",
								children: [
									"Default passcode:",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold underline",
										children: "spinmaster"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, {
						className: "pt-2 sm:justify-between",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: isVerifying,
							className: "bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm",
							children: isVerifying ? "Verifying..." : "Unlock Admin Controls"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/AdminSettingsDialog.tsx
function AdminSettingsDialog({ open, onOpenChange, onLeaderboardUpdated }) {
	const { adminPasscode } = useAdmin();
	const [newPasscode, setNewPasscode] = useState("");
	const [confirmPasscode, setConfirmPasscode] = useState("");
	const [isChangingPass, setIsChangingPass] = useState(false);
	const [isResetting, setIsResetting] = useState(false);
	const [showResetConfirm, setShowResetConfirm] = useState(false);
	const handleChangePassword = async (e) => {
		e.preventDefault();
		if (newPasscode.length < 4) {
			toast.error("Passcode must be at least 4 characters long");
			return;
		}
		if (newPasscode !== confirmPasscode) {
			toast.error("New passcodes do not match");
			return;
		}
		setIsChangingPass(true);
		try {
			await changePasscodeFn({ data: {
				currentPasscode: adminPasscode,
				newPasscode
			} });
			toast.success("Admin passcode updated successfully!");
			setNewPasscode("");
			setConfirmPasscode("");
			onOpenChange(false);
		} catch (err) {
			toast.error("Error changing passcode", { description: err?.message || "Failed to update passcode" });
		} finally {
			setIsChangingPass(false);
		}
	};
	const handleResetData = async () => {
		setIsResetting(true);
		try {
			await resetLeaderboardFn({ data: { adminPasscode } });
			toast.success("Leaderboard reset to initial seed state");
			setShowResetConfirm(false);
			onOpenChange(false);
			onLeaderboardUpdated();
		} catch (err) {
			toast.error("Reset failed", { description: err?.message || "Could not reset leaderboard" });
		} finally {
			setIsResetting(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-md border-border bg-card",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [
					/* @__PURE__ */ jsx("div", {
						className: "mx-auto w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-1",
						children: /* @__PURE__ */ jsx(SlidersHorizontal, { className: "w-5 h-5 text-primary" })
					}),
					/* @__PURE__ */ jsx(DialogTitle, {
						className: "text-xl text-center",
						children: "Admin Settings"
					}),
					/* @__PURE__ */ jsx(DialogDescription, {
						className: "text-center text-sm text-muted-foreground",
						children: "Configure administrative security and leaderboard maintenance."
					})
				] }),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-6 pt-2",
					children: [/* @__PURE__ */ jsxs("form", {
						onSubmit: handleChangePassword,
						className: "space-y-3 border-b border-border pb-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 text-sm font-semibold text-foreground",
								children: [/* @__PURE__ */ jsx(Key, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "Change Admin Passcode" })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "new-passcode",
									className: "text-xs",
									children: "New Passcode"
								}), /* @__PURE__ */ jsx(Input, {
									id: "new-passcode",
									type: "password",
									placeholder: "Enter at least 4 characters",
									value: newPasscode,
									onChange: (e) => setNewPasscode(e.target.value),
									className: "bg-background/50 border-input"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "confirm-passcode",
									className: "text-xs",
									children: "Confirm New Passcode"
								}), /* @__PURE__ */ jsx(Input, {
									id: "confirm-passcode",
									type: "password",
									placeholder: "Re-enter new passcode",
									value: confirmPasscode,
									onChange: (e) => setConfirmPasscode(e.target.value),
									className: "bg-background/50 border-input"
								})]
							}),
							/* @__PURE__ */ jsx(Button, {
								type: "submit",
								disabled: isChangingPass || !newPasscode,
								variant: "secondary",
								className: "w-full text-xs",
								children: isChangingPass ? "Updating..." : "Update Passcode"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 text-sm font-semibold text-foreground",
								children: [/* @__PURE__ */ jsx(RotateCcw, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ jsx("span", { children: "Reset Leaderboard Data" })]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "Clears current match history and resets players to standard starting ratings with sample players."
							}),
							!showResetConfirm ? /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowResetConfirm(true),
								className: "w-full text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10",
								children: "Reset to Default Seeds..."
							}) : /* @__PURE__ */ jsxs("div", {
								className: "p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 space-y-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-rose-400 shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-rose-300 font-medium",
										children: "Are you sure? This will wipe recent match history and restore seed players."
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 justify-end",
									children: [/* @__PURE__ */ jsx(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										onClick: () => setShowResetConfirm(false),
										className: "text-xs",
										children: "Cancel"
									}), /* @__PURE__ */ jsx(Button, {
										type: "button",
										size: "sm",
										disabled: isResetting,
										onClick: handleResetData,
										className: "bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold",
										children: isResetting ? "Resetting..." : "Yes, Reset Now"
									})]
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsx(DialogFooter, {
					className: "pt-2",
					children: /* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Close"
					})
				})
			]
		})
	});
}
//#endregion
//#region src/components/RankBadge.tsx
function RankBadge({ tier: propTier, elo, size = "md", showIcon = true, showDivision = true }) {
	const tier = propTier || (elo !== void 0 ? getRankTier(elo) : getRankTier(1200));
	const renderIcon = () => {
		const iconProps = {
			className: size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5",
			style: { color: tier.textColor }
		};
		switch (tier.icon) {
			case "crown": return /* @__PURE__ */ jsx(Crown, { ...iconProps });
			case "trophy": return /* @__PURE__ */ jsx(Trophy, { ...iconProps });
			case "flame": return /* @__PURE__ */ jsx(Flame, { ...iconProps });
			case "sparkles": return /* @__PURE__ */ jsx(Sparkles, { ...iconProps });
			case "zap": return /* @__PURE__ */ jsx(Zap, { ...iconProps });
			case "star": return /* @__PURE__ */ jsx(Star, { ...iconProps });
			default: return /* @__PURE__ */ jsx(Shield, { ...iconProps });
		}
	};
	return /* @__PURE__ */ jsxs("span", {
		className: `inline-flex items-center rounded-full border shadow-sm transition-all duration-200 select-none ${{
			sm: "text-xs px-2 py-0.5 gap-1",
			md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
			lg: "text-sm px-3.5 py-1.5 gap-2 font-semibold"
		}[size]}`,
		style: {
			backgroundColor: tier.bgColor,
			borderColor: tier.borderColor,
			color: tier.textColor
		},
		children: [showIcon && renderIcon(), /* @__PURE__ */ jsx("span", { children: showDivision ? tier.label : tier.name })]
	});
}
//#endregion
//#region src/components/AddPlayerDialog.tsx
function AddPlayerDialog({ open, onOpenChange, onPlayerAdded }) {
	const { adminPasscode } = useAdmin();
	const [name, setName] = useState("");
	const [startingElo, setStartingElo] = useState(1200);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const tier = getRankTier(startingElo);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		const cleanName = name.trim();
		if (!cleanName) {
			setError("Please provide a player name");
			return;
		}
		if (cleanName.length < 2) {
			setError("Player name must be at least 2 characters");
			return;
		}
		setIsSubmitting(true);
		try {
			await createPlayerFn({ data: {
				name: cleanName,
				startingElo,
				adminPasscode
			} });
			toast.success("Player added successfully!", { description: `${cleanName} joined the leaderboard at ${startingElo} Elo (${tier.label}).` });
			setName("");
			setStartingElo(1200);
			onOpenChange(false);
			onPlayerAdded();
		} catch (err) {
			const msg = err?.message || "Failed to add player";
			setError(msg);
			toast.error("Could not add player", { description: msg });
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-md border-border bg-card",
			children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [
				/* @__PURE__ */ jsx("div", {
					className: "mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-1",
					children: /* @__PURE__ */ jsx(UserPlus, { className: "w-6 h-6 text-emerald-400" })
				}),
				/* @__PURE__ */ jsx(DialogTitle, {
					className: "text-xl text-center",
					children: "Register New Player"
				}),
				/* @__PURE__ */ jsx(DialogDescription, {
					className: "text-center text-sm text-muted-foreground",
					children: "Add a table tennis competitor to the official leaderboard ladder."
				})
			] }), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 pt-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsxs(Label, {
							htmlFor: "player-name",
							className: "text-sm font-medium",
							children: [
								"Player Full Name / Tag",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-rose-400",
									"aria-hidden": "true",
									children: "*"
								})
							]
						}), /* @__PURE__ */ jsx(Input, {
							id: "player-name",
							type: "text",
							placeholder: "e.g. Jordan Smith or 'The Spin Doctor'",
							value: name,
							onChange: (e) => {
								setName(e.target.value);
								setError("");
							},
							className: "bg-background/50 border-input",
							autoFocus: true,
							required: true
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "starting-elo",
									className: "text-sm font-medium",
									children: "Initial Elo Rating"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs text-muted-foreground",
										children: "Placement Tier:"
									}), /* @__PURE__ */ jsx(RankBadge, {
										elo: startingElo,
										size: "sm"
									})]
								})]
							}),
							/* @__PURE__ */ jsx(Input, {
								id: "starting-elo",
								type: "number",
								min: 100,
								max: 3e3,
								step: 25,
								value: startingElo,
								onChange: (e) => setStartingElo(Number(e.target.value) || 1200),
								className: "bg-background/50 border-input font-mono"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "Standard default is 1,200 Elo (Gold I baseline). Elo adjusts rapidly during the first 10 placement matches."
							})
						]
					}),
					error && /* @__PURE__ */ jsx("p", {
						className: "text-xs text-rose-400 font-medium p-2 rounded bg-rose-500/10 border border-rose-500/20",
						children: error
					}),
					/* @__PURE__ */ jsxs(DialogFooter, {
						className: "pt-2 sm:justify-between",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: isSubmitting || !name.trim(),
							className: "bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm",
							children: isSubmitting ? "Registering..." : "Add to Leaderboard"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/RecordMatchDialog.tsx
function RecordMatchDialog({ open, onOpenChange, players, onMatchRecorded, preselectedPlayerId }) {
	const { adminPasscode } = useAdmin();
	const [player1Id, setPlayer1Id] = useState(preselectedPlayerId || (players[0]?.id ?? ""));
	const [player2Id, setPlayer2Id] = useState(players.find((p) => p.id !== (preselectedPlayerId || players[0]?.id))?.id ?? "");
	const [winnerId, setWinnerId] = useState("");
	const [score, setScore] = useState("3-1");
	const [notes, setNotes] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const p1 = useMemo(() => players.find((p) => p.id === Number(player1Id)), [players, player1Id]);
	const p2 = useMemo(() => players.find((p) => p.id === Number(player2Id)), [players, player2Id]);
	const scenarios = useMemo(() => {
		if (!p1 || !p2 || p1.id === p2.id) return null;
		return previewMatchScenarios(p1.elo, p2.elo, p1.matchesPlayed, p2.matchesPlayed);
	}, [p1, p2]);
	const quickScores = [
		"3-0",
		"3-1",
		"3-2",
		"2-0",
		"2-1",
		"11-9, 11-8"
	];
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!player1Id || !player2Id) {
			setError("Please select both Player 1 and Player 2");
			return;
		}
		if (player1Id === player2Id) {
			setError("A player cannot play against themselves");
			return;
		}
		if (!winnerId) {
			setError("Please select which player won the match");
			return;
		}
		setIsSubmitting(true);
		try {
			const res = await recordMatchFn({ data: {
				player1Id: Number(player1Id),
				player2Id: Number(player2Id),
				winnerId: Number(winnerId),
				score: score.trim(),
				notes: notes.trim(),
				adminPasscode
			} });
			const winnerName = winnerId === p1?.id ? p1?.name : p2?.name;
			const loserName = winnerId === p1?.id ? p2?.name : p1?.name;
			const delta = res.match?.eloDelta || 16;
			toast.success("Match Recorded!", { description: `${winnerName} won against ${loserName} (+${delta} Elo swing)` });
			onOpenChange(false);
			setWinnerId("");
			setNotes("");
			onMatchRecorded();
		} catch (err) {
			const msg = err?.message || "Failed to record match";
			setError(msg);
			toast.error("Match submission failed", { description: msg });
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-xl border-border bg-card max-h-[90vh] overflow-y-auto",
			children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [
				/* @__PURE__ */ jsx("div", {
					className: "mx-auto w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-1",
					children: /* @__PURE__ */ jsx(Swords, { className: "w-6 h-6 text-primary" })
				}),
				/* @__PURE__ */ jsx(DialogTitle, {
					className: "text-xl text-center",
					children: "Record Table Tennis Match"
				}),
				/* @__PURE__ */ jsx(DialogDescription, {
					className: "text-center text-sm text-muted-foreground",
					children: "Select the two competitors, choose the victor, and calculate official Elo rank adjustments."
				})
			] }), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-5 pt-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-2 p-3.5 rounded-xl bg-background/50 border border-border",
							children: [
								/* @__PURE__ */ jsx(Label, {
									htmlFor: "player1-select",
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Player 1"
								}),
								/* @__PURE__ */ jsxs("select", {
									id: "player1-select",
									value: player1Id,
									onChange: (e) => {
										setPlayer1Id(Number(e.target.value));
										setWinnerId("");
									},
									className: "w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										disabled: true,
										children: "Select player..."
									}), players.map((p) => /* @__PURE__ */ jsxs("option", {
										value: p.id,
										disabled: p.id === Number(player2Id),
										children: [
											p.name,
											" (",
											p.elo,
											" Elo)"
										]
									}, p.id))]
								}),
								p1 && /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between pt-2",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-xs text-muted-foreground font-mono",
										children: [p1.elo, " ELO"]
									}), /* @__PURE__ */ jsx(RankBadge, {
										elo: p1.elo,
										size: "sm"
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-2 p-3.5 rounded-xl bg-background/50 border border-border",
							children: [
								/* @__PURE__ */ jsx(Label, {
									htmlFor: "player2-select",
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Player 2"
								}),
								/* @__PURE__ */ jsxs("select", {
									id: "player2-select",
									value: player2Id,
									onChange: (e) => {
										setPlayer2Id(Number(e.target.value));
										setWinnerId("");
									},
									className: "w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										disabled: true,
										children: "Select opponent..."
									}), players.map((p) => /* @__PURE__ */ jsxs("option", {
										value: p.id,
										disabled: p.id === Number(player1Id),
										children: [
											p.name,
											" (",
											p.elo,
											" Elo)"
										]
									}, p.id))]
								}),
								p2 && /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between pt-2",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-xs text-muted-foreground font-mono",
										children: [p2.elo, " ELO"]
									}), /* @__PURE__ */ jsx(RankBadge, {
										elo: p2.elo,
										size: "sm"
									})]
								})
							]
						})]
					}),
					p1 && p2 && scenarios && /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "font-semibold text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 text-amber-400" }), "Expected Win Probabilities"]
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-muted-foreground font-mono text-[11px]",
									children: [
										p1.name.split(" ")[0],
										": ",
										scenarios.p1ExpectedWinRate,
										"% vs",
										" ",
										p2.name.split(" ")[0],
										": ",
										scenarios.p2ExpectedWinRate,
										"%"
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								"aria-hidden": "true",
								className: "w-full h-2 rounded-full bg-secondary overflow-hidden flex",
								children: [/* @__PURE__ */ jsx("div", {
									className: "bg-emerald-500 h-full transition-all duration-300",
									style: { width: `${scenarios.p1ExpectedWinRate}%` }
								}), /* @__PURE__ */ jsx("div", {
									className: "bg-blue-500 h-full transition-all duration-300",
									style: { width: `${scenarios.p2ExpectedWinRate}%` }
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-2 pt-1 text-xs",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "p-2.5 rounded-lg bg-background/80 border border-border/50",
									children: [
										/* @__PURE__ */ jsxs("p", {
											className: "text-[11px] text-muted-foreground mb-1 font-medium",
											children: [
												"If",
												" ",
												/* @__PURE__ */ jsx("span", {
													className: "text-foreground font-semibold",
													children: p1.name
												}),
												" ",
												"wins:"
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between font-mono",
											children: [/* @__PURE__ */ jsxs("span", {
												className: "text-emerald-400 font-bold",
												children: ["+", scenarios.ifP1Wins.p1Delta]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-rose-400 font-bold",
												children: scenarios.ifP1Wins.p2Delta
											})]
										}),
										scenarios.ifP1Wins.p1Delta >= 22 && /* @__PURE__ */ jsx("span", {
											className: "inline-block mt-1 text-[10px] text-amber-400 font-semibold",
											children: "⚡ Upset Bonus!"
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "p-2.5 rounded-lg bg-background/80 border border-border/50",
									children: [
										/* @__PURE__ */ jsxs("p", {
											className: "text-[11px] text-muted-foreground mb-1 font-medium",
											children: [
												"If",
												" ",
												/* @__PURE__ */ jsx("span", {
													className: "text-foreground font-semibold",
													children: p2.name
												}),
												" ",
												"wins:"
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between font-mono",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-rose-400 font-bold",
												children: scenarios.ifP2Wins.p1Delta
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-emerald-400 font-bold",
												children: ["+", scenarios.ifP2Wins.p2Delta]
											})]
										}),
										scenarios.ifP2Wins.p2Delta >= 22 && /* @__PURE__ */ jsx("span", {
											className: "inline-block mt-1 text-[10px] text-amber-400 font-semibold",
											children: "⚡ Upset Bonus!"
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsxs("span", {
							id: "winner-label",
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [
								"Select Winner",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-rose-400",
									"aria-hidden": "true",
									children: "*"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "sr-only",
									children: "(required)"
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							role: "group",
							"aria-labelledby": "winner-label",
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								disabled: !p1,
								"aria-pressed": !!p1 && winnerId === p1.id,
								onClick: () => setWinnerId(p1?.id || ""),
								className: `p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${winnerId === p1?.id ? "border-emerald-500 bg-emerald-500/15 shadow-sm ring-2 ring-emerald-500/40 text-foreground" : "border-border bg-background/40 hover:bg-background/80 text-muted-foreground hover:text-foreground"}`,
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 pr-2",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 font-semibold text-sm truncate",
										children: [winnerId === p1?.id && /* @__PURE__ */ jsx(Trophy, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ jsx("span", {
											className: "truncate",
											children: p1 ? p1.name : "Player 1"
										})]
									}), p1 && /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: [
											"New Elo:",
											" ",
											scenarios ? scenarios.ifP1Wins.p1NewElo : p1.elo
										]
									})]
								}), winnerId === p1?.id && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-400 shrink-0" })]
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								disabled: !p2,
								"aria-pressed": !!p2 && winnerId === p2.id,
								onClick: () => setWinnerId(p2?.id || ""),
								className: `p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${winnerId === p2?.id ? "border-emerald-500 bg-emerald-500/15 shadow-sm ring-2 ring-emerald-500/40 text-foreground" : "border-border bg-background/40 hover:bg-background/80 text-muted-foreground hover:text-foreground"}`,
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 pr-2",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 font-semibold text-sm truncate",
										children: [winnerId === p2?.id && /* @__PURE__ */ jsx(Trophy, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ jsx("span", {
											className: "truncate",
											children: p2 ? p2.name : "Player 2"
										})]
									}), p2 && /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: [
											"New Elo:",
											" ",
											scenarios ? scenarios.ifP2Wins.p2NewElo : p2.elo
										]
									})]
								}), winnerId === p2?.id && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-400 shrink-0" })]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ jsx(Label, {
									htmlFor: "match-score",
									className: "text-xs font-semibold text-muted-foreground",
									children: "Match Score (Games/Sets)"
								}),
								/* @__PURE__ */ jsx(Input, {
									id: "match-score",
									type: "text",
									value: score,
									onChange: (e) => setScore(e.target.value),
									placeholder: "e.g. 3-1 or 11-9, 11-8",
									className: "bg-background/50 border-input font-mono text-sm"
								}),
								/* @__PURE__ */ jsx("div", {
									role: "group",
									"aria-label": "Quick score presets",
									className: "flex flex-wrap gap-1.5 pt-1",
									children: quickScores.map((qs) => /* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-pressed": score === qs,
										"aria-label": `Set score to ${qs}`,
										onClick: () => setScore(qs),
										className: `text-[10px] px-2 py-0.5 rounded border transition-colors ${score === qs ? "bg-primary text-primary-foreground border-primary" : "bg-background/40 border-border text-muted-foreground hover:text-foreground"}`,
										children: qs
									}, qs))
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "match-notes",
								className: "text-xs font-semibold text-muted-foreground",
								children: "Match Notes (Optional)"
							}), /* @__PURE__ */ jsx(Input, {
								id: "match-notes",
								type: "text",
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								placeholder: "e.g. Tournament semi-final, overtime rally",
								className: "bg-background/50 border-input text-sm"
							})]
						})]
					}),
					error && /* @__PURE__ */ jsx("p", {
						className: "text-xs text-rose-400 font-medium p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20",
						children: error
					}),
					/* @__PURE__ */ jsxs(DialogFooter, {
						className: "pt-2 sm:justify-between",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: isSubmitting || !player1Id || !player2Id || !winnerId,
							className: "bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm",
							children: isSubmitting ? "Recording Game..." : "Confirm & Apply Elo"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/AdminBar.tsx
function AdminBar({ players, onDataRefresh }) {
	const { isAdmin, logout } = useAdmin();
	const [loginOpen, setLoginOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [addPlayerOpen, setAddPlayerOpen] = useState(false);
	const [recordMatchOpen, setRecordMatchOpen] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("header", {
			className: "w-full bg-card/60 backdrop-blur-md border-b border-border/80 sticky top-0 z-40 transition-colors",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5",
					role: "status",
					children: [isAdmin ? /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
							/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
							/* @__PURE__ */ jsx("span", { children: "Admin Mode Active" })
						]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/80 border border-border text-muted-foreground text-xs font-medium",
						children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Spectator Mode (Read-Only)" })]
					}), /* @__PURE__ */ jsx("span", {
						className: "hidden md:inline-block text-xs text-muted-foreground",
						children: isAdmin ? "Full control enabled: Record match results & register players" : "Anyone can view leaderboard and simulate matchups"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2",
					children: isAdmin ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsxs(Button, {
							size: "sm",
							onClick: () => setAddPlayerOpen(true),
							"aria-haspopup": "dialog",
							variant: "outline",
							className: "h-8 text-xs font-semibold border-border hover:bg-secondary",
							children: [/* @__PURE__ */ jsx(UserPlus, { className: "w-3.5 h-3.5 mr-1.5 text-primary" }), "Add Player"]
						}),
						/* @__PURE__ */ jsxs(Button, {
							size: "sm",
							onClick: () => setRecordMatchOpen(true),
							"aria-haspopup": "dialog",
							className: "h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm",
							children: [/* @__PURE__ */ jsx(Swords, { className: "w-3.5 h-3.5 mr-1.5" }), "Record Match"]
						}),
						/* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => setSettingsOpen(true),
							className: "h-8 w-8 p-0 text-muted-foreground hover:text-foreground",
							title: "Admin Settings",
							"aria-label": "Admin settings",
							"aria-haspopup": "dialog",
							children: /* @__PURE__ */ jsx(SlidersHorizontal, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							onClick: logout,
							className: "h-8 w-8 p-0 text-muted-foreground hover:text-rose-400",
							title: "Exit Admin Mode",
							"aria-label": "Exit admin mode",
							children: /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" })
						})
					] }) : /* @__PURE__ */ jsxs(Button, {
						size: "sm",
						onClick: () => setLoginOpen(true),
						"aria-haspopup": "dialog",
						variant: "outline",
						className: "h-8 text-xs font-semibold border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500",
						children: [/* @__PURE__ */ jsx(Lock, { className: "w-3.5 h-3.5 mr-1.5 text-emerald-400" }), "Admin Login"]
					})
				})]
			})
		}),
		/* @__PURE__ */ jsx(AdminLoginDialog, {
			open: loginOpen,
			onOpenChange: setLoginOpen
		}),
		/* @__PURE__ */ jsx(AdminSettingsDialog, {
			open: settingsOpen,
			onOpenChange: setSettingsOpen,
			onLeaderboardUpdated: onDataRefresh
		}),
		/* @__PURE__ */ jsx(AddPlayerDialog, {
			open: addPlayerOpen,
			onOpenChange: setAddPlayerOpen,
			onPlayerAdded: onDataRefresh
		}),
		/* @__PURE__ */ jsx(RecordMatchDialog, {
			open: recordMatchOpen,
			onOpenChange: setRecordMatchOpen,
			players,
			onMatchRecorded: onDataRefresh
		})
	] });
}
//#endregion
//#region src/components/EditPlayerDialog.tsx
function EditPlayerDialog({ player, open, onOpenChange, onPlayerUpdated }) {
	const { adminPasscode } = useAdmin();
	const [name, setName] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [error, setError] = useState("");
	useEffect(() => {
		if (player) {
			setName(player.name);
			setShowDeleteConfirm(false);
			setError("");
		}
	}, [player]);
	if (!player) return null;
	const handleUpdate = async (e) => {
		e.preventDefault();
		setError("");
		const cleanName = name.trim();
		if (!cleanName || cleanName.length < 2) {
			setError("Player name must be at least 2 characters");
			return;
		}
		setIsUpdating(true);
		try {
			await updatePlayerFn({ data: {
				id: player.id,
				name: cleanName,
				adminPasscode
			} });
			toast.success("Player updated successfully");
			onOpenChange(false);
			onPlayerUpdated();
		} catch (err) {
			const msg = err?.message || "Failed to update player";
			setError(msg);
			toast.error("Update failed", { description: msg });
		} finally {
			setIsUpdating(false);
		}
	};
	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deletePlayerFn({ data: {
				id: player.id,
				adminPasscode
			} });
			toast.success("Player removed from leaderboard");
			onOpenChange(false);
			onPlayerUpdated();
		} catch (err) {
			toast.error("Delete failed", { description: err?.message || "Could not delete player" });
		} finally {
			setIsDeleting(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-md border-border bg-card",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [
					/* @__PURE__ */ jsx("div", {
						className: "mx-auto w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-1",
						children: /* @__PURE__ */ jsx(Edit2, { className: "w-5 h-5 text-primary" })
					}),
					/* @__PURE__ */ jsxs(DialogTitle, {
						className: "text-xl text-center",
						children: ["Edit Player: ", player.name]
					}),
					/* @__PURE__ */ jsxs(DialogDescription, {
						className: "text-center text-sm text-muted-foreground",
						children: [
							"Current Elo: ",
							player.elo,
							" (",
							player.tier.label,
							")"
						]
					})
				] }),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleUpdate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "edit-player-name",
								className: "text-xs font-semibold",
								children: "Player Name"
							}), /* @__PURE__ */ jsx(Input, {
								id: "edit-player-name",
								type: "text",
								value: name,
								onChange: (e) => {
									setName(e.target.value);
									setError("");
								},
								className: "bg-background/50 border-input",
								required: true
							})]
						}),
						error && /* @__PURE__ */ jsx("p", {
							className: "text-xs text-rose-400 font-medium p-2 rounded bg-rose-500/10 border border-rose-500/20",
							children: error
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2 justify-end pt-2",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "outline",
								onClick: () => onOpenChange(false),
								children: "Cancel"
							}), /* @__PURE__ */ jsx(Button, {
								type: "submit",
								disabled: isUpdating || !name.trim(),
								className: "bg-emerald-600 hover:bg-emerald-500 text-white font-medium",
								children: isUpdating ? "Saving..." : "Save Changes"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "border-t border-border pt-4 mt-2",
					children: !showDeleteConfirm ? /* @__PURE__ */ jsxs(Button, {
						type: "button",
						variant: "ghost",
						size: "sm",
						onClick: () => setShowDeleteConfirm(true),
						className: "w-full text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300",
						children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5 mr-1.5" }), "Remove Player from Leaderboard..."]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 space-y-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 text-xs text-rose-300 font-medium",
								children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-rose-400" }), /* @__PURE__ */ jsxs("span", { children: [
									"Remove ",
									player.name,
									"?"
								] })]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-muted-foreground",
								children: "This hides the player from the active leaderboard. Their past matches remain recorded in match history."
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2 justify-end pt-1",
								children: [/* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: () => setShowDeleteConfirm(false),
									className: "text-xs",
									children: "Cancel"
								}), /* @__PURE__ */ jsx(Button, {
									type: "button",
									size: "sm",
									disabled: isDeleting,
									onClick: handleDelete,
									className: "bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold",
									children: isDeleting ? "Removing..." : "Confirm Remove"
								})]
							})
						]
					})
				})
			]
		})
	});
}
//#endregion
//#region src/components/PlayerProfileModal.tsx
function PlayerProfileModal({ player, matches, open, onOpenChange, onChallengePlayer }) {
	if (!player) return null;
	const playerMatches = matches.filter((m) => m.player1Id === player.id || m.player2Id === player.id);
	const isPositiveStreak = player.currentStreak > 0;
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-lg border-border bg-card max-h-[85vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ jsx(DialogHeader, {
					className: "text-left pb-2 border-b border-border",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30",
									children: ["RANK #", player.rank]
								}), /* @__PURE__ */ jsx(RankBadge, {
									elo: player.elo,
									size: "sm"
								})]
							}),
							/* @__PURE__ */ jsx(DialogTitle, {
								className: "text-2xl font-bold mt-1 text-foreground",
								children: player.name
							}),
							/* @__PURE__ */ jsxs(DialogDescription, {
								className: "text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5",
								children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), "Active player on the official leaderboard"]
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "text-right",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-3xl font-black font-mono tracking-tight text-foreground",
								children: player.elo
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-muted-foreground uppercase tracking-wider font-semibold",
								children: "Current ELO"
							})]
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-3 rounded-xl bg-background/60 border border-border",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-muted-foreground font-medium block",
									children: "Win Rate"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: `text-xl font-bold font-mono ${player.winRate >= 60 ? "text-emerald-400" : player.winRate >= 45 ? "text-amber-400" : "text-foreground"}`,
									children: [player.winRate, "%"]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-[10px] text-muted-foreground block",
									children: [
										player.wins,
										"W - ",
										player.losses,
										"L"
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-3 rounded-xl bg-background/60 border border-border",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-muted-foreground font-medium block",
									children: "Streak"
								}),
								/* @__PURE__ */ jsx("span", {
									className: `text-xl font-bold font-mono flex items-center gap-1 ${isPositiveStreak ? "text-amber-400" : "text-blue-400"}`,
									children: isPositiveStreak ? /* @__PURE__ */ jsxs(Fragment, { children: [
										/* @__PURE__ */ jsx(Flame, { className: "w-4 h-4 text-amber-400" }),
										player.currentStreak,
										"W"
									] }) : player.currentStreak < 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [Math.abs(player.currentStreak), "L"] }) : "None"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-muted-foreground block",
									children: isPositiveStreak ? "Winning run" : "Losing run"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-3 rounded-xl bg-background/60 border border-border",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-muted-foreground font-medium block",
									children: "Peak Rating"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-xl font-bold font-mono text-emerald-400 flex items-center gap-0.5",
									children: [/* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4" }), player.highestElo]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-muted-foreground block",
									children: "All-time high"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-3 rounded-xl bg-background/60 border border-border",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-muted-foreground font-medium block",
									children: "Lowest Rating"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-xl font-bold font-mono text-muted-foreground flex items-center gap-0.5",
									children: [/* @__PURE__ */ jsx(TrendingDown, { className: "w-4 h-4" }), player.lowestElo]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-muted-foreground block",
									children: "All-time low"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2 pt-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex items-center justify-between text-xs font-semibold text-muted-foreground",
						children: /* @__PURE__ */ jsxs("span", { children: [
							"Recent Match Appearances (",
							playerMatches.length,
							")"
						] })
					}), playerMatches.length === 0 ? /* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-xl",
						children: [
							"No matches recorded for ",
							player.name,
							" yet."
						]
					}) : /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: playerMatches.slice(0, 5).map((m) => {
							const won = m.winnerId === player.id;
							const opponentName = m.player1Id === player.id ? m.player2Name : m.player1Name;
							return /* @__PURE__ */ jsxs("div", {
								className: "p-2.5 rounded-lg bg-background/40 border border-border/70 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: `w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] ${won ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"}`,
										children: won ? "W" : "L"
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
										className: "font-semibold text-foreground",
										children: ["vs ", opponentName]
									}), m.score && /* @__PURE__ */ jsxs("span", {
										className: "text-muted-foreground ml-2 font-mono text-[11px]",
										children: [
											"(",
											m.score,
											")"
										]
									})] })]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-right font-mono",
									children: /* @__PURE__ */ jsxs("span", {
										className: `font-bold ${won ? "text-emerald-400" : "text-rose-400"}`,
										children: [won ? `+${m.eloDelta}` : `-${m.eloDelta}`, " ELO"]
									})
								})]
							}, m.id);
						})
					})]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, {
					className: "pt-3 sm:justify-between",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Close"
					}), onChallengePlayer && /* @__PURE__ */ jsxs(Button, {
						onClick: () => {
							onOpenChange(false);
							onChallengePlayer(player);
						},
						className: "bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold",
						children: [/* @__PURE__ */ jsx(Swords, { className: "w-3.5 h-3.5 mr-1.5" }), "Simulate Matchup"]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/components/LeaderboardTable.tsx
function LeaderboardTable({ players, matches, onDataRefresh, onChallengePlayer }) {
	const { isAdmin } = useAdmin();
	const [search, setSearch] = useState("");
	const [selectedTierGroup, setSelectedTierGroup] = useState("all");
	const [sortBy, setSortBy] = useState("elo");
	const [sortOrder, setSortOrder] = useState("desc");
	const [editingPlayer, setEditingPlayer] = useState(null);
	const [inspectingPlayer, setInspectingPlayer] = useState(null);
	const [preselectedPlayer, setPreselectedPlayer] = useState(null);
	const tierGroups = [
		{
			id: "all",
			label: "All Tiers"
		},
		{
			id: "Champion",
			label: "Champion+"
		},
		{
			id: "Diamond",
			label: "Diamond"
		},
		{
			id: "Platinum",
			label: "Platinum"
		},
		{
			id: "Gold",
			label: "Gold"
		},
		{
			id: "Silver",
			label: "Silver"
		},
		{
			id: "Bronze",
			label: "Bronze"
		}
	];
	const filteredPlayers = useMemo(() => {
		let result = [...players];
		if (search.trim()) {
			const q = search.toLowerCase().trim();
			result = result.filter((p) => p.name.toLowerCase().includes(q));
		}
		if (selectedTierGroup !== "all") {
			if (selectedTierGroup === "Champion") result = result.filter((p) => p.tier.name.includes("Champion") || p.tier.name.includes("Supersonic"));
			else result = result.filter((p) => p.tier.name === selectedTierGroup);
		}
		result.sort((a, b) => {
			let diff = 0;
			if (sortBy === "elo") diff = a.elo - b.elo;
			else if (sortBy === "wins") diff = a.wins - b.wins;
			else if (sortBy === "winRate") diff = a.winRate - b.winRate;
			else if (sortBy === "streak") diff = a.currentStreak - b.currentStreak;
			return sortOrder === "desc" ? -diff : diff;
		});
		return result;
	}, [
		players,
		search,
		selectedTierGroup,
		sortBy,
		sortOrder
	]);
	const toggleSort = (column) => {
		if (sortBy === column) setSortOrder(sortOrder === "desc" ? "asc" : "desc");
		else {
			setSortBy(column);
			setSortOrder("desc");
		}
	};
	const ariaSortFor = (column) => sortBy === column ? sortOrder === "asc" ? "ascending" : "descending" : "none";
	const renderRankBadge = (rank) => {
		if (rank === 1) return /* @__PURE__ */ jsxs("span", {
			className: "w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-xs shadow-[0_0_12px_rgba(245,158,11,0.3)]",
			children: [/* @__PURE__ */ jsx(Crown, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: rank
			})]
		});
		if (rank === 2) return /* @__PURE__ */ jsxs("span", {
			className: "w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40 flex items-center justify-center font-bold text-xs",
			children: [/* @__PURE__ */ jsx(Medal, { className: "w-4 h-4 text-slate-300" }), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: rank
			})]
		});
		if (rank === 3) return /* @__PURE__ */ jsxs("span", {
			className: "w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-bold text-xs",
			children: [/* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 text-amber-600" }), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: rank
			})]
		});
		return /* @__PURE__ */ jsx("span", {
			className: "w-7 h-7 rounded-full bg-secondary text-muted-foreground flex items-center justify-center font-mono font-semibold text-xs",
			children: rank
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative flex-1 max-w-sm",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						type: "search",
						"aria-label": "Search players by name",
						placeholder: "Search players by name...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "pl-9 bg-card/60 border-border"
					})]
				}), /* @__PURE__ */ jsx("div", {
					role: "group",
					"aria-label": "Filter by rank tier",
					className: "flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none",
					children: tierGroups.map((tg) => /* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-pressed": selectedTierGroup === tg.id,
						onClick: () => setSelectedTierGroup(tg.id),
						className: `px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${selectedTierGroup === tg.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary"}`,
						children: tg.label
					}, tg.id))
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden shadow-lg",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left border-collapse",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "border-b border-border/80 bg-secondary/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									className: "py-3.5 pl-4 pr-2 w-14 text-center",
									children: "Rank"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									className: "py-3.5 px-3",
									children: "Player"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									className: "py-3.5 px-3",
									children: "Rank Tier"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									"aria-sort": ariaSortFor("elo"),
									className: "py-3.5 px-3 select-none",
									children: /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => toggleSort("elo"),
										className: "flex items-center gap-1 uppercase tracking-wider cursor-pointer rounded hover:text-foreground",
										children: [/* @__PURE__ */ jsx("span", { children: "Rating (ELO)" }), /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-3 h-3" })]
									})
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									"aria-sort": ariaSortFor("wins"),
									className: "py-3.5 px-3 select-none hidden md:table-cell",
									children: /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => toggleSort("wins"),
										className: "flex items-center gap-1 uppercase tracking-wider cursor-pointer rounded hover:text-foreground",
										children: [/* @__PURE__ */ jsx("span", { children: "Record (W-L)" }), /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-3 h-3" })]
									})
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									"aria-sort": ariaSortFor("winRate"),
									className: "py-3.5 px-3 select-none hidden sm:table-cell",
									children: /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => toggleSort("winRate"),
										className: "flex items-center gap-1 uppercase tracking-wider cursor-pointer rounded hover:text-foreground",
										children: [/* @__PURE__ */ jsx("span", { children: "Win %" }), /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-3 h-3" })]
									})
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									"aria-sort": ariaSortFor("streak"),
									className: "py-3.5 px-3 select-none hidden lg:table-cell",
									children: /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => toggleSort("streak"),
										className: "flex items-center gap-1 uppercase tracking-wider cursor-pointer rounded hover:text-foreground",
										children: [/* @__PURE__ */ jsx("span", { children: "Streak" }), /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-3 h-3" })]
									})
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									className: "py-3.5 pr-4 pl-2 text-right",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-border/50 text-sm",
							children: filteredPlayers.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 8,
								className: "py-12 text-center text-muted-foreground",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col items-center justify-center gap-2",
									children: [
										/* @__PURE__ */ jsx(UserX, { className: "w-8 h-8 opacity-40" }),
										/* @__PURE__ */ jsx("p", {
											className: "font-medium",
											children: "No players found matching your filters"
										}),
										/* @__PURE__ */ jsx(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => {
												setSearch("");
												setSelectedTierGroup("all");
											},
											className: "text-xs text-primary",
											children: "Clear Filters"
										})
									]
								})
							}) }) : filteredPlayers.map((player) => {
								const isTopThree = player.rank <= 3;
								const isPositiveStreak = player.currentStreak > 0;
								return /* @__PURE__ */ jsxs("tr", {
									className: `group hover:bg-secondary/40 transition-colors ${isTopThree ? "bg-secondary/15" : ""}`,
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3 pl-4 pr-2 text-center",
											children: /* @__PURE__ */ jsx("div", {
												className: "flex justify-center",
												children: renderRankBadge(player.rank)
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-3",
											children: /* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => setInspectingPlayer(player),
												"aria-haspopup": "dialog",
												className: "flex items-center gap-2.5 text-left rounded-md group-hover:text-primary transition-colors",
												children: [/* @__PURE__ */ jsx("div", {
													"aria-hidden": "true",
													className: "w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0",
													children: player.name.charAt(0).toUpperCase()
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
													className: "font-semibold text-foreground block group-hover:text-primary",
													children: player.name
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-[11px] text-muted-foreground block lg:hidden",
													children: [
														player.wins,
														"W - ",
														player.losses,
														"L (",
														player.winRate,
														"%)"
													]
												})] })]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-3",
											children: /* @__PURE__ */ jsx(RankBadge, {
												tier: player.tier,
												size: "md"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-3",
											children: /* @__PURE__ */ jsxs("div", {
												className: "font-mono",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-base font-bold text-foreground",
													children: player.elo
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-[10px] text-muted-foreground ml-1.5 hidden xl:inline",
													children: [
														"(Peak: ",
														player.highestElo,
														")"
													]
												})]
											})
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-3 hidden md:table-cell font-mono text-xs",
											children: [
												/* @__PURE__ */ jsxs("span", {
													className: "text-emerald-400 font-semibold",
													children: [player.wins, "W"]
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-muted-foreground mx-1",
													children: "-"
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "text-rose-400 font-semibold",
													children: [player.losses, "L"]
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "text-muted-foreground text-[10px] ml-1.5",
													children: [
														"(",
														player.matchesPlayed,
														" total)"
													]
												})
											]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-3 hidden sm:table-cell",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsxs("span", {
													className: `font-mono text-xs font-bold ${player.winRate >= 60 ? "text-emerald-400" : player.winRate >= 45 ? "text-amber-400" : "text-muted-foreground"}`,
													children: [player.winRate, "%"]
												}), /* @__PURE__ */ jsx("div", {
													"aria-hidden": "true",
													className: "w-12 h-1.5 rounded-full bg-secondary hidden md:block overflow-hidden",
													children: /* @__PURE__ */ jsx("div", {
														className: `h-full rounded-full ${player.winRate >= 60 ? "bg-emerald-500" : player.winRate >= 45 ? "bg-amber-500" : "bg-muted-foreground"}`,
														style: { width: `${player.winRate}%` }
													})
												})]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-3 hidden lg:table-cell font-mono text-xs",
											children: player.currentStreak !== 0 ? /* @__PURE__ */ jsx("span", {
												className: `inline-flex items-center gap-1 font-semibold ${isPositiveStreak ? "text-amber-400" : "text-blue-400"}`,
												children: isPositiveStreak ? /* @__PURE__ */ jsxs(Fragment, { children: [
													/* @__PURE__ */ jsx(Flame, { className: "w-3.5 h-3.5 text-amber-400" }),
													player.currentStreak,
													"W"
												] }) : /* @__PURE__ */ jsxs(Fragment, { children: [Math.abs(player.currentStreak), "L"] })
											}) : /* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "-"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 pr-4 pl-2 text-right",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-end gap-1",
												children: [/* @__PURE__ */ jsxs(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => {
														if (onChallengePlayer) onChallengePlayer(player);
														else setInspectingPlayer(player);
													},
													className: "h-7 text-xs px-2 text-muted-foreground hover:text-foreground",
													title: "Simulate Match",
													"aria-label": `Simulate match against ${player.name}`,
													children: [/* @__PURE__ */ jsx(Swords, { className: "w-3.5 h-3.5 sm:mr-1 text-primary" }), /* @__PURE__ */ jsx("span", {
														className: "hidden sm:inline",
														children: "Simulate"
													})]
												}), isAdmin && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => setPreselectedPlayer(player),
													className: "h-7 text-xs px-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10",
													title: "Record match with this player",
													"aria-label": `Record match with ${player.name}`,
													"aria-haspopup": "dialog",
													children: "Record"
												}), /* @__PURE__ */ jsx(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => setEditingPlayer(player),
													className: "h-7 w-7 p-0 text-muted-foreground hover:text-foreground",
													title: "Edit Player",
													"aria-label": `Edit ${player.name}`,
													"aria-haspopup": "dialog",
													children: /* @__PURE__ */ jsx(Edit2, { className: "w-3.5 h-3.5" })
												})] })]
											})
										})
									]
								}, player.id);
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx(PlayerProfileModal, {
				player: inspectingPlayer,
				matches,
				open: !!inspectingPlayer,
				onOpenChange: (open) => !open && setInspectingPlayer(null),
				onChallengePlayer
			}),
			/* @__PURE__ */ jsx(EditPlayerDialog, {
				player: editingPlayer,
				open: !!editingPlayer,
				onOpenChange: (open) => !open && setEditingPlayer(null),
				onPlayerUpdated: onDataRefresh
			}),
			preselectedPlayer && /* @__PURE__ */ jsx(RecordMatchDialog, {
				open: !!preselectedPlayer,
				onOpenChange: (open) => !open && setPreselectedPlayer(null),
				players,
				preselectedPlayerId: preselectedPlayer.id,
				onMatchRecorded: onDataRefresh
			})
		]
	});
}
//#endregion
//#region src/components/MatchHistoryView.tsx
function MatchHistoryView({ matches, onDataRefresh }) {
	const { isAdmin, adminPasscode } = useAdmin();
	const [revertingMatchId, setRevertingMatchId] = useState(null);
	const [confirmMatchId, setConfirmMatchId] = useState(null);
	const handleRevertMatch = async (matchId) => {
		setRevertingMatchId(matchId);
		try {
			await deleteMatchFn({ data: {
				id: matchId,
				adminPasscode
			} });
			toast.success("Match reverted", { description: "Both players have had their pre-match ratings restored." });
			setConfirmMatchId(null);
			onDataRefresh();
		} catch (err) {
			toast.error("Could not revert match", { description: err?.message || "Error occurred" });
		} finally {
			setRevertingMatchId(null);
		}
	};
	const formatTime = (isoString) => {
		try {
			const date = new Date(isoString);
			const diffMs = (/* @__PURE__ */ new Date()).getTime() - date.getTime();
			const diffHours = Math.floor(diffMs / 36e5);
			if (diffHours < 1) return `${Math.max(1, Math.floor(diffMs / 6e4))}m ago`;
			if (diffHours < 24) return `${diffHours}h ago`;
			const diffDays = Math.floor(diffHours / 24);
			if (diffDays < 7) return `${diffDays}d ago`;
			return date.toLocaleDateString(void 0, {
				month: "short",
				day: "numeric"
			});
		} catch {
			return "Recently";
		}
	};
	if (matches.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "py-16 text-center rounded-2xl border border-dashed border-border bg-card/40",
		children: [
			/* @__PURE__ */ jsx(History, { className: "w-10 h-10 mx-auto text-muted-foreground/40 mb-3" }),
			/* @__PURE__ */ jsx("h2", {
				className: "text-base font-semibold text-foreground",
				children: "No Matches Recorded Yet"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground max-w-sm mx-auto mt-1",
				children: isAdmin ? "Click \"Record Match\" in the top bar to record the first table tennis match result." : "Match results will appear here as soon as the admin records games."
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between text-xs text-muted-foreground px-1 font-medium",
			children: [/* @__PURE__ */ jsxs("span", { children: [
				"Showing ",
				matches.length,
				" recorded match",
				matches.length === 1 ? "" : "es"
			] }), /* @__PURE__ */ jsx("span", { children: "Latest matches first" })]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-3",
			children: matches.map((m) => {
				const p1IsWinner = m.winnerId === m.player1Id;
				const winnerName = p1IsWinner ? m.player1Name : m.player2Name;
				const loserName = p1IsWinner ? m.player2Name : m.player1Name;
				const winnerEloBefore = p1IsWinner ? m.player1EloBefore : m.player2EloBefore;
				const winnerEloAfter = p1IsWinner ? m.player1EloAfter : m.player2EloAfter;
				const loserEloBefore = !p1IsWinner ? m.player1EloBefore : m.player2EloBefore;
				const loserEloAfter = !p1IsWinner ? m.player1EloAfter : m.player2EloAfter;
				const isUpset = m.eloDelta >= 22;
				return /* @__PURE__ */ jsxs("div", {
					className: "p-4 rounded-xl border border-border bg-card/70 backdrop-blur-sm shadow-sm hover:border-border/80 transition-all space-y-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "text-muted-foreground flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), formatTime(m.createdAt)]
									}),
									m.score && /* @__PURE__ */ jsx("span", {
										className: "font-mono px-2 py-0.5 rounded bg-secondary text-foreground font-semibold border border-border",
										children: m.score
									}),
									isUpset && /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full",
										children: [
											/* @__PURE__ */ jsx(Zap, { className: "w-3 h-3" }),
											"Upset (+",
											m.eloDelta,
											" Elo)"
										]
									})
								]
							}), isAdmin && /* @__PURE__ */ jsx("div", { children: confirmMatchId !== m.id ? /* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setConfirmMatchId(m.id),
								className: "h-7 text-xs text-muted-foreground hover:text-rose-400",
								title: "Revert match rating changes",
								children: [/* @__PURE__ */ jsx(RotateCcw, { className: "w-3.5 h-3.5 mr-1" }), "Revert"]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-rose-400 font-medium",
										children: "Revert?"
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => setConfirmMatchId(null),
										className: "h-6 text-[11px] px-1.5",
										children: "Cancel"
									}),
									/* @__PURE__ */ jsx(Button, {
										size: "sm",
										disabled: revertingMatchId === m.id,
										onClick: () => handleRevertMatch(m.id),
										className: "h-6 text-[11px] px-2 bg-rose-600 hover:bg-rose-500 text-white",
										children: revertingMatchId === m.id ? "Reverting..." : "Yes, Revert"
									})
								]
							}) })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3 items-center",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ jsx(Trophy, { className: "w-4 h-4 text-emerald-400" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs uppercase font-bold text-emerald-400 tracking-wider block text-[10px]",
											children: "Winner"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-sm text-foreground truncate block",
											children: winnerName
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-right font-mono",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-emerald-400 font-bold text-sm block",
										children: [
											"+",
											m.eloDelta,
											" ELO"
										]
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[11px] text-muted-foreground",
										children: [
											winnerEloBefore,
											" →",
											" ",
											/* @__PURE__ */ jsx("strong", {
												className: "text-foreground",
												children: winnerEloAfter
											})
										]
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-3 rounded-lg bg-background/50 border border-border flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-muted-foreground font-bold text-xs",
										children: "L"
									}), /* @__PURE__ */ jsxs("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs uppercase font-medium text-muted-foreground tracking-wider block text-[10px]",
											children: "Defeated"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-sm text-muted-foreground truncate block",
											children: loserName
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-right font-mono",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-rose-400 font-bold text-sm block",
										children: [
											"-",
											m.eloDelta,
											" ELO"
										]
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[11px] text-muted-foreground",
										children: [
											loserEloBefore,
											" →",
											" ",
											/* @__PURE__ */ jsx("strong", {
												className: "text-foreground",
												children: loserEloAfter
											})
										]
									})]
								})]
							})]
						}),
						m.notes && /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50",
							children: [/* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/70" }), /* @__PURE__ */ jsx("span", { children: m.notes })]
						})
					]
				}, m.id);
			})
		})]
	});
}
//#endregion
//#region src/components/MatchPredictor.tsx
function MatchPredictor({ players, matches, initialPlayer1Id, initialPlayer2Id, onMatchRecorded }) {
	const { isAdmin } = useAdmin();
	const [p1Id, setP1Id] = useState(initialPlayer1Id || players[0]?.id || 1);
	const [p2Id, setP2Id] = useState(initialPlayer2Id || players.find((p) => p.id !== (initialPlayer1Id || players[0]?.id))?.id || 2);
	const [recordDialogOpen, setRecordDialogOpen] = useState(false);
	const player1 = useMemo(() => players.find((p) => p.id === p1Id), [players, p1Id]);
	const player2 = useMemo(() => players.find((p) => p.id === p2Id), [players, p2Id]);
	const scenarios = useMemo(() => {
		if (!player1 || !player2 || player1.id === player2.id) return null;
		return previewMatchScenarios(player1.elo, player2.elo, player1.matchesPlayed, player2.matchesPlayed);
	}, [player1, player2]);
	const headToHeadMatches = useMemo(() => {
		if (!player1 || !player2) return [];
		return matches.filter((m) => m.player1Id === player1.id && m.player2Id === player2.id || m.player1Id === player2.id && m.player2Id === player1.id);
	}, [
		matches,
		player1,
		player2
	]);
	const p1H2HWins = headToHeadMatches.filter((m) => m.winnerId === player1?.id).length;
	const p2H2HWins = headToHeadMatches.filter((m) => m.winnerId === player2?.id).length;
	if (players.length < 2) return /* @__PURE__ */ jsxs("div", {
		className: "py-12 text-center rounded-2xl border border-dashed border-border bg-card/40",
		children: [/* @__PURE__ */ jsx(Calculator, { className: "w-10 h-10 mx-auto text-muted-foreground/40 mb-2" }), /* @__PURE__ */ jsx("p", {
			className: "text-sm font-semibold",
			children: "At least 2 players needed for match predictions"
		})]
	});
	const eloDiff = player1 && player2 ? Math.abs(player1.elo - player2.elo) : 0;
	const higherEloPlayer = player1 && player2 ? player1.elo >= player2.elo ? player1 : player2 : null;
	const lowerEloPlayer = player1 && player2 ? player1.elo < player2.elo ? player1 : player2 : null;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-lg space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border/70 pb-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center",
							children: /* @__PURE__ */ jsx(Calculator, { className: "w-5 h-5 text-primary" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "font-bold text-base text-foreground",
							children: "Interactive Match Simulator"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Compare players to calculate expected win odds and potential Rocket League style Elo swings."
						})] })]
					}), isAdmin && player1 && player2 && player1.id !== player2.id && /* @__PURE__ */ jsxs(Button, {
						size: "sm",
						onClick: () => setRecordDialogOpen(true),
						className: "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shrink-0",
						children: [/* @__PURE__ */ jsx(Swords, { className: "w-3.5 h-3.5 mr-1.5" }), "Record This Match"]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-4 rounded-xl bg-background/50 border border-border space-y-3",
						children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "p1-select",
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider block",
								children: "Player A"
							}),
							/* @__PURE__ */ jsx("select", {
								id: "p1-select",
								value: p1Id,
								onChange: (e) => setP1Id(Number(e.target.value)),
								className: "w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium",
								children: players.map((p) => /* @__PURE__ */ jsxs("option", {
									value: p.id,
									disabled: p.id === p2Id,
									children: [
										p.name,
										" (",
										p.elo,
										" Elo)"
									]
								}, p.id))
							}),
							player1 && /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pt-1",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-black font-mono text-foreground block",
									children: player1.elo
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] text-muted-foreground font-medium",
									children: [
										player1.wins,
										"W - ",
										player1.losses,
										"L (",
										player1.winRate,
										"%)"
									]
								})] }), /* @__PURE__ */ jsx(RankBadge, {
									elo: player1.elo,
									size: "md"
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-4 rounded-xl bg-background/50 border border-border space-y-3",
						children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "p2-select",
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider block",
								children: "Player B"
							}),
							/* @__PURE__ */ jsx("select", {
								id: "p2-select",
								value: p2Id,
								onChange: (e) => setP2Id(Number(e.target.value)),
								className: "w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium",
								children: players.map((p) => /* @__PURE__ */ jsxs("option", {
									value: p.id,
									disabled: p.id === p1Id,
									children: [
										p.name,
										" (",
										p.elo,
										" Elo)"
									]
								}, p.id))
							}),
							player2 && /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pt-1",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-black font-mono text-foreground block",
									children: player2.elo
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] text-muted-foreground font-medium",
									children: [
										player2.wins,
										"W - ",
										player2.losses,
										"L (",
										player2.winRate,
										"%)"
									]
								})] }), /* @__PURE__ */ jsx(RankBadge, {
									elo: player2.elo,
									size: "md"
								})]
							})
						]
					})]
				}),
				player1 && player2 && scenarios && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs font-semibold",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "text-emerald-400",
										children: [
											player1.name,
											": ",
											scenarios.p1ExpectedWinRate,
											"% win odds"
										]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "text-muted-foreground font-mono",
										children: [
											"Δ ",
											eloDiff,
											" Elo rating gap"
										]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "text-blue-400",
										children: [
											player2.name,
											": ",
											scenarios.p2ExpectedWinRate,
											"% win odds"
										]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								"aria-hidden": "true",
								className: "w-full h-3 rounded-full bg-secondary overflow-hidden flex shadow-inner",
								children: [/* @__PURE__ */ jsx("div", {
									className: "bg-emerald-500 h-full transition-all duration-300 flex items-center justify-end pr-2 text-[10px] text-black font-bold",
									style: { width: `${scenarios.p1ExpectedWinRate}%` }
								}), /* @__PURE__ */ jsx("div", {
									className: "bg-blue-500 h-full transition-all duration-300 flex items-center justify-start pl-2 text-[10px] text-white font-bold",
									style: { width: `${scenarios.p2ExpectedWinRate}%` }
								})]
							})]
						}),
						higherEloPlayer && lowerEloPlayer && eloDiff > 40 && /* @__PURE__ */ jsxs("div", {
							className: "p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2",
							children: [/* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("strong", {
									className: "text-amber-300",
									children: ["Asymmetric Elo Stakes:", " "]
								}),
								"Because",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-white",
									children: lowerEloPlayer.name
								}),
								" ",
								"is lower-ranked by ",
								eloDiff,
								" points, defeating",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-white",
									children: higherEloPlayer.name
								}),
								" ",
								"will trigger an upset reward, granting a larger Elo boost!"
							] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-background/70 border border-border space-y-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-xs uppercase font-bold text-emerald-400 tracking-wider",
										children: [
											"If ",
											player1.name,
											" Wins"
										]
									}), scenarios.ifP1Wins.p1Delta >= 22 && /* @__PURE__ */ jsx("span", {
										className: "text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold",
										children: "⚡ Upset Victory!"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5 text-xs font-mono",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between p-2 rounded bg-secondary/40",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-foreground font-sans font-medium",
											children: [player1.name, ":"]
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-emerald-400 font-bold",
											children: [
												"+",
												scenarios.ifP1Wins.p1Delta,
												" ELO (",
												player1.elo,
												" →",
												" ",
												scenarios.ifP1Wins.p1NewElo,
												")"
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between p-2 rounded bg-secondary/40",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-foreground font-sans font-medium",
											children: [player2.name, ":"]
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-rose-400 font-bold",
											children: [
												scenarios.ifP1Wins.p2Delta,
												" ELO (",
												player2.elo,
												" →",
												" ",
												scenarios.ifP1Wins.p2NewElo,
												")"
											]
										})]
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-background/70 border border-border space-y-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-xs uppercase font-bold text-blue-400 tracking-wider",
										children: [
											"If ",
											player2.name,
											" Wins"
										]
									}), scenarios.ifP2Wins.p2Delta >= 22 && /* @__PURE__ */ jsx("span", {
										className: "text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold",
										children: "⚡ Upset Victory!"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5 text-xs font-mono",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between p-2 rounded bg-secondary/40",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-foreground font-sans font-medium",
											children: [player2.name, ":"]
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-emerald-400 font-bold",
											children: [
												"+",
												scenarios.ifP2Wins.p2Delta,
												" ELO (",
												player2.elo,
												" →",
												" ",
												scenarios.ifP2Wins.p2NewElo,
												")"
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between p-2 rounded bg-secondary/40",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-foreground font-sans font-medium",
											children: [player1.name, ":"]
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-rose-400 font-bold",
											children: [
												scenarios.ifP2Wins.p1Delta,
												" ELO (",
												player1.elo,
												" →",
												" ",
												scenarios.ifP2Wins.p1NewElo,
												")"
											]
										})]
									})]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "pt-2 border-t border-border/60",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ jsx(History, { className: "w-3.5 h-3.5" }),
										"Head-to-Head History: ",
										p1H2HWins,
										" - ",
										p2H2HWins
									]
								}), /* @__PURE__ */ jsxs("span", { children: [headToHeadMatches.length, " lifetime meetings"] })]
							}), headToHeadMatches.length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground text-center py-4 rounded-lg bg-secondary/30",
								children: "These two players have not faced each other yet."
							}) : /* @__PURE__ */ jsx("div", {
								className: "space-y-1.5",
								children: headToHeadMatches.slice(0, 3).map((m) => {
									const won = m.winnerId === player1.id;
									return /* @__PURE__ */ jsxs("div", {
										className: "p-2 rounded bg-secondary/40 border border-border/50 text-xs flex items-center justify-between font-mono",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "font-sans font-medium",
											children: [
												won ? player1.name : player2.name,
												" won",
												m.score ? ` (${m.score})` : ""
											]
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-emerald-400 font-bold",
											children: [
												"+",
												m.eloDelta,
												" ELO swing"
											]
										})]
									}, m.id);
								})
							})]
						})
					]
				})
			]
		}), player1 && player2 && /* @__PURE__ */ jsx(RecordMatchDialog, {
			open: recordDialogOpen,
			onOpenChange: setRecordDialogOpen,
			players,
			preselectedPlayerId: player1.id,
			onMatchRecorded: () => {
				setRecordDialogOpen(false);
				onMatchRecorded();
			}
		})]
	});
}
//#endregion
//#region src/components/RankTiersGuide.tsx
function RankTiersGuide() {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "p-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm space-y-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center",
					children: /* @__PURE__ */ jsx(Trophy, { className: "w-5 h-5 text-primary" })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "font-bold text-base text-foreground",
					children: "How Elo Rating Works"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted-foreground",
					children: "Inspired by competitive ranking algorithms used in Rocket League and international chess."
				})] })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-4 pt-1",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-3.5 rounded-xl bg-background/70 border border-border space-y-1.5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 font-semibold text-xs text-emerald-400",
							children: [/* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Upsets Gain More Elo" })]
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: [
								"When a lower-ranked player defeats a higher-ranked opponent, the system rewards a large Elo swing (up to",
								" ",
								/* @__PURE__ */ jsx("strong", { children: "+32 to +48" }),
								" rating points) because the outcome was statistically unexpected."
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-3.5 rounded-xl bg-background/70 border border-border space-y-1.5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 font-semibold text-xs text-rose-400",
							children: [/* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Lower Rank Losses Hurt More" })]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: "If a high-ranked player loses to a lower-ranked player, they suffer a severe rating penalty. Conversely, losing to someone ranked higher costs very few points."
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-3.5 rounded-xl bg-background/70 border border-border space-y-1.5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 font-semibold text-xs text-amber-400",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Zero-Sum Conservation" })]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: "Every match preserves rating balance: the exact number of Elo points gained by the victor is deducted from the loser, keeping the ladder fair and inflation-free."
						})]
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between text-xs text-muted-foreground px-1 font-semibold",
				children: [/* @__PURE__ */ jsx("span", { children: "Competitive Skill Tiers & Divisions" }), /* @__PURE__ */ jsx("span", { children: "From Novice to World Class" })]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
				children: RANK_TIERS.map((tier) => /* @__PURE__ */ jsxs("div", {
					className: "p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm flex items-center justify-between transition-all hover:scale-[1.01]",
					style: { borderColor: tier.borderColor },
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ jsx(RankBadge, {
								tier,
								size: "md"
							})
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-[11px] text-muted-foreground font-mono",
							children: [
								tier.minElo,
								" – ",
								tier.maxElo > 9e3 ? "Peak" : tier.maxElo,
								" ",
								"ELO"
							]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
						style: {
							backgroundColor: tier.bgColor,
							borderColor: tier.borderColor,
							color: tier.textColor
						},
						children: /* @__PURE__ */ jsx(Award, { className: "w-5 h-5" })
					})]
				}, tier.label))
			})]
		})]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function HomePage() {
	const router = useRouter();
	const data = Route.useLoaderData();
	const { isAdmin } = useAdmin();
	const [activeTab, setActiveTab] = useState("leaderboard");
	const tabRefs = useRef([]);
	const [challengePlayer, setChallengePlayer] = useState(null);
	const players = data?.players || [];
	const matches = data?.matches || [];
	const topPlayer = players[0];
	const totalMatches = matches.length;
	const totalPlayers = players.length;
	const peakElo = players.reduce((max, p) => Math.max(max, p.highestElo), 1200);
	const tabs = [
		{
			id: "leaderboard",
			label: "Leaderboard",
			icon: Trophy,
			count: players.length
		},
		{
			id: "matches",
			label: "Match History",
			icon: History,
			count: matches.length
		},
		{
			id: "predictor",
			label: "Match Simulator & Odds",
			icon: Calculator
		},
		{
			id: "tiers",
			label: "Skill Tiers & Elo Rules",
			icon: Shield
		}
	];
	const handleTabKeyDown = (e, index) => {
		let next = null;
		if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
		else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
		else if (e.key === "Home") next = 0;
		else if (e.key === "End") next = tabs.length - 1;
		if (next === null) return;
		e.preventDefault();
		setActiveTab(tabs[next].id);
		tabRefs.current[next]?.focus();
	};
	const handleRefresh = () => {
		router.invalidate();
	};
	const handleChallenge = (p) => {
		setChallengePlayer(p);
		setActiveTab("predictor");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ jsx(AdminBar, {
				players,
				onDataRefresh: handleRefresh
			}),
			/* @__PURE__ */ jsxs("main", {
				id: "main-content",
				tabIndex: -1,
				className: "flex-1 outline-none max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-card to-card/50 p-6 sm:p-8 shadow-xl",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-2 max-w-2xl",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold",
										children: [/* @__PURE__ */ jsx(CircleDot, { className: "w-3.5 h-3.5 animate-pulse text-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "Rocket League Style Elo System" })]
									}),
									/* @__PURE__ */ jsx("h1", {
										className: "text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground flex items-center gap-3",
										children: /* @__PURE__ */ jsx("span", { children: "TopSpin Elo" })
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm sm:text-base text-muted-foreground leading-relaxed",
										children: "Official table tennis competitive leaderboard. Beat higher-ranked players for massive upset Elo rewards; defend your rank against lower seeds where defeats carry heavy rating penalties."
									})
								]
							}), topPlayer && /* @__PURE__ */ jsxs("section", {
								"aria-label": "Current table champion",
								className: "w-full md:w-auto p-4 rounded-2xl bg-secondary/60 border border-amber-500/30 backdrop-blur-md shrink-0 shadow-[0_0_24px_rgba(245,158,11,0.12)]",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5",
									children: [/* @__PURE__ */ jsx(Trophy, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Current Table Champion" })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-300 text-base shadow-inner",
										children: topPlayer.name.charAt(0)
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "font-bold text-base text-foreground",
										children: topPlayer.name
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 mt-0.5",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "font-mono font-bold text-sm text-foreground",
											children: [topPlayer.elo, " ELO"]
										}), /* @__PURE__ */ jsx(RankBadge, {
											tier: topPlayer.tier,
											size: "sm"
										})]
									})] })]
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-border/60",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-primary" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-lg font-bold font-mono text-foreground block",
										children: totalPlayers
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-muted-foreground font-medium",
										children: "Active Competitors"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ jsx(Swords, { className: "w-4 h-4 text-primary" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-lg font-bold font-mono text-foreground block",
										children: totalMatches
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-muted-foreground font-medium",
										children: "Matches Recorded"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-amber-400" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-lg font-bold font-mono text-amber-300 block",
										children: peakElo
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-muted-foreground font-medium",
										children: "All-Time Peak Rating"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 text-emerald-400" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-lg font-bold font-mono text-emerald-400 block",
										children: "±32 ELO"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-muted-foreground font-medium",
										children: "Max Upset Swing"
									})] })]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						role: "tablist",
						"aria-label": "Leaderboard sections",
						className: "flex items-center gap-2 border-b border-border pb-px overflow-x-auto scrollbar-none",
						children: tabs.map((tab, index) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.id;
							return /* @__PURE__ */ jsxs("button", {
								ref: (el) => {
									tabRefs.current[index] = el;
								},
								type: "button",
								role: "tab",
								id: `tab-${tab.id}`,
								"aria-selected": isActive,
								"aria-controls": `panel-${tab.id}`,
								tabIndex: isActive ? 0 : -1,
								onClick: () => setActiveTab(tab.id),
								onKeyDown: (e) => handleTabKeyDown(e, index),
								className: `flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring ${isActive ? "border-emerald-400 text-emerald-400 bg-emerald-500/5" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`,
								children: [
									/* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" }),
									/* @__PURE__ */ jsx("span", { children: tab.label }),
									tab.count !== void 0 && /* @__PURE__ */ jsxs("span", {
										className: "text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground font-mono",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "sr-only",
												children: "("
											}),
											tab.count,
											/* @__PURE__ */ jsx("span", {
												className: "sr-only",
												children: ")"
											})
										]
									})
								]
							}, tab.id);
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						role: "tabpanel",
						id: `panel-${activeTab}`,
						"aria-labelledby": `tab-${activeTab}`,
						tabIndex: 0,
						className: "pt-2 rounded-lg",
						children: [
							activeTab === "leaderboard" && /* @__PURE__ */ jsx(LeaderboardTable, {
								players,
								matches,
								onDataRefresh: handleRefresh,
								onChallengePlayer: handleChallenge
							}),
							activeTab === "matches" && /* @__PURE__ */ jsx(MatchHistoryView, {
								matches,
								onDataRefresh: handleRefresh
							}),
							activeTab === "predictor" && /* @__PURE__ */ jsx(MatchPredictor, {
								players,
								matches,
								initialPlayer1Id: challengePlayer?.id,
								onMatchRecorded: handleRefresh
							}),
							activeTab === "tiers" && /* @__PURE__ */ jsx(RankTiersGuide, {})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "border-t border-border/80 bg-card/40 py-8 mt-12 text-center text-xs text-muted-foreground",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 space-y-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-2 font-semibold text-foreground",
							children: [/* @__PURE__ */ jsx(Trophy, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "TopSpin Elo Table Tennis League" })]
						}),
						/* @__PURE__ */ jsx("p", { children: "Competitive Elo ranking engine powered by Netlify Database with Rocket League style tier progression." }),
						/* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-muted-foreground/70",
							children: isAdmin ? "Admin Mode enabled. Changes update live in database." : "Spectator Mode: Visit as admin to record games and add players."
						})
					]
				})
			})
		]
	});
}
//#endregion
export { HomePage as component };
