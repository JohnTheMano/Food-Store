import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { obtenerCategorias } from '@/features/categorias/api/categorias'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError, EstadoVacio, Paginacion, Skeleton } from '@/shared/components'
import { Button, Card, Input } from '@/shared/ui'
import type { Producto } from '../types/producto'
import ProductoList from '../components/ProductoList'
import ProductoModal from '../components/ProductoModal'
import { useProductos } from '../hooks/useProductos'

const PAGE_SIZE = 20

export default function AdminProductosPage() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [pagina, setPagina] = useState(0)
  const categoriasQuery = useQuery({
    queryKey: ['categorias'],
    queryFn: obtenerCategorias,
  })
  const productosQuery = useProductos({
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

  function cerrarModal() {
    setModalAbierto(false)
    setProductoSeleccionado(null)
  }

  function guardarProducto(datos: Omit<Producto, 'id'>) {
    if (productoSeleccionado) {
      productosQuery.updateMutation.mutate(
        { id: productoSeleccionado.id, datos },
        { onSuccess: cerrarModal },
      )
    } else {
      productosQuery.createMutation.mutate(datos, { onSuccess: cerrarModal })
    }
  }

  function eliminarProducto(productoId: number) {
    if (window.confirm('¿Querés dar de baja este producto?')) {
      productosQuery.deleteMutation.mutate(productoId)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
            Administración
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Productos
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Administrá precios, disponibilidad y stock del catálogo.
          </p>
        </div>
        <Button
          onClick={() => {
            setProductoSeleccionado(null)
            setModalAbierto(true)
          }}
        >
          <span aria-hidden="true">＋</span>
          Nuevo producto
        </Button>
      </header>

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-[1fr_18rem]">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Buscar producto
            <Input
              type="search"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value)
                setPagina(0)
              }}
              placeholder="Escribí un nombre..."
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
                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
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
        <div className="space-y-3" role="status" aria-label="Cargando productos">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
          <span className="sr-only">Cargando productos...</span>
        </div>
      )}
      {productosQuery.isError && (
        <EstadoError
          mensaje={handleApiError(productosQuery.error, 'No se pudieron cargar los productos.')}
          onReintentar={() => void productosQuery.refetch()}
        />
      )}
      {productosQuery.data?.items.length === 0 && (
        <EstadoVacio
          titulo="No hay productos para mostrar"
          descripcion="Probá con otra búsqueda o agregá un producto nuevo."
          accion={<Button onClick={() => setModalAbierto(true)}>Crear producto</Button>}
        />
      )}
      {productosQuery.data && productosQuery.data.items.length > 0 && (
        <>
          <Card padded={false} className="overflow-hidden">
            <ProductoList
              productos={productosQuery.data.items}
              canManage
              onEditar={(producto) => {
                setProductoSeleccionado(producto)
                setModalAbierto(true)
              }}
              onEliminar={eliminarProducto}
              showPagination={false}
            />
          </Card>
          <Paginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            onCambiar={setPagina}
          />
        </>
      )}

      {modalAbierto && (
        <ProductoModal
          key={productoSeleccionado?.id ?? 'nuevo'}
          abierto
          producto={productoSeleccionado}
          onCerrar={cerrarModal}
          onSubmit={guardarProducto}
          guardando={productosQuery.createMutation.isPending || productosQuery.updateMutation.isPending}
        />
      )}
    </main>
  )
}
