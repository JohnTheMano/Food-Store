import { Button } from '@/shared/ui'

interface EstadoErrorProps {
  mensaje: string
  onReintentar?: () => void
}

export default function EstadoError({
  mensaje,
  onReintentar,
}: EstadoErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200"
    >
      <p className="font-medium">{mensaje}</p>
      {onReintentar && (
        <Button
          variant="outline"
          className="mt-3 border-rose-300 text-rose-800 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-200 dark:hover:bg-rose-900/40"
          onClick={onReintentar}
        >
          Reintentar
        </Button>
      )}
    </div>
  )
}
