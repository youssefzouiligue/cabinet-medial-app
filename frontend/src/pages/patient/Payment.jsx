import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

export default function Payment() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    numero_carte: '',
    nom_titulaire: '',
    date_expiration: '',
    cvv: '',
  })
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [succes, setSucces] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)
    try {
      await api.post(`/patient/rendez-vous/${appointmentId}/paiement`, form)
      setSucces(true)
      setTimeout(() => navigate('/patient/rendez-vous'), 1800)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Paiement refusé.')
    } finally {
      setEnvoi(false)
    }
  }

  if (succes) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="stamp-confirme mx-auto mb-4 text-base px-4 py-2">✓ rendez-vous confirmé</div>
        <p className="text-pine-500">Redirection vers vos rendez-vous…</p>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <h2 className="font-display text-2xl text-pine-600 mb-1">Paiement sécurisé (mode test)</h2>
      <p className="text-pine-400 text-sm mb-6">
        Aucune vraie transaction n'est effectuée. Astuce : un numéro de carte se terminant par
        « 0000 » simule un paiement refusé.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-pine-600 mb-1">Nom du titulaire</label>
          <input
            required
            value={form.nom_titulaire}
            onChange={(e) => setForm({ ...form, nom_titulaire: e.target.value })}
            className="w-full border border-pine-100 rounded-sm px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-pine-600 mb-1">Numéro de carte</label>
          <input
            required
            maxLength={19}
            placeholder="4242 4242 4242 4242"
            value={form.numero_carte}
            onChange={(e) => setForm({ ...form, numero_carte: e.target.value })}
            className="w-full border border-pine-100 rounded-sm px-3 py-2 font-mono-tab"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-pine-600 mb-1">Expiration (MM/AA)</label>
            <input
              required
              placeholder="12/27"
              value={form.date_expiration}
              onChange={(e) => setForm({ ...form, date_expiration: e.target.value })}
              className="w-full border border-pine-100 rounded-sm px-3 py-2 font-mono-tab"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-600 mb-1">CVV</label>
            <input
              required
              maxLength={4}
              value={form.cvv}
              onChange={(e) => setForm({ ...form, cvv: e.target.value })}
              className="w-full border border-pine-100 rounded-sm px-3 py-2 font-mono-tab"
            />
          </div>
        </div>

        {erreur && <p className="text-clay-500 text-sm">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full bg-pine-600 text-linen-50 py-2.5 rounded-sm font-semibold hover:bg-pine-700 transition disabled:opacity-60"
        >
          {envoi ? 'Traitement…' : 'Payer et confirmer le rendez-vous'}
        </button>
      </form>
    </div>
  )
}
