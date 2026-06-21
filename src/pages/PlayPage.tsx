import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/Button'

export function PlayPage() {
  const { slug } = useParams<{ slug: string }>()

  const titles: Record<string, string> = {
    snake: 'Snake',
    tictactoe: 'Tic-Tac-Toe',
  }

  const title = slug ? titles[slug] : null

  if (!title) {
    return (
      <div className="card-playful p-10 text-center">
        <h2 className="font-display font-extrabold text-3xl mb-3">
          Ismeretlen játék
        </h2>
        <p className="text-ink-2 mb-6">A keresett játék nem található.</p>
        <Link to="/">
          <Button variant="mustard">← Vissza</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="card-playful p-10 animate-pop">
      <h2 className="font-display font-extrabold text-4xl mb-2 tracking-tight">
        {title}
      </h2>
      <p className="text-ink-2 mb-8">
        🚧 A játék komponens hamarosan érkezik — most a routing és a layout él.
      </p>
      <Link to="/">
        <Button variant="pink">← Vissza a játékválasztóhoz</Button>
      </Link>
    </div>
  )
}
