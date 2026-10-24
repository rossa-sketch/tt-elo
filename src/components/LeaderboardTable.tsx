import React, { useState, useMemo } from 'react'
import { RankBadge } from '@/components/RankBadge'
import { EditPlayerDialog } from '@/components/EditPlayerDialog'
import { PlayerProfileModal } from '@/components/PlayerProfileModal'
import { RecordMatchDialog } from '@/components/RecordMatchDialog'
import { useAdmin } from '@/lib/admin-context'
import type { PlayerLeaderboardEntry, MatchRecord } from '@/lib/types'
import {
  Trophy,
  Crown,
  Medal,
  Star,
  Search,
  ArrowUpDown,
  Flame,
  Swords,
  Edit2,
  TrendingUp,
  UserX,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface LeaderboardTableProps {
  players: PlayerLeaderboardEntry[]
  matches: MatchRecord[]
  onDataRefresh: () => void
  onChallengePlayer?: (player: PlayerLeaderboardEntry) => void
}

export function LeaderboardTable({
  players,
  matches,
  onDataRefresh,
  onChallengePlayer,
}: LeaderboardTableProps) {
  const { isAdmin } = useAdmin()
  const [search, setSearch] = useState('')
  const [selectedTierGroup, setSelectedTierGroup] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'elo' | 'wins' | 'winRate' | 'streak'>(
    'elo',
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Modals state
  const [editingPlayer, setEditingPlayer] =
    useState<PlayerLeaderboardEntry | null>(null)
  const [inspectingPlayer, setInspectingPlayer] =
    useState<PlayerLeaderboardEntry | null>(null)
  const [preselectedPlayer, setPreselectedPlayer] =
    useState<PlayerLeaderboardEntry | null>(null)

  const tierGroups = [
    { id: 'all', label: 'All Tiers' },
    { id: 'Champion', label: 'Champion+' },
    { id: 'Diamond', label: 'Diamond' },
    { id: 'Platinum', label: 'Platinum' },
    { id: 'Gold', label: 'Gold' },
    { id: 'Silver', label: 'Silver' },
    { id: 'Bronze', label: 'Bronze' },
  ]

  const filteredPlayers = useMemo(() => {
    let result = [...players]

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter((p) => p.name.toLowerCase().includes(q))
    }

    if (selectedTierGroup !== 'all') {
      if (selectedTierGroup === 'Champion') {
        result = result.filter(
          (p) =>
            p.tier.name.includes('Champion') ||
            p.tier.name.includes('Supersonic'),
        )
      } else {
        result = result.filter((p) => p.tier.name === selectedTierGroup)
      }
    }

    result.sort((a, b) => {
      let diff = 0
      if (sortBy === 'elo') diff = a.elo - b.elo
      else if (sortBy === 'wins') diff = a.wins - b.wins
      else if (sortBy === 'winRate') diff = a.winRate - b.winRate
      else if (sortBy === 'streak') diff = a.currentStreak - b.currentStreak

      return sortOrder === 'desc' ? -diff : diff
    })

    return result
  }, [players, search, selectedTierGroup, sortBy, sortOrder])

  const toggleSort = (column: 'elo' | 'wins' | 'winRate' | 'streak') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const ariaSortFor = (
    column: 'elo' | 'wins' | 'winRate' | 'streak',
  ): 'ascending' | 'descending' | 'none' =>
    sortBy === column
      ? sortOrder === 'asc'
        ? 'ascending'
        : 'descending'
      : 'none'

  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-xs shadow-[0_0_12px_rgba(245,158,11,0.3)]">
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="sr-only">{rank}</span>
        </span>
      )
    }
    if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40 flex items-center justify-center font-bold text-xs">
          <Medal className="w-4 h-4 text-slate-300" />
          <span className="sr-only">{rank}</span>
        </span>
      )
    }
    if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-bold text-xs">
          <Star className="w-3.5 h-3.5 text-amber-600" />
          <span className="sr-only">{rank}</span>
        </span>
      )
    }
    return (
      <span className="w-7 h-7 rounded-full bg-secondary text-muted-foreground flex items-center justify-center font-mono font-semibold text-xs">
        {rank}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Tier Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search players by name"
            placeholder="Search players by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card/60 border-border"
          />
        </div>

        {/* Tier Group Pills */}
        <div
          role="group"
          aria-label="Filter by rank tier"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
        >
          {tierGroups.map((tg) => (
            <button
              key={tg.id}
              type="button"
              aria-pressed={selectedTierGroup === tg.id}
              onClick={() => setSelectedTierGroup(tg.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedTierGroup === tg.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {tg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Leaderboard Table Container */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="py-3.5 pl-4 pr-2 w-14 text-center">
                  Rank
                </th>
                <th scope="col" className="py-3.5 px-3">
                  Player
                </th>
                <th scope="col" className="py-3.5 px-3">
                  Rank Tier
                </th>
                <th
                  scope="col"
                  aria-sort={ariaSortFor('elo')}
                  className="py-3.5 px-3 select-none"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort('elo')}
                    className="flex items-center gap-1 uppercase tracking-wider cursor-pointer rounded hover:text-foreground"
                  >
                    <span>Rating (ELO)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th
                  scope="col"
                  aria-sort={ariaSortFor('wins')}
                  className="py-3.5 px-3 select-none hidden md:table-cell"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort('wins')}
                    className="flex items-center gap-1 uppercase tracking-wider cursor-pointer rounded hover:text-foreground"
                  >
                    <span>Record (W-L)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th
                  scope="col"
                  aria-sort={ariaSortFor('winRate')}
                  className="py-3.5 px-3 select-none hidden sm:table-cell"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort('winRate')}
                    className="flex items-center gap-1 uppercase tracking-wider cursor-pointer rounded hover:text-foreground"
                  >
                    <span>Win %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th
                  scope="col"
                  aria-sort={ariaSortFor('streak')}
                  className="py-3.5 px-3 select-none hidden lg:table-cell"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort('streak')}
                    className="flex items-center gap-1 uppercase tracking-wider cursor-pointer rounded hover:text-foreground"
                  >
                    <span>Streak</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3.5 pr-4 pl-2 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50 text-sm">
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserX className="w-8 h-8 opacity-40" />
                      <p className="font-medium">
                        No players found matching your filters
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearch('')
                          setSelectedTierGroup('all')
                        }}
                        className="text-xs text-primary"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player) => {
                  const isTopThree = player.rank <= 3
                  const isPositiveStreak = player.currentStreak > 0

                  return (
                    <tr
                      key={player.id}
                      className={`group hover:bg-secondary/40 transition-colors ${
                        isTopThree ? 'bg-secondary/15' : ''
                      }`}
                    >
                      {/* Rank Number */}
                      <td className="py-3 pl-4 pr-2 text-center">
                        <div className="flex justify-center">
                          {renderRankBadge(player.rank)}
                        </div>
                      </td>

                      {/* Player Name & Avatar */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => setInspectingPlayer(player)}
                          aria-haspopup="dialog"
                          className="flex items-center gap-2.5 text-left rounded-md group-hover:text-primary transition-colors"
                        >
                          <div
                            aria-hidden="true"
                            className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0"
                          >
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block group-hover:text-primary">
                              {player.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground block lg:hidden">
                              {player.wins}W - {player.losses}L (
                              {player.winRate}%)
                            </span>
                          </div>
                        </button>
                      </td>

                      {/* Rank Tier Badge */}
                      <td className="py-3 px-3">
                        <RankBadge tier={player.tier} size="md" />
                      </td>

                      {/* Elo Rating */}
                      <td className="py-3 px-3">
                        <div className="font-mono">
                          <span className="text-base font-bold text-foreground">
                            {player.elo}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-1.5 hidden xl:inline">
                            (Peak: {player.highestElo})
                          </span>
                        </div>
                      </td>

                      {/* Record */}
                      <td className="py-3 px-3 hidden md:table-cell font-mono text-xs">
                        <span className="text-emerald-400 font-semibold">
                          {player.wins}W
                        </span>
                        <span className="text-muted-foreground mx-1">-</span>
                        <span className="text-rose-400 font-semibold">
                          {player.losses}L
                        </span>
                        <span className="text-muted-foreground text-[10px] ml-1.5">
                          ({player.matchesPlayed} total)
                        </span>
                      </td>

                      {/* Win Rate */}
                      <td className="py-3 px-3 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xs font-bold ${
                              player.winRate >= 60
                                ? 'text-emerald-400'
                                : player.winRate >= 45
                                  ? 'text-amber-400'
                                  : 'text-muted-foreground'
                            }`}
                          >
                            {player.winRate}%
                          </span>
                          <div
                            aria-hidden="true"
                            className="w-12 h-1.5 rounded-full bg-secondary hidden md:block overflow-hidden"
                          >
                            <div
                              className={`h-full rounded-full ${
                                player.winRate >= 60
                                  ? 'bg-emerald-500'
                                  : player.winRate >= 45
                                    ? 'bg-amber-500'
                                    : 'bg-muted-foreground'
                              }`}
                              style={{ width: `${player.winRate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Streak */}
                      <td className="py-3 px-3 hidden lg:table-cell font-mono text-xs">
                        {player.currentStreak !== 0 ? (
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${
                              isPositiveStreak
                                ? 'text-amber-400'
                                : 'text-blue-400'
                            }`}
                          >
                            {isPositiveStreak ? (
                              <>
                                <Flame className="w-3.5 h-3.5 text-amber-400" />
                                {player.currentStreak}W
                              </>
                            ) : (
                              <>{Math.abs(player.currentStreak)}L</>
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 pr-4 pl-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Simulate Match button for everyone */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (onChallengePlayer) {
                                onChallengePlayer(player)
                              } else {
                                setInspectingPlayer(player)
                              }
                            }}
                            className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                            title="Simulate Match"
                            aria-label={`Simulate match against ${player.name}`}
                          >
                            <Swords className="w-3.5 h-3.5 sm:mr-1 text-primary" />
                            <span className="hidden sm:inline">Simulate</span>
                          </Button>

                          {/* Admin Edit Controls */}
                          {isAdmin && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreselectedPlayer(player)}
                                className="h-7 text-xs px-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                title="Record match with this player"
                                aria-label={`Record match with ${player.name}`}
                                aria-haspopup="dialog"
                              >
                                Record
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingPlayer(player)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                title="Edit Player"
                                aria-label={`Edit ${player.name}`}
                                aria-haspopup="dialog"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Details Modal */}
      <PlayerProfileModal
        player={inspectingPlayer}
        matches={matches}
        open={!!inspectingPlayer}
        onOpenChange={(open) => !open && setInspectingPlayer(null)}
        onChallengePlayer={onChallengePlayer}
      />

      {/* Admin Edit Player Modal */}
      <EditPlayerDialog
        player={editingPlayer}
        open={!!editingPlayer}
        onOpenChange={(open) => !open && setEditingPlayer(null)}
        onPlayerUpdated={onDataRefresh}
      />

      {/* Admin Record Match with preselected player */}
      {preselectedPlayer && (
        <RecordMatchDialog
          open={!!preselectedPlayer}
          onOpenChange={(open) => !open && setPreselectedPlayer(null)}
          players={players}
          preselectedPlayerId={preselectedPlayer.id}
          onMatchRecorded={onDataRefresh}
        />
      )}
    </div>
  )
}
