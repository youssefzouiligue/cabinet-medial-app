import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, rolesAutorises }) {
  const { user, chargement } = useAuth()

  if (chargement) {
    return (
      <div className="flex justify-center py-24 text-pine-500 font-mono-tab text-sm">
        Chargement…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/connexion" replace />
  }

  if (rolesAutorises && !rolesAutorises.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
