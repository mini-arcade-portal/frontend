import { useCallback, useState } from 'react'
import {
  checkWinner,
  EMPTY_BOARD,
  isBoardFull,
  type Board,
  type Player,
} from './types'

export type FriendRoundResult = 'playing' | 'X' | 'O' | 'draw'

interface TicTacToeFriendGameState {
  board: Board
  currentPlayer: Player
  roundResult: FriendRoundResult
  winningLine: readonly number[] | null
  roundNumber: number
  tally: { X: number; O: number; draws: number }
  playCell: (index: number) => void
  nextRound: () => void
  resetTally: () => void
}

export function useTicTacToeFriendGame(): TicTacToeFriendGameState {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD)
  const [roundStarter, setRoundStarter] = useState<Player>('X')
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [roundResult, setRoundResult] = useState<FriendRoundResult>('playing')
  const [winningLine, setWinningLine] = useState<readonly number[] | null>(null)
  const [roundNumber, setRoundNumber] = useState(1)
  const [tally, setTally] = useState({ X: 0, O: 0, draws: 0 })

  const playCell = useCallback(
    (index: number) => {
      if (roundResult !== 'playing') return
      if (board[index] !== null) return

      const newBoard = board.slice()
      newBoard[index] = currentPlayer
      setBoard(newBoard)

      const winnerInfo = checkWinner(newBoard)
      if (winnerInfo) {
        setWinningLine(winnerInfo.line)
        setRoundResult(winnerInfo.winner)
        setTally((t) => ({ ...t, [winnerInfo.winner]: t[winnerInfo.winner] + 1 }))
        return
      }

      if (isBoardFull(newBoard)) {
        setRoundResult('draw')
        setTally((t) => ({ ...t, draws: t.draws + 1 }))
        return
      }

      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    },
    [board, currentPlayer, roundResult]
  )

  const nextRound = useCallback(() => {
    if (roundResult === 'playing') return
    const nextStarter: Player = roundStarter === 'X' ? 'O' : 'X'
    setRoundStarter(nextStarter)
    setCurrentPlayer(nextStarter)
    setBoard(EMPTY_BOARD)
    setWinningLine(null)
    setRoundResult('playing')
    setRoundNumber((n) => n + 1)
  }, [roundResult, roundStarter])

  const resetTally = useCallback(() => {
    setBoard(EMPTY_BOARD)
    setRoundStarter('X')
    setCurrentPlayer('X')
    setRoundResult('playing')
    setWinningLine(null)
    setRoundNumber(1)
    setTally({ X: 0, O: 0, draws: 0 })
  }, [])

  return {
    board,
    currentPlayer,
    roundResult,
    winningLine,
    roundNumber,
    tally,
    playCell,
    nextRound,
    resetTally,
  }
}
