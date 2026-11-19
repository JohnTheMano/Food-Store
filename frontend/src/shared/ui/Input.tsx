import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export default function Input({
  className = '',
  invalid = false,
  ...props
}: InputProps) {
  return (
    <input
      className={`block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-800 ${
        invalid
          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 dark:border-rose-700'
          : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600/10 dark:border-slate-700'
      } ${className}`}
      {...props}
    />
  )
}
