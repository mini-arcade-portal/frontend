import { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useScoreSubmission } from '@/hooks/useScoreSubmission'

import { useTicTacToeGame } from './useTicTacToeGame'
import { TicTacToeBoard } from './TicTacToeBoard'
import { StatusBar } from './StatusBar'
import { ScorePanel } from './ScorePanel'
import { GameOverModal } from './GameOverModal'
import {
  calculateFinalScore,
  DIFFICULTIES,
  type Difficulty,
} from './types'

interface TicTacToeGameProps {
  difficulty: Difficulty
}

export function TicTacToeGame({ difficulty }: TicTacToeGameProps) {
  const { submitStatus, submitError, startNewAttempt, submitScore, retrySubmit } =
    useScoreSubmission('tictactoe', difficulty)

  const handleGameOver = useCallback(
    (finalStreak: number) => {
      submitScore(calculateFinalScore(finalStreak, difficulty))
    },
    [submitScore, difficulty]
  )

  const game = useTicTacToeGame({ difficulty, onGameOver: handleGameOver })

  // Difficulty változáskor reset
  useEffect(() => {
    game.reset()
    startNewAttempt()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty])

  const handlePlayAgain = useCallback(() => {
    game.reset()
    startNewAttempt()
  }, [game, startNewAttempt])

  const config = DIFFICULTIES[difficulty]
  const showGameOver = game.gameStatus === 'gameover'
  const currentScore = game.streak * config.multiplier
  const finalScore = calculateFinalScore(game.streak, difficulty)

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-6 max-w-[1080px] mx-auto animate-pop">
      {/* Bal: játék kártya */}
      <div className="card-playful p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="min-w-0">
            <Link
              to="/play/tictactoe"
              className="font-mono text-[11px] font-bold text-ink-2 hover:text-ink"
            >
              ← MÁS SZINT
            </Link>
            <h2 className="font-display font-extrabold text-3xl tracking-tight mt-0.5">
              Tic-Tac-Toe
            </h2>
            <div className="text-xs text-ink-2 mt-1 flex items-center gap-2 flex-wrap">
              <span>{config.emoji}</span>
              <span className="font-semibold">{config.label}</span>
              <span className="opacity-50">•</span>
              <span>Sorozat: {game.streak}</span>
            </div>
          </div>
          <div className="bg-ink text-mustard rounded-xl p-2.5 px-4 text-right shrink-0">
            <div className="font-mono text-[9px] tracking-widest opacity-70 text-cream">
              SCORE
            </div>
            <div className="font-display font-extrabold text-2xl leading-none">
              {currentScore}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="mb-5">
          <StatusBar
            roundStatus={game.roundStatus}
            difficulty={difficulty}
            onNextRound={game.nextRound}
          />
        </div>

        {/* Board */}
        <TicTacToeBoard
          board={game.board}
          isClickable={game.roundStatus === 'idle'}
          winningLine={game.winningLine}
          onCellClick={game.playCell}
        />

        {/* Reset hint */}
        <div className="mt-4 text-center text-xs text-ink-2 opacity-60">
          Round #{game.roundNumber} • A te jeled az{' '}
          <span className="font-bold text-pink-deep">X</span>, az AI-é az{' '}
          <span className="font-bold text-sky-deep">O</span>
        </div>
      </div>

      {/* Jobb: side panel */}
      <ScorePanel
        streak={game.streak}
        roundNumber={game.roundNumber}
        difficulty={difficulty}
      />

      {/* Game over modal */}
      {showGameOver && (
        <GameOverModal
          streak={game.streak}
          score={finalScore}
          difficulty={difficulty}
          submitStatus={submitStatus}
          submitError={submitError}
          onPlayAgain={handlePlayAgain}
          onRetrySubmit={retrySubmit}
        />
      )}
    </div>
  )
}
