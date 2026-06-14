import { useQuery } from '@tanstack/react-query'
import { scoreApi } from '@/api/scores'
import { useAuthStore } from '@/store/authStore'
import { DIFFICULTIES, type Difficulty } from './types'

interface ScorePanelProps {
  score: number
  applesEaten: number
  difficulty: Difficulty
  currentSpeed: number
}

export function ScorePanel({
  score,
  applesEaten,
  difficulty,
  currentSpeed,
}: ScorePanelProps) {
  const config = DIFFICULTIES[difficulty]
  const currentUser = useAuthStore((s) => s.user)

  // Top scores ehhez a difficulty-hez (top 5)
  const { data: topScores } = useQuery({
    queryKey: ['scores', 'top', 'snake'],
    queryFn: () => scoreApi.topScores('snake', 10),
  })

  // Személyes best ezen a difficulty-n
  const { data: myScores } = useQuery({
    queryKey: ['scores', 'me'],
    queryFn: () => scoreApi.myScores(50),
  })

  const personalBest = myScores
    ?.filter((s) => s.gameType === 'snake' && s.difficulty === difficulty)
    .reduce((max, s) => Math.max(max, s.score), 0) ?? 0

  const globalBest = topScores
    ?.filter((s) => s.difficulty === difficulty)
    .reduce((max, s) => Math.max(max, s.score), 0) ?? 0

  // Speed indikátor: hány "fokozaton" vagyunk a max-hoz képest
  const speedSteps = Math.floor(
    (config.startSpeed - currentSpeed) / config.speedUpStep
  )

  return (
    <aside className="flex flex-col gap-5">
      {/* Difficulty badge */}
      <div className="card-dark p-4 flex items-center gap-3">
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <div className="font-mono text-[10px] tracking-widest opacity-60">
            NEHÉZSÉG
          </div>
          <div className="font-display font-extrabold text-xl">
            {config.label}
          </div>
        </div>
        <div className="ml-auto font-mono text-xs font-bold bg-mustard text-ink px-2 py-1 rounded">
          ×{config.multiplier}
        </div>
      </div>

      {/* Live stats */}
      <div className="card-dark p-5">
        <h4 className="font-display font-bold text-lg mb-3">Statisztika</h4>
        <div className="space-y-2.5 text-sm">
          <StatRow label="Hossz" value={`${applesEaten + 3}`} />
          <StatRow label="Almák" value={`${applesEaten}`} />
          {config.speedUpEvery !== Infinity && (
            <StatRow label="Tempó" value={`+${speedSteps}`} />
          )}
        </div>
      </div>

      {/* Records */}
      <div className="card-dark p-5">
        <h4 className="font-display font-bold text-lg mb-3">
          Rekordok ({config.label.toLowerCase()})
        </h4>
        <div className="space-y-2.5 text-sm">
          <StatRow
            label={`${currentUser?.username ?? 'te'} best`}
            value={personalBest > 0 ? personalBest.toLocaleString() : '—'}
            highlight={score > personalBest && personalBest > 0}
          />
          <StatRow
            label="Globális"
            value={globalBest > 0 ? globalBest.toLocaleString() : '—'}
            highlight={score > globalBest && globalBest > 0}
          />
        </div>
      </div>
    </aside>
  )
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="opacity-70">{label}</span>
      <span
        className={[
          'font-mono font-bold',
          highlight ? 'text-mustard' : 'text-cream',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  )
}
