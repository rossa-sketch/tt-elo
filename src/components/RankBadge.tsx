import React from 'react'
import { Shield, Star, Zap, Sparkles, Flame, Trophy, Crown } from 'lucide-react'
import type { RankTier } from '@/lib/elo'
import { getRankTier } from '@/lib/elo'

interface RankBadgeProps {
  tier?: RankTier
  elo?: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showDivision?: boolean
}

export function RankBadge({
  tier: propTier,
  elo,
  size = 'md',
  showIcon = true,
  showDivision = true,
}: RankBadgeProps) {
  const tier =
    propTier || (elo !== undefined ? getRankTier(elo) : getRankTier(1200))

  const renderIcon = () => {
    const iconProps = {
      className:
        size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5',
      style: { color: tier.textColor },
    }

    switch (tier.icon) {
      case 'crown':
        return <Crown {...iconProps} />
      case 'trophy':
        return <Trophy {...iconProps} />
      case 'flame':
        return <Flame {...iconProps} />
      case 'sparkles':
        return <Sparkles {...iconProps} />
      case 'zap':
        return <Zap {...iconProps} />
      case 'star':
        return <Star {...iconProps} />
      case 'shield':
      default:
        return <Shield {...iconProps} />
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm transition-all duration-200 select-none ${sizeClasses[size]}`}
      style={{
        backgroundColor: tier.bgColor,
        borderColor: tier.borderColor,
        color: tier.textColor,
      }}
    >
      {showIcon && renderIcon()}
      <span>{showDivision ? tier.label : tier.name}</span>
    </span>
  )
}
