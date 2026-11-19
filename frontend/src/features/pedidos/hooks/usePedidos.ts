import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  cambiarEstadoPedido,
  cancelarPedido,
  crearPedido,
  obtenerPedidos,
  obtenerResumenPedidos,
} from '../api/pedidos'
import type { EstadoPedido, PedidoCreateInput } from '../types/pedido'

const PEDIDOS_QUERY_KEY = ['pedidos']

export function usePedidos(
  params?: { skip?: number; limit?: number; estado?: EstadoPedido },
  scope: 'admin' | 'mios' = 'mios',
) {
  return useQuery({
    queryKey: [...PEDIDOS_QUERY_KEY, scope, params],
    queryFn: () => obtenerPedidos(params),
  })
}

export function useResumenPedidos() {
  return useQuery({
    queryKey: [...PEDIDOS_QUERY_KEY, 'resumen'],
    queryFn: obtenerResumenPedidos,
  })
}

export function useCrearPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearPedido,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY })
    },
  })
}

export function useCancelarPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelarPedido,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY })
    },
  })
}

export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) =>
      cambiarEstadoPedido(id, estado),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY })
    },
  })
}

export type { PedidoCreateInput }
