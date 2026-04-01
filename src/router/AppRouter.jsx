import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicHomePage from '../pages/PublicHomePage'
import PublicTrackingResultPage from '../pages/PublicTrackingResultPage'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminShipmentsPage from '../pages/admin/AdminShipmentsPage'
import AdminNewShipmentPage from '../pages/admin/AdminNewShipmentPage'
import AdminShipmentDetailPage from '../pages/admin/AdminShipmentDetailPage'
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import ProtectedRoute from './ProtectedRoute'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/tracking/:trackingCode" element={<PublicTrackingResultPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="shipments" element={<AdminShipmentsPage />} />
          <Route path="shipments/new" element={<AdminNewShipmentPage />} />
          <Route path="shipments/:id" element={<AdminShipmentDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}