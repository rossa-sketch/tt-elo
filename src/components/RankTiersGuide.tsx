import React from 'react'
import { RANK_TIERS } from '@/lib/elo'
import { RankBadge } from '@/components/RankBadge'
import {
  Trophy,
  Shield,
  Zap,
  TrendingUp,
  Sparkles,
  HelpCircle,
  Award,
} from 'lucide-react'

export function RankTiersGuide() {
  return (
    <div className="space-y-8">
      {/* Explanation Banner */}
      <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-base text-foreground">
              How Elo Rating Works
            </h2>
            <p className="text-xs text-muted-foreground">
              Inspired by competitive ranking algorithms used in Rocket League
              and international chess.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-background/70 border border-border space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Upsets Gain More Elo</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When a lower-ranked player defeats a higher-ranked opponent, the
              system rewards a large Elo swing (up to{' '}
              <strong>+32 to +48</strong> rating points) because the outcome was
              statistically unexpected.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-background/70 border border-border space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-rose-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Lower Rank Losses Hurt More</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If a high-ranked player loses to a lower-ranked player, they
              suffer a severe rating penalty. Conversely, losing to someone
              ranked higher costs very few points.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-background/70 border border-border space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-Sum Conservation</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every match preserves rating balance: the exact number of Elo
              points gained by the victor is deducted from the loser, keeping
              the ladder fair and inflation-free.
            </p>
          </div>
        </div>
      </div>

      {/* Rank Ladder Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1 font-semibold">
          <span>Competitive Skill Tiers & Divisions</span>
          <span>From Novice to World Class</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RANK_TIERS.map((tier) => (
            <div
              key={tier.label}
              className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm flex items-center justify-between transition-all hover:scale-[1.01]"
              style={{
                borderColor: tier.borderColor,
              }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <RankBadge tier={tier} size="md" />
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {tier.minElo} – {tier.maxElo > 9000 ? 'Peak' : tier.maxElo}{' '}
                  ELO
                </p>
              </div>

              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: tier.bgColor,
                  borderColor: tier.borderColor,
                  color: tier.textColor,
                }}
              >
                <Award className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
