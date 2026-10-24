import React, { useRef, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getLeaderboardFn } from '@/lib/server-actions'
import { AdminBar } from '@/components/AdminBar'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { MatchHistoryView } from '@/components/MatchHistoryView'
import { MatchPredictor } from '@/components/MatchPredictor'
import { RankTiersGuide } from '@/components/RankTiersGuide'
import { RankBadge } from '@/components/RankBadge'
import { useAdmin } from '@/lib/admin-context'
import type { PlayerLeaderboardEntry } from '@/lib/types'
import {
  Trophy,
  Users,
  Swords,
  Award,
  Zap,
  TrendingUp,
  History,
  Calculator,
  Shield,
  CircleDot,
} from 'lucide-react'

type TabId = 'leaderboard' | 'matches' | 'predictor' | 'tiers'

export const Route = createFileRoute('/')({
  loader: async () => {
    return await getLeaderboardFn()
  },
  component: HomePage,
})

function HomePage() {
  const router = useRouter()
  const data = Route.useLoaderData()
  const { isAdmin } = useAdmin()

  const [activeTab, setActiveTab] = useState<TabId>('leaderboard')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [challengePlayer, setChallengePlayer] =
    useState<PlayerLeaderboardEntry | null>(null)

  const players = data?.players || []
  const matches = data?.matches || []

  const topPlayer = players[0]
  const totalMatches = matches.length
  const totalPlayers = players.length
  const peakElo = players.reduce((max, p) => Math.max(max, p.highestElo), 1200)

  const tabs: Array<{
    id: TabId
    label: string
    icon: typeof Trophy
    count?: number
  }> = [
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      count: players.length,
    },
    {
      id: 'matches',
      label: 'Match History',
      icon: History,
      count: matches.length,
    },
    { id: 'predictor', label: 'Match Simulator & Odds', icon: Calculator },
    { id: 'tiers', label: 'Skill Tiers & Elo Rules', icon: Shield },
  ]

  // Arrow/Home/End navigation between tabs (WAI-ARIA tabs pattern)
  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (e.key === 'ArrowLeft')
      next = (index - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    if (next === null) return
    e.preventDefault()
    setActiveTab(tabs[next].id)
    tabRefs.current[next]?.focus()
  }

  const handleRefresh = () => {
    router.invalidate()
  }

  const handleChallenge = (p: PlayerLeaderboardEntry) => {
    setChallengePlayer(p)
    setActiveTab('predictor')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Admin Bar */}
      <AdminBar players={players} onDataRefresh={handleRefresh} />

      {/* Main Content Container */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 outline-none max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8"
      >
        {/* Hero & Brand Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-card to-card/50 p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <CircleDot className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Rocket League Style Elo System</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground flex items-center gap-3">
                <span>TopSpin Elo</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Official table tennis competitive leaderboard. Beat
                higher-ranked players for massive upset Elo rewards; defend your
                rank against lower seeds where defeats carry heavy rating
                penalties.
              </p>
            </div>

            {/* Top Ranked Player Spotlight */}
            {topPlayer && (
              <section
                aria-label="Current table champion"
                className="w-full md:w-auto p-4 rounded-2xl bg-secondary/60 border border-amber-500/30 backdrop-blur-md shrink-0 shadow-[0_0_24px_rgba(245,158,11,0.12)]"
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  <Trophy className="w-4 h-4" />
                  <span>Current Table Champion</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-300 text-base shadow-inner">
                    {topPlayer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-base text-foreground">
                      {topPlayer.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-bold text-sm text-foreground">
                        {topPlayer.elo} ELO
                      </span>
                      <RankBadge tier={topPlayer.tier} size="sm" />
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-lg font-bold font-mono text-foreground block">
                  {totalPlayers}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Active Competitors
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Swords className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-lg font-bold font-mono text-foreground block">
                  {totalMatches}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Matches Recorded
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-lg font-bold font-mono text-amber-300 block">
                  {peakElo}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  All-Time Peak Rating
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg font-bold font-mono text-emerald-400 block">
                  ±32 ELO
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Max Upset Swing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          role="tablist"
          aria-label="Leaderboard sections"
          className="flex items-center gap-2 border-b border-border pb-px overflow-x-auto scrollbar-none"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring ${
                  isActive
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground font-mono">
                    <span className="sr-only">(</span>
                    {tab.count}
                    <span className="sr-only">)</span>
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content Panels */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className="pt-2 rounded-lg"
        >
          {activeTab === 'leaderboard' && (
            <LeaderboardTable
              players={players}
              matches={matches}
              onDataRefresh={handleRefresh}
              onChallengePlayer={handleChallenge}
            />
          )}

          {activeTab === 'matches' && (
            <MatchHistoryView matches={matches} onDataRefresh={handleRefresh} />
          )}

          {activeTab === 'predictor' && (
            <MatchPredictor
              players={players}
              matches={matches}
              initialPlayer1Id={challengePlayer?.id}
              onMatchRecorded={handleRefresh}
            />
          )}

          {activeTab === 'tiers' && <RankTiersGuide />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-card/40 py-8 mt-12 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          <div className="flex items-center justify-center gap-2 font-semibold text-foreground">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>TopSpin Elo Table Tennis League</span>
          </div>
          <p>
            Competitive Elo ranking engine powered by Netlify Database with
            Rocket League style tier progression.
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            {isAdmin
              ? 'Admin Mode enabled. Changes update live in database.'
              : 'Spectator Mode: Visit as admin to record games and add players.'}
          </p>
        </div>
      </footer>
    </div>
  )
}
