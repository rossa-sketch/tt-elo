import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RankBadge } from '@/components/RankBadge'
import type { PlayerLeaderboardEntry, MatchRecord } from '@/lib/types'
import {
  Trophy,
  Flame,
  TrendingUp,
  TrendingDown,
  Target,
  Swords,
  Calendar,
} from 'lucide-react'

interface PlayerProfileModalProps {
  player: PlayerLeaderboardEntry | null
  matches: MatchRecord[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onChallengePlayer?: (player: PlayerLeaderboardEntry) => void
}

export function PlayerProfileModal({
  player,
  matches,
  open,
  onOpenChange,
  onChallengePlayer,
}: PlayerProfileModalProps) {
  if (!player) return null

  // Filter player's matches
  const playerMatches = matches.filter(
    (m) => m.player1Id === player.id || m.player2Id === player.id,
  )

  const isPositiveStreak = player.currentStreak > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-border bg-card max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-left pb-2 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                  RANK #{player.rank}
                </span>
                <RankBadge elo={player.elo} size="sm" />
              </div>
              <DialogTitle className="text-2xl font-bold mt-1 text-foreground">
                {player.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                Active player on the official leaderboard
              </DialogDescription>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black font-mono tracking-tight text-foreground">
                {player.elo}
              </span>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                Current ELO
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Key Career Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2">
          <div className="p-3 rounded-xl bg-background/60 border border-border">
            <span className="text-[11px] text-muted-foreground font-medium block">
              Win Rate
            </span>
            <span
              className={`text-xl font-bold font-mono ${
                player.winRate >= 60
                  ? 'text-emerald-400'
                  : player.winRate >= 45
                    ? 'text-amber-400'
                    : 'text-foreground'
              }`}
            >
              {player.winRate}%
            </span>
            <span className="text-[10px] text-muted-foreground block">
              {player.wins}W - {player.losses}L
            </span>
          </div>

          <div className="p-3 rounded-xl bg-background/60 border border-border">
            <span className="text-[11px] text-muted-foreground font-medium block">
              Streak
            </span>
            <span
              className={`text-xl font-bold font-mono flex items-center gap-1 ${
                isPositiveStreak ? 'text-amber-400' : 'text-blue-400'
              }`}
            >
              {isPositiveStreak ? (
                <>
                  <Flame className="w-4 h-4 text-amber-400" />
                  {player.currentStreak}W
                </>
              ) : player.currentStreak < 0 ? (
                <>{Math.abs(player.currentStreak)}L</>
              ) : (
                'None'
              )}
            </span>
            <span className="text-[10px] text-muted-foreground block">
              {isPositiveStreak ? 'Winning run' : 'Losing run'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-background/60 border border-border">
            <span className="text-[11px] text-muted-foreground font-medium block">
              Peak Rating
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-4 h-4" />
              {player.highestElo}
            </span>
            <span className="text-[10px] text-muted-foreground block">
              All-time high
            </span>
          </div>

          <div className="p-3 rounded-xl bg-background/60 border border-border">
            <span className="text-[11px] text-muted-foreground font-medium block">
              Lowest Rating
            </span>
            <span className="text-xl font-bold font-mono text-muted-foreground flex items-center gap-0.5">
              <TrendingDown className="w-4 h-4" />
              {player.lowestElo}
            </span>
            <span className="text-[10px] text-muted-foreground block">
              All-time low
            </span>
          </div>
        </div>

        {/* Player's Match History */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Recent Match Appearances ({playerMatches.length})</span>
          </div>

          {playerMatches.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-xl">
              No matches recorded for {player.name} yet.
            </p>
          ) : (
            <div className="space-y-2">
              {playerMatches.slice(0, 5).map((m) => {
                const won = m.winnerId === player.id
                const opponentName =
                  m.player1Id === player.id ? m.player2Name : m.player1Name
                return (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-lg bg-background/40 border border-border/70 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] ${
                          won
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {won ? 'W' : 'L'}
                      </span>
                      <div>
                        <span className="font-semibold text-foreground">
                          vs {opponentName}
                        </span>
                        {m.score && (
                          <span className="text-muted-foreground ml-2 font-mono text-[11px]">
                            ({m.score})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span
                        className={`font-bold ${won ? 'text-emerald-400' : 'text-rose-400'}`}
                      >
                        {won ? `+${m.eloDelta}` : `-${m.eloDelta}`} ELO
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter className="pt-3 sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onChallengePlayer && (
            <Button
              onClick={() => {
                onOpenChange(false)
                onChallengePlayer(player)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
            >
              <Swords className="w-3.5 h-3.5 mr-1.5" />
              Simulate Matchup
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
