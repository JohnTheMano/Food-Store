import { useState } from 'react'
import type { Categoria } from '../types/categoria'
import CategoriaList from '../components/CategoriaList'
import CategoriaModal from '../components/CategoriaModal'
import { useCategorias } from '../hooks/useCategorias'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError, EstadoVacio, Skeleton } from '@/shared/components'
import { Button } from '@/shared/ui'

export default function AdminCategoriasPage() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null)
  const {
    data: categorias = [],
    isPending,
    isError,
    error,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useCategorias()

  function cerrarModal() {
    setModalAbierto(false)
    setCategoriaSeleccionada(null)
  }

  function guardarCategoria(datos: Omit<Categoria, 'id'>) {
    if (categoriaSeleccionada) {
      updateMutation.mutate(
        { id: categoriaSeleccionada.id, datos },
        { onSuccess: cerrarModal },
      )
    } else {
      createMutation.mutate(datos, { onSuccess: cerrarModal })
    }
  }

  function eliminarCategoria(categoriaId: number) {
    if (window.confirm('¿Querés dar de baja esta categoría?')) {
      deleteMutation.mutate(categoriaId)
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
            Categorías
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Organizá el menú para que sea fácil encontrar cada producto.
          </p>
        </div>
        <Button
          onClick={() => {
            setCategoriaSeleccionada(null)
            setModalAbierto(true)
          }}
        >
          <span aria-hidden="true">＋</span>
          Nueva categoría
        </Button>
      </header>

      {isPending && (
        <div className="space-y-3" role="status" aria-label="Cargando categorías">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
          <span className="sr-only">Cargando categorías...</span>
        </div>
      )}
      {isError && (
        <EstadoError
          mensaje={handleApiError(error, 'No se pudieron cargar las categorías.')}
        />
      )}
      {!isPending && !isError && categorias.length === 0 && (
        <EstadoVacio
          titulo="Todavía no hay categorías"
          descripcion="Creá una categoría para empezar a organizar el menú."
          accion={<Button onClick={() => setModalAbierto(true)}>Crear categoría</Button>}
        />
      )}
      {!isPending && !isError && categorias.length > 0 && (
        <CategoriaList
          categorias={categorias}
          canManage
          onEditar={(categoria) => {
            setCategoriaSeleccionada(categoria)
            setModalAbierto(true)
          }}
          onEliminar={eliminarCategoria}
        />
      )}

      <CategoriaModal
        abierto={modalAbierto}
        categoria={categoriaSeleccionada}
        onCerrar={cerrarModal}
        onSubmit={guardarCategoria}
        guardando={createMutation.isPending || updateMutation.isPending}
      />
    </main>
  )
}
