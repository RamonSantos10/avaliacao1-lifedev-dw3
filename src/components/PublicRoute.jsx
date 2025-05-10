import { Navigate, Outlet } from 'react-router-dom'
import { useAuthValue } from '../context/AuthContext'

const PublicRoute = () => {
    const { user } = useAuthValue()

    return user ? <Navigate to="/dashboard" /> : <Outlet />
}

export default PublicRoute