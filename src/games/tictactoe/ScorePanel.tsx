import { useQuery } from '@tanstack/react-query'
import { scoreApi } from '@/api/scores'
import { useAuthStore } from '@/store/authStore'
import { DIFFICULTIES, type Difficulty } from './types'

interface ScorePanelProps {
  streak: number
  roundNumber: number
  difficulty: Difficulty
}

export function ScorePanel({
  streak,
  roundNumber,
  difficulty,
}: ScorePanelProps) {
  const config = DIFFICULTIES[difficulty]
  const currentUser = useAuthStore((s) => s.user)

  const { data: topScores } = useQuery({
    queryKey: ['scores', 'top', 'tictactoe'],
    queryFn: () => scoreApi.topScores('tictactoe', 10),
  })

  const { data: myScores } = useQuery({
    queryKey: ['scores', 'me'],
    queryFn: () => scoreApi.myScores(50),
  })

  const personalBest =
    myScores
      ?.filter((s) => s.gameType === 'tictactoe' && s.difficulty === difficulty)
      .reduce((max, s) => Math.max(max, s.score), 0) ?? 0

  const globalBest =
    topScores
      ?.filter((s) => s.difficulty === difficulty)
      .reduce((max, s) => Math.max(max, s.score), 0) ?? 0

  const currentScore = streak * config.multiplier

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

      {/* Streak stats */}
      <div className="card-dark p-5">
        <h4 className="font-display font-bold text-lg mb-3">Sorozat</h4>
        <div className="space-y-2.5 text-sm">
          <StatRow label="Aktuális streak" value={`${streak}`} />
          <StatRow label="Round" value={`#${roundNumber}`} />
          <StatRow
            label="Pontszám"
            value={`${currentScore}`}
            highlight={currentScore > 0}
          />
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
            highlight={currentScore > personalBest && personalBest > 0}
          />
          <StatRow
            label="Globális"
            value={globalBest > 0 ? globalBest.toLocaleString() : '—'}
            highlight={currentScore > globalBest && globalBest > 0}
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
