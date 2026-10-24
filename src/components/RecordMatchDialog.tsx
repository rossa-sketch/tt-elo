import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdmin } from '@/lib/admin-context'
import { recordMatchFn } from '@/lib/server-actions'
import { previewMatchScenarios } from '@/lib/elo'
import { RankBadge } from '@/components/RankBadge'
import type { PlayerLeaderboardEntry } from '@/lib/types'
import { toast } from 'sonner'
import {
  Swords,
  Trophy,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react'

interface RecordMatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  players: PlayerLeaderboardEntry[]
  onMatchRecorded: () => void
  preselectedPlayerId?: number
}

export function RecordMatchDialog({
  open,
  onOpenChange,
  players,
  onMatchRecorded,
  preselectedPlayerId,
}: RecordMatchDialogProps) {
  const { adminPasscode } = useAdmin()
  const [player1Id, setPlayer1Id] = useState<number | ''>(
    preselectedPlayerId || (players[0]?.id ?? ''),
  )
  const [player2Id, setPlayer2Id] = useState<number | ''>(
    players.find((p) => p.id !== (preselectedPlayerId || players[0]?.id))?.id ??
      '',
  )
  const [winnerId, setWinnerId] = useState<number | ''>('')
  const [score, setScore] = useState('3-1')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const p1 = useMemo(
    () => players.find((p) => p.id === Number(player1Id)),
    [players, player1Id],
  )
  const p2 = useMemo(
    () => players.find((p) => p.id === Number(player2Id)),
    [players, player2Id],
  )

  const scenarios = useMemo(() => {
    if (!p1 || !p2 || p1.id === p2.id) return null
    return previewMatchScenarios(
      p1.elo,
      p2.elo,
      p1.matchesPlayed,
      p2.matchesPlayed,
    )
  }, [p1, p2])

  const quickScores = ['3-0', '3-1', '3-2', '2-0', '2-1', '11-9, 11-8']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!player1Id || !player2Id) {
      setError('Please select both Player 1 and Player 2')
      return
    }
    if (player1Id === player2Id) {
      setError('A player cannot play against themselves')
      return
    }
    if (!winnerId) {
      setError('Please select which player won the match')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await recordMatchFn({
        data: {
          player1Id: Number(player1Id),
          player2Id: Number(player2Id),
          winnerId: Number(winnerId),
          score: score.trim(),
          notes: notes.trim(),
          adminPasscode,
        },
      })

      const winnerName = winnerId === p1?.id ? p1?.name : p2?.name
      const loserName = winnerId === p1?.id ? p2?.name : p1?.name
      const delta = res.match?.eloDelta || 16

      toast.success('Match Recorded!', {
        description: `${winnerName} won against ${loserName} (+${delta} Elo swing)`,
      })

      onOpenChange(false)
      setWinnerId('')
      setNotes('')
      onMatchRecorded()
    } catch (err: any) {
      const msg = err?.message || 'Failed to record match'
      setError(msg)
      toast.error('Match submission failed', { description: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl border-border bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-1">
            <Swords className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl text-center">
            Record Table Tennis Match
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Select the two competitors, choose the victor, and calculate
            official Elo rank adjustments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Player Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Player 1 Selection */}
            <div className="space-y-2 p-3.5 rounded-xl bg-background/50 border border-border">
              <Label
                htmlFor="player1-select"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Player 1
              </Label>
              <select
                id="player1-select"
                value={player1Id}
                onChange={(e) => {
                  setPlayer1Id(Number(e.target.value))
                  setWinnerId('')
                }}
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                <option value="" disabled>
                  Select player...
                </option>
                {players.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={p.id === Number(player2Id)}
                  >
                    {p.name} ({p.elo} Elo)
                  </option>
                ))}
              </select>

              {p1 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    {p1.elo} ELO
                  </span>
                  <RankBadge elo={p1.elo} size="sm" />
                </div>
              )}
            </div>

            {/* Player 2 Selection */}
            <div className="space-y-2 p-3.5 rounded-xl bg-background/50 border border-border">
              <Label
                htmlFor="player2-select"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Player 2
              </Label>
              <select
                id="player2-select"
                value={player2Id}
                onChange={(e) => {
                  setPlayer2Id(Number(e.target.value))
                  setWinnerId('')
                }}
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                <option value="" disabled>
                  Select opponent...
                </option>
                {players.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={p.id === Number(player1Id)}
                  >
                    {p.name} ({p.elo} Elo)
                  </option>
                ))}
              </select>

              {p2 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    {p2.elo} ELO
                  </span>
                  <RankBadge elo={p2.elo} size="sm" />
                </div>
              )}
            </div>
          </div>

          {/* Elo Stakes & Probability Calculator Preview */}
          {p1 && p2 && scenarios && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Expected Win Probabilities
                </span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {p1.name.split(' ')[0]}: {scenarios.p1ExpectedWinRate}% vs{' '}
                  {p2.name.split(' ')[0]}: {scenarios.p2ExpectedWinRate}%
                </span>
              </div>

              {/* Progress bar showing relative win expectancy */}
              <div
                aria-hidden="true"
                className="w-full h-2 rounded-full bg-secondary overflow-hidden flex"
              >
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${scenarios.p1ExpectedWinRate}%` }}
                />
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${scenarios.p2ExpectedWinRate}%` }}
                />
              </div>

              {/* Potential Elo Stakes */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-background/80 border border-border/50">
                  <p className="text-[11px] text-muted-foreground mb-1 font-medium">
                    If{' '}
                    <span className="text-foreground font-semibold">
                      {p1.name}
                    </span>{' '}
                    wins:
                  </p>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-emerald-400 font-bold">
                      +{scenarios.ifP1Wins.p1Delta}
                    </span>
                    <span className="text-rose-400 font-bold">
                      {scenarios.ifP1Wins.p2Delta}
                    </span>
                  </div>
                  {scenarios.ifP1Wins.p1Delta >= 22 && (
                    <span className="inline-block mt-1 text-[10px] text-amber-400 font-semibold">
                      ⚡ Upset Bonus!
                    </span>
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-background/80 border border-border/50">
                  <p className="text-[11px] text-muted-foreground mb-1 font-medium">
                    If{' '}
                    <span className="text-foreground font-semibold">
                      {p2.name}
                    </span>{' '}
                    wins:
                  </p>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-rose-400 font-bold">
                      {scenarios.ifP2Wins.p1Delta}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      +{scenarios.ifP2Wins.p2Delta}
                    </span>
                  </div>
                  {scenarios.ifP2Wins.p2Delta >= 22 && (
                    <span className="inline-block mt-1 text-[10px] text-amber-400 font-semibold">
                      ⚡ Upset Bonus!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Select Winner Buttons */}
          <div className="space-y-2">
            <span
              id="winner-label"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Select Winner{' '}
              <span className="text-rose-400" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(required)</span>
            </span>
            <div
              role="group"
              aria-labelledby="winner-label"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <button
                type="button"
                disabled={!p1}
                aria-pressed={!!p1 && winnerId === p1.id}
                onClick={() => setWinnerId(p1?.id || '')}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                  winnerId === p1?.id
                    ? 'border-emerald-500 bg-emerald-500/15 shadow-sm ring-2 ring-emerald-500/40 text-foreground'
                    : 'border-border bg-background/40 hover:bg-background/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 font-semibold text-sm truncate">
                    {winnerId === p1?.id && (
                      <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className="truncate">
                      {p1 ? p1.name : 'Player 1'}
                    </span>
                  </div>
                  {p1 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      New Elo:{' '}
                      {scenarios ? scenarios.ifP1Wins.p1NewElo : p1.elo}
                    </p>
                  )}
                </div>
                {winnerId === p1?.id && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
              </button>

              <button
                type="button"
                disabled={!p2}
                aria-pressed={!!p2 && winnerId === p2.id}
                onClick={() => setWinnerId(p2?.id || '')}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                  winnerId === p2?.id
                    ? 'border-emerald-500 bg-emerald-500/15 shadow-sm ring-2 ring-emerald-500/40 text-foreground'
                    : 'border-border bg-background/40 hover:bg-background/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 font-semibold text-sm truncate">
                    {winnerId === p2?.id && (
                      <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className="truncate">
                      {p2 ? p2.name : 'Player 2'}
                    </span>
                  </div>
                  {p2 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      New Elo:{' '}
                      {scenarios ? scenarios.ifP2Wins.p2NewElo : p2.elo}
                    </p>
                  )}
                </div>
                {winnerId === p2?.id && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Score & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="match-score"
                className="text-xs font-semibold text-muted-foreground"
              >
                Match Score (Games/Sets)
              </Label>
              <Input
                id="match-score"
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g. 3-1 or 11-9, 11-8"
                className="bg-background/50 border-input font-mono text-sm"
              />
              <div
                role="group"
                aria-label="Quick score presets"
                className="flex flex-wrap gap-1.5 pt-1"
              >
                {quickScores.map((qs) => (
                  <button
                    key={qs}
                    type="button"
                    aria-pressed={score === qs}
                    aria-label={`Set score to ${qs}`}
                    onClick={() => setScore(qs)}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      score === qs
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background/40 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {qs}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="match-notes"
                className="text-xs font-semibold text-muted-foreground"
              >
                Match Notes (Optional)
              </Label>
              <Input
                id="match-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Tournament semi-final, overtime rally"
                className="bg-background/50 border-input text-sm"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
              {error}
            </p>
          )}

          <DialogFooter className="pt-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !player1Id || !player2Id || !winnerId}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm"
            >
              {isSubmitting ? 'Recording Game...' : 'Confirm & Apply Elo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
