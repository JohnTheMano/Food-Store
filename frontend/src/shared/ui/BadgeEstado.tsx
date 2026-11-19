interface BadgeEstadoProps {
  estado: string
}

const stateStyles: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800 ring-amber-700/10 dark:bg-amber-400/10 dark:text-amber-300',
  EN_PREPARACION: 'bg-sky-100 text-sky-800 ring-sky-700/10 dark:bg-sky-400/10 dark:text-sky-300',
  ENTREGADO: 'bg-emerald-100 text-emerald-800 ring-emerald-700/10 dark:bg-emerald-400/10 dark:text-emerald-300',
  CANCELADO: 'bg-rose-100 text-rose-800 ring-rose-700/10 dark:bg-rose-400/10 dark:text-rose-300',
}

export default function BadgeEstado({ estado }: BadgeEstadoProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${stateStyles[estado] ?? 'bg-slate-100 text-slate-700 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-300'}`}
    >
      {estado.replaceAll('_', ' ')}
    </span>
  )
}
