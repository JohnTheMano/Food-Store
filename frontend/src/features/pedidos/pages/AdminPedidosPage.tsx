import { useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError, EstadoVacio, Skeleton } from '@/shared/components'
import { BadgeEstado, Button, Card } from '@/shared/ui'
import type { EstadoPedido, Pedido } from '../types/pedido'
import { useCambiarEstadoPedido, usePedidos } from '../hooks/usePedidos'

const columnHelper = createColumnHelper<Pedido>()
const estados: EstadoPedido[] = ['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO']
const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})
const prioridadEstado: Record<EstadoPedido, number> = {
  PENDIENTE: 0,
  EN_PREPARACION: 1,
  ENTREGADO: 2,
  CANCELADO: 3,
}

export default function AdminPedidosPage() {
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPedido | ''>('')
  const parametros = useMemo(() => ({
    limit: 100,
    estado: estadoFiltro || undefined,
  }), [estadoFiltro])
  const query = usePedidos(parametros, 'admin')
  const {
    mutate: cambiarEstadoPedido,
    isPending: actualizandoPedido,
    isError: errorActualizacion,
    error: detalleErrorActualizacion,
  } = useCambiarEstadoPedido()
  const pedidosOrdenados = useMemo(
    () => [...(query.data?.items ?? [])].sort(
      (a, b) => prioridadEstado[a.estado] - prioridadEstado[b.estado],
    ),
    [query.data?.items],
  )

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'Pedido',
      cell: (info) => <span className="font-bold text-slate-900 dark:text-white">#{info.getValue()}</span>,
    }),
    columnHelper.accessor('usuario_id', {
      header: 'Usuario',
      cell: (info) => <span className="text-slate-500">#{info.getValue()}</span>,
    }),
    columnHelper.accessor('estado', {
      header: 'Estado',
      cell: (info) => <BadgeEstado estado={info.getValue()} />,
    }),
    columnHelper.accessor('items', {
      header: 'Productos',
      cell: (info) => (
        <ul className="space-y-1">
          {info.getValue().map((item) => (
            <li key={item.producto_id} className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold">{item.cantidad}×</span> {item.nombre_producto}
            </li>
          ))}
        </ul>
      ),
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: (info) => (
        <span className="font-semibold text-slate-900 dark:text-white">
          {currencyFormatter.format(info.getValue())}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const pedido = row.original
        return (
          <div className="flex flex-wrap gap-2">
            {pedido.estado === 'PENDIENTE' && (
              <Button
                className="px-3 py-2"
                disabled={actualizandoPedido}
                onClick={() => cambiarEstadoPedido({ id: pedido.id, estado: 'EN_PREPARACION' })}
              >
                Preparar
              </Button>
            )}
            {pedido.estado === 'EN_PREPARACION' && (
              <Button
                variant="secondary"
                className="px-3 py-2"
                disabled={actualizandoPedido}
                onClick={() => cambiarEstadoPedido({ id: pedido.id, estado: 'ENTREGADO' })}
              >
                Entregar
              </Button>
            )}
            {(pedido.estado === 'PENDIENTE' || pedido.estado === 'EN_PREPARACION') && (
              <Button
                variant="outline"
                className="border-rose-200 px-3 py-2 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300"
                disabled={actualizandoPedido}
                onClick={() => cambiarEstadoPedido({ id: pedido.id, estado: 'CANCELADO' })}
              >
                Cancelar
              </Button>
            )}
          </div>
        )
      },
    }),
  ], [actualizandoPedido, cambiarEstadoPedido])

  const table = useReactTable({
    data: pedidosOrdenados,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
            Administración
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Pedidos
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Revisá cada pedido y avanzá su estado.
          </p>
        </div>
        <label className="block min-w-48 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Filtrar por estado
          <select
            value={estadoFiltro}
            onChange={(event) => setEstadoFiltro(event.target.value as EstadoPedido | '')}
            className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-normal shadow-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">Todos los estados</option>
            {estados.map((estado) => <option key={estado} value={estado}>{estado.replaceAll('_', ' ')}</option>)}
          </select>
        </label>
      </header>

      {query.isPending && (
        <div className="space-y-3" role="status" aria-label="Cargando pedidos">
          {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-16 w-full" />)}
        </div>
      )}
      {query.isError && (
        <EstadoError
          mensaje={handleApiError(query.error, 'No se pudieron cargar los pedidos.')}
          onReintentar={() => void query.refetch()}
        />
      )}
      {errorActualizacion && (
        <div className="mb-4">
          <EstadoError mensaje={handleApiError(detalleErrorActualizacion, 'No se pudo actualizar el pedido.')} />
        </div>
      )}
      {query.data?.items.length === 0 && (
        <EstadoVacio
          titulo="No hay pedidos para este filtro"
          descripcion="Cuando ingresen pedidos, aparecerán en esta tabla."
        />
      )}
      {query.data && query.data.items.length > 0 && (
        <Card padded={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[54rem] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="border-b-2 border-slate-200 px-5 py-4 font-semibold dark:border-slate-700">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="align-top transition-colors even:bg-slate-50/80 hover:bg-emerald-50/70 dark:even:bg-slate-800/40 dark:hover:bg-emerald-950/30">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border-b-2 border-slate-200 px-5 py-5 text-sm dark:border-slate-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </main>
  )
}
