import { CANVAS_HEIGHT, CANVAS_WIDTH } from './types'

interface FlappyBirdBoardProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  onFlap: () => void
}

export function FlappyBirdBoard({ canvasRef, onFlap }: FlappyBirdBoardProps) {
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={onFlap}
      onTouchStart={(e) => {
        e.preventDefault()
        onFlap()
      }}
      className="border-[3px] border-ink rounded-2xl h-full w-full cursor-pointer touch-none"
    />
  )
}
