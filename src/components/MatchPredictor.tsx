import React, { useState, useMemo } from 'react'
import { previewMatchScenarios, calculateExpectedScore } from '@/lib/elo'
import { RankBadge } from '@/components/RankBadge'
import { RecordMatchDialog } from '@/components/RecordMatchDialog'
import { useAdmin } from '@/lib/admin-context'
import type { PlayerLeaderboardEntry, MatchRecord } from '@/lib/types'
import {
  Swords,
  Calculator,
  Zap,
  TrendingUp,
  TrendingDown,
  History,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MatchPredictorProps {
  players: PlayerLeaderboardEntry[]
  matches: MatchRecord[]
  initialPlayer1Id?: number
  initialPlayer2Id?: number
  onMatchRecorded: () => void
}

export function MatchPredictor({
  players,
  matches,
  initialPlayer1Id,
  initialPlayer2Id,
  onMatchRecorded,
}: MatchPredictorProps) {
  const { isAdmin } = useAdmin()
  const [p1Id, setP1Id] = useState<number>(
    initialPlayer1Id || players[0]?.id || 1,
  )
  const [p2Id, setP2Id] = useState<number>(
    initialPlayer2Id ||
      players.find((p) => p.id !== (initialPlayer1Id || players[0]?.id))?.id ||
      2,
  )
  const [recordDialogOpen, setRecordDialogOpen] = useState(false)

  const player1 = useMemo(
    () => players.find((p) => p.id === p1Id),
    [players, p1Id],
  )
  const player2 = useMemo(
    () => players.find((p) => p.id === p2Id),
    [players, p2Id],
  )

  const scenarios = useMemo(() => {
    if (!player1 || !player2 || player1.id === player2.id) return null
    return previewMatchScenarios(
      player1.elo,
      player2.elo,
      player1.matchesPlayed,
      player2.matchesPlayed,
    )
  }, [player1, player2])

  // Head to head history between these two players
  const headToHeadMatches = useMemo(() => {
    if (!player1 || !player2) return []
    return matches.filter(
      (m) =>
        (m.player1Id === player1.id && m.player2Id === player2.id) ||
        (m.player1Id === player2.id && m.player2Id === player1.id),
    )
  }, [matches, player1, player2])

  const p1H2HWins = headToHeadMatches.filter(
    (m) => m.winnerId === player1?.id,
  ).length
  const p2H2HWins = headToHeadMatches.filter(
    (m) => m.winnerId === player2?.id,
  ).length

  if (players.length < 2) {
    return (
      <div className="py-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
        <Calculator className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />
        <p className="text-sm font-semibold">
          At least 2 players needed for match predictions
        </p>
      </div>
    )
  }

  const eloDiff = player1 && player2 ? Math.abs(player1.elo - player2.elo) : 0
  const higherEloPlayer =
    player1 && player2 ? (player1.elo >= player2.elo ? player1 : player2) : null
  const lowerEloPlayer =
    player1 && player2 ? (player1.elo < player2.elo ? player1 : player2) : null

  return (
    <div className="space-y-6">
      {/* Matchup Selector Card */}
      <div className="p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                Interactive Match Simulator
              </h2>
              <p className="text-xs text-muted-foreground">
                Compare players to calculate expected win odds and potential
                Rocket League style Elo swings.
              </p>
            </div>
          </div>

          {isAdmin && player1 && player2 && player1.id !== player2.id && (
            <Button
              size="sm"
              onClick={() => setRecordDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shrink-0"
            >
              <Swords className="w-3.5 h-3.5 mr-1.5" />
              Record This Match
            </Button>
          )}
        </div>

        {/* Player Selection Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fighter 1 */}
          <div className="p-4 rounded-xl bg-background/50 border border-border space-y-3">
            <label
              htmlFor="p1-select"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
            >
              Player A
            </label>
            <select
              id="p1-select"
              value={p1Id}
              onChange={(e) => setP1Id(Number(e.target.value))}
              className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === p2Id}>
                  {p.name} ({p.elo} Elo)
                </option>
              ))}
            </select>

            {player1 && (
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-2xl font-black font-mono text-foreground block">
                    {player1.elo}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {player1.wins}W - {player1.losses}L ({player1.winRate}%)
                  </span>
                </div>
                <RankBadge elo={player1.elo} size="md" />
              </div>
            )}
          </div>

          {/* Fighter 2 */}
          <div className="p-4 rounded-xl bg-background/50 border border-border space-y-3">
            <label
              htmlFor="p2-select"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
            >
              Player B
            </label>
            <select
              id="p2-select"
              value={p2Id}
              onChange={(e) => setP2Id(Number(e.target.value))}
              className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === p1Id}>
                  {p.name} ({p.elo} Elo)
                </option>
              ))}
            </select>

            {player2 && (
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-2xl font-black font-mono text-foreground block">
                    {player2.elo}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {player2.wins}W - {player2.losses}L ({player2.winRate}%)
                  </span>
                </div>
                <RankBadge elo={player2.elo} size="md" />
              </div>
            )}
          </div>
        </div>

        {/* Prediction Results */}
        {player1 && player2 && scenarios && (
          <div className="space-y-4 pt-2">
            {/* Probability Gauge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-400">
                  {player1.name}: {scenarios.p1ExpectedWinRate}% win odds
                </span>
                <span className="text-muted-foreground font-mono">
                  Δ {eloDiff} Elo rating gap
                </span>
                <span className="text-blue-400">
                  {player2.name}: {scenarios.p2ExpectedWinRate}% win odds
                </span>
              </div>

              <div
                aria-hidden="true"
                className="w-full h-3 rounded-full bg-secondary overflow-hidden flex shadow-inner"
              >
                <div
                  className="bg-emerald-500 h-full transition-all duration-300 flex items-center justify-end pr-2 text-[10px] text-black font-bold"
                  style={{ width: `${scenarios.p1ExpectedWinRate}%` }}
                />
                <div
                  className="bg-blue-500 h-full transition-all duration-300 flex items-center justify-start pl-2 text-[10px] text-white font-bold"
                  style={{ width: `${scenarios.p2ExpectedWinRate}%` }}
                />
              </div>
            </div>

            {/* High vs Low Elo Dynamics Highlight */}
            {higherEloPlayer && lowerEloPlayer && eloDiff > 40 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">
                    Asymmetric Elo Stakes:{' '}
                  </strong>
                  Because{' '}
                  <span className="font-semibold text-white">
                    {lowerEloPlayer.name}
                  </span>{' '}
                  is lower-ranked by {eloDiff} points, defeating{' '}
                  <span className="font-semibold text-white">
                    {higherEloPlayer.name}
                  </span>{' '}
                  will trigger an upset reward, granting a larger Elo boost!
                </div>
              </div>
            )}

            {/* Potential Outcomes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Scenario 1: Player 1 Wins */}
              <div className="p-4 rounded-xl bg-background/70 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                    If {player1.name} Wins
                  </span>
                  {scenarios.ifP1Wins.p1Delta >= 22 && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      ⚡ Upset Victory!
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-secondary/40">
                    <span className="text-foreground font-sans font-medium">
                      {player1.name}:
                    </span>
                    <span className="text-emerald-400 font-bold">
                      +{scenarios.ifP1Wins.p1Delta} ELO ({player1.elo} →{' '}
                      {scenarios.ifP1Wins.p1NewElo})
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-secondary/40">
                    <span className="text-foreground font-sans font-medium">
                      {player2.name}:
                    </span>
                    <span className="text-rose-400 font-bold">
                      {scenarios.ifP1Wins.p2Delta} ELO ({player2.elo} →{' '}
                      {scenarios.ifP1Wins.p2NewElo})
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario 2: Player 2 Wins */}
              <div className="p-4 rounded-xl bg-background/70 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">
                    If {player2.name} Wins
                  </span>
                  {scenarios.ifP2Wins.p2Delta >= 22 && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      ⚡ Upset Victory!
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-secondary/40">
                    <span className="text-foreground font-sans font-medium">
                      {player2.name}:
                    </span>
                    <span className="text-emerald-400 font-bold">
                      +{scenarios.ifP2Wins.p2Delta} ELO ({player2.elo} →{' '}
                      {scenarios.ifP2Wins.p2NewElo})
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-secondary/40">
                    <span className="text-foreground font-sans font-medium">
                      {player1.name}:
                    </span>
                    <span className="text-rose-400 font-bold">
                      {scenarios.ifP2Wins.p1Delta} ELO ({player1.elo} →{' '}
                      {scenarios.ifP2Wins.p1NewElo})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Head to head past encounters */}
            <div className="pt-2 border-t border-border/60">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  Head-to-Head History: {p1H2HWins} - {p2H2HWins}
                </span>
                <span>{headToHeadMatches.length} lifetime meetings</span>
              </div>

              {headToHeadMatches.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4 rounded-lg bg-secondary/30">
                  These two players have not faced each other yet.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {headToHeadMatches.slice(0, 3).map((m) => {
                    const won = m.winnerId === player1.id
                    return (
                      <div
                        key={m.id}
                        className="p-2 rounded bg-secondary/40 border border-border/50 text-xs flex items-center justify-between font-mono"
                      >
                        <span className="font-sans font-medium">
                          {won ? player1.name : player2.name} won
                          {m.score ? ` (${m.score})` : ''}
                        </span>
                        <span className="text-emerald-400 font-bold">
                          +{m.eloDelta} ELO swing
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Record Match Shortcut for Admin */}
      {player1 && player2 && (
        <RecordMatchDialog
          open={recordDialogOpen}
          onOpenChange={setRecordDialogOpen}
          players={players}
          preselectedPlayerId={player1.id}
          onMatchRecorded={() => {
            setRecordDialogOpen(false)
            onMatchRecorded()
          }}
        />
      )}
    </div>
  )
}
