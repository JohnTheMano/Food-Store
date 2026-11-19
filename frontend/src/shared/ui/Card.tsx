import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean
}

export default function Card({
  padded = true,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
      {...props}
    />
  )
}
