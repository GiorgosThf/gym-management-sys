import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore.ts'

interface ProtectedRouteProps {
    role: 'ROLE_USER' | 'ROLE_ADMIN'
}

export function ProtectedRoute({ role }: Readonly<ProtectedRouteProps>) {
    const { user, isAuthenticated } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (user?.role !== role) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
