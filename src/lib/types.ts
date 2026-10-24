export interface Player {
  id: number
  name: string
  elo: number
  matchesPlayed: number
  wins: number
  losses: number
  currentStreak: number
  highestElo: number
  lowestElo: number
  avatarUrl?: string | null
  isActive: number
  createdAt: string
  updatedAt: string
}

export interface PlayerLeaderboardEntry extends Player {
  rank: number
  winRate: number
  tier: {
    name: string
    division?: string
    label: string
    color: string
    bgColor: string
    borderColor: string
    textColor: string
    icon: string
  }
}

export interface MatchRecord {
  id: number
  player1Id: number
  player2Id: number
  winnerId: number
  player1EloBefore: number
  player1EloAfter: number
  player2EloBefore: number
  player2EloAfter: number
  eloDelta: number
  score?: string | null
  notes?: string | null
  createdAt: string
  player1Name?: string
  player2Name?: string
  winnerName?: string
}

export interface RecordMatchPayload {
  player1Id: number
  player2Id: number
  winnerId: number
  score?: string
  notes?: string
  adminPasscode: string
}

export interface CreatePlayerPayload {
  name: string
  startingElo?: number
  adminPasscode: string
}

export interface EditPlayerPayload {
  id: number
  name: string
  adminPasscode: string
}

export interface DeleteMatchPayload {
  id: number
  adminPasscode: string
}

export interface ChangePasscodePayload {
  currentPasscode: string
  newPasscode: string
}
