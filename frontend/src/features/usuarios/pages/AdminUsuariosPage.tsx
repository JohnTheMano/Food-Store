import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useAuthStore } from '@/features/auth'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError, EstadoVacio, Skeleton } from '@/shared/components'
import { Button, Card } from '@/shared/ui'
import { useUsuarios } from '../hooks/useUsuarios'
import type { UsuarioAdmin } from '../types/usuario'

const columnHelper = createColumnHelper<UsuarioAdmin>()

export default function AdminUsuariosPage() {
  const currentUser = useAuthStore((state) => state.user)
  const {
    data: users = [],
    isPending,
    isError,
    error,
    setUserActive,
    isUpdating,
  } = useUsuarios()

  const columns = [
    columnHelper.accessor('username', {
      header: 'Usuario',
      cell: (info) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{info.row.original.full_name}</p>
          <p className="text-xs text-slate-500">@{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('role', {
      header: 'Rol',
      cell: (info) => (
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('disabled', {
      header: 'Estado',
      cell: (info) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
          info.getValue()
            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300'
        }`}>
          {info.getValue() ? 'Inactivo' : 'Activo'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        if (row.original.id === currentUser?.id) {
          return <span className="text-xs text-slate-400">Tu cuenta</span>
        }

        return (
          <Button
            type="button"
            variant={row.original.disabled ? 'outline' : 'danger'}
            disabled={isUpdating}
            onClick={() => setUserActive(row.original.id, row.original.disabled)}
            className="px-3 py-2"
          >
            {row.original.disabled ? 'Activar' : 'Desactivar'}
          </Button>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
          Administración
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Usuarios
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Administrá el acceso y el estado de las cuentas.
        </p>
      </header>
      {isPending && (
        <div className="space-y-3" role="status" aria-label="Cargando usuarios">
          {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-16 w-full" />)}
        </div>
      )}
      {isError && (
        <EstadoError mensaje={handleApiError(error, 'Error al cargar los usuarios.')} />
      )}
      {!isPending && !isError && users.length === 0 && (
        <EstadoVacio
          titulo="No hay usuarios"
          descripcion="Las cuentas registradas aparecerán en esta lista."
        />
      )}
      {!isPending && !isError && users.length > 0 && (
        <Card padded={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-5 py-4 font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
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
