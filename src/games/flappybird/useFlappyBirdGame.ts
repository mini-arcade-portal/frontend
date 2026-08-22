import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BIRD_RADIUS,
  BIRD_X,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DIFFICULTIES,
  FLAP_VELOCITY,
  GRAVITY,
  GROUND_HEIGHT,
  MAX_FALL_SPEED,
  PIPE_MARGIN,
  PIPE_SPACING,
  PIPE_WIDTH,
  type Bird,
  type Difficulty,
  type GameStatus,
  type Pipe,
} from './types'

interface UseFlappyBirdGameOptions {
  difficulty: Difficulty
  onGameOver?: (finalScore: number) => void
}

interface FlappyBirdGameState {
  canvasRef: React.RefObject<HTMLCanvasElement>
  status: GameStatus
  score: number
  pipesPassed: number
  flap: () => void
  reset: () => void
}

interface World {
  bird: Bird
  pipes: Pipe[]
  distanceSinceLastPipe: number
}

function initialWorld(): World {
  return {
    bird: { y: CANVAS_HEIGHT / 2, velocity: 0 },
    pipes: [],
    distanceSinceLastPipe: 0,
  }
}

export function useFlappyBirdGame({
  difficulty,
  onGameOver,
}: UseFlappyBirdGameOptions): FlappyBirdGameState {
  const config = DIFFICULTIES[difficulty]

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<GameStatus>('idle')
  const [score, setScore] = useState(0)
  const [pipesPassed, setPipesPassed] = useState(0)

  const worldRef = useRef<World>(initialWorld())
  const statusRef = useRef<GameStatus>('idle')
  const scoreRef = useRef(0)
  const rafRef = useRef<number | undefined>(undefined)
  const lastTsRef = useRef<number | null>(null)

  const onGameOverRef = useRef(onGameOver)
  useEffect(() => {
    onGameOverRef.current = onGameOver
  }, [onGameOver])

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { bird, pipes } = worldRef.current

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Ég
      ctx.fillStyle = '#bfe8ff'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Csövek
      ctx.fillStyle = '#3fc28a'
      for (const p of pipes) {
        const gapTop = p.gapY - config.pipeGap / 2
        const gapBottom = p.gapY + config.pipeGap / 2
        ctx.fillRect(p.x, 0, PIPE_WIDTH, gapTop)
        ctx.fillRect(
          p.x,
          gapBottom,
          PIPE_WIDTH,
          CANVAS_HEIGHT - GROUND_HEIGHT - gapBottom
        )
      }

      // Talaj
      ctx.fillStyle = '#f5ead0'
      ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT)

      // Madár
      ctx.fillStyle = '#ff5d8f'
      ctx.beginPath()
      ctx.arc(BIRD_X, bird.y, BIRD_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    },
    [config.pipeGap]
  )

  const tick = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 1 / 30)
      lastTsRef.current = ts

      if (statusRef.current === 'playing') {
        const world = worldRef.current

        world.bird.velocity = Math.min(
          world.bird.velocity + GRAVITY * dt,
          MAX_FALL_SPEED
        )
        world.bird.y += world.bird.velocity * dt

        world.distanceSinceLastPipe += config.scrollSpeed * dt
        if (world.distanceSinceLastPipe >= PIPE_SPACING) {
          world.distanceSinceLastPipe = 0
          const usableHeight = CANVAS_HEIGHT - GROUND_HEIGHT - PIPE_MARGIN * 2
          const gapY = PIPE_MARGIN + Math.random() * usableHeight
          world.pipes.push({ x: CANVAS_WIDTH, gapY, passed: false })
        }

        for (const p of world.pipes) p.x -= config.scrollSpeed * dt
        world.pipes = world.pipes.filter((p) => p.x + PIPE_WIDTH > 0)

        let collided =
          world.bird.y + BIRD_RADIUS > CANVAS_HEIGHT - GROUND_HEIGHT ||
          world.bird.y - BIRD_RADIUS < 0

        for (const p of world.pipes) {
          if (!p.passed && p.x + PIPE_WIDTH < BIRD_X - BIRD_RADIUS) {
            p.passed = true
            setPipesPassed((n) => n + 1)
            setScore((s) => {
              const next = s + config.multiplier
              scoreRef.current = next
              return next
            })
          }

          const withinX =
            BIRD_X + BIRD_RADIUS > p.x && BIRD_X - BIRD_RADIUS < p.x + PIPE_WIDTH
          if (withinX) {
            const gapTop = p.gapY - config.pipeGap / 2
            const gapBottom = p.gapY + config.pipeGap / 2
            if (
              world.bird.y - BIRD_RADIUS < gapTop ||
              world.bird.y + BIRD_RADIUS > gapBottom
            ) {
              collided = true
            }
          }
        }

        if (collided) {
          statusRef.current = 'gameover'
          setStatus('gameover')
        }
      }

      draw(ctx)
      rafRef.current = requestAnimationFrame(tick)
    },
    [config, draw]
  )

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [tick])

  useEffect(() => {
    if (status === 'gameover') {
      onGameOverRef.current?.(scoreRef.current)
    }
  }, [status])

  const flap = useCallback(() => {
    if (statusRef.current === 'gameover') return
    if (statusRef.current === 'idle') {
      statusRef.current = 'playing'
      setStatus('playing')
    }
    worldRef.current.bird.velocity = FLAP_VELOCITY
  }, [])

  const reset = useCallback(() => {
    worldRef.current = initialWorld()
    lastTsRef.current = null
    statusRef.current = 'idle'
    scoreRef.current = 0
    setStatus('idle')
    setScore(0)
    setPipesPassed(0)
  }, [])

  /**
   * Billentyűzet input kezelő — globálisan, mint a Snake-nél.
   */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        flap()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [flap])

  return {
    canvasRef,
    status,
    score,
    pipesPassed,
    flap,
    reset,
  }
}
