export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export interface Position {
  x: number
  y: number
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover'

/**
 * Difficulty-specific paraméterek.
 * - startSpeed: milyen lassan indul (ms / lépés). Nagyobb = lassabb.
 * - speedUpEvery: hány alma után gyorsuljon
 * - speedUpStep: mennyivel gyorsuljon (ms-ben)
 * - minSpeed: alsó határ a sebességre
 * - multiplier: score szorzó
 */
export interface DifficultyConfig {
  key: Difficulty
  label: string
  emoji: string
  startSpeed: number
  speedUpEvery: number
  speedUpStep: number
  minSpeed: number
  multiplier: number
  description: string
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  EASY: {
    key: 'EASY',
    label: 'Könnyű',
    emoji: '🌱',
    startSpeed: 180,
    speedUpEvery: Infinity, // nincs gyorsulás
    speedUpStep: 0,
    minSpeed: 180,
    multiplier: 1,
    description: 'Lassú tempó, nem gyorsul. Tanulásra ideális.',
  },
  MEDIUM: {
    key: 'MEDIUM',
    label: 'Közepes',
    emoji: '🔥',
    startSpeed: 130,
    speedUpEvery: 5,
    speedUpStep: 5,
    minSpeed: 70,
    multiplier: 1.3,
    description: 'Klasszikus Snake érzés. Minden 5 alma után gyorsul.',
  },
  HARD: {
    key: 'HARD',
    label: 'Nehéz',
    emoji: '⚡',
    startSpeed: 90,
    speedUpEvery: 3,
    speedUpStep: 5,
    minSpeed: 50,
    multiplier: 1.6,
    description: 'Gyors kezdés és gyors gyorsulás. Csak profiknak.',
  },
}

export const BOARD_SIZE = 15

export const BASE_APPLE_SCORE = 10

/**
 * Score formula:
 *   total = (base + speedBonus) × multiplier
 */
export function calculateAppleScore(
  difficulty: Difficulty,
  currentSpeed: number
): number {
  const config = DIFFICULTIES[difficulty]
  const speedBonus = Math.floor((config.startSpeed - currentSpeed) / 10)
  return Math.floor((BASE_APPLE_SCORE + speedBonus) * config.multiplier)
}
