import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const tabs = [
  { to: '/', label: 'Játékok', end: true },
  { to: '/leaderboard', label: 'Ranglista' },
  { to: '/me', label: 'Profil' },
]

export function TopNav() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isOnLogin = location.pathname === '/login'
  const ctaTo = isOnLogin ? '/register' : '/login'
  const ctaLabel = isOnLogin ? 'REGISZTRÁCIÓ →' : 'BELÉPÉS →'

  return (
    <nav className="flex items-center justify-between p-3.5 px-6 bg-cream text-ink rounded-3xl mb-8 shadow-hard border-[3px] border-ink">
      <NavLink to="/" className="flex items-center gap-3">
        <div
          className="w-9 h-9 bg-pink border-[3px] border-ink grid place-items-center text-xl -rotate-6"
          style={{ borderRadius: '14px 18px 14px 22px' }}
        >
          🕹
        </div>
        <span className="font-display font-black text-2xl tracking-tight">
          Mini Arcade
        </span>
      </NavLink>

      {user && (
        <div className="flex gap-1.5 bg-ink p-1.5 rounded-2xl">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                [
                  'px-4 py-2 rounded-xl font-semibold text-sm transition-all font-sans',
                  isActive
                    ? 'bg-mustard text-ink shadow-[0_2px_0_rgba(0,0,0,0.2)]'
                    : 'text-cream hover:bg-cream/10',
                ].join(' ')
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      )}

      {user ? (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-mint border-[2.5px] border-ink rounded-full grid place-items-center font-display font-extrabold text-base">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-sm">{user.username}</span>
          <button
            onClick={handleLogout}
            className="ml-2 text-xs font-mono font-semibold text-ink-2 hover:text-coral transition-colors"
            title="Kijelentkezés"
          >
            KILÉP →
          </button>
        </div>
      ) : (
        <NavLink
          to={ctaTo}
          className="font-mono text-xs font-bold tracking-widest bg-ink text-cream px-3.5 py-2.5 rounded-lg"
        >
          {ctaLabel}
        </NavLink>
      )}
    </nav>
  )
}