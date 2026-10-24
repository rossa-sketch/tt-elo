/**
 * Elo Rating System for Table Tennis Leaderboard
 * Inspired by competitive ranking systems like Rocket League and Chess.
 *
 * Rules:
 * - A win against a higher-ranked opponent yields a large Elo gain (+upset bonus).
 * - A loss against a lower-ranked opponent yields a severe Elo penalty.
 * - An expected win (higher rank beats lower rank) yields a small Elo gain.
 * - An expected loss (lower rank loses to higher rank) yields a minimal Elo loss.
 */

export interface RankTier {
  name: string
  division?: string
  label: string
  minElo: number
  maxElo: number
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  icon: 'shield' | 'trophy' | 'zap' | 'flame' | 'sparkles' | 'crown' | 'star'
}

export const RANK_TIERS: RankTier[] = [
  {
    name: 'Bronze',
    division: 'I',
    label: 'Bronze I',
    minElo: 0,
    maxElo: 949,
    color: '#cd7f32',
    bgColor: 'rgba(205, 127, 50, 0.15)',
    borderColor: 'rgba(205, 127, 50, 0.4)',
    textColor: '#e89758',
    icon: 'shield',
  },
  {
    name: 'Bronze',
    division: 'II',
    label: 'Bronze II',
    minElo: 950,
    maxElo: 1049,
    color: '#cd7f32',
    bgColor: 'rgba(205, 127, 50, 0.2)',
    borderColor: 'rgba(205, 127, 50, 0.5)',
    textColor: '#ffa668',
    icon: 'shield',
  },
  {
    name: 'Silver',
    division: 'I',
    label: 'Silver I',
    minElo: 1050,
    maxElo: 1124,
    color: '#c0c0c0',
    bgColor: 'rgba(192, 192, 192, 0.15)',
    borderColor: 'rgba(192, 192, 192, 0.4)',
    textColor: '#e2e8f0',
    icon: 'shield',
  },
  {
    name: 'Silver',
    division: 'II',
    label: 'Silver II',
    minElo: 1125,
    maxElo: 1199,
    color: '#e2e8f0',
    bgColor: 'rgba(226, 232, 240, 0.18)',
    borderColor: 'rgba(226, 232, 240, 0.5)',
    textColor: '#f8fafc',
    icon: 'shield',
  },
  {
    name: 'Gold',
    division: 'I',
    label: 'Gold I',
    minElo: 1200,
    maxElo: 1274,
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.4)',
    textColor: '#facc15',
    icon: 'star',
  },
  {
    name: 'Gold',
    division: 'II',
    label: 'Gold II',
    minElo: 1275,
    maxElo: 1349,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
    textColor: '#fbbf24',
    icon: 'star',
  },
  {
    name: 'Platinum',
    division: 'I',
    label: 'Platinum I',
    minElo: 1350,
    maxElo: 1424,
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.45)',
    textColor: '#22d3ee',
    icon: 'zap',
  },
  {
    name: 'Platinum',
    division: 'II',
    label: 'Platinum II',
    minElo: 1425,
    maxElo: 1499,
    color: '#0ea5e9',
    bgColor: 'rgba(14, 165, 233, 0.2)',
    borderColor: 'rgba(14, 165, 233, 0.5)',
    textColor: '#38bdf8',
    icon: 'zap',
  },
  {
    name: 'Diamond',
    division: 'I',
    label: 'Diamond I',
    minElo: 1500,
    maxElo: 1599,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.18)',
    borderColor: 'rgba(59, 130, 246, 0.55)',
    textColor: '#60a5fa',
    icon: 'sparkles',
  },
  {
    name: 'Diamond',
    division: 'II',
    label: 'Diamond II',
    minElo: 1600,
    maxElo: 1699,
    color: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: 'rgba(99, 102, 241, 0.6)',
    textColor: '#818cf8',
    icon: 'sparkles',
  },
  {
    name: 'Champion',
    division: 'I',
    label: 'Champion I',
    minElo: 1700,
    maxElo: 1799,
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: 'rgba(168, 85, 247, 0.6)',
    textColor: '#c084fc',
    icon: 'flame',
  },
  {
    name: 'Champion',
    division: 'II',
    label: 'Champion II',
    minElo: 1800,
    maxElo: 1899,
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.2)',
    borderColor: 'rgba(236, 72, 153, 0.6)',
    textColor: '#f472b6',
    icon: 'flame',
  },
  {
    name: 'Grand Champion',
    division: '',
    label: 'Grand Champion',
    minElo: 1900,
    maxElo: 2049,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.22)',
    borderColor: 'rgba(239, 68, 68, 0.65)',
    textColor: '#f87171',
    icon: 'trophy',
  },
  {
    name: 'Supersonic Legend',
    division: '',
    label: 'Supersonic Legend',
    minElo: 2050,
    maxElo: 99999,
    color: '#ffffff',
    bgColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    textColor: '#ffffff',
    icon: 'crown',
  },
]

export const BASE_STARTING_ELO = 1200
export const DEFAULT_K_FACTOR = 32
export const PLACEMENT_K_FACTOR = 48

/**
 * Calculates expected win probability of player A against player B using standard Elo logistic curve.
 * Output is between 0 and 1.
 */
export function calculateExpectedScore(
  playerElo: number,
  opponentElo: number,
): number {
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400))
}

/**
 * Returns K-factor. Higher during the first 10 placement games to calibrate rating faster.
 */
export function getKFactor(matchesPlayed = 20): number {
  if (matchesPlayed < 10) {
    return PLACEMENT_K_FACTOR
  }
  return DEFAULT_K_FACTOR
}

export interface MatchOutcome {
  winnerDelta: number
  loserDelta: number
  winnerNewElo: number
  loserNewElo: number
  expectedWinnerScore: number
  expectedLoserScore: number
}

/**
 * Calculates new Elo ratings after a match.
 * Zero-sum: winner gain == loser loss (ensuring Elo conservation across the table).
 * Minimum Elo delta is 1 so a win is always rewarded.
 */
export function calculateMatchElo(
  winnerElo: number,
  loserElo: number,
  winnerMatches = 20,
  loserMatches = 20,
): MatchOutcome {
  const expectedWinner = calculateExpectedScore(winnerElo, loserElo)
  const expectedLoser = 1 - expectedWinner

  // Average the K-factor if players are in different calibration stages
  const kWinner = getKFactor(winnerMatches)
  const kLoser = getKFactor(loserMatches)
  const k = Math.round((kWinner + kLoser) / 2)

  // Standard Elo formula: Δ = K * (Actual - Expected)
  // Actual score for winner is 1.0
  const rawDelta = k * (1 - expectedWinner)
  const delta = Math.max(1, Math.round(rawDelta))

  const winnerNewElo = winnerElo + delta
  const loserNewElo = Math.max(100, loserElo - delta) // floor at 100

  return {
    winnerDelta: delta,
    loserDelta: -delta,
    winnerNewElo,
    loserNewElo,
    expectedWinnerScore: Math.round(expectedWinner * 100) / 100,
    expectedLoserScore: Math.round(expectedLoser * 100) / 100,
  }
}

/**
 * Previews potential match outcomes for two players before the match is submitted.
 */
export function previewMatchScenarios(
  player1Elo: number,
  player2Elo: number,
  p1Matches = 20,
  p2Matches = 20,
) {
  const ifP1Wins = calculateMatchElo(
    player1Elo,
    player2Elo,
    p1Matches,
    p2Matches,
  )
  const ifP2Wins = calculateMatchElo(
    player2Elo,
    player1Elo,
    p2Matches,
    p1Matches,
  )

  return {
    p1ExpectedWinRate: Math.round(
      calculateExpectedScore(player1Elo, player2Elo) * 100,
    ),
    p2ExpectedWinRate: Math.round(
      calculateExpectedScore(player2Elo, player1Elo) * 100,
    ),
    ifP1Wins: {
      p1Delta: ifP1Wins.winnerDelta,
      p2Delta: ifP1Wins.loserDelta,
      p1NewElo: ifP1Wins.winnerNewElo,
      p2NewElo: ifP1Wins.loserNewElo,
    },
    ifP2Wins: {
      p1Delta: ifP2Wins.loserDelta,
      p2Delta: ifP2Wins.winnerDelta,
      p1NewElo: ifP2Wins.loserNewElo,
      p2NewElo: ifP2Wins.winnerNewElo,
    },
  }
}

/**
 * Resolves the rank tier for a given Elo rating.
 */
export function getRankTier(elo: number): RankTier {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (elo >= RANK_TIERS[i].minElo) {
      return RANK_TIERS[i]
    }
  }
  return RANK_TIERS[0]
}

/**
 * Computes next streak value.
 * Positive integer: win streak (e.g. +3)
 * Negative integer: losing streak (e.g. -2)
 */
export function updateStreak(currentStreak: number, isWin: boolean): number {
  if (isWin) {
    return currentStreak > 0 ? currentStreak + 1 : 1
  } else {
    return currentStreak < 0 ? currentStreak - 1 : -1
  }
}
