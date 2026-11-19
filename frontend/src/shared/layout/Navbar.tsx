import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/shared/ui'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { darkMode, toggleTheme } = useThemeStore()
  const isAdmin = user?.role === 'admin'

  const linkClass = (path: string) => {
    const active = path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(`${path}/`)

    return `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? 'bg-emerald-800 text-white'
        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 text-xl font-extrabold tracking-tight text-emerald-900 dark:text-emerald-300">
          Food Store
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          <Link to="/" className={linkClass('/')}>Menú</Link>
          <Link to="/carrito" className={linkClass('/carrito')}>Carrito</Link>
          {user && <Link to="/mis-pedidos" className={linkClass('/mis-pedidos')}>Mis pedidos</Link>}
          {isAdmin && (
            <>
              <Link to="/admin/resumen" className={linkClass('/admin/resumen')}>Resumen</Link>
              <Link to="/admin/pedidos" className={linkClass('/admin/pedidos')}>Pedidos</Link>
              <Link to="/admin/productos" className={linkClass('/admin/productos')}>Productos</Link>
              <Link to="/admin/categorias" className={linkClass('/admin/categorias')}>Categorías</Link>
              <Link to="/admin/usuarios" className={linkClass('/admin/usuarios')}>Usuarios</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={toggleTheme}
            className="px-3"
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            {darkMode ? '☀️' : '🌙'}
          </Button>
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.full_name}</p>
                <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{user.role}</p>
              </div>
              <Button variant="outline" onClick={() => void handleLogout()} className="px-3 py-2">
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>Ingresar</Link>
              <Link
                to="/register"
                className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
