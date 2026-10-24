import React, { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Button } from '@/components/ui/button'
import { AdminLoginDialog } from '@/components/AdminLoginDialog'
import { AdminSettingsDialog } from '@/components/AdminSettingsDialog'
import { AddPlayerDialog } from '@/components/AddPlayerDialog'
import { RecordMatchDialog } from '@/components/RecordMatchDialog'
import type { PlayerLeaderboardEntry } from '@/lib/types'
import {
  Lock,
  Unlock,
  ShieldCheck,
  UserPlus,
  Swords,
  SlidersHorizontal,
  LogOut,
  Eye,
} from 'lucide-react'

interface AdminBarProps {
  players: PlayerLeaderboardEntry[]
  onDataRefresh: () => void
}

export function AdminBar({ players, onDataRefresh }: AdminBarProps) {
  const { isAdmin, logout } = useAdmin()
  const [loginOpen, setLoginOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [addPlayerOpen, setAddPlayerOpen] = useState(false)
  const [recordMatchOpen, setRecordMatchOpen] = useState(false)

  return (
    <>
      <header className="w-full bg-card/60 backdrop-blur-md border-b border-border/80 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-2.5" role="status">
            {isAdmin ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Mode Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/80 border border-border text-muted-foreground text-xs font-medium">
                <Eye className="w-3.5 h-3.5" />
                <span>Spectator Mode (Read-Only)</span>
              </div>
            )}
            <span className="hidden md:inline-block text-xs text-muted-foreground">
              {isAdmin
                ? 'Full control enabled: Record match results & register players'
                : 'Anyone can view leaderboard and simulate matchups'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Button
                  size="sm"
                  onClick={() => setAddPlayerOpen(true)}
                  aria-haspopup="dialog"
                  variant="outline"
                  className="h-8 text-xs font-semibold border-border hover:bg-secondary"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Add Player
                </Button>

                <Button
                  size="sm"
                  onClick={() => setRecordMatchOpen(true)}
                  aria-haspopup="dialog"
                  className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  <Swords className="w-3.5 h-3.5 mr-1.5" />
                  Record Match
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSettingsOpen(true)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  title="Admin Settings"
                  aria-label="Admin settings"
                  aria-haspopup="dialog"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={logout}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-400"
                  title="Exit Admin Mode"
                  aria-label="Exit admin mode"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => setLoginOpen(true)}
                aria-haspopup="dialog"
                variant="outline"
                className="h-8 text-xs font-semibold border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500"
              >
                <Lock className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Admin Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Dialogs */}
      <AdminLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <AdminSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onLeaderboardUpdated={onDataRefresh}
      />
      <AddPlayerDialog
        open={addPlayerOpen}
        onOpenChange={setAddPlayerOpen}
        onPlayerAdded={onDataRefresh}
      />
      <RecordMatchDialog
        open={recordMatchOpen}
        onOpenChange={setRecordMatchOpen}
        players={players}
        onMatchRecorded={onDataRefresh}
      />
    </>
  )
}
