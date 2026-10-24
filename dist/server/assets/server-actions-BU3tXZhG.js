import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "../server.js";
import { a as updateStreak, n as calculateMatchElo, r as getRankTier } from "./elo-bNM48V2Z.js";
import { drizzle } from "drizzle-orm/netlify-db";
import { drizzle as drizzle$1 } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { readFileSync } from "node:fs";
import { desc, eq } from "drizzle-orm";
//#region \0rolldown/runtime.js
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
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.42/node_modules/@tanstack/start-server-core/dist/esm/createServerRpc.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region db/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	appSettings: () => appSettings,
	matches: () => matches,
	players: () => players
});
var players = pgTable("players", {
	id: serial().primaryKey(),
	name: text().notNull().unique(),
	elo: integer().notNull().default(1200),
	matchesPlayed: integer("matches_played").notNull().default(0),
	wins: integer().notNull().default(0),
	losses: integer().notNull().default(0),
	currentStreak: integer("current_streak").notNull().default(0),
	highestElo: integer("highest_elo").notNull().default(1200),
	lowestElo: integer("lowest_elo").notNull().default(1200),
	avatarUrl: text("avatar_url"),
	isActive: integer("is_active").notNull().default(1),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var matches = pgTable("matches", {
	id: serial().primaryKey(),
	player1Id: integer("player1_id").notNull().references(() => players.id, { onDelete: "cascade" }),
	player2Id: integer("player2_id").notNull().references(() => players.id, { onDelete: "cascade" }),
	winnerId: integer("winner_id").notNull().references(() => players.id, { onDelete: "cascade" }),
	player1EloBefore: integer("player1_elo_before").notNull(),
	player1EloAfter: integer("player1_elo_after").notNull(),
	player2EloBefore: integer("player2_elo_before").notNull(),
	player2EloAfter: integer("player2_elo_after").notNull(),
	eloDelta: integer("elo_delta").notNull(),
	score: text("score"),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var appSettings = pgTable("app_settings", {
	key: text().primaryKey(),
	value: text().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
//#endregion
//#region db/connection.ts
var SSL_URL_PARAMS = /* @__PURE__ */ new Set([
	"ssl",
	"sslmode",
	"uselibpqcompat",
	"channel_binding",
	"sslrootcert",
	"sslcert",
	"sslkey",
	"sslpassword",
	"sslcrl",
	"sslcrldir",
	"sslnegotiation",
	"ssl_min_protocol_version",
	"ssl_max_protocol_version"
]);
var URL_SOURCES = [
	"DATABASE_URL",
	"NETLIFY_DB_URL",
	"NETLIFY_DATABASE_URL",
	"TEMP_NETLIFY_DATABASE_URL"
];
var LOCAL_HOSTS = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"::1",
	"0.0.0.0",
	"host.docker.internal"
]);
function parseUrl(value) {
	if (!value) return void 0;
	if (value.startsWith("/")) return void 0;
	try {
		return new URL(value);
	} catch {
		return;
	}
}
function normalizeSslMode(value) {
	if (!value) return void 0;
	switch (value.trim().toLowerCase()) {
		case "disable":
		case "disabled":
		case "off":
		case "false":
		case "0": return "disable";
		case "allow": return "allow";
		case "prefer": return "prefer";
		case "require":
		case "required":
		case "on":
		case "true":
		case "1": return "require";
		case "verify-ca":
		case "verify_ca": return "verify-ca";
		case "verify-full":
		case "verify_full": return "verify-full";
		case "no-verify":
		case "no_verify":
		case "noverify": return "no-verify";
		default: return;
	}
}
function isLocalHost(url) {
	return LOCAL_HOSTS.has(url.hostname.toLowerCase());
}
function resolveSslMode(url, env) {
	const explicitMode = normalizeSslMode(env.DATABASE_SSL_MODE);
	if (explicitMode) return explicitMode;
	const sslFlag = normalizeSslMode(env.DATABASE_SSL);
	if (sslFlag) return sslFlag;
	const urlMode = normalizeSslMode(url?.searchParams.get("sslmode"));
	if (urlMode) return urlMode;
	const pgMode = normalizeSslMode(env.PGSSLMODE);
	if (pgMode) return pgMode;
	if (!url || isLocalHost(url)) return "disable";
	return "require";
}
function readPemValue(value) {
	if (!value) return void 0;
	if (value.includes("-----BEGIN ")) return value;
	try {
		return readFileSync(value, "utf8");
	} catch {
		return value;
	}
}
function buildSslConfig(url, env, mode) {
	if (mode === "disable") return false;
	const config = { rejectUnauthorized: mode === "verify-ca" || mode === "verify-full" };
	const ca = readPemValue(env.DATABASE_SSL_CA ?? env.PGSSLROOTCERT ?? url?.searchParams.get("sslrootcert"));
	const cert = readPemValue(env.DATABASE_SSL_CERT ?? env.PGSSLCERT ?? url?.searchParams.get("sslcert"));
	const key = readPemValue(env.DATABASE_SSL_KEY ?? env.PGSSLKEY ?? url?.searchParams.get("sslkey"));
	if (ca) config.ca = ca;
	if (cert) config.cert = cert;
	if (key) config.key = key;
	if (mode === "verify-ca") config.checkServerIdentity = () => void 0;
	return config;
}
function stripSslParams(rawUrl, url) {
	if (!url) return rawUrl;
	const cleaned = new URL(url.toString());
	for (const key of [...cleaned.searchParams.keys()]) if (SSL_URL_PARAMS.has(key.toLowerCase())) cleaned.searchParams.delete(key);
	return cleaned.toString();
}
function canonicalUrlSslMode(mode) {
	switch (mode) {
		case "disable": return "disable";
		case "verify-ca": return "verify-ca";
		case "verify-full": return "verify-full";
		case "allow":
		case "prefer":
		case "require":
		case "no-verify": return "no-verify";
	}
}
function addSslParams(connectionString, url, env, mode) {
	if (!connectionString) return connectionString;
	const parsed = parseUrl(connectionString);
	if (!parsed) return connectionString;
	parsed.searchParams.set("sslmode", canonicalUrlSslMode(mode));
	if (mode === "verify-ca" || mode === "verify-full") {
		const rootCert = env.DATABASE_SSL_CA ?? env.PGSSLROOTCERT ?? url?.searchParams.get("sslrootcert");
		if (rootCert && !rootCert.includes("-----BEGIN ")) parsed.searchParams.set("sslrootcert", rootCert);
	}
	return parsed.toString();
}
function resolveConnector(source, env) {
	const requested = (env.DB_CONNECTOR ?? env.DATABASE_CONNECTOR ?? "").trim().toLowerCase();
	if ([
		"netlify",
		"netlify-db",
		"netlify_db",
		"serverless",
		"neon"
	].includes(requested)) return "netlify";
	if ([
		"pg",
		"postgres",
		"postgresql",
		"node-postgres",
		"node_postgres",
		"tcp"
	].includes(requested)) return "pg";
	if ((env.NETLIFY_DB_DRIVER ?? "").toLowerCase() === "serverless") return "netlify";
	if (source === "NETLIFY_DB_URL" && !env.DATABASE_URL) return "netlify";
	return "pg";
}
function resolveDatabaseConnection(rawUrl, options = {}) {
	const env = options.env ?? process.env;
	const source = options.source ?? "DATABASE_URL";
	if (!rawUrl) return {
		configured: false,
		source,
		connector: "pg",
		rawUrl: "",
		connectionString: "",
		urlWithSslParams: "",
		sslMode: "disable",
		ssl: false,
		host: "",
		database: ""
	};
	const url = parseUrl(rawUrl);
	const sslMode = resolveSslMode(url, env);
	const connectionString = stripSslParams(rawUrl, url);
	const ssl = buildSslConfig(url, env, sslMode);
	return {
		configured: true,
		source,
		connector: resolveConnector(source, env),
		rawUrl,
		connectionString,
		urlWithSslParams: addSslParams(connectionString, url, env, sslMode),
		sslMode,
		ssl,
		host: url?.hostname ?? "",
		database: url?.pathname.replace(/^\//, "") ?? ""
	};
}
function getDatabaseConnectionSettings(env = process.env) {
	for (const source of URL_SOURCES) {
		const rawUrl = env[source]?.trim();
		if (rawUrl) return resolveDatabaseConnection(rawUrl, {
			source,
			env
		});
	}
	return resolveDatabaseConnection("", {
		source: "none",
		env
	});
}
/** Password-free description suitable for logs. */
function describeDatabaseConnection(settings) {
	if (!settings.configured) return "no connection string configured (using in-memory fallback until one is provided)";
	const target = settings.host ? `${settings.host}${settings.database ? `/${settings.database}` : ""}` : "local socket";
	return `${settings.connector} connector -> ${target} (ssl=${settings.sslMode}, source=${settings.source})`;
}
//#endregion
//#region db/index.ts
function intFromEnv(env, name, fallback) {
	const raw = env[name];
	if (!raw) return fallback;
	const value = Number.parseInt(raw, 10);
	return Number.isFinite(value) && value >= 0 ? value : fallback;
}
function createNodePostgresDatabase(settings) {
	const pool = new Pool({
		connectionString: settings.connectionString || void 0,
		ssl: settings.ssl,
		application_name: "topspin-elo",
		max: intFromEnv(process.env, "DATABASE_POOL_MAX", 10),
		idleTimeoutMillis: intFromEnv(process.env, "DATABASE_IDLE_TIMEOUT_MS", 3e4),
		connectionTimeoutMillis: intFromEnv(process.env, "DATABASE_CONNECT_TIMEOUT_MS", 1e4)
	});
	return drizzle$1({
		client: pool,
		schema: schema_exports
	});
}
function createNetlifyDatabase(settings) {
	return drizzle({
		connection: settings.urlWithSslParams,
		schema: schema_exports
	});
}
function createDatabase() {
	const settings = getDatabaseConnectionSettings();
	console.log("--- Database Configuration ---");
	console.log(describeDatabaseConnection(settings));
	console.log("------------------------------");
	if (!settings.configured) {
		console.warn("[db] No DATABASE_URL or NETLIFY_DB_URL configured; queries will use the in-memory fallback.");
		return createNodePostgresDatabase(settings);
	}
	return settings.connector === "netlify" ? createNetlifyDatabase(settings) : createNodePostgresDatabase(settings);
}
var db = createDatabase();
//#endregion
//#region src/lib/server-db.ts
var DEFAULT_ADMIN_PASSCODE = process.env.ADMIN_PASSWORD || "spinmaster";
var SEED_PLAYERS = [
	{
		name: "Marcus 'Smash' Vance",
		elo: 1650,
		matchesPlayed: 28,
		wins: 20,
		losses: 8,
		currentStreak: 4,
		highestElo: 1685,
		lowestElo: 1200
	},
	{
		name: "Elena 'Backhand' Chen",
		elo: 1540,
		matchesPlayed: 24,
		wins: 16,
		losses: 8,
		currentStreak: 2,
		highestElo: 1570,
		lowestElo: 1200
	},
	{
		name: "Leo 'Spin' Rossi",
		elo: 1410,
		matchesPlayed: 22,
		wins: 13,
		losses: 9,
		currentStreak: -1,
		highestElo: 1460,
		lowestElo: 1200
	},
	{
		name: "Maya 'Topspin' Patel",
		elo: 1280,
		matchesPlayed: 18,
		wins: 10,
		losses: 8,
		currentStreak: 1,
		highestElo: 1320,
		lowestElo: 1180
	},
	{
		name: "Dave 'Chopper' Miller",
		elo: 1160,
		matchesPlayed: 15,
		wins: 6,
		losses: 9,
		currentStreak: -2,
		highestElo: 1240,
		lowestElo: 1140
	},
	{
		name: "Sam 'Rookie' Torres",
		elo: 1020,
		matchesPlayed: 12,
		wins: 3,
		losses: 9,
		currentStreak: -3,
		highestElo: 1200,
		lowestElo: 1e3
	}
];
var memoryStore = {
	players: SEED_PLAYERS.map((p, idx) => ({
		id: idx + 1,
		...p,
		avatarUrl: null,
		isActive: 1,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - (7 - idx) * 864e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	})),
	matches: [
		{
			id: 1,
			player1Id: 1,
			player2Id: 2,
			winnerId: 1,
			player1EloBefore: 1634,
			player1EloAfter: 1650,
			player2EloBefore: 1556,
			player2EloAfter: 1540,
			eloDelta: 16,
			score: "11-8, 9-11, 11-7",
			notes: "Finals warmup match",
			createdAt: (/* @__PURE__ */ new Date(Date.now() - 72e5)).toISOString()
		},
		{
			id: 2,
			player1Id: 3,
			player2Id: 4,
			winnerId: 4,
			player1EloBefore: 1432,
			player1EloAfter: 1410,
			player2EloBefore: 1258,
			player2EloAfter: 1280,
			eloDelta: 22,
			score: "11-6, 12-10",
			notes: "Upset victory for Maya (+22 Elo)",
			createdAt: (/* @__PURE__ */ new Date(Date.now() - 18e6)).toISOString()
		},
		{
			id: 3,
			player1Id: 5,
			player2Id: 6,
			winnerId: 5,
			player1EloBefore: 1144,
			player1EloAfter: 1160,
			player2EloBefore: 1036,
			player2EloAfter: 1020,
			eloDelta: 16,
			score: "11-9, 11-8",
			notes: "Regular table rotation",
			createdAt: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString()
		}
	],
	adminPasscode: DEFAULT_ADMIN_PASSCODE,
	nextPlayerId: 7,
	nextMatchId: 4
};
async function verifyAdminPasscode(passcode) {
	if (!passcode) return false;
	try {
		const settings = await db.select().from(appSettings).where(eq(appSettings.key, "admin_passcode")).limit(1);
		if (settings.length > 0 && settings[0].value) return settings[0].value.trim() === passcode.trim();
	} catch (err) {}
	return passcode.trim() === memoryStore.adminPasscode.trim() || passcode.trim() === DEFAULT_ADMIN_PASSCODE;
}
async function setAdminPasscode(currentPasscode, newPasscode) {
	if (!await verifyAdminPasscode(currentPasscode)) throw new Error("Unauthorized: Current admin passcode is incorrect");
	if (!newPasscode || newPasscode.trim().length < 4) throw new Error("New passcode must be at least 4 characters long");
	const cleanPasscode = newPasscode.trim();
	try {
		if ((await db.select().from(appSettings).where(eq(appSettings.key, "admin_passcode")).limit(1)).length > 0) await db.update(appSettings).set({
			value: cleanPasscode,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(appSettings.key, "admin_passcode"));
		else await db.insert(appSettings).values({
			key: "admin_passcode",
			value: cleanPasscode
		});
	} catch (err) {}
	memoryStore.adminPasscode = cleanPasscode;
	return {
		success: true,
		message: "Admin passcode updated successfully"
	};
}
async function getLeaderboardData() {
	let dbPlayers = [];
	let dbMatches = [];
	try {
		dbPlayers = await db.select().from(players).where(eq(players.isActive, 1)).orderBy(desc(players.elo));
		if (dbPlayers.length === 0) {
			for (const p of SEED_PLAYERS) await db.insert(players).values({
				name: p.name,
				elo: p.elo,
				matchesPlayed: p.matchesPlayed,
				wins: p.wins,
				losses: p.losses,
				currentStreak: p.currentStreak,
				highestElo: p.highestElo,
				lowestElo: p.lowestElo,
				isActive: 1
			});
			dbPlayers = await db.select().from(players).where(eq(players.isActive, 1)).orderBy(desc(players.elo));
		}
		dbMatches = await db.select().from(matches).orderBy(desc(matches.createdAt)).limit(50);
	} catch (err) {
		console.error("--- DATABASE QUERY ERROR ---");
		console.error(err);
		dbPlayers = [...memoryStore.players].filter((p) => p.isActive === 1);
		dbPlayers.sort((a, b) => b.elo - a.elo);
		dbMatches = [...memoryStore.matches].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}
	const playerMap = /* @__PURE__ */ new Map();
	dbPlayers.forEach((p) => playerMap.set(p.id, p));
	return {
		players: dbPlayers.map((p, index) => {
			const total = p.matchesPlayed || 0;
			const winRate = total > 0 ? Math.round(p.wins / total * 100) : 0;
			return {
				id: p.id,
				name: p.name,
				elo: p.elo,
				matchesPlayed: p.matchesPlayed,
				wins: p.wins,
				losses: p.losses,
				currentStreak: p.currentStreak,
				highestElo: p.highestElo,
				lowestElo: p.lowestElo,
				avatarUrl: p.avatarUrl,
				isActive: p.isActive,
				createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
				updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : String(p.updatedAt),
				rank: index + 1,
				winRate,
				tier: getRankTier(p.elo)
			};
		}),
		matches: dbMatches.map((m) => {
			const p1 = playerMap.get(m.player1Id);
			const p2 = playerMap.get(m.player2Id);
			const winner = playerMap.get(m.winnerId);
			return {
				id: m.id,
				player1Id: m.player1Id,
				player2Id: m.player2Id,
				winnerId: m.winnerId,
				player1EloBefore: m.player1EloBefore,
				player1EloAfter: m.player1EloAfter,
				player2EloBefore: m.player2EloBefore,
				player2EloAfter: m.player2EloAfter,
				eloDelta: m.eloDelta,
				score: m.score,
				notes: m.notes,
				createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
				player1Name: p1 ? p1.name : `Player #${m.player1Id}`,
				player2Name: p2 ? p2.name : `Player #${m.player2Id}`,
				winnerName: winner ? winner.name : `Player #${m.winnerId}`
			};
		})
	};
}
async function createPlayer(payload) {
	if (!await verifyAdminPasscode(payload.adminPasscode)) throw new Error("Unauthorized: Only an admin can add players.");
	const name = payload.name?.trim();
	if (!name || name.length < 2) throw new Error("Player name must be at least 2 characters long");
	const startingElo = Math.max(100, Math.min(3e3, Number(payload.startingElo) || 1200));
	try {
		const [inserted] = await db.insert(players).values({
			name,
			elo: startingElo,
			highestElo: startingElo,
			lowestElo: startingElo,
			matchesPlayed: 0,
			wins: 0,
			losses: 0,
			currentStreak: 0,
			isActive: 1
		}).returning();
		const tier = getRankTier(inserted.elo);
		return {
			...inserted,
			rank: 999,
			winRate: 0,
			tier,
			createdAt: inserted.createdAt.toISOString(),
			updatedAt: inserted.updatedAt.toISOString()
		};
	} catch (err) {
		console.error("Error in createPlayer:", err);
		if (err?.code === "23505") throw new Error(`A player named "${name}" already exists on the leaderboard`);
		if (memoryStore.players.find((p) => p.name.toLowerCase() === name.toLowerCase() && p.isActive === 1)) throw new Error(`A player named "${name}" already exists on the leaderboard`);
		const newPlayer = {
			id: memoryStore.nextPlayerId++,
			name,
			elo: startingElo,
			matchesPlayed: 0,
			wins: 0,
			losses: 0,
			currentStreak: 0,
			highestElo: startingElo,
			lowestElo: startingElo,
			avatarUrl: null,
			isActive: 1,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		memoryStore.players.push(newPlayer);
		return {
			...newPlayer,
			rank: memoryStore.players.length,
			winRate: 0,
			tier: getRankTier(newPlayer.elo)
		};
	}
}
async function recordMatch(payload) {
	if (!await verifyAdminPasscode(payload.adminPasscode)) throw new Error("Unauthorized: Only an admin can record match results.");
	const { player1Id, player2Id, winnerId, score, notes } = payload;
	if (player1Id === player2Id) throw new Error("A player cannot play against themselves");
	if (winnerId !== player1Id && winnerId !== player2Id) throw new Error("Winner must be either Player 1 or Player 2");
	try {
		const [p1] = await db.select().from(players).where(eq(players.id, player1Id)).limit(1);
		const [p2] = await db.select().from(players).where(eq(players.id, player2Id)).limit(1);
		if (!p1 || !p2) throw new Error("One or both selected players do not exist");
		const p1IsWinner = winnerId === player1Id;
		const outcome = p1IsWinner ? calculateMatchElo(p1.elo, p2.elo, p1.matchesPlayed, p2.matchesPlayed) : calculateMatchElo(p2.elo, p1.elo, p2.matchesPlayed, p1.matchesPlayed);
		const p1Delta = p1IsWinner ? outcome.winnerDelta : outcome.loserDelta;
		const p2Delta = p1IsWinner ? outcome.loserDelta : outcome.winnerDelta;
		const p1EloAfter = p1.elo + p1Delta;
		const p2EloAfter = p2.elo + p2Delta;
		await db.update(players).set({
			elo: p1EloAfter,
			matchesPlayed: p1.matchesPlayed + 1,
			wins: p1IsWinner ? p1.wins + 1 : p1.wins,
			losses: p1IsWinner ? p1.losses : p1.losses + 1,
			currentStreak: updateStreak(p1.currentStreak, p1IsWinner),
			highestElo: Math.max(p1.highestElo, p1EloAfter),
			lowestElo: Math.min(p1.lowestElo, p1EloAfter),
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(players.id, player1Id));
		await db.update(players).set({
			elo: p2EloAfter,
			matchesPlayed: p2.matchesPlayed + 1,
			wins: !p1IsWinner ? p2.wins + 1 : p2.wins,
			losses: !p1IsWinner ? p2.losses : p2.losses + 1,
			currentStreak: updateStreak(p2.currentStreak, !p1IsWinner),
			highestElo: Math.max(p2.highestElo, p2EloAfter),
			lowestElo: Math.min(p2.lowestElo, p2EloAfter),
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(players.id, player2Id));
		const [insertedMatch] = await db.insert(matches).values({
			player1Id,
			player2Id,
			winnerId,
			player1EloBefore: p1.elo,
			player1EloAfter: p1EloAfter,
			player2EloBefore: p2.elo,
			player2EloAfter: p2EloAfter,
			eloDelta: outcome.winnerDelta,
			score: score?.trim() || null,
			notes: notes?.trim() || null
		}).returning();
		return {
			success: true,
			match: {
				...insertedMatch,
				createdAt: insertedMatch.createdAt.toISOString(),
				player1Name: p1.name,
				player2Name: p2.name,
				winnerName: p1IsWinner ? p1.name : p2.name
			}
		};
	} catch (err) {
		console.error("Error in recordMatch:", err);
		const p1 = memoryStore.players.find((p) => p.id === player1Id);
		const p2 = memoryStore.players.find((p) => p.id === player2Id);
		if (!p1 || !p2) throw new Error("One or both selected players do not exist");
		const p1IsWinner = winnerId === player1Id;
		const outcome = p1IsWinner ? calculateMatchElo(p1.elo, p2.elo, p1.matchesPlayed, p2.matchesPlayed) : calculateMatchElo(p2.elo, p1.elo, p2.matchesPlayed, p1.matchesPlayed);
		const p1Delta = p1IsWinner ? outcome.winnerDelta : outcome.loserDelta;
		const p2Delta = p1IsWinner ? outcome.loserDelta : outcome.winnerDelta;
		const p1EloAfter = p1.elo + p1Delta;
		const p2EloAfter = p2.elo + p2Delta;
		p1.elo = p1EloAfter;
		p1.matchesPlayed += 1;
		if (p1IsWinner) {
			p1.wins += 1;
			p1.currentStreak = updateStreak(p1.currentStreak, true);
		} else {
			p1.losses += 1;
			p1.currentStreak = updateStreak(p1.currentStreak, false);
		}
		p1.highestElo = Math.max(p1.highestElo, p1EloAfter);
		p1.lowestElo = Math.min(p1.lowestElo, p1EloAfter);
		p1.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
		p2.elo = p2EloAfter;
		p2.matchesPlayed += 1;
		if (!p1IsWinner) {
			p2.wins += 1;
			p2.currentStreak = updateStreak(p2.currentStreak, true);
		} else {
			p2.losses += 1;
			p2.currentStreak = updateStreak(p2.currentStreak, false);
		}
		p2.highestElo = Math.max(p2.highestElo, p2EloAfter);
		p2.lowestElo = Math.min(p2.lowestElo, p2EloAfter);
		p2.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
		const newMatch = {
			id: memoryStore.nextMatchId++,
			player1Id,
			player2Id,
			winnerId,
			player1EloBefore: p1.elo - p1Delta,
			player1EloAfter: p1EloAfter,
			player2EloBefore: p2.elo - p2Delta,
			player2EloAfter: p2EloAfter,
			eloDelta: outcome.winnerDelta,
			score: score?.trim() || null,
			notes: notes?.trim() || null,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			player1Name: p1.name,
			player2Name: p2.name,
			winnerName: p1IsWinner ? p1.name : p2.name
		};
		memoryStore.matches.unshift(newMatch);
		return {
			success: true,
			match: newMatch
		};
	}
}
async function deleteMatch(matchId, adminPasscode) {
	if (!await verifyAdminPasscode(adminPasscode)) throw new Error("Unauthorized: Only an admin can revert matches.");
	try {
		const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
		if (!match) throw new Error("Match not found");
		const [p1] = await db.select().from(players).where(eq(players.id, match.player1Id)).limit(1);
		if (p1) {
			const p1WasWinner = match.winnerId === match.player1Id;
			await db.update(players).set({
				elo: match.player1EloBefore,
				matchesPlayed: Math.max(0, p1.matchesPlayed - 1),
				wins: p1WasWinner ? Math.max(0, p1.wins - 1) : p1.wins,
				losses: !p1WasWinner ? Math.max(0, p1.losses - 1) : p1.losses,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(players.id, match.player1Id));
		}
		const [p2] = await db.select().from(players).where(eq(players.id, match.player2Id)).limit(1);
		if (p2) {
			const p2WasWinner = match.winnerId === match.player2Id;
			await db.update(players).set({
				elo: match.player2EloBefore,
				matchesPlayed: Math.max(0, p2.matchesPlayed - 1),
				wins: p2WasWinner ? Math.max(0, p2.wins - 1) : p2.wins,
				losses: !p2WasWinner ? Math.max(0, p2.losses - 1) : p2.losses,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(players.id, match.player2Id));
		}
		await db.delete(matches).where(eq(matches.id, matchId));
	} catch (err) {
		const matchIdx = memoryStore.matches.findIndex((m) => m.id === matchId);
		if (matchIdx !== -1) {
			const match = memoryStore.matches[matchIdx];
			const p1 = memoryStore.players.find((p) => p.id === match.player1Id);
			const p2 = memoryStore.players.find((p) => p.id === match.player2Id);
			if (p1) {
				const p1WasWinner = match.winnerId === match.player1Id;
				p1.elo = match.player1EloBefore;
				p1.matchesPlayed = Math.max(0, p1.matchesPlayed - 1);
				if (p1WasWinner) p1.wins = Math.max(0, p1.wins - 1);
				else p1.losses = Math.max(0, p1.losses - 1);
			}
			if (p2) {
				const p2WasWinner = match.winnerId === match.player2Id;
				p2.elo = match.player2EloBefore;
				p2.matchesPlayed = Math.max(0, p2.matchesPlayed - 1);
				if (p2WasWinner) p2.wins = Math.max(0, p2.wins - 1);
				else p2.losses = Math.max(0, p2.losses - 1);
			}
			memoryStore.matches.splice(matchIdx, 1);
		}
	}
	return {
		success: true,
		message: "Match successfully deleted and player ratings restored"
	};
}
async function updatePlayer(payload) {
	if (!await verifyAdminPasscode(payload.adminPasscode)) throw new Error("Unauthorized: Only an admin can edit players.");
	const name = payload.name?.trim();
	if (!name || name.length < 2) throw new Error("Player name must be at least 2 characters long");
	try {
		await db.update(players).set({
			name,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(players.id, payload.id));
	} catch (err) {
		const memPlayer = memoryStore.players.find((p) => p.id === payload.id);
		if (memPlayer) {
			memPlayer.name = name;
			memPlayer.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
		}
	}
	return {
		success: true,
		message: "Player updated successfully"
	};
}
async function deletePlayer(id, adminPasscode) {
	if (!await verifyAdminPasscode(adminPasscode)) throw new Error("Unauthorized: Only an admin can remove players.");
	try {
		await db.update(players).set({
			isActive: 0,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(players.id, id));
	} catch (err) {
		const memPlayer = memoryStore.players.find((p) => p.id === id);
		if (memPlayer) memPlayer.isActive = 0;
	}
	return {
		success: true,
		message: "Player removed from leaderboard"
	};
}
async function resetLeaderboardToDefaults(adminPasscode) {
	if (!await verifyAdminPasscode(adminPasscode)) throw new Error("Unauthorized: Only an admin can reset the leaderboard.");
	try {
		await db.delete(matches);
		await db.delete(players);
		for (const p of SEED_PLAYERS) await db.insert(players).values({
			name: p.name,
			elo: p.elo,
			matchesPlayed: p.matchesPlayed,
			wins: p.wins,
			losses: p.losses,
			currentStreak: p.currentStreak,
			highestElo: p.highestElo,
			lowestElo: p.lowestElo,
			isActive: 1
		});
	} catch (err) {
		memoryStore.players = SEED_PLAYERS.map((p, idx) => ({
			id: idx + 1,
			...p,
			avatarUrl: null,
			isActive: 1,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}));
		memoryStore.matches = [];
		memoryStore.nextPlayerId = 7;
		memoryStore.nextMatchId = 1;
	}
	return {
		success: true,
		message: "Leaderboard reset to initial seed state"
	};
}
//#endregion
//#region src/lib/server-actions.ts?tss-serverfn-split
var getLeaderboardFn_createServerFn_handler = createServerRpc({
	id: "06b8b0eb8890fdba8cfe68660aa7d777f293efed141940b693ac170245f76b5c",
	name: "getLeaderboardFn",
	filename: "src/lib/server-actions.ts"
}, (opts) => getLeaderboardFn.__executeServer(opts));
var getLeaderboardFn = createServerFn({ method: "GET" }).handler(getLeaderboardFn_createServerFn_handler, async () => {
	return await getLeaderboardData();
});
var verifyAdminFn_createServerFn_handler = createServerRpc({
	id: "a3353162aa2432bd930728c2c90772ae4eec7a603665530dff196c3363687e99",
	name: "verifyAdminFn",
	filename: "src/lib/server-actions.ts"
}, (opts) => verifyAdminFn.__executeServer(opts));
var verifyAdminFn = createServerFn({ method: "POST" }).validator((data) => data).handler(verifyAdminFn_createServerFn_handler, async ({ data }) => {
	return { isValid: await verifyAdminPasscode(data.passcode) };
});
var createPlayerFn_createServerFn_handler = createServerRpc({
	id: "713995f1b29b51d5b7136694e6f820d9ce8999cc9f14b324f570fb415ef0a506",
	name: "createPlayerFn",
	filename: "src/lib/server-actions.ts"
}, (opts) => createPlayerFn.__executeServer(opts));
var createPlayerFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createPlayerFn_createServerFn_handler, async ({ data }) => {
	return await createPlayer(data);
});
var recordMatchFn_createServerFn_handler = createServerRpc({
	id: "745641068ad6aff338d176c9360217125131e7e8a699ce21b7913f33e603dfc7",
	name: "recordMatchFn",
	filename: "src/lib/server-actions.ts"
}, (opts) => recordMatchFn.__executeServer(opts));
var recordMatchFn = createServerFn({ method: "POST" }).validator((data) => data).handler(recordMatchFn_createServerFn_handler, async ({ data }) => {
	return await recordMatch(data);
});
var deleteMatchFn_createServerFn_handler = createServerRpc({
	id: "bc46a6cf2b887bad0c15066ab432fb89b42928170fe60027c9a4d999c2181563",
	name: "deleteMatchFn",
	filename: "src/lib/server-actions.ts"
}, (opts) => deleteMatchFn.__executeServer(opts));
var deleteMatchFn = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteMatchFn_createServerFn_handler, async ({ data }) => {
	return await deleteMatch(data.id, data.adminPasscode);
});
var updatePlayerFn_createServerFn_handler = createServerRpc({
	id: "b6b0a22c8315798514a91e9753d37fa3df79971256202d984ce4de963258010c",
	name: "updatePlayerFn",
	filename: "src/lib/server-actions.ts"
}, (opts) => updatePlayerFn.__executeServer(opts));
var updatePlayerFn = createServerFn({ method: "POST" }).validator((data) => data).handler(updatePlayerFn_createServerFn_handler, async ({ data }) => {
	return await updatePlayer(data);
});
var deletePlayerFn_createServerFn_handler = createServerRpc({
	id: "c6f3bb7ab29535e89030ce21607a624dccd3767b18052c11022c417319214167",
	name: "deletePlayerFn",
	filename: "src/lib/server-actions.ts"
}, (opts) => deletePlayerFn.__executeServer(opts));
var deletePlayerFn = createServerFn({ method: "POST" }).validator((data) => data).handler(deletePlayerFn_createServerFn_handler, async ({ data }) => {
	return await deletePlayer(data.id, data.adminPasscode);
});
var changePasscodeFn_createServerFn_handler = createServerRpc({
	id: "6c5c7ea63d733c128587d8621ec83081cde360dc4644f68d536c65cef0ad00af",
	name: "changePasscodeFn",
	filename: "src/lib/server-actions.ts"
}, (opts) => changePasscodeFn.__executeServer(opts));
var changePasscodeFn = createServerFn({ method: "POST" }).validator((data) => data).handler(changePasscodeFn_createServerFn_handler, async ({ data }) => {
	return await setAdminPasscode(data.currentPasscode, data.newPasscode);
});
var resetLeaderboardFn_createServerFn_handler = createServerRpc({
	id: "35029817a949b51008f808927114761dd37335d844e1043af9afab3af2931a0e",
	name: "resetLeaderboardFn",
	filename: "src/lib/server-actions.ts"
}, (opts) => resetLeaderboardFn.__executeServer(opts));
var resetLeaderboardFn = createServerFn({ method: "POST" }).validator((data) => data).handler(resetLeaderboardFn_createServerFn_handler, async ({ data }) => {
	return await resetLeaderboardToDefaults(data.adminPasscode);
});
//#endregion
export { changePasscodeFn_createServerFn_handler, createPlayerFn_createServerFn_handler, deleteMatchFn_createServerFn_handler, deletePlayerFn_createServerFn_handler, getLeaderboardFn_createServerFn_handler, recordMatchFn_createServerFn_handler, resetLeaderboardFn_createServerFn_handler, __exportAll as t, updatePlayerFn_createServerFn_handler, verifyAdminFn_createServerFn_handler };
