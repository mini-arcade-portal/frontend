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
  isAuthenticated: () => boolean
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: () => !!get().token,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'mini-arcade-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
