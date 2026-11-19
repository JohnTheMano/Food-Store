import { Link } from 'react-router-dom'
import { EstadoVacio } from '@/shared/components'
import { Card, Input } from '@/shared/ui'
import { useCartStore } from '@/store/cartStore'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

export default function CarritoPage() {
  const items = useCartStore((state) => state.items)
  const quitar = useCartStore((state) => state.quitar)
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad)
  const total = useCartStore((state) => state.total)

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
          Tu selección
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Carrito
        </h1>
      </header>

      {items.length === 0 ? (
        <EstadoVacio
          titulo="Tu carrito está esperando algo rico"
          descripcion="Explorá el menú y agregá tus productos favoritos."
          accion={
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              Ver el menú
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_19rem] lg:items-start">
          <Card padded={false} className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <article
                key={item.producto_id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-6"
              >
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-900 dark:text-white">{item.nombre}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {currencyFormatter.format(item.precio_unitario)} por unidad
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-24 text-xs font-semibold text-slate-500">
                    Cantidad
                    <Input
                      aria-label={`Cantidad de ${item.nombre}`}
                      type="number"
                      min={1}
                      value={item.cantidad}
                      onChange={(event) => cambiarCantidad(item.producto_id, Number(event.target.value))}
                      className="mt-1"
                    />
                  </label>
                  <div className="min-w-24 text-right">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {currencyFormatter.format(item.precio_unitario * item.cantidad)}
                    </p>
                    <button
                      type="button"
                      onClick={() => quitar(item.producto_id)}
                      className="mt-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </Card>

          <Card className="lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resumen</h2>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400">Total</span>
              <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300">
                {currencyFormatter.format(total())}
              </span>
            </div>
            <Link
              to="/checkout"
              className="mt-5 flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              Continuar al checkout
            </Link>
            <Link
              to="/"
              className="mt-3 flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Seguir mirando
            </Link>
          </Card>
        </div>
      )}
    </main>
  )
}
