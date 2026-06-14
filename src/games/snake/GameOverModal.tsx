import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { DIFFICULTIES, type Difficulty } from './types'

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

interface GameOverModalProps {
  score: number
  applesEaten: number
  difficulty: Difficulty
  submitStatus: SubmitStatus
  submitError?: string
  onPlayAgain: () => void
  onRetrySubmit: () => void
}

export function GameOverModal({
  score,
  applesEaten,
  difficulty,
  submitStatus,
  submitError,
  onPlayAgain,
  onRetrySubmit,
}: GameOverModalProps) {
  const config = DIFFICULTIES[difficulty]

  return (
    <div
      className="fixed inset-0 bg-ink/80 grid place-items-center z-50 p-6 animate-pop"
      role="dialog"
      aria-modal="true"
    >
      <div className="card-playful w-full max-w-md p-9 text-center">
        <div className="font-mono text-xs tracking-widest opacity-60 mb-2">
          / GAME OVER
        </div>
        <h2 className="font-display font-black text-5xl tracking-tight mb-1">
          Vége!
        </h2>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span>{config.emoji}</span>
          <span className="font-semibold text-ink-2">{config.label}</span>
        </div>

        {/* Big score */}
        <div className="bg-ink text-mustard rounded-2xl p-6 mb-5">
          <div className="font-mono text-[10px] tracking-widest opacity-70 text-cream">
            PONTSZÁM
          </div>
          <div className="font-display font-extrabold text-6xl tracking-tight">
            {score.toLocaleString()}
          </div>
          <div className="text-cream/70 text-xs font-mono">
            {applesEaten} alma • {applesEaten + 3} hosszú
          </div>
        </div>

        {/* Submit státusz */}
        <SubmitBanner
          status={submitStatus}
          error={submitError}
          onRetry={onRetrySubmit}
          score={score}
        />

        {/* Akció gombok */}
        <div className="flex flex-col gap-3 mt-6">
          <Button variant="mustard" size="lg" fullWidth onClick={onPlayAgain}>
            Új játék ({config.label})
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/play/snake" className="contents">
              <Button variant="mint" fullWidth>
                Más szint
              </Button>
            </Link>
            <Link to="/leaderboard" className="contents">
              <Button variant="sky" fullWidth>
                Ranglista
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmitBanner({
  status,
  error,
  onRetry,
  score,
}: {
  status: SubmitStatus
  error?: string
  onRetry: () => void
  score: number
}) {
  if (score === 0) {
    return (
      <div className="text-sm text-ink-2 opacity-60">
        0 pont nem került fel a ranglistára.
      </div>
    )
  }

  if (status === 'submitting') {
    return (
      <div className="text-sm font-medium text-ink-2 flex items-center justify-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-mustard animate-pulse" />
        Feltöltés a ranglistára…
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="text-sm font-bold text-mint-deep flex items-center justify-center gap-2">
        ✓ Feltöltve a ranglistára
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-coral">
          ✗ {error || 'Sikertelen feltöltés'}
        </div>
        <button
          onClick={onRetry}
          className="text-xs font-mono font-bold text-ink-2 hover:text-ink underline"
        >
          ÚJRAPRÓBÁLÁS
        </button>
      </div>
    )
  }

  return null
}
