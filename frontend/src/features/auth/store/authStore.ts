
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cerrarSesion, iniciarSesion, obtenerSesion } from '../api/auth'
import type { AuthStoreState } from '../types/auth.types'

interface AuthStore extends AuthStoreState {
    clearSession: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      status: 'checking',
      login: async (username, password) => {
        await iniciarSesion(username, password)
        const usuario = await obtenerSesion()
        set({ user: usuario, status: 'authenticated' })
      },
      logout: async () => {
        try {
          await cerrarSesion()
        } finally {
          set({ user: null, status: 'unauthenticated' })
        }
      },
      checkSession: async () => {
        set({ status: 'checking' })
        try {
          const usuario = await obtenerSesion()
          set({ user: usuario, status: 'authenticated' })
        } catch {
          set({ user: null, status: 'unauthenticated' })
        }
      },
      clearSession: () => set({ user: null, status: 'unauthenticated' }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user }) as Partial<AuthStore>,
    },
  ),
)
