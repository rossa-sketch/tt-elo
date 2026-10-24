import React, { useState, useEffect } from 'react'
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
import { updatePlayerFn, deletePlayerFn } from '@/lib/server-actions'
import type { PlayerLeaderboardEntry } from '@/lib/types'
import { toast } from 'sonner'
import { Edit2, Trash2, AlertCircle } from 'lucide-react'

interface EditPlayerDialogProps {
  player: PlayerLeaderboardEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlayerUpdated: () => void
}

export function EditPlayerDialog({
  player,
  open,
  onOpenChange,
  onPlayerUpdated,
}: EditPlayerDialogProps) {
  const { adminPasscode } = useAdmin()
  const [name, setName] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (player) {
      setName(player.name)
      setShowDeleteConfirm(false)
      setError('')
    }
  }, [player])

  if (!player) return null

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanName = name.trim()
    if (!cleanName || cleanName.length < 2) {
      setError('Player name must be at least 2 characters')
      return
    }

    setIsUpdating(true)
    try {
      await updatePlayerFn({
        data: {
          id: player.id,
          name: cleanName,
          adminPasscode,
        },
      })
      toast.success('Player updated successfully')
      onOpenChange(false)
      onPlayerUpdated()
    } catch (err: any) {
      const msg = err?.message || 'Failed to update player'
      setError(msg)
      toast.error('Update failed', { description: msg })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePlayerFn({
        data: {
          id: player.id,
          adminPasscode,
        },
      })
      toast.success('Player removed from leaderboard')
      onOpenChange(false)
      onPlayerUpdated()
    } catch (err: any) {
      toast.error('Delete failed', {
        description: err?.message || 'Could not delete player',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-1">
            <Edit2 className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-xl text-center">
            Edit Player: {player.name}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Current Elo: {player.elo} ({player.tier.label})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="edit-player-name" className="text-xs font-semibold">
              Player Name
            </Label>
            <Input
              id="edit-player-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              className="bg-background/50 border-input"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium p-2 rounded bg-rose-500/10 border border-rose-500/20">
              {error}
            </p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || !name.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>

        {/* Delete Player Section */}
        <div className="border-t border-border pt-4 mt-2">
          {!showDeleteConfirm ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Remove Player from Leaderboard...
            </Button>
          ) : (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Remove {player.name}?</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                This hides the player from the active leaderboard. Their past
                matches remain recorded in match history.
              </p>
              <div className="flex gap-2 justify-end pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  {isDeleting ? 'Removing...' : 'Confirm Remove'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
