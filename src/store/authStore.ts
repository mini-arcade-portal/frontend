import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'USER' | 'ADMIN'

export interface AuthUser {
  username: string
  role: Role
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  sessionExpired: boolean
  isAuthenticated: () => boolean
  login: (token: string, user: AuthUser) => void
  logout: () => void
  expireSession: () => void
  clearSessionExpired: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      sessionExpired: false,
      isAuthenticated: () => !!get().token,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      expireSession: () => set({ token: null, user: null, sessionExpired: true }),
      clearSessionExpired: () => set({ sessionExpired: false }),
    }),
    {
      name: 'mini-arcade-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
