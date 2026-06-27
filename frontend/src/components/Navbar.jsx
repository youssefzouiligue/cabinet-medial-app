import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, deconnexion } = useAuth()
  const navigate = useNavigate()

  async function handleDeconnexion() {
    await deconnexion()
    navigate('/connexion')
  }

  const espace = {
    patient: '/patient',
    medecin: '/medecin',
    admin: '/admin',
  }[user?.role]

  return (
    <header className="border-b border-pine-100 bg-linen-50/95 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl text-pine-600 tracking-tight">Cabinet</span>
          <span className="font-mono-tab text-[10px] uppercase tracking-[0.2em] text-honey-500 border border-honey-400 rounded-full px-2 py-0.5">
            Carnet de RDV
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-pine-600">
          {!user && (
            <>
              <Link to="/connexion" className="hover:text-clay-500 transition">Connexion</Link>
              <Link
                to="/inscription"
                className="bg-pine-600 text-linen-50 px-4 py-2 rounded-sm hover:bg-pine-700 transition"
              >
                Créer un compte
              </Link>
            </>
          )}

          {user && (
            <>
              <Link to={espace} className="hover:text-clay-500 transition">
                Mon espace
              </Link>
              <span className="text-pine-400 font-mono-tab text-xs hidden sm:inline">
                {user.prenom} · {user.role}
              </span>
              <button
                onClick={handleDeconnexion}
                className="text-clay-500 hover:text-clay-600 transition"
              >
                Déconnexion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
