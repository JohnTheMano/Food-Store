import { Button } from '@/shared/ui'

interface PaginacionProps {
  pagina: number
  totalPaginas: number
  onCambiar: (pagina: number) => void
}

export default function Paginacion({
  pagina,
  totalPaginas,
  onCambiar,
}: PaginacionProps) {
  if (totalPaginas <= 1) return null

  return (
    <nav aria-label="Paginación" className="mt-6 flex items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={() => onCambiar(Math.max(0, pagina - 1))}
        disabled={pagina === 0}
      >
        Anterior
      </Button>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Página {pagina + 1} de {totalPaginas}
      </span>
      <Button
        variant="outline"
        onClick={() => onCambiar(Math.min(totalPaginas - 1, pagina + 1))}
        disabled={pagina + 1 >= totalPaginas}
      >
        Siguiente
      </Button>
    </nav>
  )
}
