import type { ReactNode } from 'react'

interface AuthPageLayoutProps {
  children: ReactNode
}

export default function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 px-4 py-10">
      <div className="absolute -left-24 -top-24 size-80 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="absolute -bottom-28 -right-20 size-96 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative w-full">{children}</div>
    </div>
  )
}
