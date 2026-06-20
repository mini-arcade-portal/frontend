import { Button } from '@/components/Button'
import { DIFFICULTIES, type Difficulty, type RoundStatus } from './types'

interface StatusBarProps {
  roundStatus: RoundStatus
  difficulty: Difficulty
  onNextRound: () => void
}

/**
 * Status sor a board fölött:
 *   - idle: "A te köröd"
 *   - thinking: "Az AI gondolkodik..."
 *   - won: "Nyertél! → Következő round"
 *   - drawn: difficulty-függő (Hard-on streak nő, Easy/Medium-on game over)
 *   - lost: "Vége" (a modal úgyis megjelenik)
 */
export function StatusBar({
  roundStatus,
  difficulty,
  onNextRound,
}: StatusBarProps) {
  const config = DIFFICULTIES[difficulty]

  if (roundStatus === 'idle') {
    return (
      <Banner color="cream" icon="✕">
        <span className="font-semibold">A te köröd</span>
        <span className="text-ink-2 opacity-70 ml-2 text-sm">
          (te vagy az X)
        </span>
      </Banner>
    )
  }

  if (roundStatus === 'thinking') {
    return (
      <Banner color="sky" icon="◯">
        <span className="font-semibold">Az AI gondolkodik</span>
        <Dots />
      </Banner>
    )
  }

  if (roundStatus === 'won') {
    return (
      <Banner color="mint" icon="🎉">
        <span className="font-bold">Nyertél!</span>
        <Button
          variant="mustard"
          size="sm"
          onClick={onNextRound}
          className="ml-auto"
        >
          Következő →
        </Button>
      </Banner>
    )
  }

  if (roundStatus === 'drawn') {
    if (config.drawCountsForStreak) {
      // Hard mode: a draw is jó!
      return (
        <Banner color="mint" icon="🛡️">
          <span className="font-bold">Megtartottad a döntetlent!</span>
          <Button
            variant="mustard"
            size="sm"
            onClick={onNextRound}
            className="ml-auto"
          >
            Következő →
          </Button>
        </Banner>
      )
    }
    return (
      <Banner color="coral" icon="🤝">
        <span className="font-bold">Döntetlen</span>
        <span className="text-ink-2 opacity-70 ml-2 text-sm">
          A streak megszakadt
        </span>
      </Banner>
    )
  }

  if (roundStatus === 'lost') {
    return (
      <Banner color="coral" icon="✗">
        <span className="font-bold">Vesztettél</span>
      </Banner>
    )
  }

  return null
}

function Banner({
  children,
  color,
  icon,
}: {
  children: React.ReactNode
  color: 'cream' | 'mint' | 'coral' | 'sky'
  icon: string
}) {
  const bg = {
    cream: 'bg-cream-soft',
    mint: 'bg-mint',
    coral: 'bg-coral text-cream',
    sky: 'bg-sky',
  }[color]

  return (
    <div
      className={[
        bg,
        'border-[3px] border-ink rounded-2xl px-5 py-3.5',
        'flex items-center gap-3',
        color === 'coral' ? 'text-cream' : 'text-ink',
      ].join(' ')}
    >
      <span className="text-2xl">{icon}</span>
      {children}
    </div>
  )
}

function Dots() {
  return (
    <span className="inline-flex gap-1 ml-1">
      <span className="w-1.5 h-1.5 bg-ink rounded-full animate-pulse" />
      <span
        className="w-1.5 h-1.5 bg-ink rounded-full animate-pulse"
        style={{ animationDelay: '0.2s' }}
      />
      <span
        className="w-1.5 h-1.5 bg-ink rounded-full animate-pulse"
        style={{ animationDelay: '0.4s' }}
      />
    </span>
  )
}
