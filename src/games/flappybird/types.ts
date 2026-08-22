export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export type GameStatus = 'idle' | 'playing' | 'gameover'

export interface Bird {
  y: number
  velocity: number
}

export interface Pipe {
  x: number
  /** A rés (gap) függőleges közepe */
  gapY: number
  /** Már elszámoltuk-e a pontot érte (a madár elhagyta) */
  passed: boolean
}

/**
 * Difficulty-specific paraméterek.
 * - scrollSpeed: mennyi px/s sebességgel görögnek a csövek. Nagyobb = gyorsabb.
 * - pipeGap: a rés magassága px-ben a cső két fele között. Kisebb = szűkebb, nehezebb.
 * - multiplier: hány pont jár egy átrepült csőért.
 */
export interface DifficultyConfig {
  key: Difficulty
  label: string
  emoji: string
  scrollSpeed: number
  pipeGap: number
  multiplier: number
  description: string
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  EASY: {
    key: 'EASY',
    label: 'Könnyű',
    emoji: '🌱',
    scrollSpeed: 140,
    pipeGap: 190,
    multiplier: 1,
    description: 'Lassú tempó, széles rés. Tanulásra ideális.',
  },
  MEDIUM: {
    key: 'MEDIUM',
    label: 'Közepes',
    emoji: '🔥',
    scrollSpeed: 190,
    pipeGap: 155,
    multiplier: 2,
    description: 'Klasszikus Flappy Bird érzés.',
  },
  HARD: {
    key: 'HARD',
    label: 'Nehéz',
    emoji: '⚡',
    scrollSpeed: 240,
    pipeGap: 125,
    multiplier: 3,
    description: 'Gyors csövek, szűk rés. Csak profiknak.',
  },
}

// Pálya-konstansok (px)
export const CANVAS_WIDTH = 400
export const CANVAS_HEIGHT = 600
export const GROUND_HEIGHT = 40

// Madár
export const BIRD_X = 90
export const BIRD_RADIUS = 14
export const GRAVITY = 1400 // px/s²
export const FLAP_VELOCITY = -420 // px/s (negatív = felfelé)
export const MAX_FALL_SPEED = 700 // px/s

// Csövek
export const PIPE_WIDTH = 64
export const PIPE_SPACING = 260 // px két cső-pár vízszintes távolsága
export const PIPE_MARGIN = 60 // px a rés közepe minimum ennyire legyen a tetőtől/talajtól
