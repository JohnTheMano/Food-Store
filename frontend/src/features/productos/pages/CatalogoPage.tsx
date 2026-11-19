import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { obtenerCategorias } from '@/features/categorias/api/categorias'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError, EstadoVacio, Paginacion, Skeleton } from '@/shared/components'
import { Card, Input } from '@/shared/ui'
import { useCartStore } from '@/store/cartStore'
import ProductoCard from '../components/ProductoCard'
import { useCatalogoProductos } from '../hooks/useProductos'

const PAGE_SIZE = 12

export default function CatalogoPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [pagina, setPagina] = useState(0)
  const agregar = useCartStore((state) => state.agregar)
  const categoriasQuery = useQuery({
    queryKey: ['categorias'],
    queryFn: obtenerCategorias,
  })
  const productosQuery = useCatalogoProductos({
    skip: pagina * PAGE_SIZE,
    limit: PAGE_SIZE,
    search: search || undefined,
    categoria_id: categoriaId ? Number(categoriaId) : undefined,
  })
  const totalPaginas = Math.max(
    1,
    Math.ceil((productosQuery.data?.total ?? 0) / PAGE_SIZE),
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [searchInput])

  function agregarAlCarrito(producto: { id: number; nombre: string; precio_base: number }) {
    agregar({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio_unitario: producto.precio_base,
    })
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-700 px-6 py-10 text-white shadow-xl sm:px-10 sm:py-12">
        <div className="absolute -right-10 -top-20 size-64 rounded-full bg-amber-300/10 blur-2xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
            Hecho para disfrutar
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Algo rico te está esperando
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100 sm:text-base">
            Explorá el menú, elegí tus favoritos y armá tu pedido en unos pocos pasos.
          </p>
        </div>
      </section>

      <Card className="mb-7">
        <div className="grid gap-4 md:grid-cols-[1fr_18rem] md:items-end">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Buscar en el menú
            <Input
              type="search"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value)
                setPagina(0)
              }}
              placeholder="Hamburguesas, pizzas, bebidas..."
              className="mt-2"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Categoría
            <select
              value={categoriaId}
              onChange={(event) => {
                setCategoriaId(event.target.value)
                setPagina(0)
              }}
              className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-800 shadow-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">Todas las categorías</option>
              {(categoriasQuery.data ?? []).map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
        {categoriasQuery.isError && (
          <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">
            {handleApiError(categoriasQuery.error, 'No se pudieron cargar las categorías.')}
          </p>
        )}
      </Card>

      {productosQuery.isPending && (
        <div
          role="status"
          aria-label="Cargando productos"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
          <span className="sr-only">Cargando productos...</span>
        </div>
      )}
      {productosQuery.isError && (
        <EstadoError
          mensaje={handleApiError(productosQuery.error, 'No se pudo cargar el catálogo.')}
          onReintentar={() => void productosQuery.refetch()}
        />
      )}
      {productosQuery.data?.items.length === 0 && (
        <EstadoVacio
          titulo="No encontramos productos"
          descripcion="Probá con otra búsqueda o elegí una categoría diferente."
        />
      )}
      {productosQuery.data && productosQuery.data.items.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {productosQuery.data.total} productos disponibles en el menú
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productosQuery.data.items.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onAgregar={agregarAlCarrito}
              />
            ))}
          </div>
          <Paginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            onCambiar={setPagina}
          />
        </>
      )}
    </main>
  )
}
