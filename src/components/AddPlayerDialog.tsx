import React, { useState } from 'react'
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
import { createPlayerFn } from '@/lib/server-actions'
import { getRankTier } from '@/lib/elo'
import { RankBadge } from '@/components/RankBadge'
import { toast } from 'sonner'
import { UserPlus, Sparkles } from 'lucide-react'

interface AddPlayerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlayerAdded: () => void
}

export function AddPlayerDialog({
  open,
  onOpenChange,
  onPlayerAdded,
}: AddPlayerDialogProps) {
  const { adminPasscode } = useAdmin()
  const [name, setName] = useState('')
  const [startingElo, setStartingElo] = useState<number>(1200)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const tier = getRankTier(startingElo)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanName = name.trim()
    if (!cleanName) {
      setError('Please provide a player name')
      return
    }
    if (cleanName.length < 2) {
      setError('Player name must be at least 2 characters')
      return
    }

    setIsSubmitting(true)
    try {
      await createPlayerFn({
        data: {
          name: cleanName,
          startingElo,
          adminPasscode,
        },
      })
      toast.success('Player added successfully!', {
        description: `${cleanName} joined the leaderboard at ${startingElo} Elo (${tier.label}).`,
      })
      setName('')
      setStartingElo(1200)
      onOpenChange(false)
      onPlayerAdded()
    } catch (err: any) {
      const msg = err?.message || 'Failed to add player'
      setError(msg)
      toast.error('Could not add player', { description: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-1">
            <UserPlus className="w-6 h-6 text-emerald-400" />
          </div>
          <DialogTitle className="text-xl text-center">
            Register New Player
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Add a table tennis competitor to the official leaderboard ladder.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="player-name" className="text-sm font-medium">
              Player Full Name / Tag{' '}
              <span className="text-rose-400" aria-hidden="true">
                *
              </span>
            </Label>
            <Input
              id="player-name"
              type="text"
              placeholder="e.g. Jordan Smith or 'The Spin Doctor'"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              className="bg-background/50 border-input"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="starting-elo" className="text-sm font-medium">
                Initial Elo Rating
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Placement Tier:
                </span>
                <RankBadge elo={startingElo} size="sm" />
              </div>
            </div>
            <Input
              id="starting-elo"
              type="number"
              min={100}
              max={3000}
              step={25}
              value={startingElo}
              onChange={(e) => setStartingElo(Number(e.target.value) || 1200)}
              className="bg-background/50 border-input font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Standard default is 1,200 Elo (Gold I baseline). Elo adjusts
              rapidly during the first 10 placement matches.
            </p>
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium p-2 rounded bg-rose-500/10 border border-rose-500/20">
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
              disabled={isSubmitting || !name.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm"
            >
              {isSubmitting ? 'Registering...' : 'Add to Leaderboard'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
