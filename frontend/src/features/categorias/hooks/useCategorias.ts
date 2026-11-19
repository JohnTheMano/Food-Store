import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleApiError } from '@/shared/api/handleApiError'
import { useNotificationStore } from '@/store/notificationStore'
import type { Categoria } from '../types/categoria'
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '../api/categorias'

export function useCategorias() {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)
  const query = useQuery({ queryKey: ['categorias'], queryFn: obtenerCategorias })

  useEffect(() => {
    if (query.isError) {
      showNotification(handleApiError(query.error, 'Error al cargar las categorías'))
    }
  }, [query.error, query.isError, showNotification])

  const createMutation = useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification('Categoría creada')
    },
    onError: (error) => showNotification(handleApiError(error, 'Error al crear la categoría')),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: Omit<Categoria, 'id'> }) =>
      actualizarCategoria(id, datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification('Categoría actualizada')
    },
    onError: (error) => showNotification(handleApiError(error, 'Error al actualizar la categoría')),
  })

  const deleteMutation = useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification('Categoría eliminada')
    },
    onError: (error) => showNotification(handleApiError(error, 'Error al eliminar la categoría')),
  })

  return { ...query, createMutation, updateMutation, deleteMutation }
}
