import { useCallback, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { scoreApi } from '@/api/scores'
import { extractErrorMessage } from '@/api/client'

import { useSnakeGame } from './useSnakeGame'
import { SnakeBoard } from './SnakeBoard'
import { ScorePanel } from './ScorePanel'
import { GameOverModal, type SubmitStatus } from './GameOverModal'
import { DIFFICULTIES, type Difficulty } from './types'

interface SnakeGameProps {
  difficulty: Difficulty
}

export function SnakeGame({ difficulty }: SnakeGameProps) {
  const queryClient = useQueryClient()
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState<string>()
  const [lastSubmittedScore, setLastSubmittedScore] = useState<number | null>(null)

  const submitMutation = useMutation({
    mutationFn: (score: number) =>
      scoreApi.submit({
        gameType: 'snake',
        difficulty,
        score,
      }),
    onMutate: () => setSubmitStatus('submitting'),
    onSuccess: () => {
      setSubmitStatus('success')
      queryClient.invalidateQueries({ queryKey: ['scores'] })
    },
    onError: (err) => {
      setSubmitStatus('error')
      setSubmitError(extractErrorMessage(err))
    },
  })

  const handleGameOver = useCallback(
    (finalScore: number) => {
      if (finalScore > 0 && lastSubmittedScore !== finalScore) {
        setLastSubmittedScore(finalScore)
        submitMutation.mutate(finalScore)
      }
    },
    [submitMutation, lastSubmittedScore]
  )

  const game = useSnakeGame({ difficulty, onGameOver: handleGameOver })

  useEffect(() => {
    game.reset()
    setSubmitStatus('idle')
    setSubmitError(undefined)
    setLastSubmittedScore(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty])

  const handlePlayAgain = useCallback(() => {
    game.reset()
    setSubmitStatus('idle')
    setSubmitError(undefined)
    setLastSubmittedScore(null)
  }, [game])

  const handleRetrySubmit = useCallback(() => {
    if (lastSubmittedScore !== null) {
      submitMutation.mutate(lastSubmittedScore)
    }
  }, [submitMutation, lastSubmittedScore])

  const config = DIFFICULTIES[difficulty]
  const showIdleHint = game.status === 'idle'
  const showPaused = game.status === 'paused'
  const showGameOver = game.status === 'gameover'

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-6 max-w-[1080px] mx-auto animate-pop">
      {/* Bal: játék kártya */}
      <div className="card-playful p-6">
        {/* Header — kompakt */}
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="min-w-0">
            <Link
              to="/play/snake"
              className="font-mono text-[11px] font-bold text-ink-2 hover:text-ink"
            >
              ← MÁS SZINT
            </Link>
            <h2 className="font-display font-extrabold text-3xl tracking-tight mt-0.5">
              Snake
            </h2>
            <div className="text-xs text-ink-2 mt-1 flex items-center gap-2 flex-wrap">
              <span>{config.emoji}</span>
              <span className="font-semibold">{config.label}</span>
              <span className="opacity-50">•</span>
              <span>Nyilak / WASD • Space = szünet</span>
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

        {/* Board area*/}
        <div className="relative flex justify-center">
          <div
            className="relative w-full"
            style={{ maxWidth: 'min(680px, calc(100vh - 280px))' }}
          >
            <SnakeBoard snake={game.snake} food={game.food} />

            {showIdleHint && (
              <BoardOverlay>
                <div className="text-center px-6">
                  <div className="font-display font-black text-2xl mb-2">
                    Készen állsz?
                  </div>
                  <div className="text-ink-2 font-medium text-sm">
                    Nyomj meg egy <Kbd>↑</Kbd> <Kbd>↓</Kbd> <Kbd>←</Kbd>{' '}
                    <Kbd>→</Kbd> billentyűt
                  </div>
                </div>
              </BoardOverlay>
            )}

            {showPaused && (
              <BoardOverlay>
                <div className="text-center px-6">
                  <div className="font-display font-black text-2xl mb-2">
                    Szünet
                  </div>
                  <div className="text-ink-2 font-medium text-sm mb-3">
                    Folytatás: <Kbd>Space</Kbd>
                  </div>
                  <Button variant="mustard" size="sm" onClick={game.togglePause}>
                    Folytatás →
                  </Button>
                </div>
              </BoardOverlay>
            )}
          </div>
        </div>

        {/* Controls alul — kompakt */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-1">
            <Kbd>↑</Kbd>
            <Kbd>←</Kbd>
            <Kbd>↓</Kbd>
            <Kbd>→</Kbd>
            <span className="mx-1.5 text-ink-2 text-xs self-center">vagy</span>
            <Kbd>W</Kbd>
            <Kbd>A</Kbd>
            <Kbd>S</Kbd>
            <Kbd>D</Kbd>
          </div>
          {game.status === 'playing' && (
            <Button variant="pink" size="sm" onClick={game.togglePause}>
              Szünet
            </Button>
          )}
        </div>
      </div>

      {/* Jobb: side panel */}
      <ScorePanel
        score={game.score}
        applesEaten={game.applesEaten}
        difficulty={difficulty}
        currentSpeed={game.currentSpeed}
      />

      {/* Game over modal */}
      {showGameOver && (
        <GameOverModal
          score={game.score}
          applesEaten={game.applesEaten}
          difficulty={difficulty}
          submitStatus={submitStatus}
          submitError={submitError}
          onPlayAgain={handlePlayAgain}
          onRetrySubmit={handleRetrySubmit}
        />
      )}
    </div>
  )
}

function BoardOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 bg-cream/85 grid place-items-center rounded-2xl backdrop-blur-sm">
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