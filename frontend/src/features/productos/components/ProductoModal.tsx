import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { obtenerCategorias } from '@/features/categorias/api/categorias'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError, Skeleton } from '@/shared/components'
import { Button, Input, Modal } from '@/shared/ui'
import type { Producto } from '../types/producto'

interface ProductoModalProps {
  abierto: boolean
  producto: Producto | null
  onCerrar: () => void
  onSubmit: (datos: Omit<Producto, 'id'>) => void
  guardando: boolean
}

const fieldClass = 'block text-sm font-semibold text-slate-700 dark:text-slate-200'

export default function ProductoModal({
  abierto,
  producto,
  onCerrar,
  onSubmit,
  guardando,
}: ProductoModalProps) {
  const categoriasQuery = useQuery({
    queryKey: ['categorias'],
    queryFn: obtenerCategorias,
    enabled: abierto,
  })

  const form = useForm({
    defaultValues: {
      nombre: producto?.nombre ?? '',
      descripcion: producto?.descripcion ?? '',
      precio_base: producto?.precio_base ?? 0,
      imagen_url: producto?.imagen_url ?? '',
      stock: producto?.stock ?? 0,
      disponible: producto?.disponible ?? true,
      activo: producto?.activo ?? true,
      categoria_id: producto?.categoria_id ?? 0,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        descripcion: value.descripcion || null,
        imagen_url: value.imagen_url || null,
      })
    },
  })

  useEffect(() => {
    const primeraCategoria = categoriasQuery.data?.[0]
    if (!producto && primeraCategoria && form.state.values.categoria_id === 0) {
      form.setFieldValue('categoria_id', primeraCategoria.id)
    }
  }, [categoriasQuery.data, form, producto])

  return (
    <Modal
      open={abierto}
      title={producto ? 'Editar producto' : 'Nuevo producto'}
      onClose={onCerrar}
      className="max-w-2xl"
    >
      {categoriasQuery.isPending ? (
        <div className="space-y-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      ) : categoriasQuery.isError ? (
        <EstadoError
          mensaje={handleApiError(categoriasQuery.error, 'No se pudieron cargar las categorías.')}
          onReintentar={() => void categoriasQuery.refetch()}
        />
      ) : categoriasQuery.data.length === 0 ? (
        <EstadoError mensaje="Creá una categoría antes de cargar productos." />
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="nombre"
              validators={{
                onChange: ({ value }) => value.trim() ? undefined : 'El nombre es obligatorio',
              }}
            >
              {(field) => (
                <label htmlFor="producto-nombre" className={fieldClass}>
                  Nombre
                  <Input
                    id="producto-nombre"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    invalid={field.state.meta.errors.length > 0}
                    className="mt-2"
                  />
                  {field.state.meta.errors.map((error) => (
                    <span key={String(error)} className="mt-1 block text-xs text-rose-600">{error}</span>
                  ))}
                </label>
              )}
            </form.Field>

            <form.Field name="categoria_id">
              {(field) => (
                <label htmlFor="producto-categoria" className={fieldClass}>
                  Categoría
                  <select
                    id="producto-categoria"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(Number(event.target.value))}
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-800 shadow-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    {categoriasQuery.data.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                    ))}
                  </select>
                </label>
              )}
            </form.Field>

            <form.Field
              name="precio_base"
              validators={{
                onChange: ({ value }) => value < 0 ? 'El precio no puede ser negativo' : undefined,
              }}
            >
              {(field) => (
                <label htmlFor="producto-precio" className={fieldClass}>
                  Precio
                  <Input
                    id="producto-precio"
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(Number(event.target.value))}
                    invalid={field.state.meta.errors.length > 0}
                    className="mt-2"
                  />
                </label>
              )}
            </form.Field>

            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) => value < 0 ? 'El stock no puede ser negativo' : undefined,
              }}
            >
              {(field) => (
                <label htmlFor="producto-stock" className={fieldClass}>
                  Stock
                  <Input
                    id="producto-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(Number(event.target.value))}
                    invalid={field.state.meta.errors.length > 0}
                    className="mt-2"
                  />
                </label>
              )}
            </form.Field>
          </div>

          <form.Field name="descripcion">
            {(field) => (
              <label htmlFor="producto-descripcion" className={fieldClass}>
                Descripción <span className="font-normal text-slate-400">(opcional)</span>
                <textarea
                  id="producto-descripcion"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  rows={3}
                  className="mt-2 block w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            )}
          </form.Field>

          <form.Field name="imagen_url">
            {(field) => (
              <label htmlFor="producto-imagen" className={fieldClass}>
                URL de imagen <span className="font-normal text-slate-400">(opcional)</span>
                <Input
                  id="producto-imagen"
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="mt-2"
                  placeholder="https://..."
                />
              </label>
            )}
          </form.Field>

          <form.Field name="disponible">
            {(field) => (
              <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(event) => field.handleChange(event.target.checked)}
                  className="size-4 rounded border-slate-300 accent-emerald-700"
                />
                Disponible para la venta
              </label>
            )}
          </form.Field>

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row">
            <Button variant="outline" onClick={onCerrar} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Guardando…' : producto ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
