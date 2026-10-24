import React, { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { deleteMatchFn } from '@/lib/server-actions'
import type { MatchRecord } from '@/lib/types'
import { toast } from 'sonner'
import {
  Trophy,
  History,
  RotateCcw,
  Sparkles,
  Zap,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MatchHistoryViewProps {
  matches: MatchRecord[]
  onDataRefresh: () => void
}

export function MatchHistoryView({
  matches,
  onDataRefresh,
}: MatchHistoryViewProps) {
  const { isAdmin, adminPasscode } = useAdmin()
  const [revertingMatchId, setRevertingMatchId] = useState<number | null>(null)
  const [confirmMatchId, setConfirmMatchId] = useState<number | null>(null)

  const handleRevertMatch = async (matchId: number) => {
    setRevertingMatchId(matchId)
    try {
      await deleteMatchFn({
        data: {
          id: matchId,
          adminPasscode,
        },
      })
      toast.success('Match reverted', {
        description: 'Both players have had their pre-match ratings restored.',
      })
      setConfirmMatchId(null)
      onDataRefresh()
    } catch (err: any) {
      toast.error('Could not revert match', {
        description: err?.message || 'Error occurred',
      })
    } finally {
      setRevertingMatchId(null)
    }
  }

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

      if (diffHours < 1) {
        const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)))
        return `${diffMins}m ago`
      }
      if (diffHours < 24) {
        return `${diffHours}h ago`
      }
      const diffDays = Math.floor(diffHours / 24)
      if (diffDays < 7) {
        return `${diffDays}d ago`
      }
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'Recently'
    }
  }

  if (matches.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-card/40">
        <History className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
        <h2 className="text-base font-semibold text-foreground">
          No Matches Recorded Yet
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          {isAdmin
            ? 'Click "Record Match" in the top bar to record the first table tennis match result.'
            : 'Match results will appear here as soon as the admin records games.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1 font-medium">
        <span>
          Showing {matches.length} recorded match
          {matches.length === 1 ? '' : 'es'}
        </span>
        <span>Latest matches first</span>
      </div>

      <div className="space-y-3">
        {matches.map((m) => {
          const p1IsWinner = m.winnerId === m.player1Id
          const winnerName = p1IsWinner ? m.player1Name : m.player2Name
          const loserName = p1IsWinner ? m.player2Name : m.player1Name
          const winnerEloBefore = p1IsWinner
            ? m.player1EloBefore
            : m.player2EloBefore
          const winnerEloAfter = p1IsWinner
            ? m.player1EloAfter
            : m.player2EloAfter
          const loserEloBefore = !p1IsWinner
            ? m.player1EloBefore
            : m.player2EloBefore
          const loserEloAfter = !p1IsWinner
            ? m.player1EloAfter
            : m.player2EloAfter

          const isUpset = m.eloDelta >= 22

          return (
            <div
              key={m.id}
              className="p-4 rounded-xl border border-border bg-card/70 backdrop-blur-sm shadow-sm hover:border-border/80 transition-all space-y-3"
            >
              {/* Match Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatTime(m.createdAt)}
                  </span>
                  {m.score && (
                    <span className="font-mono px-2 py-0.5 rounded bg-secondary text-foreground font-semibold border border-border">
                      {m.score}
                    </span>
                  )}
                  {isUpset && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      <Zap className="w-3 h-3" />
                      Upset (+{m.eloDelta} Elo)
                    </span>
                  )}
                </div>

                {/* Admin Revert Action */}
                {isAdmin && (
                  <div>
                    {confirmMatchId !== m.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmMatchId(m.id)}
                        className="h-7 text-xs text-muted-foreground hover:text-rose-400"
                        title="Revert match rating changes"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        Revert
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-rose-400 font-medium">
                          Revert?
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmMatchId(null)}
                          className="h-6 text-[11px] px-1.5"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          disabled={revertingMatchId === m.id}
                          onClick={() => handleRevertMatch(m.id)}
                          className="h-6 text-[11px] px-2 bg-rose-600 hover:bg-rose-500 text-white"
                        >
                          {revertingMatchId === m.id
                            ? 'Reverting...'
                            : 'Yes, Revert'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Match Outcome Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                {/* Winner Card */}
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider block text-[10px]">
                        Winner
                      </span>
                      <span className="font-semibold text-sm text-foreground truncate block">
                        {winnerName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 font-bold text-sm block">
                      +{m.eloDelta} ELO
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {winnerEloBefore} →{' '}
                      <strong className="text-foreground">
                        {winnerEloAfter}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Loser Card */}
                <div className="p-3 rounded-lg bg-background/50 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-muted-foreground font-bold text-xs">
                      L
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs uppercase font-medium text-muted-foreground tracking-wider block text-[10px]">
                        Defeated
                      </span>
                      <span className="font-semibold text-sm text-muted-foreground truncate block">
                        {loserName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-rose-400 font-bold text-sm block">
                      -{m.eloDelta} ELO
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {loserEloBefore} →{' '}
                      <strong className="text-foreground">
                        {loserEloAfter}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Notes */}
              {m.notes && (
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
                  <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/70" />
                  <span>{m.notes}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
