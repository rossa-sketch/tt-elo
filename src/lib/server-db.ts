import { db } from '../../db/index.js'
import { players, matches, appSettings } from '../../db/schema.js'
import { eq, desc, sql } from 'drizzle-orm'
import { calculateMatchElo, getRankTier, updateStreak } from './elo.js'
import type {
  PlayerLeaderboardEntry,
  MatchRecord,
  RecordMatchPayload,
  CreatePlayerPayload,
  EditPlayerPayload,
} from './types.js'

const DEFAULT_ADMIN_PASSCODE = process.env.ADMIN_PASSWORD || 'spinmaster'

// Seed players with diverse starting ratings illustrating competitive tiers
const SEED_PLAYERS = [
  {
    name: "Marcus 'Smash' Vance",
    elo: 1650,
    matchesPlayed: 28,
    wins: 20,
    losses: 8,
    currentStreak: 4,
    highestElo: 1685,
    lowestElo: 1200,
  },
  {
    name: "Elena 'Backhand' Chen",
    elo: 1540,
    matchesPlayed: 24,
    wins: 16,
    losses: 8,
    currentStreak: 2,
    highestElo: 1570,
    lowestElo: 1200,
  },
  {
    name: "Leo 'Spin' Rossi",
    elo: 1410,
    matchesPlayed: 22,
    wins: 13,
    losses: 9,
    currentStreak: -1,
    highestElo: 1460,
    lowestElo: 1200,
  },
  {
    name: "Maya 'Topspin' Patel",
    elo: 1280,
    matchesPlayed: 18,
    wins: 10,
    losses: 8,
    currentStreak: 1,
    highestElo: 1320,
    lowestElo: 1180,
  },
  {
    name: "Dave 'Chopper' Miller",
    elo: 1160,
    matchesPlayed: 15,
    wins: 6,
    losses: 9,
    currentStreak: -2,
    highestElo: 1240,
    lowestElo: 1140,
  },
  {
    name: "Sam 'Rookie' Torres",
    elo: 1020,
    matchesPlayed: 12,
    wins: 3,
    losses: 9,
    currentStreak: -3,
    highestElo: 1200,
    lowestElo: 1000,
  },
]

// In-memory fallback cache in case Postgres is still provisioning
interface MemoryStore {
  players: any[]
  matches: any[]
  adminPasscode: string
  nextPlayerId: number
  nextMatchId: number
}

const memoryStore: MemoryStore = {
  players: SEED_PLAYERS.map((p, idx) => ({
    id: idx + 1,
    ...p,
    avatarUrl: null,
    isActive: 1,
    createdAt: new Date(Date.now() - (7 - idx) * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
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
      score: '11-8, 9-11, 11-7',
      notes: 'Finals warmup match',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
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
      score: '11-6, 12-10',
      notes: 'Upset victory for Maya (+22 Elo)',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
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
      score: '11-9, 11-8',
      notes: 'Regular table rotation',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ],
  adminPasscode: DEFAULT_ADMIN_PASSCODE,
  nextPlayerId: 7,
  nextMatchId: 4,
}

export async function verifyAdminPasscode(passcode: string): Promise<boolean> {
  if (!passcode) return false

  try {
    const settings = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, 'admin_passcode'))
      .limit(1)

    if (settings.length > 0 && settings[0].value) {
      return settings[0].value.trim() === passcode.trim()
    }
  } catch (err) {
    // Database fallback
  }

  return (
    passcode.trim() === memoryStore.adminPasscode.trim() ||
    passcode.trim() === DEFAULT_ADMIN_PASSCODE
  )
}

export async function setAdminPasscode(
  currentPasscode: string,
  newPasscode: string,
): Promise<{ success: boolean; message: string }> {
  const isAuthorized = await verifyAdminPasscode(currentPasscode)
  if (!isAuthorized) {
    throw new Error('Unauthorized: Current admin passcode is incorrect')
  }

  if (!newPasscode || newPasscode.trim().length < 4) {
    throw new Error('New passcode must be at least 4 characters long')
  }

  const cleanPasscode = newPasscode.trim()

  try {
    const existing = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, 'admin_passcode'))
      .limit(1)

    if (existing.length > 0) {
      await db
        .update(appSettings)
        .set({ value: cleanPasscode, updatedAt: new Date() })
        .where(eq(appSettings.key, 'admin_passcode'))
    } else {
      await db.insert(appSettings).values({
        key: 'admin_passcode',
        value: cleanPasscode,
      })
    }
  } catch (err) {
    // Memory fallback
  }

  memoryStore.adminPasscode = cleanPasscode
  return { success: true, message: 'Admin passcode updated successfully' }
}

export async function getLeaderboardData(): Promise<{
  players: PlayerLeaderboardEntry[]
  matches: MatchRecord[]
}> {
  let dbPlayers: any[] = []
  let dbMatches: any[] = []

  try {
    dbPlayers = await db
      .select()
      .from(players)
      .where(eq(players.isActive, 1))
      .orderBy(desc(players.elo))

    // If database table is empty, seed initial players
    if (dbPlayers.length === 0) {
      for (const p of SEED_PLAYERS) {
        await db.insert(players).values({
          name: p.name,
          elo: p.elo,
          matchesPlayed: p.matchesPlayed,
          wins: p.wins,
          losses: p.losses,
          currentStreak: p.currentStreak,
          highestElo: p.highestElo,
          lowestElo: p.lowestElo,
          isActive: 1,
        })
      }
      dbPlayers = await db
        .select()
        .from(players)
        .where(eq(players.isActive, 1))
        .orderBy(desc(players.elo))
    }

    dbMatches = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(50)
  } catch (err) {
    // Use fallback memory store if database is offline or not configured yet
    dbPlayers = [...memoryStore.players].filter((p) => p.isActive === 1)
    dbPlayers.sort((a, b) => b.elo - a.elo)
    dbMatches = [...memoryStore.matches].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  const playerMap = new Map<number, any>()
  dbPlayers.forEach((p) => playerMap.set(p.id, p))

  const formattedPlayers: PlayerLeaderboardEntry[] = dbPlayers.map(
    (p, index) => {
      const total = p.matchesPlayed || 0
      const winRate = total > 0 ? Math.round((p.wins / total) * 100) : 0
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
        createdAt:
          p.createdAt instanceof Date
            ? p.createdAt.toISOString()
            : String(p.createdAt),
        updatedAt:
          p.updatedAt instanceof Date
            ? p.updatedAt.toISOString()
            : String(p.updatedAt),
        rank: index + 1,
        winRate,
        tier: getRankTier(p.elo),
      }
    },
  )

  const formattedMatches: MatchRecord[] = dbMatches.map((m) => {
    const p1 = playerMap.get(m.player1Id)
    const p2 = playerMap.get(m.player2Id)
    const winner = playerMap.get(m.winnerId)

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
      createdAt:
        m.createdAt instanceof Date
          ? m.createdAt.toISOString()
          : String(m.createdAt),
      player1Name: p1 ? p1.name : `Player #${m.player1Id}`,
      player2Name: p2 ? p2.name : `Player #${m.player2Id}`,
      winnerName: winner ? winner.name : `Player #${m.winnerId}`,
    }
  })

  return {
    players: formattedPlayers,
    matches: formattedMatches,
  }
}

export async function createPlayer(
  payload: CreatePlayerPayload,
): Promise<PlayerLeaderboardEntry> {
  const isAuthorized = await verifyAdminPasscode(payload.adminPasscode)
  if (!isAuthorized) {
    throw new Error('Unauthorized: Only an admin can add players.')
  }

  const name = payload.name?.trim()
  if (!name || name.length < 2) {
    throw new Error('Player name must be at least 2 characters long')
  }

  const startingElo = Math.max(
    100,
    Math.min(3000, Number(payload.startingElo) || 1200),
  )

  try {
    const [inserted] = await db
      .insert(players)
      .values({
        name,
        elo: startingElo,
        highestElo: startingElo,
        lowestElo: startingElo,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        isActive: 1,
      })
      .returning()

    const tier = getRankTier(inserted.elo)
    return {
      ...inserted,
      rank: 999,
      winRate: 0,
      tier,
      createdAt: inserted.createdAt.toISOString(),
      updatedAt: inserted.updatedAt.toISOString(),
    }
  } catch (err: any) {
    // If DB unavailable, use memory fallback
    if (err?.code === '23505') {
      throw new Error(
        `A player named "${name}" already exists on the leaderboard`,
      )
    }

    const existingMem = memoryStore.players.find(
      (p) => p.name.toLowerCase() === name.toLowerCase() && p.isActive === 1,
    )
    if (existingMem) {
      throw new Error(
        `A player named "${name}" already exists on the leaderboard`,
      )
    }

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    memoryStore.players.push(newPlayer)

    return {
      ...newPlayer,
      rank: memoryStore.players.length,
      winRate: 0,
      tier: getRankTier(newPlayer.elo),
    }
  }
}

export async function recordMatch(
  payload: RecordMatchPayload,
): Promise<{ success: boolean; match: MatchRecord }> {
  const isAuthorized = await verifyAdminPasscode(payload.adminPasscode)
  if (!isAuthorized) {
    throw new Error('Unauthorized: Only an admin can record match results.')
  }

  const { player1Id, player2Id, winnerId, score, notes } = payload
  if (player1Id === player2Id) {
    throw new Error('A player cannot play against themselves')
  }
  if (winnerId !== player1Id && winnerId !== player2Id) {
    throw new Error('Winner must be either Player 1 or Player 2')
  }

  try {
    const [p1] = await db
      .select()
      .from(players)
      .where(eq(players.id, player1Id))
      .limit(1)
    const [p2] = await db
      .select()
      .from(players)
      .where(eq(players.id, player2Id))
      .limit(1)

    if (!p1 || !p2) {
      throw new Error('One or both selected players do not exist')
    }

    const p1IsWinner = winnerId === player1Id
    const outcome = p1IsWinner
      ? calculateMatchElo(p1.elo, p2.elo, p1.matchesPlayed, p2.matchesPlayed)
      : calculateMatchElo(p2.elo, p1.elo, p2.matchesPlayed, p1.matchesPlayed)

    const p1Delta = p1IsWinner ? outcome.winnerDelta : outcome.loserDelta
    const p2Delta = p1IsWinner ? outcome.loserDelta : outcome.winnerDelta
    const p1EloAfter = p1.elo + p1Delta
    const p2EloAfter = p2.elo + p2Delta

    // Update Player 1
    await db
      .update(players)
      .set({
        elo: p1EloAfter,
        matchesPlayed: p1.matchesPlayed + 1,
        wins: p1IsWinner ? p1.wins + 1 : p1.wins,
        losses: p1IsWinner ? p1.losses : p1.losses + 1,
        currentStreak: updateStreak(p1.currentStreak, p1IsWinner),
        highestElo: Math.max(p1.highestElo, p1EloAfter),
        lowestElo: Math.min(p1.lowestElo, p1EloAfter),
        updatedAt: new Date(),
      })
      .where(eq(players.id, player1Id))

    // Update Player 2
    await db
      .update(players)
      .set({
        elo: p2EloAfter,
        matchesPlayed: p2.matchesPlayed + 1,
        wins: !p1IsWinner ? p2.wins + 1 : p2.wins,
        losses: !p1IsWinner ? p2.losses : p2.losses + 1,
        currentStreak: updateStreak(p2.currentStreak, !p1IsWinner),
        highestElo: Math.max(p2.highestElo, p2EloAfter),
        lowestElo: Math.min(p2.lowestElo, p2EloAfter),
        updatedAt: new Date(),
      })
      .where(eq(players.id, player2Id))

    // Insert match
    const [insertedMatch] = await db
      .insert(matches)
      .values({
        player1Id,
        player2Id,
        winnerId,
        player1EloBefore: p1.elo,
        player1EloAfter: p1EloAfter,
        player2EloBefore: p2.elo,
        player2EloAfter: p2EloAfter,
        eloDelta: outcome.winnerDelta,
        score: score?.trim() || null,
        notes: notes?.trim() || null,
      })
      .returning()

    return {
      success: true,
      match: {
        ...insertedMatch,
        createdAt: insertedMatch.createdAt.toISOString(),
        player1Name: p1.name,
        player2Name: p2.name,
        winnerName: p1IsWinner ? p1.name : p2.name,
      },
    }
  } catch (err: any) {
    // Memory fallback
    const p1 = memoryStore.players.find((p) => p.id === player1Id)
    const p2 = memoryStore.players.find((p) => p.id === player2Id)

    if (!p1 || !p2) {
      throw new Error('One or both selected players do not exist')
    }

    const p1IsWinner = winnerId === player1Id
    const outcome = p1IsWinner
      ? calculateMatchElo(p1.elo, p2.elo, p1.matchesPlayed, p2.matchesPlayed)
      : calculateMatchElo(p2.elo, p1.elo, p2.matchesPlayed, p1.matchesPlayed)

    const p1Delta = p1IsWinner ? outcome.winnerDelta : outcome.loserDelta
    const p2Delta = p1IsWinner ? outcome.loserDelta : outcome.winnerDelta
    const p1EloAfter = p1.elo + p1Delta
    const p2EloAfter = p2.elo + p2Delta

    p1.elo = p1EloAfter
    p1.matchesPlayed += 1
    if (p1IsWinner) {
      p1.wins += 1
      p1.currentStreak = updateStreak(p1.currentStreak, true)
    } else {
      p1.losses += 1
      p1.currentStreak = updateStreak(p1.currentStreak, false)
    }
    p1.highestElo = Math.max(p1.highestElo, p1EloAfter)
    p1.lowestElo = Math.min(p1.lowestElo, p1EloAfter)
    p1.updatedAt = new Date().toISOString()

    p2.elo = p2EloAfter
    p2.matchesPlayed += 1
    if (!p1IsWinner) {
      p2.wins += 1
      p2.currentStreak = updateStreak(p2.currentStreak, true)
    } else {
      p2.losses += 1
      p2.currentStreak = updateStreak(p2.currentStreak, false)
    }
    p2.highestElo = Math.max(p2.highestElo, p2EloAfter)
    p2.lowestElo = Math.min(p2.lowestElo, p2EloAfter)
    p2.updatedAt = new Date().toISOString()

    const newMatch: MatchRecord = {
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
      createdAt: new Date().toISOString(),
      player1Name: p1.name,
      player2Name: p2.name,
      winnerName: p1IsWinner ? p1.name : p2.name,
    }

    memoryStore.matches.unshift(newMatch)

    return {
      success: true,
      match: newMatch,
    }
  }
}

export async function deleteMatch(
  matchId: number,
  adminPasscode: string,
): Promise<{ success: boolean; message: string }> {
  const isAuthorized = await verifyAdminPasscode(adminPasscode)
  if (!isAuthorized) {
    throw new Error('Unauthorized: Only an admin can revert matches.')
  }

  try {
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId))
      .limit(1)

    if (!match) {
      throw new Error('Match not found')
    }

    // Revert Player 1
    const [p1] = await db
      .select()
      .from(players)
      .where(eq(players.id, match.player1Id))
      .limit(1)
    if (p1) {
      const p1WasWinner = match.winnerId === match.player1Id
      await db
        .update(players)
        .set({
          elo: match.player1EloBefore,
          matchesPlayed: Math.max(0, p1.matchesPlayed - 1),
          wins: p1WasWinner ? Math.max(0, p1.wins - 1) : p1.wins,
          losses: !p1WasWinner ? Math.max(0, p1.losses - 1) : p1.losses,
          updatedAt: new Date(),
        })
        .where(eq(players.id, match.player1Id))
    }

    // Revert Player 2
    const [p2] = await db
      .select()
      .from(players)
      .where(eq(players.id, match.player2Id))
      .limit(1)
    if (p2) {
      const p2WasWinner = match.winnerId === match.player2Id
      await db
        .update(players)
        .set({
          elo: match.player2EloBefore,
          matchesPlayed: Math.max(0, p2.matchesPlayed - 1),
          wins: p2WasWinner ? Math.max(0, p2.wins - 1) : p2.wins,
          losses: !p2WasWinner ? Math.max(0, p2.losses - 1) : p2.losses,
          updatedAt: new Date(),
        })
        .where(eq(players.id, match.player2Id))
    }

    await db.delete(matches).where(eq(matches.id, matchId))
  } catch (err) {
    // Memory fallback
    const matchIdx = memoryStore.matches.findIndex((m) => m.id === matchId)
    if (matchIdx !== -1) {
      const match = memoryStore.matches[matchIdx]
      const p1 = memoryStore.players.find((p) => p.id === match.player1Id)
      const p2 = memoryStore.players.find((p) => p.id === match.player2Id)

      if (p1) {
        const p1WasWinner = match.winnerId === match.player1Id
        p1.elo = match.player1EloBefore
        p1.matchesPlayed = Math.max(0, p1.matchesPlayed - 1)
        if (p1WasWinner) p1.wins = Math.max(0, p1.wins - 1)
        else p1.losses = Math.max(0, p1.losses - 1)
      }

      if (p2) {
        const p2WasWinner = match.winnerId === match.player2Id
        p2.elo = match.player2EloBefore
        p2.matchesPlayed = Math.max(0, p2.matchesPlayed - 1)
        if (p2WasWinner) p2.wins = Math.max(0, p2.wins - 1)
        else p2.losses = Math.max(0, p2.losses - 1)
      }

      memoryStore.matches.splice(matchIdx, 1)
    }
  }

  return {
    success: true,
    message: 'Match successfully deleted and player ratings restored',
  }
}

export async function updatePlayer(
  payload: EditPlayerPayload,
): Promise<{ success: boolean; message: string }> {
  const isAuthorized = await verifyAdminPasscode(payload.adminPasscode)
  if (!isAuthorized) {
    throw new Error('Unauthorized: Only an admin can edit players.')
  }

  const name = payload.name?.trim()
  if (!name || name.length < 2) {
    throw new Error('Player name must be at least 2 characters long')
  }

  try {
    await db
      .update(players)
      .set({ name, updatedAt: new Date() })
      .where(eq(players.id, payload.id))
  } catch (err) {
    const memPlayer = memoryStore.players.find((p) => p.id === payload.id)
    if (memPlayer) {
      memPlayer.name = name
      memPlayer.updatedAt = new Date().toISOString()
    }
  }

  return { success: true, message: 'Player updated successfully' }
}

export async function deletePlayer(
  id: number,
  adminPasscode: string,
): Promise<{ success: boolean; message: string }> {
  const isAuthorized = await verifyAdminPasscode(adminPasscode)
  if (!isAuthorized) {
    throw new Error('Unauthorized: Only an admin can remove players.')
  }

  try {
    // Soft delete so matches remain valid
    await db
      .update(players)
      .set({ isActive: 0, updatedAt: new Date() })
      .where(eq(players.id, id))
  } catch (err) {
    const memPlayer = memoryStore.players.find((p) => p.id === id)
    if (memPlayer) {
      memPlayer.isActive = 0
    }
  }

  return { success: true, message: 'Player removed from leaderboard' }
}

export async function resetLeaderboardToDefaults(
  adminPasscode: string,
): Promise<{ success: boolean; message: string }> {
  const isAuthorized = await verifyAdminPasscode(adminPasscode)
  if (!isAuthorized) {
    throw new Error('Unauthorized: Only an admin can reset the leaderboard.')
  }

  try {
    await db.delete(matches)
    await db.delete(players)

    for (const p of SEED_PLAYERS) {
      await db.insert(players).values({
        name: p.name,
        elo: p.elo,
        matchesPlayed: p.matchesPlayed,
        wins: p.wins,
        losses: p.losses,
        currentStreak: p.currentStreak,
        highestElo: p.highestElo,
        lowestElo: p.lowestElo,
        isActive: 1,
      })
    }
  } catch (err) {
    memoryStore.players = SEED_PLAYERS.map((p, idx) => ({
      id: idx + 1,
      ...p,
      avatarUrl: null,
      isActive: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    memoryStore.matches = []
    memoryStore.nextPlayerId = 7
    memoryStore.nextMatchId = 1
  }

  return { success: true, message: 'Leaderboard reset to initial seed state' }
}
