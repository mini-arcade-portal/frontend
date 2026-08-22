import { describe, expect, it } from 'vitest'
import { DIFFICULTIES } from './types'

describe('DIFFICULTIES', () => {
  it('gets faster as the difficulty increases', () => {
    expect(DIFFICULTIES.EASY.scrollSpeed).toBeLessThan(
      DIFFICULTIES.MEDIUM.scrollSpeed
    )
    expect(DIFFICULTIES.MEDIUM.scrollSpeed).toBeLessThan(
      DIFFICULTIES.HARD.scrollSpeed
    )
  })

  it('gets a narrower pipe gap as the difficulty increases', () => {
    expect(DIFFICULTIES.EASY.pipeGap).toBeGreaterThan(
      DIFFICULTIES.MEDIUM.pipeGap
    )
    expect(DIFFICULTIES.MEDIUM.pipeGap).toBeGreaterThan(
      DIFFICULTIES.HARD.pipeGap
    )
  })

  it('gets a higher score multiplier as the difficulty increases', () => {
    expect(DIFFICULTIES.EASY.multiplier).toBeLessThan(
      DIFFICULTIES.MEDIUM.multiplier
    )
    expect(DIFFICULTIES.MEDIUM.multiplier).toBeLessThan(
      DIFFICULTIES.HARD.multiplier
    )
  })
})
