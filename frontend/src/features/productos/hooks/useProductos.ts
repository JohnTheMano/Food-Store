import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleApiError } from '@/shared/api/handleApiError'
import { useNotificationStore } from '@/store/notificationStore'
import type { Producto } from '../types/producto'
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../api/productos'

export interface ProductFilters {
  skip: number
  limit: number
  search?: string
  categoria_id?: number
}

export function useCatalogoProductos(filters: ProductFilters) {
  return useQuery({
    queryKey: ['productos', filters],
    queryFn: () => obtenerProductos(filters),
  })
}

export function useProductos(filters: ProductFilters) {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)
  const query = useCatalogoProductos(filters)

  useEffect(() => {
    if (query.isError) {
      showNotification(handleApiError(query.error, 'Error al cargar los productos'))
    }
  }, [query.error, query.isError, showNotification])

  const createMutation = useMutation({
    mutationFn: crearProducto,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['productos'] }); showNotification('Producto creado') },
    onError: (error) => showNotification(handleApiError(error, 'Error al crear el producto')),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: Omit<Producto, 'id'> }) => actualizarProducto(id, datos),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['productos'] }); showNotification('Producto actualizado') },
    onError: (error) => showNotification(handleApiError(error, 'Error al actualizar el producto')),
  })
  const deleteMutation = useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['productos'] }); showNotification('Producto eliminado') },
    onError: (error) => showNotification(handleApiError(error, 'Error al eliminar el producto')),
  })

  return { ...query, createMutation, updateMutation, deleteMutation }
}
