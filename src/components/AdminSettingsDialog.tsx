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
import { changePasscodeFn, resetLeaderboardFn } from '@/lib/server-actions'
import { toast } from 'sonner'
import { SlidersHorizontal, Key, RotateCcw, AlertTriangle } from 'lucide-react'

interface AdminSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLeaderboardUpdated: () => void
}

export function AdminSettingsDialog({
  open,
  onOpenChange,
  onLeaderboardUpdated,
}: AdminSettingsDialogProps) {
  const { adminPasscode } = useAdmin()
  const [newPasscode, setNewPasscode] = useState('')
  const [confirmPasscode, setConfirmPasscode] = useState('')
  const [isChangingPass, setIsChangingPass] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPasscode.length < 4) {
      toast.error('Passcode must be at least 4 characters long')
      return
    }
    if (newPasscode !== confirmPasscode) {
      toast.error('New passcodes do not match')
      return
    }

    setIsChangingPass(true)
    try {
      await changePasscodeFn({
        data: {
          currentPasscode: adminPasscode,
          newPasscode,
        },
      })
      toast.success('Admin passcode updated successfully!')
      setNewPasscode('')
      setConfirmPasscode('')
      onOpenChange(false)
    } catch (err: any) {
      toast.error('Error changing passcode', {
        description: err?.message || 'Failed to update passcode',
      })
    } finally {
      setIsChangingPass(false)
    }
  }

  const handleResetData = async () => {
    setIsResetting(true)
    try {
      await resetLeaderboardFn({
        data: { adminPasscode },
      })
      toast.success('Leaderboard reset to initial seed state')
      setShowResetConfirm(false)
      onOpenChange(false)
      onLeaderboardUpdated()
    } catch (err: any) {
      toast.error('Reset failed', {
        description: err?.message || 'Could not reset leaderboard',
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-1">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-xl text-center">
            Admin Settings
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Configure administrative security and leaderboard maintenance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Change Passcode Section */}
          <form
            onSubmit={handleChangePassword}
            className="space-y-3 border-b border-border pb-5"
          >
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Change Admin Passcode</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-passcode" className="text-xs">
                New Passcode
              </Label>
              <Input
                id="new-passcode"
                type="password"
                placeholder="Enter at least 4 characters"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                className="bg-background/50 border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-passcode" className="text-xs">
                Confirm New Passcode
              </Label>
              <Input
                id="confirm-passcode"
                type="password"
                placeholder="Re-enter new passcode"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                className="bg-background/50 border-input"
              />
            </div>

            <Button
              type="submit"
              disabled={isChangingPass || !newPasscode}
              variant="secondary"
              className="w-full text-xs"
            >
              {isChangingPass ? 'Updating...' : 'Update Passcode'}
            </Button>
          </form>

          {/* Reset Leaderboard Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset Leaderboard Data</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Clears current match history and resets players to standard
              starting ratings with sample players.
            </p>

            {!showResetConfirm ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowResetConfirm(true)}
                className="w-full text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
              >
                Reset to Default Seeds...
              </Button>
            ) : (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-300 font-medium">
                    Are you sure? This will wipe recent match history and
                    restore seed players.
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResetConfirm(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isResetting}
                    onClick={handleResetData}
                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                  >
                    {isResetting ? 'Resetting...' : 'Yes, Reset Now'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
