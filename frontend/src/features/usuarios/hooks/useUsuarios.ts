import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleApiError } from '@/shared/api/handleApiError'
import { useNotificationStore } from '@/store/notificationStore'
import { actualizarEstadoUsuario, obtenerUsuarios } from '../api/usuarios'

interface SetUserActiveVariables {
  userId: number
  active: boolean
}

const ADMIN_USERS_QUERY_KEY = ['admin-users']

export function useUsuarios() {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const query = useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: obtenerUsuarios,
  })

  useEffect(() => {
    if (query.isError) {
      showNotification(handleApiError(query.error, 'Error al cargar los usuarios'))
    }
  }, [query.error, query.isError, showNotification])

  const activeMutation = useMutation({
    mutationFn: ({ userId, active }: SetUserActiveVariables) =>
      actualizarEstadoUsuario(userId, active),
    onSuccess: (_data, { active }) => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY })
      showNotification(active ? 'Usuario activado' : 'Usuario desactivado')
    },
    onError: (error) => {
      showNotification(handleApiError(error, 'No se pudo actualizar el usuario'))
    },
  })

  return {
    ...query,
    setUserActive: (userId: number, active: boolean) =>
      activeMutation.mutate({ userId, active }),
    isUpdating: activeMutation.isPending,
  }
}
