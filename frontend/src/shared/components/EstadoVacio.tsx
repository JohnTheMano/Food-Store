import type { ReactNode } from 'react'

interface EstadoVacioProps {
  titulo: string
  descripcion?: string
  accion?: ReactNode
}

export default function EstadoVacio({
  titulo,
  descripcion,
  accion,
}: EstadoVacioProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/60">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100 text-xl text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
        ◇
      </div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{titulo}</h2>
      {descripcion && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          {descripcion}
        </p>
      )}
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  )
}
