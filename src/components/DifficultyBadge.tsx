import type { Difficulty } from '@/api/scores'

const config: Record<Difficulty, { label: string; emoji: string; bg: string }> = {
  EASY: { label: 'Könnyű', emoji: '🌱', bg: 'bg-mint' },
  MEDIUM: { label: 'Közepes', emoji: '🔥', bg: 'bg-mustard' },
  HARD: { label: 'Nehéz', emoji: '⚡', bg: 'bg-pink' },
}

interface DifficultyBadgeProps {
  difficulty: Difficulty
  size?: 'sm' | 'md'
}

export function DifficultyBadge({ difficulty, size = 'sm' }: DifficultyBadgeProps) {
  const c = config[difficulty]
  const sizeClasses =
    size === 'md' ? 'text-sm px-2.5 py-1' : 'text-xs px-2 py-0.5'

  return (
    <span
      className={[
        c.bg,
        'inline-flex items-center gap-1 border-2 border-ink rounded-md font-mono font-bold text-ink',
        sizeClasses,
      ].join(' ')}
      title={c.label}
    >
      <span>{c.emoji}</span>
      <span>{c.label}</span>
    </span>
  )
}
