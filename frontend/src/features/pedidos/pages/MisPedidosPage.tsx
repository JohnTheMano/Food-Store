import { useState } from 'react'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError, EstadoVacio, Skeleton } from '@/shared/components'
import DetallePedidoCard from '../components/DetallePedidoCard'
import { useCancelarPedido, usePedidos } from '../hooks/usePedidos'

export default function MisPedidosPage() {
  const [actionError, setActionError] = useState('')
  const query = usePedidos({ limit: 50 }, 'mios')
  const cancelMutation = useCancelarPedido()

  async function cancelarPedido(pedidoId: number) {
    setActionError('')
    try {
      await cancelMutation.mutateAsync(pedidoId)
    } catch (error) {
      setActionError(handleApiError(error, 'No se pudo cancelar el pedido.'))
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
          Tu actividad
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mis pedidos
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Consultá el estado y los detalles de tus compras.
        </p>
      </header>

      {actionError && (
        <div className="mb-5">
          <EstadoError mensaje={actionError} />
        </div>
      )}
      {query.isPending && (
        <div className="space-y-5" role="status" aria-label="Cargando pedidos">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-52 w-full" />
          ))}
          <span className="sr-only">Cargando pedidos...</span>
        </div>
      )}
      {query.isError && (
        <EstadoError
          mensaje={handleApiError(query.error, 'No se pudieron cargar tus pedidos.')}
          onReintentar={() => void query.refetch()}
        />
      )}
      {query.data?.items.length === 0 && (
        <EstadoVacio
          titulo="Todavía no hiciste pedidos"
          descripcion="Cuando confirmes una compra, vas a poder seguirla desde acá."
        />
      )}
      {query.data && query.data.items.length > 0 && (
        <section aria-label="Historial de pedidos" className="space-y-5">
          {query.data.items.map((pedido) => (
            <DetallePedidoCard
              key={pedido.id}
              pedido={pedido}
              onCancelar={(id) => void cancelarPedido(id)}
              cancelando={cancelMutation.isPending}
            />
          ))}
        </section>
      )}
    </main>
  )
}
