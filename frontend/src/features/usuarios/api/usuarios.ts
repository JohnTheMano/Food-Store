import axiosInstance from '@/shared/api/axiosInstance'
import type { UsuarioAdmin } from '../types/usuario'

export async function obtenerUsuarios(): Promise<UsuarioAdmin[]> {
  const response = await axiosInstance.get<UsuarioAdmin[]>('/admin/usuarios')
  return response.data
}

export async function actualizarEstadoUsuario(
  userId: number,
  active: boolean,
): Promise<void> {
  await axiosInstance.post(
    `/admin/usuarios/${userId}/${active ? 'activar' : 'desactivar'}`,
  )
}
