import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface GameCardData {
  slug: string
  title: string
  icon: string
  description: string
  bg: string
  iconColor: string
}

const games: GameCardData[] = [
  {
    slug: 'snake',
    title: 'Snake',
    icon: '🐍',
    description:
      'Klasszikus kígyó, modern köntösben. Egyél almát, ne harapj magadba.',
    bg: 'bg-gradient-to-br from-[#c8f7d4] to-mint',
    iconColor: 'mint',
  },
  {
    slug: 'tictactoe',
    title: 'Tic-Tac-Toe',
    icon: '⭕',
    description: 'Három a sorban. Játssz egy barát ellen vagy a gép ellen.',
    bg: 'bg-gradient-to-br from-[#ffd9c0] to-pink',
    iconColor: 'pink',
  },
]

export function HomePage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="animate-pop">
      {/* Hero */}
      <section className="card-playful p-12 md:p-14 mb-8 relative overflow-hidden">
        <div className="absolute w-[200px] h-[200px] bg-mint border-[3px] border-ink rounded-full -top-16 -right-16" />
        <div className="absolute w-20 h-20 bg-coral border-[3px] border-ink rounded-3xl bottom-8 right-20 rotate-[20deg]" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-block font-mono text-xs font-bold bg-ink text-cream px-3 py-1.5 rounded-lg tracking-widest uppercase mb-5">
            / Üdv {user?.username ?? 'újra'} ↘
          </span>
          <h1 className="font-display font-black text-5xl md:text-7xl leading-[0.95] tracking-tight mb-4">
            Játssz,{' '}
            <em className="italic text-pink-deep font-extrabold">küldj</em>
            <br />
            score-t, nyerj.
          </h1>
          <p className="text-lg text-ink-2 font-medium max-w-lg">
            Kis játékok, nagy ranglisták. Válassz egyet és kezdjük — a legjobb
            eredményed mindenki láthatja.
          </p>
        </div>
      </section>

      {/* Section label */}
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-display font-extrabold text-3xl tracking-tight">
          Válassz játékot
        </h2>
        <div className="flex-1 h-[3px] bg-cream/30 rounded" />
      </div>

      {/* Games grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {games.map((g) => (
          <Link
            key={g.slug}
            to={`/play/${g.slug}`}
            className={[
              g.bg,
              'text-ink border-[3px] border-ink rounded-3xl p-8 shadow-hard',
              'transition-transform hover:-translate-x-0.5 hover:-translate-y-1 hover:shadow-hard-lg',
              'relative overflow-hidden block group',
            ].join(' ')}
          >
            <div className="w-20 h-20 bg-ink rounded-3xl grid place-items-center text-4xl mb-6">
              {g.icon}
            </div>
            <h3 className="font-display font-extrabold text-4xl tracking-tight mb-1">
              {g.title}
            </h3>
            <p className="text-sm font-medium text-ink-2 mb-5 max-w-xs">
              {g.description}
            </p>

            <div className="absolute bottom-7 right-7 w-14 h-14 bg-ink text-mustard border-[3px] border-ink rounded-full grid place-items-center text-2xl transition-transform group-hover:rotate-12 group-hover:scale-110">
              ▶
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
