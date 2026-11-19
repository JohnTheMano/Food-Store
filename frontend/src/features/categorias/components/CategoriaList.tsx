import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button, Card } from '@/shared/ui'
import { Paginacion } from '@/shared/components'
import type { Categoria } from '../types/categoria'

interface CategoriaListProps {
  categorias: Categoria[]
  canManage: boolean
  onEditar: (categoria: Categoria) => void
  onEliminar: (id: number) => void
}

const columnHelper = createColumnHelper<Categoria>()

export default function CategoriaList({
  categorias,
  canManage,
  onEditar,
  onEliminar,
}: CategoriaListProps) {
  const columns = [
    columnHelper.accessor('nombre', {
      header: 'Nombre',
      cell: (info) => <span className="font-semibold text-slate-900 dark:text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor('descripcion', {
      header: 'Descripción',
      cell: (info) => info.getValue() || <span className="text-slate-400">Sin descripción</span>,
    }),
    ...(canManage
      ? [
          columnHelper.display({
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="px-3 py-2"
                  onClick={() => onEditar(row.original)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  className="px-3 py-2"
                  onClick={() => onEliminar(row.original.id)}
                >
                  Dar de baja
                </Button>
              </div>
            ),
          }),
        ]
      : []),
  ]

  const table = useReactTable({
    data: categorias,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-5 py-4 font-semibold">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-2"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: '↑',
                          desc: '↓',
                        }[header.column.getIsSorted() as string] ?? ''}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 px-5 py-3 dark:border-slate-800">
        <Paginacion
          pagina={table.getState().pagination.pageIndex}
          totalPaginas={table.getPageCount()}
          onCambiar={table.setPageIndex}
        />
      </div>
    </Card>
  )
}
