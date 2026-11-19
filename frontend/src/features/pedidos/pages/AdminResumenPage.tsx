import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError, Skeleton } from '@/shared/components'
import { Card } from '@/shared/ui'
import { useResumenPedidos } from '../hooks/usePedidos'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

const metricStyles = [
  'bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300',
  'bg-sky-50 text-sky-800 dark:bg-sky-400/10 dark:text-sky-300',
  'bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300',
  'bg-rose-50 text-rose-800 dark:bg-rose-400/10 dark:text-rose-300',
  'bg-violet-50 text-violet-800 dark:bg-violet-400/10 dark:text-violet-300',
  'bg-teal-50 text-teal-800 dark:bg-teal-400/10 dark:text-teal-300',
]

export default function AdminResumenPage() {
  const query = useResumenPedidos()

  const indicators = query.data
    ? [
        { label: 'Pedidos pendientes', value: query.data.pendientes },
        { label: 'En preparación', value: query.data.en_preparacion },
        { label: 'Pedidos entregados', value: query.data.entregados },
        { label: 'Pedidos cancelados', value: query.data.cancelados },
        { label: 'Pedidos de hoy', value: query.data.pedidos_hoy },
        {
          label: 'Ingresos entregados',
          value: currencyFormatter.format(query.data.ingresos_entregados),
        },
      ]
    : []

  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
          Panel de administración
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Resumen del negocio
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Un vistazo rápido a la actividad y los resultados de hoy.
        </p>
      </header>
      {query.isPending && (
        <div
          role="status"
          aria-label="Cargando resumen"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
          <span className="sr-only">Cargando resumen...</span>
        </div>
      )}
      {query.isError && (
        <EstadoError mensaje={handleApiError(query.error, 'No se pudo cargar el resumen.')} />
      )}
      {query.data && (
        <section
          aria-label="Indicadores del negocio"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {indicators.map(({ label, value }, index) => (
            <Card key={label} className="relative overflow-hidden">
              <div className={`mb-5 inline-flex rounded-xl px-3 py-1.5 text-xs font-semibold ${metricStyles[index]}`}>
                Indicador
              </div>
              <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</h2>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
              </p>
            </Card>
          ))}
        </section>
      )}
    </main>
  )
}
