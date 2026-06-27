import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import AppointmentCard from '../../components/AppointmentCard'

export default function MyAppointments() {
  const [rendezVous, setRendezVous] = useState([])
  const [chargement, setChargement] = useState(true)

  // Filters state
  const [filtreStatut, setFiltreStatut] = useState('')
  const [filtreType, setFiltreType] = useState('')

  function charger() {
    api.get('/patient/rendez-vous')
      .then((res) => setRendezVous(res.data))
      .finally(() => setChargement(false))
  }

  useEffect(() => {
    charger()
  }, [])

  async function annuler(id) {
    if (!confirm('Annuler ce rendez-vous ?')) return
    await api.put(`/patient/rendez-vous/${id}/annuler`)
    charger()
  }

  // Apply filters locally
  const rdvFiltres = rendezVous.filter((rdv) => {
    const matchStatut = filtreStatut === '' || rdv.statut === filtreStatut
    const matchType = filtreType === '' || rdv.type_consultation === filtreType
    return matchStatut && matchType
  })

  if (chargement) return <p className="text-pine-400 font-mono-tab text-sm">Chargement…</p>

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="bg-white border border-pine-100 rounded p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="space-y-1">
            <span className="block text-[10px] font-semibold text-pine-400 uppercase tracking-wider">
              Statut
            </span>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="text-xs border border-pine-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-pine-400 bg-white text-pine-600 font-medium"
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente_paiement">En attente de paiement</option>
              <option value="confirme">Confirmé</option>
              <option value="termine">Terminé</option>
              <option value="annule">Annulé</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-semibold text-pine-400 uppercase tracking-wider">
              Type
            </span>
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="text-xs border border-pine-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-pine-400 bg-white text-pine-600 font-medium"
            >
              <option value="">Tous les types</option>
              <option value="presentiel">Présentiel</option>
              <option value="video">Appel vidéo</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-mono text-pine-400">
          {rdvFiltres.length} rendez-vous trouvé(s)
        </span>
      </div>

      {/* Grid */}
      {rdvFiltres.length === 0 ? (
        <div className="bg-white border border-pine-100 rounded p-12 text-center text-pine-400 text-sm">
          Aucun rendez-vous ne correspond à vos filtres.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {rdvFiltres.map((rdv) => (
            <AppointmentCard
              key={rdv.id}
              rdv={rdv}
              autrePersonne={`Dr. ${rdv.medecin?.prenom} ${rdv.medecin?.nom}`}
            >
              <div className="flex gap-2 pt-1">
                {rdv.statut === 'en_attente_paiement' && (
                  <Link
                    to={`/patient/paiement/${rdv.id}`}
                    className="text-xs font-semibold text-honey-500 hover:text-honey-600 border border-honey-500/20 px-3 py-1.5 rounded bg-honey-500/5 transition"
                  >
                    Payer maintenant →
                  </Link>
                )}
                {(rdv.statut === 'en_attente_paiement' || rdv.statut === 'confirme') && (
                  <button
                    onClick={() => annuler(rdv.id)}
                    className="text-xs font-semibold text-clay-500 hover:text-clay-600 border border-clay-500/20 px-3 py-1.5 rounded hover:bg-clay-500/5 transition"
                  >
                    Annuler le RDV
                  </button>
                )}
              </div>
            </AppointmentCard>
          ))}
        </div>
      )}
    </div>
  )
}
