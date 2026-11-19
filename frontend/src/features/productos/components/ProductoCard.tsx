import { useState } from 'react'
import { Button, Card } from '@/shared/ui'
import type { Producto } from '../types/producto'

interface ProductoCardProps {
  producto: Producto
  onAgregar: (producto: Producto) => void
}

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

export default function ProductoCard({ producto, onAgregar }: ProductoCardProps) {
  const [imageError, setImageError] = useState(false)
  const sinStock = !producto.disponible || producto.stock < 1

  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-100 dark:from-amber-950/50 dark:via-slate-800 dark:to-emerald-950/50">
        {producto.imagen_url && !imageError ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl" aria-hidden="true">
            🍽️
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
            sinStock
              ? 'bg-white/90 text-slate-600 dark:bg-slate-900/90 dark:text-slate-300'
              : 'bg-emerald-700 text-white'
          }`}
        >
          {sinStock ? 'Agotado' : 'Disponible'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{producto.nombre}</h2>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
          {producto.descripcion || 'Preparado con ingredientes seleccionados.'}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-xl font-extrabold tracking-tight text-emerald-800 dark:text-emerald-300">
            {currencyFormatter.format(producto.precio_base)}
          </p>
          <Button
            onClick={() => onAgregar(producto)}
            disabled={sinStock}
            className="px-3"
          >
            Agregar
          </Button>
        </div>
      </div>
    </Card>
  )
}
