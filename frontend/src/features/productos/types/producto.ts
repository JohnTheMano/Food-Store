export interface Producto {
    id: number
    nombre: string
    descripcion: string | null
    precio_base: number
    imagen_url: string | null
    stock: number
    disponible: boolean
    activo: boolean
    categoria_id: number
}

export interface ProductosPaginados {
    total: number
    items: Producto[]
}