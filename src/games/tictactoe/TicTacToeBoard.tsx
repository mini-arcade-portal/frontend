import type { Board, CellValue } from './types'

interface TicTacToeBoardProps {
  board: Board
  isClickable: boolean
  winningLine: readonly number[] | null
  onCellClick: (index: number) => void
}

export function TicTacToeBoard({
  board,
  isClickable,
  winningLine,
  onCellClick,
}: TicTacToeBoardProps) {
  return (
    <div className="flex justify-center">
      <div
        className="aspect-square bg-[#f5ead0] border-[3px] border-ink rounded-2xl grid gap-2 p-3 w-full"
        style={{
          maxWidth: 'min(480px, calc(100dvh - 400px))',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
        }}
      >
        {board.map((value, idx) => (
          <Cell
            key={idx}
            value={value}
            isWinning={winningLine?.includes(idx) ?? false}
            isClickable={isClickable && value === null}
            onClick={() => onCellClick(idx)}
          />
        ))}
      </div>
    </div>
  )
}

interface CellProps {
  value: CellValue
  isWinning: boolean
  isClickable: boolean
  onClick: () => void
}

function Cell({ value, isWinning, isClickable, onClick }: CellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={[
        'border-[3px] border-ink rounded-2xl grid place-items-center',
        'font-display font-black transition-all',
        'aspect-square',
        isWinning
          ? 'bg-mustard'
          : isClickable
            ? 'bg-cream-soft hover:bg-mustard/30 cursor-pointer'
            : 'bg-cream-soft cursor-default',
        isClickable ? 'hover:-translate-y-0.5' : '',
      ].join(' ')}
    >
      {value === 'X' && <XMark winning={isWinning} />}
      {value === 'O' && <OMark winning={isWinning} />}
    </button>
  )
}

function XMark({ winning }: { winning: boolean }) {
  return (
    <span
      className={[
        'text-7xl md:text-8xl leading-none',
        winning ? 'text-ink' : 'text-pink-deep',
        'animate-pop',
      ].join(' ')}
    >
      ✕
    </span>
  )
}

function OMark({ winning }: { winning: boolean }) {
  return (
    <span
      className={[
        'text-7xl md:text-8xl leading-none',
        winning ? 'text-ink' : 'text-sky-deep',
        'animate-pop',
      ].join(' ')}
    >
      ◯
    </span>
  )
}
