import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BOARD_SIZE,
  calculateAppleScore,
  DIFFICULTIES,
  type Difficulty,
  type Direction,
  type GameStatus,
  type Position,
} from './types'

interface UseSnakeGameOptions {
  difficulty: Difficulty
  onGameOver?: (finalScore: number) => void
}

interface SnakeGameState {
  snake: Position[]
  food: Position
  direction: Direction
  status: GameStatus
  score: number
  applesEaten: number
  currentSpeed: number
  changeDirection: (dir: Direction) => void
  togglePause: () => void
  reset: () => void
}

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
}

const DELTA: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

function initialSnake(): Position[] {
  const mid = Math.floor(BOARD_SIZE / 2)
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
}

function spawnFood(snake: Position[]): Position {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
  while (true) {
    const candidate = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    }
    if (!occupied.has(`${candidate.x},${candidate.y}`)) {
      return candidate
    }
  }
}

export function useSnakeGame({
  difficulty,
  onGameOver,
}: UseSnakeGameOptions): SnakeGameState {
  const config = DIFFICULTIES[difficulty]

  const [snake, setSnake] = useState<Position[]>(initialSnake)
  const [food, setFood] = useState<Position>(() => spawnFood(initialSnake()))
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [status, setStatus] = useState<GameStatus>('idle')
  const [score, setScore] = useState(0)
  const [applesEaten, setApplesEaten] = useState(0)
  const [currentSpeed, setCurrentSpeed] = useState(config.startSpeed)

  
  const nextDirectionRef = useRef<Direction>('RIGHT')

  
  const onGameOverRef = useRef(onGameOver)
  useEffect(() => {
    onGameOverRef.current = onGameOver
  }, [onGameOver])

  
  const tick = useCallback(() => {
    setSnake((prevSnake) => {
      const dir = nextDirectionRef.current
      const head = prevSnake[0]
      const delta = DELTA[dir]
      const newHead: Position = {
        x: head.x + delta.x,
        y: head.y + delta.y,
      }

      // Fal-kollízió
      if (
        newHead.x < 0 ||
        newHead.x >= BOARD_SIZE ||
        newHead.y < 0 ||
        newHead.y >= BOARD_SIZE
      ) {
        setStatus('gameover')
        return prevSnake
      }

      // Önmagába harapás
      const willEat = newHead.x === food.x && newHead.y === food.y
      const bodyForCheck = willEat ? prevSnake : prevSnake.slice(0, -1)
      if (
        bodyForCheck.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
      ) {
        setStatus('gameover')
        return prevSnake
      }

      setDirection(dir)

      if (willEat) {
        // Score + apple + új étel + esetleges gyorsulás
        setApplesEaten((prevApples) => {
          const newApples = prevApples + 1
          const appleScore = calculateAppleScore(difficulty, currentSpeed)
          setScore((s) => s + appleScore)

          // Gyorsulás-e?
          if (
            config.speedUpEvery !== Infinity &&
            newApples % config.speedUpEvery === 0
          ) {
            setCurrentSpeed((s) => Math.max(config.minSpeed, s - config.speedUpStep))
          }

          return newApples
        })
        setFood(spawnFood([newHead, ...prevSnake]))
        return [newHead, ...prevSnake]
      }

      // Nem eszik → fej előre, farok le
      return [newHead, ...prevSnake.slice(0, -1)]
    })
  }, [config, currentSpeed, difficulty, food.x, food.y])

  useEffect(() => {
    if (status !== 'playing') return
    const id = setTimeout(tick, currentSpeed)
    return () => clearTimeout(id)
  }, [status, tick, currentSpeed, snake])

  useEffect(() => {
    if (status === 'gameover') {
      onGameOverRef.current?.(score)
    }
  }, [status])

  const changeDirection = useCallback(
    (newDir: Direction) => {
      if (status === 'gameover' || status === 'paused') return

      // 180 fok tiltás
      if (OPPOSITE[direction] === newDir) return

      nextDirectionRef.current = newDir

      // Idle-ből indítjuk a játékot
      if (status === 'idle') {
        setStatus('playing')
      }
    },
    [direction, status]
  )

  const togglePause = useCallback(() => {
    if (status === 'playing') setStatus('paused')
    else if (status === 'paused') setStatus('playing')
  }, [status])

  const reset = useCallback(() => {
    const fresh = initialSnake()
    setSnake(fresh)
    setFood(spawnFood(fresh))
    setDirection('RIGHT')
    setStatus('idle')
    setScore(0)
    setApplesEaten(0)
    setCurrentSpeed(config.startSpeed)
    nextDirectionRef.current = 'RIGHT'
  }, [config.startSpeed])

  /**
   * Billentyűzet input kezelő — globálisan.
   */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          changeDirection('UP')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          changeDirection('DOWN')
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          changeDirection('LEFT')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          changeDirection('RIGHT')
          break
        case ' ':
          e.preventDefault()
          togglePause()
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [changeDirection, togglePause])

  return {
    snake,
    food,
    direction,
    status,
    score,
    applesEaten,
    currentSpeed,
    changeDirection,
    togglePause,
    reset,
  }
}
