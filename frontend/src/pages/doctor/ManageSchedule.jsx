import { useEffect, useState } from 'react'
import api from '../../api/axios'
import CreneauxLedger from '../../components/CreneauxLedger'

export default function ManageSchedule() {
  const [creneaux, setCreneaux] = useState([])
  const [form, setForm] = useState({
    date: '',
    heure_debut: '09:00',
    heure_fin: '12:00',
    duree_minutes: 30,
  })
  const [message, setMessage] = useState('')
  const [envoi, setEnvoi] = useState(false)

  function charger() {
    api.get('/medecin/creneaux').then((res) => setCreneaux(res.data))
  }

  useEffect(() => {
    charger()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setEnvoi(true)
    setMessage('')
    try {
      const res = await api.post('/medecin/creneaux', form)
      setMessage(res.data.message)
      charger()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la création des créneaux.')
    } finally {
      setEnvoi(false)
    }
  }

  async function supprimer(creneau) {
    if (!confirm('Supprimer ce créneau ?')) return
    await api.delete(`/medecin/creneaux/${creneau.id}`)
    charger()
  }

  return (
    <div className="grid md:grid-cols-[1fr_1.3fr] gap-8">
      <form onSubmit={handleSubmit} className="border border-pine-100 rounded-sm bg-white p-5 space-y-4 h-fit">
        <p className="font-display text-lg text-pine-600">Ouvrir des créneaux</p>

        <div>
          <label className="block text-sm font-medium text-pine-600 mb-1">Date</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border border-pine-100 rounded-sm px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-pine-600 mb-1">De</label>
            <input
              type="time"
              required
              value={form.heure_debut}
              onChange={(e) => setForm({ ...form, heure_debut: e.target.value })}
              className="w-full border border-pine-100 rounded-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-600 mb-1">À</label>
            <input
              type="time"
              required
              value={form.heure_fin}
              onChange={(e) => setForm({ ...form, heure_fin: e.target.value })}
              className="w-full border border-pine-100 rounded-sm px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pine-600 mb-1">Durée par créneau (minutes)</label>
          <input
            type="number"
            min={10}
            max={120}
            value={form.duree_minutes}
            onChange={(e) => setForm({ ...form, duree_minutes: Number(e.target.value) })}
            className="w-full border border-pine-100 rounded-sm px-3 py-2"
          />
        </div>

        {message && <p className="text-sm text-pine-500">{message}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full bg-pine-600 text-linen-50 py-2.5 rounded-sm font-semibold hover:bg-pine-700 transition disabled:opacity-60"
        >
          {envoi ? 'Création…' : 'Générer les créneaux'}
        </button>
      </form>

      <CreneauxLedger
        creneaux={creneaux}
        actionsMedecin={(c) =>
          c.disponible && (
            <button onClick={() => supprimer(c)} className="text-sm font-semibold text-clay-500">
              Supprimer
            </button>
          )
        }
      />
    </div>
  )
}
