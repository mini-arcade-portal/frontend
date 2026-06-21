import { useCallback, useEffect, useRef, useState } from 'react'
import { getAIMove } from './ai'
import {
  checkWinner,
  DIFFICULTIES,
  EMPTY_BOARD,
  isBoardFull,
  type Board,
  type Difficulty,
  type GameStatus,
  type RoundStatus,
} from './types'

interface UseTicTacToeGameOptions {
  difficulty: Difficulty
  /** A streak véget ért — submit ezzel a score-ral */
  onGameOver?: (streak: number) => void
}

interface TicTacToeGameState {
  board: Board
  roundStatus: RoundStatus
  gameStatus: GameStatus
  streak: number
  roundNumber: number
  /** A győztes vonal indexei round vége után — vizualizáláshoz */
  winningLine: readonly number[] | null
  /** Cellára kattintáskor hívandó */
  playCell: (index: number) => void
  /** Új round indítása győzelem/döntetlen után */
  nextRound: () => void
  /** Teljes reset új streak-hez */
  reset: () => void
}

const AI_THINK_MS = 650 // mennyit "gondolkodjon" az AI mielőtt lép

export function useTicTacToeGame({
  difficulty,
  onGameOver,
}: UseTicTacToeGameOptions): TicTacToeGameState {
  const config = DIFFICULTIES[difficulty]

  const [board, setBoard] = useState<Board>(EMPTY_BOARD)
  const [roundStatus, setRoundStatus] = useState<RoundStatus>('idle')
  const [gameStatus, setGameStatus] = useState<GameStatus>('active')
  const [streak, setStreak] = useState(0)
  const [roundNumber, setRoundNumber] = useState(1)
  const [winningLine, setWinningLine] = useState<readonly number[] | null>(null)

  /**
   * Game over callback ref
   */
  const onGameOverRef = useRef(onGameOver)
  useEffect(() => {
    onGameOverRef.current = onGameOver
  }, [onGameOver])


  const evaluateBoard = useCallback(
    (b: Board, justMoved: 'X' | 'O') => {
      const winnerInfo = checkWinner(b)

      if (winnerInfo) {
        setWinningLine(winnerInfo.line)
        if (winnerInfo.winner === 'X') {
          // Player nyert
          setStreak((s) => s + 1)
          setRoundStatus('won')
        } else {
          // AI nyert → game over
          setRoundStatus('lost')
          setGameStatus('gameover')
        }
        return
      }

      if (isBoardFull(b)) {
        // Döntetlen
        if (config.drawCountsForStreak) {
          // Hard mode: a draw is folytatja a streak-et
          setStreak((s) => s + 1)
          setRoundStatus('drawn')
        } else {
          // Easy/Medium: draw megszakítja → game over
          setRoundStatus('drawn')
          setGameStatus('gameover')
        }
        return
      }

      // Round folytatódik — ha most a player lépett, jöjjön az AI
      if (justMoved === 'X') {
        setRoundStatus('thinking')
      }
    },
    [config.drawCountsForStreak]
  )

  /**
   * Cellára kattintás.
   */
  const playCell = useCallback(
    (index: number) => {
      if (gameStatus !== 'active') return
      if (roundStatus !== 'idle') return
      if (board[index] !== null) return

      const newBoard = board.slice()
      newBoard[index] = 'X'
      setBoard(newBoard)
      evaluateBoard(newBoard, 'X')
    },
    [board, gameStatus, roundStatus, evaluateBoard]
  )

  /**
   * AI turn — amikor a roundStatus 'thinking', késleltetve lépünk.
   */
  useEffect(() => {
    if (roundStatus !== 'thinking') return

    const timeoutId = setTimeout(() => {
      const aiIndex = getAIMove(board, difficulty)
      const newBoard = board.slice()
      newBoard[aiIndex] = 'O'
      setBoard(newBoard)
      evaluateBoard(newBoard, 'O')
      setRoundStatus((current) => (current === 'thinking' ? 'idle' : current))
    }, AI_THINK_MS)

    return () => clearTimeout(timeoutId)
  }, [roundStatus, board, difficulty, evaluateBoard])

  /**
   * Game over fire-and-forget effect.
   */
  useEffect(() => {
    if (gameStatus === 'gameover') {
      onGameOverRef.current?.(streak)
    }
  }, [gameStatus])

  const nextRound = useCallback(() => {
    if (gameStatus !== 'active') return
    if (roundStatus !== 'won' && roundStatus !== 'drawn') return

    setBoard(EMPTY_BOARD)
    setWinningLine(null)
    setRoundStatus('idle')
    setRoundNumber((n) => n + 1)
  }, [gameStatus, roundStatus])

  /**
   * Teljes reset — új streak, score 0-ról.
   */
  const reset = useCallback(() => {
    setBoard(EMPTY_BOARD)
    setRoundStatus('idle')
    setGameStatus('active')
    setStreak(0)
    setRoundNumber(1)
    setWinningLine(null)
  }, [])

  return {
    board,
    roundStatus,
    gameStatus,
    streak,
    roundNumber,
    winningLine,
    playCell,
    nextRound,
    reset,
  }
}
