export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export type Player = 'X' | 'O'

export type CellValue = Player | null

export type Board = CellValue[]

export type RoundStatus = 'idle' | 'thinking' | 'won' | 'lost' | 'drawn'

export type GameStatus = 'active' | 'gameover'

export interface DifficultyConfig {
  key: Difficulty
  label: string
  emoji: string
  multiplier: number
  description: string
  /**
   * Hard-on a draw is folytatja a streak-et (lehetetlen nyerni minimax ellen).
   * Easy/Medium-on a draw megszakítja.
   */
  drawCountsForStreak: boolean
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  EASY: {
    key: 'EASY',
    label: 'Könnyű',
    emoji: '🌱',
    multiplier: 1,
    description: 'Az AI random módon lép. Tanulásra ideális.',
    drawCountsForStreak: false,
  },
  MEDIUM: {
    key: 'MEDIUM',
    label: 'Közepes',
    emoji: '🔥',
    multiplier: 2,
    description: 'Az AI blokkolja a vereséget és próbál nyerni.',
    drawCountsForStreak: false,
  },
  HARD: {
    key: 'HARD',
    label: 'Nehéz',
    emoji: '⚡',
    multiplier: 3,
    description:
      'Tökéletesen játszik (minimax). Itt a döntetlen is győzelem!',
    drawCountsForStreak: true,
  },
}

/** Üres board */
export const EMPTY_BOARD: Board = Array(9).fill(null)

/** A 8 lehetséges győztes vonal indexei */
export const WIN_LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // sorok
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // oszlopok
  [0, 4, 8],
  [2, 4, 6], // átlók
] as const

/**
 * Visszaadja a győztes Player-t és a győztes vonal indexeit, vagy null-t.
 */
export function checkWinner(
  board: Board
): { winner: Player; line: readonly number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line }
    }
  }
  return null
}

/** Tele-e a board? */
export function isBoardFull(board: Board): boolean {
  return board.every((c) => c !== null)
}

/**
 * Streak hossz × difficulty multiplier.
 */
export function calculateFinalScore(
  streakLength: number,
  difficulty: Difficulty
): number {
  return streakLength * DIFFICULTIES[difficulty].multiplier
}
