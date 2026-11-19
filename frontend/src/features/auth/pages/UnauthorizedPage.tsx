import { Link } from 'react-router-dom'
import { Card } from '@/shared/ui'

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10 dark:bg-slate-950">
      <Card className="max-w-lg text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-rose-100 text-2xl dark:bg-rose-400/10">
          🔒
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Acceso denegado
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          No tenés permisos para acceder a esta sección.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
        >
          Volver al catálogo
        </Link>
      </Card>
    </main>
  )
}
