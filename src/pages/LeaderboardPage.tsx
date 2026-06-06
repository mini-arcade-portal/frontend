import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { scoreApi, type GameType, type ScoreResponse } from '@/api/scores'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/Button'
import { DifficultyBadge } from '@/components/DifficultyBadge'

const tabs: { value: GameType; label: string }[] = [
  { value: 'snake', label: '🐍 Snake' },
  { value: 'tictactoe', label: '⭕ Tic-Tac-Toe' },
]

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<GameType>('snake')
  const currentUser = useAuthStore((s) => s.user)

  const { data: scores, isLoading } = useQuery({
    queryKey: ['scores', 'top', activeTab],
    queryFn: () => scoreApi.topScores(activeTab, 10),
  })

  const top3 = scores?.slice(0, 3) ?? []
  const rest = scores?.slice(3) ?? []

  return (
    <div className="animate-pop">
      {/* Header */}
      <div className="card-playful p-9 px-12 mb-6 relative overflow-hidden">
        <div className="absolute w-[140px] h-[140px] bg-mustard border-[3px] border-ink rounded-full -top-10 -right-10" />
        <span className="inline-block font-mono text-xs font-bold bg-ink text-cream px-3 py-1.5 rounded-lg tracking-widest uppercase mb-4">
          / Hall of fame
        </span>
        <h1 className="font-display font-black text-5xl md:text-6xl tracking-tight">
          Ranglista
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2.5 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={[
              'bg-cream text-ink border-[3px] border-ink px-5 py-2.5 rounded-2xl font-bold text-sm',
              'shadow-hard-sm transition-transform',
              'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard',
              activeTab === tab.value
                ? 'bg-mustard -translate-y-1 shadow-hard'
                : '',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="card-playful p-10 text-center text-ink-2">
          Betöltés…
        </div>
      )}

      {!isLoading && scores?.length === 0 && (
        <EmptyState gameType={activeTab} />
      )}

      {!isLoading && top3.length > 0 && (
        <>
          {/* Podium */}
          <div className="grid grid-cols-3 gap-4 mb-7 items-end">
            {top3[1] && <Podium score={top3[1]} place={2} />}
            {top3[0] && <Podium score={top3[0]} place={1} />}
            {top3[2] && <Podium score={top3[2]} place={3} />}
          </div>

          {/* Table */}
          {rest.length > 0 && (
            <div className="card-playful overflow-hidden p-0">
              <div className="grid grid-cols-[70px_1fr_140px_1fr_140px] bg-ink text-cream py-3.5 px-6 font-mono text-[11px] font-semibold tracking-widest uppercase">
                <div>Hely</div>
                <div>Játékos</div>
                <div>Szint</div>
                <div>Pontszám</div>
                <div className="text-right">Mikor</div>
              </div>
              {rest.map((score, idx) => (
                <ScoreRow
                  key={score.id}
                  score={score}
                  rank={idx + 4}
                  isMe={score.username === currentUser?.username}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function EmptyState({ gameType }: { gameType: GameType }) {
  const config = {
    snake: {
      emoji: '🐍',
      name: 'Snake',
      link: '/play/snake',
      label: '🐍 Snake start →',
    },
    tictactoe: {
      emoji: '⭕',
      name: 'Tic-Tac-Toe',
      link: '/play/tictactoe',
      label: '⭕ Tic-Tac-Toe start →',
    },
  }[gameType]

  return (
    <div className="card-playful p-12 text-center">
      <div className="text-5xl mb-4">{config.emoji}</div>
      <h3 className="font-display font-extrabold text-2xl mb-2">
        Még senki nem játszott {config.name}-t
      </h3>
      <p className="text-ink-2 mb-6 max-w-md mx-auto">
        Legyél az első, aki felkerül a ranglistára! Válassz egy nehézségi
        szintet és kezd el játszani.
      </p>
      <Link to={config.link}>
        <Button variant="mustard" size="lg">
          {config.label}
        </Button>
      </Link>
    </div>
  )
}

function Podium({ score, place }: { score: ScoreResponse; place: 1 | 2 | 3 }) {
  const config = {
    1: { bg: 'bg-mustard', crown: '👑', translate: '-translate-y-5' },
    2: { bg: 'bg-mint', crown: '🥈', translate: '' },
    3: { bg: 'bg-coral', crown: '🥉', translate: 'translate-y-2.5' },
  }[place]

  return (
    <div
      className={[
        config.bg,
        'text-ink border-[3px] border-ink rounded-3xl p-5 px-4 text-center shadow-hard relative',
        config.translate,
      ].join(' ')}
    >
      <div
        className={[
          'absolute -top-4 left-1/2 -translate-x-1/2',
          'w-9 h-9 rounded-full border-[3px] border-ink grid place-items-center',
          'font-display font-extrabold text-lg',
          config.bg,
        ].join(' ')}
      >
        {place}
      </div>
      <div className="text-3xl mb-1">{config.crown}</div>
      <div className="font-display font-extrabold text-xl tracking-tight mt-2 truncate">
        {score.username}
      </div>
      <div className="font-mono font-bold text-base mb-2">
        {score.score.toLocaleString()} pts
      </div>
      <div className="flex justify-center">
        <DifficultyBadge difficulty={score.difficulty} />
      </div>
    </div>
  )
}

function ScoreRow({
  score,
  rank,
  isMe,
}: {
  score: ScoreResponse
  rank: number
  isMe: boolean
}) {
  return (
    <div
      className={[
        'grid grid-cols-[70px_1fr_140px_1fr_140px] items-center py-4 px-6 border-b-2 border-ink/10 font-semibold relative',
        isMe ? 'bg-mustard/25' : '',
      ].join(' ')}
    >
      {isMe && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 bg-ink text-mustard font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
          TE
        </span>
      )}
      <div className={['font-display font-extrabold text-xl', isMe ? 'pl-7' : ''].join(' ')}>
        {rank}
      </div>
      <div>{score.username}</div>
      <div>
        <DifficultyBadge difficulty={score.difficulty} />
      </div>
      <div className="font-mono font-bold text-mint-deep">
        {score.score.toLocaleString()}
      </div>
      <div className="font-mono text-sm text-ink-2 opacity-70 text-right">
        {formatRelative(score.createdAt)}
      </div>
    </div>
  )
}

function formatRelative(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMin = Math.floor((now - then) / 60000)
  if (diffMin < 1) return 'most'
  if (diffMin < 60) return `${diffMin} perce`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} órája`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'tegnap'
  if (diffD < 7) return `${diffD} napja`
  return new Date(iso).toLocaleDateString('hu-HU')
}
