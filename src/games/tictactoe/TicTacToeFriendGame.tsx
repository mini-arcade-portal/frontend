import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { useTicTacToeFriendGame } from './useTicTacToeFriendGame'
import { TicTacToeBoard } from './TicTacToeBoard'

export function TicTacToeFriendGame() {
  const game = useTicTacToeFriendGame()
  const roundOver = game.roundResult !== 'playing'

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-6 max-w-[1080px] mx-auto animate-pop">
      {/* Bal: játék kártya */}
      <div className="card-playful p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="min-w-0">
            <Link
              to="/play/tictactoe"
              className="font-mono text-[11px] font-bold text-ink-2 hover:text-ink"
            >
              ← AI MÓD
            </Link>
            <h2 className="font-display font-extrabold text-3xl tracking-tight mt-0.5">
              Tic-Tac-Toe
            </h2>
            <div className="text-xs text-ink-2 mt-1 flex items-center gap-2 flex-wrap">
              <span>🤝</span>
              <span className="font-semibold">Barát mód</span>
              <span className="opacity-50">•</span>
              <span>Nincs ranglista — csak játék</span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="mb-5">
          <StatusBanner
            roundResult={game.roundResult}
            currentPlayer={game.currentPlayer}
            onNextRound={game.nextRound}
          />
        </div>

        {/* Board */}
        <TicTacToeBoard
          board={game.board}
          isClickable={!roundOver}
          winningLine={game.winningLine}
          onCellClick={game.playCell}
        />

        <div className="mt-4 text-center text-xs text-ink-2 opacity-60">
          Round #{game.roundNumber} • Az 1. játékos az{' '}
          <span className="font-bold text-pink-deep">X</span>, a 2. játékos az{' '}
          <span className="font-bold text-sky-deep">O</span>
        </div>
      </div>

      {/* Jobb: side panel */}
      <aside className="flex flex-col gap-5">
        <div className="card-dark p-5">
          <h4 className="font-display font-bold text-lg mb-3">Állás</h4>
          <div className="space-y-2.5 text-sm">
            <StatRow label="1. játékos (X)" value={`${game.tally.X}`} />
            <StatRow label="2. játékos (O)" value={`${game.tally.O}`} />
            <StatRow label="Döntetlen" value={`${game.tally.draws}`} />
          </div>
        </div>
        <Button variant="ink" onClick={game.resetTally}>
          Teljes reset
        </Button>
      </aside>
    </div>
  )
}

function StatusBanner({
  roundResult,
  currentPlayer,
  onNextRound,
}: {
  roundResult: ReturnType<typeof useTicTacToeFriendGame>['roundResult']
  currentPlayer: 'X' | 'O'
  onNextRound: () => void
}) {
  if (roundResult === 'playing') {
    return (
      <Banner color="cream" icon={currentPlayer === 'X' ? '✕' : '◯'}>
        <span className="font-semibold">
          {currentPlayer === 'X' ? '1. játékos' : '2. játékos'} köre
        </span>
      </Banner>
    )
  }

  if (roundResult === 'draw') {
    return (
      <Banner color="coral" icon="🤝">
        <span className="font-bold">Döntetlen</span>
        <Button
          variant="mustard"
          size="sm"
          onClick={onNextRound}
          className="ml-auto"
        >
          Következő →
        </Button>
      </Banner>
    )
  }

  return (
    <Banner color="mint" icon="🎉">
      <span className="font-bold">
        {roundResult === 'X' ? '1. játékos' : '2. játékos'} nyert!
      </span>
      <Button
        variant="mustard"
        size="sm"
        onClick={onNextRound}
        className="ml-auto"
      >
        Következő →
      </Button>
    </Banner>
  )
}

function Banner({
  children,
  color,
  icon,
}: {
  children: React.ReactNode
  color: 'cream' | 'mint' | 'coral'
  icon: string
}) {
  const bg = {
    cream: 'bg-cream-soft',
    mint: 'bg-mint',
    coral: 'bg-coral text-cream',
  }[color]

  return (
    <div
      className={[
        bg,
        'border-[3px] border-ink rounded-2xl px-5 py-3.5',
        'flex items-center gap-3',
        color === 'coral' ? 'text-cream' : 'text-ink',
      ].join(' ')}
    >
      <span className="text-2xl">{icon}</span>
      {children}
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="opacity-70">{label}</span>
      <span className="font-mono font-bold text-cream">{value}</span>
    </div>
  )
}
