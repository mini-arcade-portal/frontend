import { BOARD_SIZE, type Position } from './types'

interface SnakeBoardProps {
  snake: Position[]
  food: Position
}

//15x15 grid renderer
export function SnakeBoard({ snake, food }: SnakeBoardProps) {
  const head = snake[0]
  const bodySet = new Set(snake.slice(1).map((p) => `${p.x},${p.y}`))

  const cells = []
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const isHead = head.x === x && head.y === y
      const isBody = bodySet.has(`${x},${y}`)
      const isFood = food.x === x && food.y === y
      cells.push(
        <Cell key={`${x},${y}`} isHead={isHead} isBody={isBody} isFood={isFood} />
      )
    }
  }

  return (
    <div className="flex justify-center">
      <div
        className="aspect-square bg-[#f5ead0] border-[3px] border-ink rounded-2xl grid gap-px p-1.5 w-full"
        style={{
          maxWidth: 'min(680px, calc(100vh - 280px))',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {cells}
      </div>
    </div>
  )
}

interface CellProps {
  isHead: boolean
  isBody: boolean
  isFood: boolean
}

function Cell({ isHead, isBody, isFood }: CellProps) {
  if (isHead) {
    return (
      <div className="relative bg-mint-deep rounded-md">
        <span className="absolute top-1 left-1 w-1 h-1 bg-ink rounded-full" />
        <span className="absolute top-1 right-1 w-1 h-1 bg-ink rounded-full" />
      </div>
    )
  }
  if (isBody) {
    return <div className="bg-mint rounded-sm" />
  }
  if (isFood) {
    return <div className="bg-pink-deep rounded-full animate-pulse" />
  }
  return <div />
}