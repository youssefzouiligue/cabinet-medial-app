import { useEffect, useState } from 'react'
import api from '../../api/axios'
import AppointmentCard from '../../components/AppointmentCard'

export default function DoctorAppointments() {
  const [rendezVous, setRendezVous] = useState([])
  const [chargement, setChargement] = useState(true)
  const [lienForm, setLienForm] = useState({}) // { [rdvId]: string }
  const [lienEnCours, setLienEnCours] = useState(null)
  const [lienErreur, setLienErreur] = useState({})

  // Filters state
  const [recherchePatient, setRecherchePatient] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('')
  const [filtreType, setFiltreType] = useState('')

  function charger() {
    api
      .get('/medecin/rendez-vous')
      .then((res) => setRendezVous(res.data))
      .finally(() => setChargement(false))
  }

  useEffect(() => {
    charger()
  }, [])

  async function changerStatut(id, statut) {
    await api.put(`/medecin/rendez-vous/${id}/statut`, { statut })
    charger()
  }

  async function enregistrerLien(rdv) {
    const url = lienForm[rdv.id] || ''
    setLienErreur((e) => ({ ...e, [rdv.id]: '' }))

    if (!url.startsWith('http')) {
      setLienErreur((e) => ({ ...e, [rdv.id]: 'Veuillez entrer une URL valide (http…).' }))
      return
    }

    setLienEnCours(rdv.id)
    try {
      await api.put(`/medecin/rendez-vous/${rdv.id}/lien-video`, { lien_video: url })
      charger()
      setLienForm((f) => { const copy = { ...f }; delete copy[rdv.id]; return copy })
    } catch (err) {
      const msg = err.response?.data?.errors?.lien_video?.[0] || err.response?.data?.message || 'Erreur lors de la mise à jour.'
      setLienErreur((e) => ({ ...e, [rdv.id]: msg }))
    } finally {
      setLienEnCours(null)
    }
  }

  // Apply filters locally
  const rdvFiltres = rendezVous.filter((rdv) => {
    const nomPatient = `${rdv.patient?.prenom} ${rdv.patient?.nom}`.toLowerCase()
    const matchPatient = nomPatient.includes(recherchePatient.toLowerCase())
    const matchStatut = filtreStatut === '' || rdv.statut === filtreStatut
    const matchType = filtreType === '' || rdv.type_consultation === filtreType
    return matchPatient && matchStatut && matchType
  })

  if (chargement)
    return <p className="text-pine-400 font-mono-tab text-sm">Chargement…</p>

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="bg-white border border-pine-100 rounded p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="space-y-1">
            <span className="block text-[10px] font-semibold text-pine-400 uppercase tracking-wider">
              Rechercher Patient
            </span>
            <input
              type="text"
              placeholder="🔍 Ex: Sara Alami"
              value={recherchePatient}
              onChange={(e) => setRecherchePatient(e.target.value)}
              className="text-xs border border-pine-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-pine-400 max-w-[150px]"
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

      {/* Grid */}
      {rdvFiltres.length === 0 ? (
        <div className="bg-white border border-pine-100 rounded p-12 text-center text-pine-400 text-sm">
          Aucun rendez-vous ne correspond à vos filtres.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {rdvFiltres.map((rdv) => {
            const isVideoConfirme =
              rdv.type_consultation === 'video' &&
              (rdv.statut === 'confirme' || rdv.statut === 'en_attente_paiement')
            const formOuvert = rdv.id in lienForm

            return (
              <AppointmentCard
                key={rdv.id}
                rdv={rdv}
                autrePersonne={`Patient : ${rdv.patient?.prenom} ${rdv.patient?.nom}`}
              >
                {/* ── Lien vidéo personnalisé ── */}
                {isVideoConfirme && (
                  <div className="border-t border-pine-100 pt-3 mt-1 flex flex-col gap-2">
                    {/* Affiche le lien actuel s'il est une vraie URL */}
                    {rdv.lien_video && rdv.lien_video.startsWith('http') && !formOuvert && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-pine-400 font-mono-tab">🔗 Lien actuel :</span>
                        <a
                          href={rdv.lien_video}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-pine-600 underline truncate max-w-[200px]"
                        >
                          {rdv.lien_video}
                        </a>
                        <button
                          onClick={() =>
                            setLienForm((f) => ({ ...f, [rdv.id]: rdv.lien_video }))
                          }
                          className="text-xs text-honey-500 hover:text-honey-600 font-semibold"
                        >
                          Modifier
                        </button>
                      </div>
                    )}

                    {/* Bouton pour ouvrir le form si pas encore de lien réel */}
                    {(!rdv.lien_video || !rdv.lien_video.startsWith('http')) && !formOuvert && (
                      <button
                        onClick={() => setLienForm((f) => ({ ...f, [rdv.id]: '' }))}
                        className="self-start flex items-center gap-1.5 text-xs font-semibold text-pine-600 border border-pine-200 rounded px-3 py-1.5 hover:bg-pine-50 transition"
                      >
                        📎 Ajouter un lien d'appel (Zoom / Meet / Jitsi…)
                      </button>
                    )}

                    {/* Formulaire inline */}
                    {formOuvert && (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-pine-500 uppercase tracking-wide">
                          Lien de la salle vidéo
                        </label>
                        <input
                          type="url"
                          placeholder="https://meet.google.com/abc-defg-hij"
                          value={lienForm[rdv.id]}
                          onChange={(e) =>
                            setLienForm((f) => ({ ...f, [rdv.id]: e.target.value }))
                          }
                          className="w-full text-sm border border-pine-200 rounded px-3 py-2 focus:outline-none focus:border-pine-400 font-mono-tab"
                        />
                        {lienErreur[rdv.id] && (
                          <p className="text-xs text-clay-500">{lienErreur[rdv.id]}</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => enregistrerLien(rdv)}
                            disabled={lienEnCours === rdv.id}
                            className="text-sm font-semibold bg-pine-600 text-linen-50 px-4 py-1.5 rounded hover:bg-pine-700 transition disabled:opacity-50"
                          >
                            {lienEnCours === rdv.id ? 'Enregistrement…' : 'Enregistrer'}
                          </button>
                          <button
                            onClick={() =>
                              setLienForm((f) => {
                                const copy = { ...f }
                                delete copy[rdv.id]
                                return copy
                              })
                            }
                            className="text-sm text-pine-400 hover:text-pine-600"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Actions statut ── */}
                <div className="flex gap-3 pt-1 border-t border-pine-50 mt-2">
                  {rdv.statut === 'confirme' && (
                    <button
                      onClick={() => changerStatut(rdv.id, 'termine')}
                      className="text-xs font-semibold text-pine-500 hover:text-pine-600 border border-pine-500/20 px-2.5 py-1 rounded hover:bg-pine-500/5 transition"
                    >
                      Marquer terminé
                    </button>
                  )}
                  {rdv.statut !== 'annule' && rdv.statut !== 'termine' && (
                    <button
                      onClick={() => changerStatut(rdv.id, 'annule')}
                      className="text-xs font-semibold text-clay-500 hover:text-clay-600 border border-clay-500/20 px-2.5 py-1 rounded hover:bg-clay-500/5 transition"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </AppointmentCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
