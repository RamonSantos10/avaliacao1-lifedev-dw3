
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthValue } from '../context/AuthContext'

const PrivateRoute = () => {
    const { user } = useAuthValue()

    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute