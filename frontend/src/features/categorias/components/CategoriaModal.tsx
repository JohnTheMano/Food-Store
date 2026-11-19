import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { Button, Input, Modal } from '@/shared/ui'
import type { Categoria } from '../types/categoria'

interface CategoriaModalProps {
  abierto: boolean
  categoria: Categoria | null
  onCerrar: () => void
  onSubmit: (datos: Omit<Categoria, 'id'>) => void
  guardando: boolean
}

const fieldClass = 'block text-sm font-semibold text-slate-700 dark:text-slate-200'

export default function CategoriaModal({
  abierto,
  categoria,
  onCerrar,
  onSubmit,
  guardando,
}: CategoriaModalProps) {
  const form = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
      })
    },
  })

  useEffect(() => {
    if (abierto) {
      form.reset({
        nombre: categoria?.nombre ?? '',
        descripcion: categoria?.descripcion ?? '',
      })
    }
  }, [abierto, categoria, form])

  return (
    <Modal
      open={abierto}
      title={categoria ? 'Editar categoría' : 'Nueva categoría'}
      onClose={onCerrar}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-5"
      >
        <form.Field
          name="nombre"
          validators={{
            onChange: ({ value }) => {
              const nombre = value.trim()
              if (!nombre) return 'El nombre es obligatorio'
              if (nombre.length < 2) return 'Usá al menos 2 caracteres'
              if (nombre.length > 100) return 'El máximo es 100 caracteres'
              return undefined
            },
          }}
        >
          {(field) => (
            <label htmlFor="categoria-nombre" className={fieldClass}>
              Nombre
              <Input
                id="categoria-nombre"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                maxLength={100}
                invalid={field.state.meta.errors.length > 0}
                className="mt-2"
                autoFocus
              />
              {field.state.meta.errors.map((error) => (
                <span key={String(error)} className="mt-1 block text-xs font-medium text-rose-600">
                  {error}
                </span>
              ))}
            </label>
          )}
        </form.Field>

        <form.Field name="descripcion">
          {(field) => (
            <label htmlFor="categoria-descripcion" className={fieldClass}>
              Descripción <span className="font-normal text-slate-400">(opcional)</span>
              <textarea
                id="categoria-descripcion"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                rows={4}
                className="mt-2 block w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          )}
        </form.Field>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row">
          <Button variant="outline" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? 'Guardando…' : categoria ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
