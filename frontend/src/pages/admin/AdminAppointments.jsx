import { useEffect, useState } from 'react'
import api from '../../api/axios'

const STATUTS = {
  en_attente_paiement: { label: 'En attente de paiement', css: 'bg-honey-400/10 text-honey-500' },
  confirme: { label: 'Confirmé', css: 'bg-pine-50 text-pine-500' },
  annule: { label: 'Annulé', css: 'bg-clay-500/10 text-clay-500' },
  termine: { label: 'Terminé', css: 'bg-linen-200 text-pine-400' },
}

export default function AdminAppointments() {
  const [rendezVous, setRendezVous] = useState([])
  const [chargement, setChargement] = useState(true)

  // Filters state
  const [rechercheNom, setRechercheNom] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('')
  const [filtreType, setFiltreType] = useState('')

  function charger() {
    api.get('/admin/rendez-vous')
      .then((res) => setRendezVous(res.data))
      .finally(() => setChargement(false))
  }

  useEffect(() => {
    charger()
  }, [])

  async function supprimer(id) {
    if (!confirm('Supprimer ce rendez-vous ?')) return
    await api.delete(`/admin/rendez-vous/${id}`)
    charger()
  }

  // Filter logic locally
  const rdvFiltres = rendezVous.filter((rdv) => {
    const nomPatient = rdv.patient ? `${rdv.patient.prenom} ${rdv.patient.nom}`.toLowerCase() : ''
    const nomMedecin = rdv.medecin ? `${rdv.medecin.prenom} ${rdv.medecin.nom}`.toLowerCase() : ''
    const query = rechercheNom.toLowerCase()
    const matchNom = nomPatient.includes(query) || nomMedecin.includes(query)
    
    const matchStatut = filtreStatut === '' || rdv.statut === filtreStatut
    const matchType = filtreType === '' || rdv.type_consultation === filtreType
    
    return matchNom && matchStatut && matchType
  })

  if (chargement) {
    return <p className="text-pine-400 font-mono-tab text-sm">Chargement…</p>
  }

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="bg-white border border-pine-100 rounded p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="space-y-1">
            <span className="block text-[10px] font-semibold text-pine-400 uppercase tracking-wider">
              Rechercher Nom
            </span>
            <input
              type="text"
              placeholder="🔍 Patient ou Médecin"
              value={rechercheNom}
              onChange={(e) => setRechercheNom(e.target.value)}
              className="text-xs border border-pine-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-pine-400 max-w-[170px]"
            />
          </div>

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

        <span className="text-xs font-mono text-pine-400 self-end md:self-center">
          {rdvFiltres.length} rendez-vous trouvé(s)
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-pine-100 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-linen-50 border-b border-pine-100 text-left text-pine-400 font-mono-tab text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Date & Heure</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Médecin</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pine-50 text-pine-600">
              {rdvFiltres.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-pine-400">
                    Aucun rendez-vous ne correspond à vos critères.
                  </td>
                </tr>
              ) : (
                rdvFiltres.map((rdv) => {
                  const s = STATUTS[rdv.statut] || { label: rdv.statut, css: 'bg-gray-100' }
                  return (
                    <tr key={rdv.id} className="hover:bg-linen-50/20 transition">
                      <td className="px-6 py-4 font-mono-tab">
                        {new Date(rdv.schedule?.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        · {rdv.schedule?.heure_debut?.slice(0, 5)}
                      </td>
                      <td className="px-6 py-4">
                        {rdv.patient ? (
                          <div>
                            <p className="font-semibold">{rdv.patient.prenom} {rdv.patient.nom}</p>
                            <p className="text-xs text-pine-400">{rdv.patient.telephone}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-clay-500 italic">Patient supprimé</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {rdv.medecin ? (
                          <div>
                            <p className="font-semibold">{rdv.medecin.prenom} {rdv.medecin.nom}</p>
                            <p className="text-xs text-pine-400">{rdv.medecin.specialite}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-clay-500 italic">Médecin supprimé</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono-tab uppercase tracking-wider border border-pine-100 rounded px-2 py-0.5 bg-linen-50">
                          {rdv.type_consultation === 'video' ? 'Appel vidéo' : 'Présentiel'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.css}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => supprimer(rdv.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded border border-clay-500/20 text-clay-500 hover:bg-clay-500/5 transition"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
