import axiosInstance from '@/shared/api/axiosInstance'
import type { RegisterData, UsuarioAuth } from '../types/auth.types'

const AUTH_URL = '/auth'

export async function iniciarSesion(username: string, password: string): Promise<void> {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  form.append('grant_type', 'password')

  await axiosInstance.post(`${AUTH_URL}/token`, form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export async function obtenerSesion(): Promise<UsuarioAuth> {
  const response = await axiosInstance.get<UsuarioAuth>(`${AUTH_URL}/me`)
  return response.data
}

export async function cerrarSesion(): Promise<void> {
  await axiosInstance.post(`${AUTH_URL}/logout`)
}

export async function registrarUsuario(datos: RegisterData): Promise<UsuarioAuth> {
  const response = await axiosInstance.post<UsuarioAuth>(`${AUTH_URL}/register`, datos)
  return response.data
}
