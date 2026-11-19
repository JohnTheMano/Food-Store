import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
}

interface CartStore {
  items: CartItem[]
  agregar: (item: Omit<CartItem, 'cantidad'>) => void
  quitar: (productoId: number) => void
  cambiarCantidad: (productoId: number, cantidad: number) => void
  vaciar: () => void
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      agregar: (item) => set((state) => {
        const existing = state.items.find((entry) => entry.producto_id === item.producto_id)
        if (existing) {
          return { items: state.items.map((entry) =>
            entry.producto_id === item.producto_id
              ? { ...entry, cantidad: entry.cantidad + 1 }
              : entry,
          ) }
        }
        return { items: [...state.items, { ...item, cantidad: 1 }] }
      }),
      quitar: (productoId) => set((state) => ({
        items: state.items.filter((item) => item.producto_id !== productoId),
      })),
      cambiarCantidad: (productoId, cantidad) => set((state) => ({
        items: state.items.map((item) =>
          item.producto_id === productoId
            ? { ...item, cantidad: Math.max(1, cantidad) }
            : item,
        ),
      })),
      vaciar: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.precio_unitario * item.cantidad, 0),
    }),
    { name: 'cart-store' },
  ),
)
