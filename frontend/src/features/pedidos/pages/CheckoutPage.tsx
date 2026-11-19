import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@tanstack/react-form'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError, EstadoVacio } from '@/shared/components'
import { Button, Card, Input } from '@/shared/ui'
import { useCartStore } from '@/store/cartStore'
import { useCrearPedido } from '../hooks/usePedidos'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

export default function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const vaciar = useCartStore((state) => state.vaciar)
  const total = useCartStore((state) => state.total)
  const [error, setError] = useState('')
  const mutation = useCrearPedido()
  const form = useForm({
    defaultValues: {
      direccion_entrega: '',
      forma_pago: 'EFECTIVO' as 'EFECTIVO' | 'TRANSFERENCIA',
      notas: '',
    },
    onSubmit: async ({ value }) => {
      setError('')
      if (items.length === 0) {
        setError('El carrito está vacío.')
        return
      }

      try {
        await mutation.mutateAsync({
          items: items.map((item) => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
          })),
          direccion_entrega: value.direccion_entrega,
          forma_pago: value.forma_pago,
          notas: value.notas || undefined,
        })
        vaciar()
        navigate('/mis-pedidos', { replace: true })
      } catch (submitError) {
        setError(handleApiError(submitError, 'No se pudo crear el pedido.'))
      }
    },
  })

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <EstadoVacio
          titulo="No hay productos para confirmar"
          descripcion="Agregá productos al carrito antes de continuar con el pedido."
          accion={
            <Button onClick={() => navigate('/')}>
              Volver al menú
            </Button>
          }
        />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
          Último paso
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Confirmar pedido
        </h1>
      </header>
      {error && <div className="mb-5"><EstadoError mensaje={error} /></div>}

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <Card>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void form.handleSubmit()
            }}
            className="space-y-5"
          >
            <form.Field
              name="direccion_entrega"
              validators={{
                onChange: ({ value }) => {
                  if (value.trim().length < 5) return 'Ingresá una dirección de al menos 5 caracteres'
                  if (value.length > 200) return 'La dirección no puede superar 200 caracteres'
                  return undefined
                },
              }}
            >
              {(field) => (
                <label htmlFor="direccion-entrega" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Dirección de entrega
                  <Input
                    id="direccion-entrega"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    minLength={5}
                    maxLength={200}
                    placeholder="Calle, número, localidad"
                    invalid={field.state.meta.errors.length > 0}
                    className="mt-2"
                  />
                  {field.state.meta.errors.map((message) => (
                    <span key={String(message)} className="mt-1 block text-xs text-rose-600">{message}</span>
                  ))}
                </label>
              )}
            </form.Field>

            <form.Field name="forma_pago">
              {(field) => (
                <label htmlFor="forma-pago" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Forma de pago
                  <select
                    id="forma-pago"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value as 'EFECTIVO' | 'TRANSFERENCIA')}
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-normal shadow-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                  </select>
                </label>
              )}
            </form.Field>

            <form.Field name="notas">
              {(field) => (
                <label htmlFor="notas" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Notas <span className="font-normal text-slate-400">(opcional)</span>
                  <textarea
                    id="notas"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    rows={3}
                    className="mt-2 block w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-normal shadow-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700 dark:bg-slate-950"
                    placeholder="Indicaciones para tu pedido..."
                  />
                </label>
              )}
            </form.Field>

            <Button type="submit" disabled={mutation.isPending} className="w-full py-3">
              {mutation.isPending ? 'Confirmando pedido…' : 'Confirmar y realizar pedido'}
            </Button>
          </form>
        </Card>

        <Card className="lg:sticky lg:top-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tu pedido</h2>
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <li key={item.producto_id} className="flex justify-between gap-3 py-3 text-sm">
                <span className="text-slate-600 dark:text-slate-300">
                  {item.cantidad}× {item.nombre}
                </span>
                <span className="shrink-0 font-semibold text-slate-800 dark:text-slate-100">
                  {currencyFormatter.format(item.precio_unitario * item.cantidad)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Total</span>
            <span className="text-lg font-extrabold text-emerald-800 dark:text-emerald-300">
              {currencyFormatter.format(total())}
            </span>
          </div>
        </Card>
      </div>
    </main>
  )
}
