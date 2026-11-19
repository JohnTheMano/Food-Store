import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export default function AuthSessionInitializer() {
  const checkSession = useAuthStore((state) => state.checkSession)

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  return null
}
