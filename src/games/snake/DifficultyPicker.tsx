import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { DIFFICULTIES, type Difficulty } from './types'

const cardColors: Record<Difficulty, string> = {
  EASY: 'bg-gradient-to-br from-[#c8f7d4] to-mint',
  MEDIUM: 'bg-gradient-to-br from-[#ffd9c0] to-mustard',
  HARD: 'bg-gradient-to-br from-[#ffb8c0] to-pink-deep',
}

const difficultyOrder: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']

export function DifficultyPicker() {
  const [selected, setSelected] = useState<Difficulty | null>(null)
  const navigate = useNavigate()

  const handleStart = () => {
    if (!selected) return
    navigate(`/play/snake?difficulty=${selected}`)
  }

  return (
    <div className="animate-pop">
      {/* Header */}
      <div className="card-playful p-10 mb-8 relative overflow-hidden">
        <div className="absolute w-40 h-40 bg-mint border-[3px] border-ink rounded-full -top-12 -right-12" />
        <div className="relative z-10">
          <span className="inline-block font-mono text-xs font-bold bg-ink text-cream px-3 py-1.5 rounded-lg tracking-widest uppercase mb-4">
            / 🐍 Snake
          </span>
          <h1 className="font-display font-black text-5xl md:text-6xl tracking-tight">
            Válassz nehézséget
          </h1>
          <p className="text-ink-2 font-medium mt-3 max-w-lg">
            A nehezebb szint több pontot ér — de gyorsabb a tempó és kevesebbet
            hibázhatsz.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {difficultyOrder.map((key) => {
          const config = DIFFICULTIES[key]
          const isSelected = selected === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={[
                cardColors[key],
                'text-ink border-[3px] border-ink rounded-3xl p-7 text-left',
                'transition-all',
                isSelected
                  ? '-translate-y-2 shadow-hard-lg ring-4 ring-mustard'
                  : 'shadow-hard hover:-translate-y-1',
              ].join(' ')}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl">{config.emoji}</span>
                <span className="font-mono text-xs font-bold bg-ink text-cream px-2 py-1 rounded">
                  ×{config.multiplier}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-3xl tracking-tight mb-1">
                {config.label}
              </h3>
              <p className="text-sm font-medium text-ink-2 mb-5">
                {config.description}
              </p>
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="opacity-70">Kezdő tempó:</span>
                  <span className="font-bold">{config.startSpeed}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Gyorsulás:</span>
                  <span className="font-bold">
                    {config.speedUpEvery === Infinity
                      ? 'nincs'
                      : `/${config.speedUpEvery} alma`}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Start button */}
      <div className="flex justify-center">
        <Button
          variant="mustard"
          size="lg"
          disabled={!selected}
          onClick={handleStart}
          className="min-w-[260px]"
        >
          {selected ? `Start ${DIFFICULTIES[selected].label} →` : 'Válassz egy szintet'}
        </Button>
      </div>
    </div>
  )
}
