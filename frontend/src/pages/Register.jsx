import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { inscription } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation: '',
  })
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)

  function update(champ, valeur) {
    setForm((f) => ({ ...f, [champ]: valeur }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErreurs({})
    setEnvoi(true)
    try {
      // Inscription will register user as 'patient' by default on the backend
      await inscription(form)
      navigate('/patient')
    } catch (err) {
      setErreurs(err.response?.data?.errors || { general: ['Inscription impossible.'] })
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-pine-600 mb-8">Créer un compte patient</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Champ
            label="Prénom"
            value={form.prenom}
            onChange={(v) => update('prenom', v)}
            erreurs={erreurs.prenom}
          />
          <Champ
            label="Nom"
            value={form.nom}
            onChange={(v) => update('nom', v)}
            erreurs={erreurs.nom}
          />
        </div>

        <Champ
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => update('email', v)}
          erreurs={erreurs.email}
        />
        
        <Champ
          label="Téléphone"
          value={form.telephone}
          onChange={(v) => update('telephone', v)}
          erreurs={erreurs.telephone}
        />

        <Champ
          label="Mot de passe"
          type="password"
          value={form.password}
          onChange={(v) => update('password', v)}
          erreurs={erreurs.password}
        />
        
        <Champ
          label="Confirmer le mot de passe"
          type="password"
          value={form.password_confirmation}
          onChange={(v) => update('password_confirmation', v)}
        />

        {erreurs.general && <p className="text-clay-500 text-sm">{erreurs.general[0]}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full bg-pine-600 text-linen-50 py-2.5 rounded-sm font-semibold hover:bg-pine-700 transition disabled:opacity-60"
        >
          {envoi ? 'Création en cours…' : 'Créer mon compte'}
        </button>
      </form>

      <p className="text-sm text-pine-400 mt-6">
        Déjà inscrit ?{' '}
        <Link to="/connexion" className="text-clay-500 font-semibold">
          Connectez-vous
        </Link>
      </p>
    </main>
  )
}

function Champ({ label, value, onChange, type = 'text', erreurs }) {
  return (
    <div>
      <label className="block text-sm font-medium text-pine-600 mb-1">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-pine-100 rounded-sm px-3 py-2 focus:outline-none focus:border-pine-400 bg-linen-50/20"
      />
      {erreurs && <p className="text-clay-500 text-xs mt-1">{erreurs[0]}</p>}
    </div>
  )
}
