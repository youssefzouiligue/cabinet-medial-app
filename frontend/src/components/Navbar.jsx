import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Stethoscope, LogIn, UserPlus, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react'

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
    <header className="border-b border-white/10 bg-[#0f2419]/95 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-pine-600 flex items-center justify-center group-hover:bg-pine-500 transition-colors">
            <Stethoscope size={16} className="text-white" />
          </div>
          <span className="font-display text-lg text-white tracking-tight">Cabinet Médical</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-3">
          {!user && (
            <>
              <Link
                to="/connexion"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <LogIn size={15} />
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #2b5048, #3d6b60)', color: '#fff', boxShadow: '0 2px 12px rgba(43,80,72,0.4)' }}
              >
                <UserPlus size={15} />
                Créer un compte
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to={espace}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <LayoutDashboard size={15} />
                Mon espace
                <ChevronRight size={13} className="opacity-50" />
              </Link>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-pine-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.prenom?.[0]?.toUpperCase()}
                </div>
                <span className="text-xs text-white/60 hidden sm:inline">
                  {user.prenom} · <span className="capitalize">{user.role}</span>
                </span>
              </div>

              <button
                onClick={handleDeconnexion}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white/50 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
