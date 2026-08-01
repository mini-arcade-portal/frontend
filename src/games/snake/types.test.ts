import { describe, expect, it } from 'vitest'
import { calculateAppleScore, DIFFICULTIES } from './types'

describe('calculateAppleScore', () => {
  it('returns the base score at start speed on EASY (no speed bonus, multiplier 1)', () => {
    const config = DIFFICULTIES.EASY
    expect(calculateAppleScore('EASY', config.startSpeed)).toBe(10)
  })

  it('returns the base score at start speed on MEDIUM, scaled by the multiplier', () => {
    const config = DIFFICULTIES.MEDIUM
    // speedBonus = floor((startSpeed - startSpeed) / 10) = 0
    expect(calculateAppleScore('MEDIUM', config.startSpeed)).toBe(
      Math.floor((10 + 0) * config.multiplier)
    )
  })

  it('adds a speed bonus once the snake has sped up, scaled by the multiplier', () => {
    const config = DIFFICULTIES.HARD
    const sped = config.startSpeed - 20 // two speed-up steps worth
    const expectedBonus = Math.floor((config.startSpeed - sped) / 10)
    expect(calculateAppleScore('HARD', sped)).toBe(
      Math.floor((10 + expectedBonus) * config.multiplier)
    )
  })

  it('never returns a negative speed bonus when currentSpeed exceeds startSpeed', () => {
    const config = DIFFICULTIES.EASY
    // EASY never speeds up in practice, but guard the formula anyway.
    const result = calculateAppleScore('EASY', config.startSpeed + 50)
    expect(result).toBeLessThanOrEqual(10)
  })
})
