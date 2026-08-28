import { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useScoreSubmission } from '@/hooks/useScoreSubmission'

import { useFlappyBirdGame } from './useFlappyBirdGame'
import { FlappyBirdBoard } from './FlappyBirdBoard'
import { ScorePanel } from './ScorePanel'
import { GameOverModal } from './GameOverModal'
import { DIFFICULTIES, CANVAS_WIDTH, CANVAS_HEIGHT, type Difficulty } from './types'

interface FlappyBirdGameProps {
  difficulty: Difficulty
}

export function FlappyBirdGame({ difficulty }: FlappyBirdGameProps) {
  const { submitStatus, submitError, startNewAttempt, submitScore, retrySubmit } =
    useScoreSubmission('flappybird', difficulty)

  const game = useFlappyBirdGame({ difficulty, onGameOver: submitScore })

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
  const showIdleHint = game.status === 'idle'
  const showGameOver = game.status === 'gameover'

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-6 max-w-[1080px] mx-auto animate-pop h-full">
      {/* Bal: játék kártya */}
      <div className="card-playful p-6 flex flex-col h-full">
        {/* Header — kompakt */}
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="min-w-0">
            <Link
              to="/play/flappybird"
              className="font-mono text-[11px] font-bold text-ink-2 hover:text-ink"
            >
              ← MÁS SZINT
            </Link>
            <h2 className="font-display font-extrabold text-3xl tracking-tight mt-0.5">
              Flappy Bird
            </h2>
            <div className="text-xs text-ink-2 mt-1 flex items-center gap-2 flex-wrap">
              <span>{config.emoji}</span>
              <span className="font-semibold">{config.label}</span>
              <span className="opacity-50">•</span>
              <span>Kattintás / Space = repülés</span>
            </div>
          </div>
          <div className="bg-ink text-mustard rounded-xl p-2.5 px-4 text-right shrink-0">
            <div className="font-mono text-[9px] tracking-widest opacity-70 text-cream">
              SCORE
            </div>
            <div className="font-display font-extrabold text-2xl leading-none">
              {game.score.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Board area */}
        <div className="relative flex justify-center items-center flex-1 min-h-0">
          <div
            className="relative w-[min(100%,400px)] h-auto lg:w-auto lg:h-[min(100%,600px)]"
            style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
          >
            <FlappyBirdBoard canvasRef={game.canvasRef} onFlap={game.flap} />

            {showIdleHint && (
              <BoardOverlay onActivate={game.flap}>
                <div className="text-center px-6">
                  <div className="font-display font-black text-2xl mb-2">
                    Készen állsz?
                  </div>
                  <div className="text-ink-2 font-medium text-sm">
                    Kattints a pályára vagy nyomj <Kbd>Space</Kbd>-t a repüléshez
                  </div>
                </div>
              </BoardOverlay>
            )}
          </div>
        </div>

        {/* Controls alul — kompakt */}
        <div className="flex items-center justify-center mt-4">
          <Kbd>Space</Kbd>
          <span className="mx-1.5 text-ink-2 text-xs self-center">vagy</span>
          <span className="text-ink-2 text-xs self-center">kattintás</span>
        </div>
      </div>

      {/* Jobb: side panel */}
      <ScorePanel
        score={game.score}
        pipesPassed={game.pipesPassed}
        difficulty={difficulty}
      />

      {/* Game over modal */}
      {showGameOver && (
        <GameOverModal
          score={game.score}
          pipesPassed={game.pipesPassed}
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

function BoardOverlay({
  children,
  onActivate,
}: {
  children: React.ReactNode
  onActivate?: () => void
}) {
  return (
    <div
      className="absolute inset-0 bg-cream/85 grid place-items-center rounded-2xl backdrop-blur-sm cursor-pointer"
      onClick={onActivate}
      onTouchStart={
        onActivate
          ? (e) => {
              e.preventDefault()
              onActivate()
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-grid place-items-center min-w-[26px] h-7 px-1.5 bg-ink text-cream rounded-md font-mono font-bold text-xs">
      {children}
    </span>
  )
}
