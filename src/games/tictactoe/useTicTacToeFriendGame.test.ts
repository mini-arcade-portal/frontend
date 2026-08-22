import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTicTacToeFriendGame } from './useTicTacToeFriendGame'

describe('useTicTacToeFriendGame', () => {
  it('alternates X/O between the two local players with no AI move', () => {
    const { result } = renderHook(() => useTicTacToeFriendGame())

    expect(result.current.currentPlayer).toBe('X')

    act(() => result.current.playCell(0))
    expect(result.current.board[0]).toBe('X')
    expect(result.current.currentPlayer).toBe('O')

    act(() => result.current.playCell(1))
    expect(result.current.board[1]).toBe('O')
    expect(result.current.currentPlayer).toBe('X')
  })

  it('detects a win, tallies it, and stops accepting moves until nextRound', () => {
    const { result } = renderHook(() => useTicTacToeFriendGame())

    act(() => result.current.playCell(0)) // X
    act(() => result.current.playCell(3)) // O
    act(() => result.current.playCell(1)) // X
    act(() => result.current.playCell(4)) // O
    act(() => result.current.playCell(2)) // X wins top row

    expect(result.current.roundResult).toBe('X')
    expect(result.current.tally.X).toBe(1)

    act(() => result.current.playCell(5))
    expect(result.current.board[5]).toBeNull()
  })

  it('detects a draw and tallies it', () => {
    const { result } = renderHook(() => useTicTacToeFriendGame())
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8]
    for (const i of moves) {
      act(() => result.current.playCell(i))
    }

    expect(result.current.roundResult).toBe('draw')
    expect(result.current.tally.draws).toBe(1)
  })

  it('nextRound resets the board and alternates the starting player', () => {
    const { result } = renderHook(() => useTicTacToeFriendGame())
    act(() => result.current.playCell(0))
    act(() => result.current.playCell(3))
    act(() => result.current.playCell(1))
    act(() => result.current.playCell(4))
    act(() => result.current.playCell(2)) // X wins

    act(() => result.current.nextRound())

    expect(result.current.board.every((c) => c === null)).toBe(true)
    expect(result.current.currentPlayer).toBe('O')
    expect(result.current.roundNumber).toBe(2)
  })

  it('resetTally clears the board and the win counters', () => {
    const { result } = renderHook(() => useTicTacToeFriendGame())
    act(() => result.current.playCell(0))
    act(() => result.current.playCell(3))
    act(() => result.current.playCell(1))
    act(() => result.current.playCell(4))
    act(() => result.current.playCell(2)) // X wins

    act(() => result.current.resetTally())

    expect(result.current.tally).toEqual({ X: 0, O: 0, draws: 0 })
    expect(result.current.currentPlayer).toBe('X')
    expect(result.current.roundNumber).toBe(1)
  })
})
