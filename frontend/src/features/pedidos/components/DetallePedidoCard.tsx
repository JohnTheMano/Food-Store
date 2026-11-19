import { BadgeEstado, Button, Card } from '@/shared/ui'
import type { Pedido } from '../types/pedido'

interface DetallePedidoCardProps {
  pedido: Pedido
  onCancelar?: (pedidoId: number) => void
  cancelando?: boolean
}

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

export default function DetallePedidoCard({
  pedido,
  onCancelar,
  cancelando = false,
}: DetallePedidoCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/70 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pedido
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            #{pedido.id}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <BadgeEstado estado={pedido.estado} />
          {pedido.estado === 'PENDIENTE' && onCancelar && (
            <Button
              variant="outline"
              onClick={() => onCancelar(pedido.id)}
              disabled={cancelando}
              className="border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300"
            >
              Cancelar
            </Button>
          )}
        </div>
      </header>
      <div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
        <div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {pedido.items.map((item) => (
              <li key={`${pedido.id}-${item.producto_id}`} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  <strong className="mr-2 text-slate-900 dark:text-white">{item.cantidad}×</strong>
                  {item.nombre_producto}
                </span>
                <span className="shrink-0 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {currencyFormatter.format(item.subtotal)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {pedido.forma_pago} · {pedido.direccion_entrega}
          </p>
          {pedido.notas && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Nota: {pedido.notas}
            </p>
          )}
        </div>
        <div className="border-t border-slate-100 pt-4 text-left sm:min-w-36 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total</p>
          <p className="mt-1 text-xl font-bold text-emerald-800 dark:text-emerald-300">
            {currencyFormatter.format(pedido.total)}
          </p>
        </div>
      </div>
    </Card>
  )
}
