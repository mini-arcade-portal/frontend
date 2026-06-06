import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { scoreApi } from '@/api/scores'
import { Button } from '@/components/Button'
import { DifficultyBadge } from '@/components/DifficultyBadge'
import { useAuthStore } from '@/store/authStore'

export function MyScoresPage() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  const { data: scores, isLoading } = useQuery({
    queryKey: ['scores', 'me'],
    queryFn: () => scoreApi.myScores(20),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => scoreApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] })
    },
  })

  return (
    <div className="animate-pop">
      <div className="card-playful p-9 px-12 mb-6 relative overflow-hidden">
        <div className="absolute w-[140px] h-[140px] bg-pink border-[3px] border-ink rounded-full -top-10 -right-10" />
        <span className="inline-block font-mono text-xs font-bold bg-ink text-cream px-3 py-1.5 rounded-lg tracking-widest uppercase mb-4">
          / Profil
        </span>
        <h1 className="font-display font-black text-5xl md:text-6xl tracking-tight">
          {user?.username}
        </h1>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-display font-extrabold text-2xl tracking-tight">
          Saját eredményeim
        </h2>
        <div className="flex-1 h-[3px] bg-cream/30 rounded" />
      </div>

      {isLoading && (
        <div className="card-playful p-10 text-center text-ink-2">
          Betöltés…
        </div>
      )}

      {!isLoading && scores?.length === 0 && (
        <div className="card-playful p-10 text-center">
          <p className="text-ink-2">
            Még nincs egyetlen eredményed sem. Játssz egyet!
          </p>
        </div>
      )}

      {!isLoading && scores && scores.length > 0 && (
        <div className="card-playful overflow-hidden p-0">
          <div className="grid grid-cols-[1fr_140px_1fr_1fr_120px] bg-ink text-cream py-3.5 px-6 font-mono text-[11px] font-semibold tracking-widest uppercase">
            <div>Játék</div>
            <div>Szint</div>
            <div>Pontszám</div>
            <div>Időpont</div>
            <div className="text-right">Művelet</div>
          </div>
          {scores.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-[1fr_140px_1fr_1fr_120px] items-center py-4 px-6 border-b-2 border-ink/10 font-semibold"
            >
              <div className="capitalize">{s.gameType}</div>
              <div>
                <DifficultyBadge difficulty={s.difficulty} />
              </div>
              <div className="font-mono font-bold text-mint-deep">
                {s.score.toLocaleString()}
              </div>
              <div className="font-mono text-sm text-ink-2 opacity-70">
                {new Date(s.createdAt).toLocaleString('hu-HU')}
              </div>
              <div className="text-right">
                <Button
                  variant="pink"
                  size="sm"
                  onClick={() => {
                    if (confirm('Biztosan törlöd ezt az eredményt?')) {
                      deleteMutation.mutate(s.id)
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  Törlés
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
