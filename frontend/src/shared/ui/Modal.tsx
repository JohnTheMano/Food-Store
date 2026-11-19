import { useId, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  className?: string
}

export default function Modal({
  open,
  title,
  onClose,
  children,
  className = '',
}: ModalProps) {
  const titleId = useId()

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`my-auto w-full max-w-lg rounded-2xl border border-white/60 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-7 ${className}`}
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="-mr-2 -mt-2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}
