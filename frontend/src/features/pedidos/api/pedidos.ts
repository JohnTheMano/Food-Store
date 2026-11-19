import axiosInstance from '@/shared/api/axiosInstance'
import type {
  EstadoPedido,
  Pedido,
  PedidoCreateInput,
  PedidosPaginados,
  ResumenPedidos,
} from '../types/pedido'

export async function obtenerPedidos(params?: { skip?: number; limit?: number; estado?: EstadoPedido }): Promise<PedidosPaginados> {
  const response = await axiosInstance.get('/pedidos', { params })
  return response.data
}

export async function obtenerResumenPedidos(): Promise<ResumenPedidos> {
  const response = await axiosInstance.get('/pedidos/resumen')
  return response.data
}

export async function crearPedido(data: PedidoCreateInput): Promise<Pedido> {
  const response = await axiosInstance.post('/pedidos', data)
  return response.data
}

export async function cancelarPedido(id: number): Promise<Pedido> {
  const response = await axiosInstance.patch(`/pedidos/${id}/cancelar`)
  return response.data
}

export async function cambiarEstadoPedido(
  id: number,
  estado: EstadoPedido,
): Promise<Pedido> {
  const response = await axiosInstance.patch(`/pedidos/${id}/estado`, { estado })
  return response.data
}
