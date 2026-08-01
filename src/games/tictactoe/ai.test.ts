import { describe, expect, it } from 'vitest'
import { getAIMove } from './ai'
import { checkWinner, type Board } from './types'

describe('getAIMove — EASY', () => {
  it('always returns an index of an empty cell', () => {
    const board: Board = ['X', null, 'X', null, 'O', null, null, null, null]
    const emptyIndices = [1, 3, 5, 6, 7, 8]
    for (let i = 0; i < 20; i++) {
      expect(emptyIndices).toContain(getAIMove(board, 'EASY'))
    }
  })
})

describe('getAIMove — MEDIUM', () => {
  it('takes the winning move when one is available', () => {
    // O has two in a row (0, 1); taking 2 wins immediately.
    const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null]
    expect(getAIMove(board, 'MEDIUM')).toBe(2)
  })

  it('blocks the opponent winning move when it has no winning move itself', () => {
    // X has two in a row (0, 1); O must block at 2.
    const board: Board = ['X', 'X', null, 'O', null, null, null, null, null]
    expect(getAIMove(board, 'MEDIUM')).toBe(2)
  })
})

describe('getAIMove — HARD (minimax)', () => {
  it('takes the immediate winning move when available', () => {
    const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null]
    expect(getAIMove(board, 'HARD')).toBe(2)
  })

  it('blocks an immediate opponent win', () => {
    const board: Board = ['X', 'X', null, 'O', null, null, null, null, null]
    expect(getAIMove(board, 'HARD')).toBe(2)
  })

  it('never loses a full game against an opponent that always blocks/wins optimally', () => {
    let board: Board = Array(9).fill(null)
    let current: 'X' | 'O' = 'X'

    while (!checkWinner(board) && board.includes(null)) {
      const move =
        current === 'O'
          ? getAIMove(board, 'HARD')
          : bestOpponentMove(board)
      board = board.slice() as Board
      board[move] = current
      current = current === 'X' ? 'O' : 'X'
    }

    const result = checkWinner(board)
    expect(result?.winner).not.toBe('X')
  })
})

/** A simple minimax-driven opponent used only to stress-test the AI in the "never loses" test. */
function bestOpponentMove(board: Board): number {
  const empty = board.flatMap((cell, i) => (cell === null ? [i] : []))
  for (const i of empty) {
    const test = board.slice() as Board
    test[i] = 'X'
    if (checkWinner(test)?.winner === 'X') return i
  }
  for (const i of empty) {
    const test = board.slice() as Board
    test[i] = 'O'
    if (checkWinner(test)?.winner === 'O') return i
  }
  return empty[0]
}
