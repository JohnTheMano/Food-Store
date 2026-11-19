import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage, UnauthorizedPage } from '@/features/auth'
import { AdminCategoriasPage } from '@/features/categorias'
import AdminUsuariosPage from '@/features/usuarios/pages/AdminUsuariosPage'
import { AdminProductosPage, CatalogoPage } from '@/features/productos'
import CarritoPage from '@/features/pedidos/pages/CarritoPage'
import CheckoutPage from '@/features/pedidos/pages/CheckoutPage'
import MisPedidosPage from '@/features/pedidos/pages/MisPedidosPage'
import AdminPedidosPage from '@/features/pedidos/pages/AdminPedidosPage'
import AdminResumenPage from '@/features/pedidos/pages/AdminResumenPage'
import MainLayout from '@/shared/layout/MainLayout'
import ProtectedRoute from '@/shared/components/ProtectedRoute'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<MainLayout />}>
        <Route index element={<CatalogoPage />} />
        <Route path="/productos" element={<CatalogoPage />} />
        <Route path="/carrito" element={<CarritoPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/mis-pedidos" element={<MisPedidosPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
          <Route path="/admin/productos" element={<AdminProductosPage />} />
          <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
          <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
          <Route path="/admin/resumen" element={<AdminResumenPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
