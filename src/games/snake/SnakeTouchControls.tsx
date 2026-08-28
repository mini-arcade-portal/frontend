import type { Direction } from './types'

interface SnakeTouchControlsProps {
  onDirection: (direction: Direction) => void
}

export function SnakeTouchControls({ onDirection }: SnakeTouchControlsProps) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full max-w-[220px] mx-auto">
      <div />
      <DPadButton label="↑" onPress={() => onDirection('UP')} />
      <div />
      <DPadButton label="←" onPress={() => onDirection('LEFT')} />
      <DPadButton label="↓" onPress={() => onDirection('DOWN')} />
      <DPadButton label="→" onPress={() => onDirection('RIGHT')} />
    </div>
  )
}

function DPadButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="aspect-square grid place-items-center border-[3px] border-ink rounded-xl bg-ink text-cream text-xl font-bold active:bg-mustard active:text-ink"
    >
      {label}
    </button>
  )
}
