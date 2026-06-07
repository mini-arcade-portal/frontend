import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { DifficultyPicker as SnakeDifficultyPicker } from '@/games/snake/DifficultyPicker'
import { SnakeGame } from '@/games/snake/SnakeGame'
import { DifficultyPicker as TicTacToeDifficultyPicker } from '@/games/tictactoe/DifficultyPicker'
import { TicTacToeGame } from '@/games/tictactoe/TicTacToeGame'
import type { Difficulty } from '@/games/snake/types'

const VALID_DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']

function isValidDifficulty(v: string | null): v is Difficulty {
  return v !== null && VALID_DIFFICULTIES.includes(v as Difficulty)
}

export function PlayPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const difficultyParam = searchParams.get('difficulty')

  if (slug === 'snake') {
    if (isValidDifficulty(difficultyParam)) {
      return <SnakeGame difficulty={difficultyParam} />
    }
    return <SnakeDifficultyPicker />
  }

  if (slug === 'tictactoe') {
    if (isValidDifficulty(difficultyParam)) {
      return <TicTacToeGame difficulty={difficultyParam} />
    }
    return <TicTacToeDifficultyPicker />
  }

  return (
    <div className="card-playful p-10 text-center animate-pop">
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
