import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BIRD_RADIUS,
  BIRD_X,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CLOUD_COUNT,
  CLOUD_SPEED,
  DIFFICULTIES,
  FLAP_VELOCITY,
  GRAVITY,
  GROUND_HEIGHT,
  MAX_FALL_SPEED,
  PIPE_CAP_HEIGHT,
  PIPE_CAP_OVERHANG,
  PIPE_MIN_BODY,
  PIPE_SPACING,
  PIPE_WIDTH,
  WING_FLAP_DURATION,
  type Bird,
  type Cloud,
  type Difficulty,
  type GameStatus,
  type Pipe,
} from './types'

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

function drawCloud(ctx: CanvasRenderingContext2D, cloud: Cloud) {
  const { x, y, scale } = cloud
  ctx.beginPath()
  ctx.ellipse(x, y, 26 * scale, 16 * scale, 0, 0, Math.PI * 2)
  ctx.ellipse(x + 20 * scale, y + 4 * scale, 20 * scale, 13 * scale, 0, 0, Math.PI * 2)
  ctx.ellipse(x - 20 * scale, y + 4 * scale, 18 * scale, 12 * scale, 0, 0, Math.PI * 2)
  ctx.fill()
}

function drawBird(
  ctx: CanvasRenderingContext2D,
  bird: Bird,
  timeSinceFlap: number,
  ink: string
) {
  const tilt = clamp(bird.velocity / 500, -0.5, 1.4)
  const wingPhase = clamp(1 - timeSinceFlap / WING_FLAP_DURATION, 0, 1)
  const wingAngle = lerp(0.3, -0.9, wingPhase)

  ctx.save()
  ctx.translate(BIRD_X, bird.y)
  ctx.rotate(tilt)
  ctx.lineWidth = 2.5
  ctx.strokeStyle = ink

  // Szárny (a test mögött, a hátsó felén)
  ctx.save()
  ctx.translate(-BIRD_RADIUS * 0.2, BIRD_RADIUS * 0.1)
  ctx.rotate(wingAngle)
  ctx.fillStyle = '#ff8fab'
  ctx.beginPath()
  ctx.ellipse(0, 0, BIRD_RADIUS * 0.85, BIRD_RADIUS * 0.5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // Test
  ctx.fillStyle = '#ffc857'
  ctx.beginPath()
  ctx.ellipse(0, 0, BIRD_RADIUS * 1.15, BIRD_RADIUS, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Csőr
  ctx.fillStyle = '#ff7a5c'
  ctx.beginPath()
  ctx.moveTo(BIRD_RADIUS * 0.7, -BIRD_RADIUS * 0.1)
  ctx.lineTo(BIRD_RADIUS * 1.5, BIRD_RADIUS * 0.05)
  ctx.lineTo(BIRD_RADIUS * 0.7, BIRD_RADIUS * 0.3)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Szem
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(BIRD_RADIUS * 0.35, -BIRD_RADIUS * 0.35, BIRD_RADIUS * 0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = ink
  ctx.beginPath()
  ctx.arc(BIRD_RADIUS * 0.48, -BIRD_RADIUS * 0.35, BIRD_RADIUS * 0.18, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

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
  clouds: Cloud[]
  distanceSinceLastPipe: number
  /** Másodpercek az utolsó flap óta — a szárnycsapás-animációhoz */
  timeSinceFlap: number
}

function randomCloud(x: number): Cloud {
  return {
    x,
    y: 30 + Math.random() * 160,
    scale: 0.6 + Math.random() * 0.8,
  }
}

function initialWorld(): World {
  return {
    bird: { y: CANVAS_HEIGHT / 2, velocity: 0 },
    pipes: [],
    clouds: Array.from({ length: CLOUD_COUNT }, (_, i) =>
      randomCloud((i / CLOUD_COUNT) * CANVAS_WIDTH)
    ),
    distanceSinceLastPipe: 0,
    timeSinceFlap: WING_FLAP_DURATION,
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
      const { bird, pipes, clouds, timeSinceFlap } = worldRef.current
      const INK = '#1a1d3a'

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Ég
      ctx.fillStyle = '#bfe8ff'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Felhők
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      for (const c of clouds) {
        drawCloud(ctx, c)
      }

      // Csövek
      ctx.lineWidth = 3
      ctx.strokeStyle = INK
      for (const p of pipes) {
        const gapTop = p.gapY - config.pipeGap / 2
        const gapBottom = p.gapY + config.pipeGap / 2

        ctx.fillStyle = '#3fc28a'
        ctx.fillRect(p.x, 0, PIPE_WIDTH, gapTop)
        ctx.strokeRect(p.x, 0, PIPE_WIDTH, gapTop)
        ctx.fillRect(
          p.x,
          gapBottom,
          PIPE_WIDTH,
          CANVAS_HEIGHT - GROUND_HEIGHT - gapBottom
        )
        ctx.strokeRect(
          p.x,
          gapBottom,
          PIPE_WIDTH,
          CANVAS_HEIGHT - GROUND_HEIGHT - gapBottom
        )

        // "Sapkák" a rés két oldalán, a klasszikus Flappy Bird cső-peremhez hasonlóan
        ctx.fillStyle = '#2fa374'
        const capX = p.x - PIPE_CAP_OVERHANG
        const capWidth = PIPE_WIDTH + PIPE_CAP_OVERHANG * 2
        ctx.fillRect(capX, gapTop - PIPE_CAP_HEIGHT, capWidth, PIPE_CAP_HEIGHT)
        ctx.strokeRect(capX, gapTop - PIPE_CAP_HEIGHT, capWidth, PIPE_CAP_HEIGHT)
        ctx.fillRect(capX, gapBottom, capWidth, PIPE_CAP_HEIGHT)
        ctx.strokeRect(capX, gapBottom, capWidth, PIPE_CAP_HEIGHT)
      }

      // Talaj
      ctx.fillStyle = '#f5ead0'
      ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT)
      ctx.beginPath()
      ctx.moveTo(0, CANVAS_HEIGHT - GROUND_HEIGHT)
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_HEIGHT)
      ctx.stroke()

      // Madár
      drawBird(ctx, bird, timeSinceFlap, INK)
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

      // Felhők és szárnycsapás-animáció mindig sodródnak/telnek, állapottól függetlenül
      const ambientWorld = worldRef.current
      ambientWorld.timeSinceFlap += dt
      for (const c of ambientWorld.clouds) {
        c.x -= CLOUD_SPEED * dt
        if (c.x < -40) {
          const fresh = randomCloud(CANVAS_WIDTH + 40)
          c.x = fresh.x
          c.y = fresh.y
          c.scale = fresh.scale
        }
      }

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
          const gapHalf = config.pipeGap / 2
          const minGapY = gapHalf + PIPE_MIN_BODY
          const maxGapY = CANVAS_HEIGHT - GROUND_HEIGHT - gapHalf - PIPE_MIN_BODY
          const gapY = minGapY + Math.random() * (maxGapY - minGapY)
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
    worldRef.current.timeSinceFlap = 0
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
