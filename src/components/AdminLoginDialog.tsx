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
import { Lock, KeyRound, ShieldCheck } from 'lucide-react'

interface AdminLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminLoginDialog({
  open,
  onOpenChange,
}: AdminLoginDialogProps) {
  const { login, isVerifying } = useAdmin()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!passcode.trim()) {
      setError('Please enter the admin passcode')
      return
    }

    const success = await login(passcode)
    if (success) {
      setPasscode('')
      onOpenChange(false)
    } else {
      setError('Invalid passcode. Default passcode is "spinmaster"')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <DialogTitle className="text-xl text-center">
            Admin Access
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Enter the admin passcode to record match results, add new players,
            or manage leaderboard settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="admin-passcode" className="text-sm font-medium">
              Admin Passcode
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="admin-passcode"
                type="password"
                placeholder="Enter passcode..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value)
                  setError('')
                }}
                className="pl-9 bg-background/50 border-input"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Leaderboard Security</span>
            </div>
            <p>
              Visitors can freely view ranks and simulate matches. Only
              authenticated admins can modify leaderboard data.
            </p>
            <p className="pt-1 text-emerald-400 font-mono text-[11px]">
              Default passcode:{' '}
              <span className="font-semibold underline">spinmaster</span>
            </p>
          </div>

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
              disabled={isVerifying}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm"
            >
              {isVerifying ? 'Verifying...' : 'Unlock Admin Controls'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
