import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ESPACE_PAR_ROLE = { patient: '/patient', medecin: '/medecin', admin: '/admin' }

export default function Login() {
  const { connexion } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)
    try {
      const user = await connexion(form.email, form.password)
      navigate(ESPACE_PAR_ROLE[user.role] || '/')
    } catch (err) {
      setErreur(err.response?.data?.message || 'Connexion impossible.')
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-pine-600 mb-2">Connexion</h1>
      <p className="text-pine-400 text-sm mb-8">
        Comptes de démonstration : admin@cabinet.test / medecin@cabinet.test / patient@cabinet.test (mot de passe : password)
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-pine-600 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-pine-100 rounded-sm px-3 py-2 focus:outline-none focus:border-pine-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-pine-600 mb-1">Mot de passe</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-pine-100 rounded-sm px-3 py-2 focus:outline-none focus:border-pine-400"
          />
        </div>

        {erreur && <p className="text-clay-500 text-sm">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full bg-pine-600 text-linen-50 py-2.5 rounded-sm font-semibold hover:bg-pine-700 transition disabled:opacity-60"
        >
          {envoi ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <p className="text-sm text-pine-400 mt-6">
        Pas encore de compte ? <Link to="/inscription" className="text-clay-500 font-semibold">Inscrivez-vous</Link>
      </p>
    </main>
  )
}
