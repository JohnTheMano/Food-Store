
import type { Producto, ProductosPaginados } from '../types/producto'
import axiosInstance from '@/shared/api/axiosInstance'

const API_URL = '/productos'

export async function obtenerProductos(params?: {
    skip?: number
    limit?: number
    search?: string
    categoria_id?: number
    disponible?: boolean
}): Promise<ProductosPaginados> {
    const response = await axiosInstance.get(API_URL, { params })
    return response.data
}

export async function crearProducto(
    producto: Omit<Producto, 'id'>
): Promise<Producto> {
    const response = await axiosInstance.post(`${API_URL}/`, producto)
    return response.data
}

export async function actualizarProducto(
    id: number,
    producto: Omit<Producto, 'id'>
): Promise<Producto> {
    const response = await axiosInstance.put(`${API_URL}/${id}`, producto)
    return response.data
}

export async function eliminarProducto(id: number): Promise<void> {
    await axiosInstance.delete(`${API_URL}/${id}`)
}
