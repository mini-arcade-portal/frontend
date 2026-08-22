import { Navigate, useParams, useSearchParams } from 'react-router-dom'

import { SnakeGame } from '@/games/snake/SnakeGame'
import { DifficultyPicker as SnakeDifficultyPicker } from '@/games/snake/DifficultyPicker'
import { TicTacToeGame } from '@/games/tictactoe/TicTacToeGame'
import { TicTacToeFriendGame } from '@/games/tictactoe/TicTacToeFriendGame'
import { DifficultyPicker as TicTacToeDifficultyPicker } from '@/games/tictactoe/DifficultyPicker'
import { FlappyBirdGame } from '@/games/flappybird/FlappyBirdGame'
import { DifficultyPicker as FlappyBirdDifficultyPicker } from '@/games/flappybird/DifficultyPicker'
import type { Difficulty } from '@/api/scores'

const VALID_DIFFICULTIES: readonly Difficulty[] = ['EASY', 'MEDIUM', 'HARD']

function parseDifficulty(value: string | null): Difficulty | null {
  return VALID_DIFFICULTIES.includes(value as Difficulty)
    ? (value as Difficulty)
    : null
}

export function PlayPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const difficulty = parseDifficulty(searchParams.get('difficulty'))

  if (slug === 'snake') {
    return difficulty ? (
      <SnakeGame difficulty={difficulty} />
    ) : (
      <SnakeDifficultyPicker />
    )
  }

  if (slug === 'tictactoe') {
    if (searchParams.get('opponent') === 'friend') {
      return <TicTacToeFriendGame />
    }
    return difficulty ? (
      <TicTacToeGame difficulty={difficulty} />
    ) : (
      <TicTacToeDifficultyPicker />
    )
  }

  if (slug === 'flappybird') {
    return difficulty ? (
      <FlappyBirdGame difficulty={difficulty} />
    ) : (
      <FlappyBirdDifficultyPicker />
    )
  }

  // Ismeretlen slug → vissza a főoldalra
  return <Navigate to="/" replace />
}