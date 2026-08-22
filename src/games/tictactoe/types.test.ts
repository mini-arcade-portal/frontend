import { describe, expect, it } from 'vitest'
import {
  calculateFinalScore,
  checkWinner,
  DIFFICULTIES,
  EMPTY_BOARD,
  isBoardFull,
  WIN_LINES,
  type Board,
} from './types'

describe('checkWinner', () => {
  it('returns null for an empty board', () => {
    expect(checkWinner(EMPTY_BOARD)).toBeNull()
  })

  it('returns null for a full board with no winner (draw)', () => {
    const draw: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    expect(checkWinner(draw)).toBeNull()
  })

  it.each(WIN_LINES)('detects a win along line [%i, %i, %i]', (a, b, c) => {
    const board: Board = Array(9).fill(null)
    board[a] = 'X'
    board[b] = 'X'
    board[c] = 'X'
    const result = checkWinner(board)
    expect(result?.winner).toBe('X')
    expect(result?.line).toEqual([a, b, c])
  })
})

describe('isBoardFull', () => {
  it('is false for the empty board', () => {
    expect(isBoardFull(EMPTY_BOARD)).toBe(false)
  })

  it('is false when at least one cell is empty', () => {
    const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null]
    expect(isBoardFull(board)).toBe(false)
  })

  it('is true when every cell is filled', () => {
    const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    expect(isBoardFull(board)).toBe(true)
  })
})

describe('calculateFinalScore', () => {
  it.each(Object.values(DIFFICULTIES))(
    'multiplies streak length by the $key multiplier',
    (config) => {
      expect(calculateFinalScore(4, config.key)).toBe(4 * config.multiplier)
    }
  )
})

describe('DIFFICULTIES.drawCountsForStreak', () => {
  it('only HARD lets a draw continue the streak (unbeatable AI)', () => {
    expect(DIFFICULTIES.EASY.drawCountsForStreak).toBe(false)
    expect(DIFFICULTIES.MEDIUM.drawCountsForStreak).toBe(false)
    expect(DIFFICULTIES.HARD.drawCountsForStreak).toBe(true)
  })
})
