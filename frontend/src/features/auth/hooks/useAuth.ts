import { handleApiError } from '@/shared/api/handleApiError'
import { registrarUsuario } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import type { RegisterData } from '../types/auth.types'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)
  const loginWithStore = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const checkSession = useAuthStore((state) => state.checkSession)

  const login = async (username: string, password: string) => {
    try {
      await loginWithStore(username, password)
    } catch (error: unknown) {
      throw new Error(
        handleApiError(error, 'No se pudo iniciar sesión. Verificá tus credenciales.'),
        { cause: error },
      )
    }
  }

  const register = async (data: RegisterData) => {
    try {
      await registrarUsuario(data)
    } catch (error: unknown) {
      throw new Error(handleApiError(error, 'No se pudo completar el registro.'), {
        cause: error,
      })
    }
  }

  return { user, status, login, logout, checkSession, register }
}
