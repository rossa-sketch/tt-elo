import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "../server.js";
import { t as __exportAll } from "./server-actions-BU3tXZhG.js";
import { createContext, useContext, useEffect, useState } from "react";
import { HeadContent, Link, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { Toaster, toast } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2 has-[>svg]:px-3",
			xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
			lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
			icon: "size-9",
			"icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-8",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		"data-slot": "button",
		"data-variant": variant,
		"data-size": size,
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
//#region src/components/error-pages.tsx
function NotFoundPage() {
	return /* @__PURE__ */ jsx("main", {
		id: "main-content",
		className: "grid min-h-svh place-items-center px-6 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md space-y-6 text-center",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-muted-foreground",
					children: "This page doesn’t exist. Check the address or return to the home page."
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						children: "Go home"
					})
				})
			]
		})
	});
}
function RouteErrorPage({ reset }) {
	const router = useRouter();
	return /* @__PURE__ */ jsx("main", {
		id: "main-content",
		className: "grid min-h-svh place-items-center px-6 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md space-y-6 text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "This page couldn’t load"
				}),
				/* @__PURE__ */ jsx("p", {
					role: "alert",
					className: "text-muted-foreground",
					children: "Please try again, or return to the home page."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ jsx(Button, {
						onClick: () => {
							router.invalidate();
							reset();
						},
						children: "Try again"
					}), /* @__PURE__ */ jsx(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ jsx("a", {
							href: "/",
							children: "Go home"
						})
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		theme: "light",
		className: "toaster group",
		icons: {
			success: /* @__PURE__ */ jsx(CircleCheckIcon, { className: "size-4" }),
			info: /* @__PURE__ */ jsx(InfoIcon, { className: "size-4" }),
			warning: /* @__PURE__ */ jsx(TriangleAlertIcon, { className: "size-4" }),
			error: /* @__PURE__ */ jsx(OctagonXIcon, { className: "size-4" }),
			loading: /* @__PURE__ */ jsx(Loader2Icon, { className: "size-4 animate-spin" })
		},
		style: {
			"--normal-bg": "var(--popover)",
			"--normal-text": "var(--popover-foreground)",
			"--normal-border": "var(--border)",
			"--border-radius": "var(--radius)"
		},
		...props
	});
};
//#endregion
//#region src/components/ui/tooltip.tsx
function TooltipProvider({ delayDuration = 0, ...props }) {
	return /* @__PURE__ */ jsx(TooltipPrimitive.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration,
		...props
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.42/node_modules/@tanstack/start-server-core/dist/esm/createSsrRpc.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/lib/server-actions.ts
var getLeaderboardFn = createServerFn({ method: "GET" }).handler(createSsrRpc("06b8b0eb8890fdba8cfe68660aa7d777f293efed141940b693ac170245f76b5c"));
var verifyAdminFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("a3353162aa2432bd930728c2c90772ae4eec7a603665530dff196c3363687e99"));
var createPlayerFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("713995f1b29b51d5b7136694e6f820d9ce8999cc9f14b324f570fb415ef0a506"));
var recordMatchFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("745641068ad6aff338d176c9360217125131e7e8a699ce21b7913f33e603dfc7"));
var deleteMatchFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("bc46a6cf2b887bad0c15066ab432fb89b42928170fe60027c9a4d999c2181563"));
var updatePlayerFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("b6b0a22c8315798514a91e9753d37fa3df79971256202d984ce4de963258010c"));
var deletePlayerFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("c6f3bb7ab29535e89030ce21607a624dccd3767b18052c11022c417319214167"));
var changePasscodeFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("6c5c7ea63d733c128587d8621ec83081cde360dc4644f68d536c65cef0ad00af"));
var resetLeaderboardFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("35029817a949b51008f808927114761dd37335d844e1043af9afab3af2931a0e"));
//#endregion
//#region src/lib/admin-context.tsx
var AdminContext = createContext({
	isAdmin: false,
	adminPasscode: "",
	isVerifying: false,
	login: async () => false,
	logout: () => {}
});
var STORAGE_KEY = "topspin_tt_admin_pass";
function AdminProvider({ children }) {
	const [isAdmin, setIsAdmin] = useState(false);
	const [adminPasscode, setAdminPasscode] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			setAdminPasscode(saved);
			verifyAdminFn({ data: { passcode: saved } }).then((res) => {
				if (res.isValid) setIsAdmin(true);
				else {
					localStorage.removeItem(STORAGE_KEY);
					setIsAdmin(false);
					setAdminPasscode("");
				}
			}).catch(() => {
				setIsAdmin(true);
			});
		}
	}, []);
	const login = async (passcode) => {
		setIsVerifying(true);
		try {
			if ((await verifyAdminFn({ data: { passcode } })).isValid) {
				setIsAdmin(true);
				setAdminPasscode(passcode);
				localStorage.setItem(STORAGE_KEY, passcode);
				toast.success("Admin access granted", { description: "You can now record matches and manage players." });
				return true;
			} else {
				toast.error("Access Denied", { description: "Incorrect admin passcode. Try default \"spinmaster\"." });
				return false;
			}
		} catch (err) {
			toast.error("Authentication error", { description: err?.message || "Could not verify admin passcode" });
			return false;
		} finally {
			setIsVerifying(false);
		}
	};
	const logout = () => {
		setIsAdmin(false);
		setAdminPasscode("");
		localStorage.removeItem(STORAGE_KEY);
		toast.info("Signed out of Admin Mode", { description: "The app is now in view-only spectator mode." });
	};
	return /* @__PURE__ */ jsx(AdminContext.Provider, {
		value: {
			isAdmin,
			adminPasscode,
			isVerifying,
			login,
			logout
		},
		children
	});
}
function useAdmin() {
	return useContext(AdminContext);
}
//#endregion
//#region src/routes/__root.tsx
var siteName = "TopSpin Elo | Table Tennis Leaderboard";
var siteDescription = "Real-time competitive table tennis Elo leaderboard and match tracking system with Rocket League style rank tiers, upset calculation, and admin controls.";
var Route$1 = createRootRoute({
	head: () => ({ meta: [
		{ charSet: "utf-8" },
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1"
		},
		{ title: siteName },
		{
			name: "description",
			content: siteDescription
		},
		{
			property: "og:title",
			content: siteName
		},
		{
			property: "og:description",
			content: siteDescription
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
	shellComponent: RootDocument,
	notFoundComponent: NotFoundPage
});
function RootDocument({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", {
			className: "min-h-screen bg-background text-foreground antialiased selection:bg-emerald-500/30 selection:text-emerald-200",
			children: [
				/* @__PURE__ */ jsx("a", {
					href: "#main-content",
					className: "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg",
					children: "Skip to main content"
				}),
				/* @__PURE__ */ jsxs(AdminProvider, { children: [/* @__PURE__ */ jsx(TooltipProvider, { children }), /* @__PURE__ */ jsx(Toaster$1, {
					richColors: true,
					position: "top-right"
				})] }),
				/* @__PURE__ */ jsx(Scripts, {})
			]
		})]
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-DIJnh3Nu.js");
var Route = createFileRoute("/")({
	loader: async () => {
		return await getLeaderboardFn();
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var rootRouteChildren = { IndexRoute: Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	return createRouter({
		routeTree,
		defaultErrorComponent: RouteErrorPage,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { createPlayerFn as a, recordMatchFn as c, Button as d, cn as f, getRouter, changePasscodeFn as i, resetLeaderboardFn as l, Route as n, deleteMatchFn as o, useAdmin as r, deletePlayerFn as s, router_exports as t, updatePlayerFn as u };
