import { describe, it, expect } from 'vitest'
import {
  calculateExpectedScore,
  calculateMatchElo,
  previewMatchScenarios,
  getRankTier,
  updateStreak,
  RANK_TIERS,
} from './elo'

describe('Elo Rating System', () => {
  it('calculates 50% win probability for equally rated players', () => {
    const expected = calculateExpectedScore(1200, 1200)
    expect(expected).toBeCloseTo(0.5, 4)
  })

  it('calculates higher expected win probability for higher rated player', () => {
    const higherVsLower = calculateExpectedScore(1500, 1200)
    const lowerVsHigher = calculateExpectedScore(1200, 1500)

    expect(higherVsLower).toBeGreaterThan(0.8)
    expect(lowerVsHigher).toBeLessThan(0.2)
    expect(higherVsLower + lowerVsHigher).toBeCloseTo(1, 4)
  })

  it('awards significantly MORE Elo when winning against a higher ranked opponent (upset)', () => {
    // Underdog (1000) beats Favorite (1400)
    const underdogWin = calculateMatchElo(1000, 1400, 20, 20)
    // Favorite (1400) beats Underdog (1000)
    const favoriteWin = calculateMatchElo(1400, 1000, 20, 20)

    // A win against higher rank yields much more Elo than against lower rank
    expect(underdogWin.winnerDelta).toBeGreaterThan(favoriteWin.winnerDelta)
    expect(underdogWin.winnerDelta).toBeGreaterThanOrEqual(28)
    expect(favoriteWin.winnerDelta).toBeLessThanOrEqual(4)

    // Loser penalty matches winner gain (zero-sum)
    expect(underdogWin.loserDelta).toBe(-underdogWin.winnerDelta)
    expect(favoriteWin.loserDelta).toBe(-favoriteWin.winnerDelta)
  })

  it('penalizes significantly MORE Elo when losing to a lower ranked opponent', () => {
    // High rank (1500) loses to Low rank (1100) -> Low rank is the winner
    const highRankLoses = calculateMatchElo(1100, 1500, 20, 20)
    // Low rank (1100) loses to High rank (1500) -> High rank is the winner
    const lowRankLoses = calculateMatchElo(1500, 1100, 20, 20)

    // Losing to lower rank is a huge penalty (-29 vs -3)
    expect(Math.abs(highRankLoses.loserDelta)).toBeGreaterThan(
      Math.abs(lowRankLoses.loserDelta),
    )
  })

  it('maintains a minimum 1 Elo delta even for huge rating gaps', () => {
    const extremeMismatch = calculateMatchElo(2500, 500, 50, 50)
    expect(extremeMismatch.winnerDelta).toBeGreaterThanOrEqual(1)
    expect(extremeMismatch.loserDelta).toBeLessThanOrEqual(-1)
  })

  it('correctly previews match scenarios for both player win conditions', () => {
    const preview = previewMatchScenarios(1300, 1200)
    expect(preview.p1ExpectedWinRate).toBeGreaterThan(preview.p2ExpectedWinRate)
    expect(preview.ifP1Wins.p1Delta).toBeGreaterThan(0)
    expect(preview.ifP2Wins.p2Delta).toBeGreaterThan(0)
    // P2 is lower rank (1200), so if P2 wins, they gain more than if P1 (1300) wins
    expect(preview.ifP2Wins.p2Delta).toBeGreaterThan(preview.ifP1Wins.p1Delta)
  })

  it('assigns correct Rocket League style rank tiers based on Elo', () => {
    expect(getRankTier(800).label).toBe('Bronze I')
    expect(getRankTier(1000).label).toBe('Bronze II')
    expect(getRankTier(1100).label).toBe('Silver I')
    expect(getRankTier(1200).label).toBe('Gold I')
    expect(getRankTier(1300).label).toBe('Gold II')
    expect(getRankTier(1400).label).toBe('Platinum I')
    expect(getRankTier(1550).label).toBe('Diamond I')
    expect(getRankTier(1650).label).toBe('Diamond II')
    expect(getRankTier(1750).label).toBe('Champion I')
    expect(getRankTier(1850).label).toBe('Champion II')
    expect(getRankTier(1950).label).toBe('Grand Champion')
    expect(getRankTier(2100).label).toBe('Supersonic Legend')
  })

  it('tracks winning and losing streaks accurately', () => {
    expect(updateStreak(0, true)).toBe(1)
    expect(updateStreak(1, true)).toBe(2)
    expect(updateStreak(2, true)).toBe(3)
    // Win streak broken by loss
    expect(updateStreak(3, false)).toBe(-1)
    expect(updateStreak(-1, false)).toBe(-2)
    // Loss streak broken by win
    expect(updateStreak(-2, true)).toBe(1)
  })
})
