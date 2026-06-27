import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import CreneauxLedger from '../../components/CreneauxLedger'

export default function BookAppointment() {
  const navigate = useNavigate()
  const [medecins, setMedecins] = useState([])
  const [medecinId, setMedecinId] = useState(null)
  const [creneaux, setCreneaux] = useState([])
  const [creneauChoisi, setCreneauChoisi] = useState(null)
  const [typeConsultation, setTypeConsultation] = useState('presentiel')
  const [motif, setMotif] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  // Filters for Select Medecin list
  const [rechercheMedecin, setRechercheMedecin] = useState('')
  const [specialiteFiltre, setSpecialiteFiltre] = useState('')
  const [specialites, setSpecialites] = useState([])

  useEffect(() => {
    api.get('/medecins').then((res) => {
      setMedecins(res.data)
      const uniqueSpecs = [...new Set(res.data.map((m) => m.specialite).filter(Boolean))]
      setSpecialites(uniqueSpecs)
      if (res.data.length > 0) {
        setMedecinId(res.data[0].id)
      }
    })
  }, [])

  useEffect(() => {
    if (!medecinId) return
    api.get(`/medecins/${medecinId}/creneaux`).then((res) => setCreneaux(res.data))
  }, [medecinId])

  async function confirmerReservation() {
    setErreur('')
    setEnvoi(true)
    try {
      const res = await api.post('/patient/rendez-vous', {
        schedule_id: creneauChoisi.id,
        type_consultation: typeConsultation,
        motif,
      })
      navigate(`/patient/paiement/${res.data.rendez_vous.id}`)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Réservation impossible, ce créneau est peut-être déjà pris.')
      setCreneauChoisi(null)
    } finally {
      setEnvoi(false)
    }
  }

  // Filter list of doctors to present in dropdown
  const medecinsFiltres = medecins.filter((m) => {
    const nomComplet = `${m.prenom} ${m.nom}`.toLowerCase()
    const matchRecherche = nomComplet.includes(rechercheMedecin.toLowerCase())
    const matchSpecialite = specialiteFiltre === '' || m.specialite === specialiteFiltre
    return matchRecherche && matchSpecialite
  })

  // Set the selected doctor automatically if filter changes and current doctor is excluded
  useEffect(() => {
    if (medecinsFiltres.length > 0) {
      const exists = medecinsFiltres.some((m) => m.id === medecinId)
      if (!exists) {
        setMedecinId(medecinsFiltres[0].id)
      }
    } else {
      setMedecinId(null)
    }
  }, [rechercheMedecin, specialiteFiltre, medecins])

  return (
    <div className="grid md:grid-cols-[1fr_1.3fr] gap-8 items-start">
      {/* Selection Column */}
      <div className="space-y-6">
        <div className="bg-white border border-pine-100 rounded p-5 shadow-sm space-y-4">
          <h2 className="font-display text-xl text-pine-600 font-semibold border-b border-pine-50 pb-2">
            Sélectionner un praticien
          </h2>
          
          {/* Doctor Selection Filters */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-pine-400 uppercase tracking-wider mb-1">
                Spécialité
              </label>
              <select
                value={specialiteFiltre}
                onChange={(e) => setSpecialiteFiltre(e.target.value)}
                className="w-full text-xs border border-pine-100 rounded px-2.5 py-2 focus:outline-none focus:border-pine-400 bg-white"
              >
                <option value="">Toutes</option>
                {specialites.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-pine-400 uppercase tracking-wider mb-1">
                Rechercher nom
              </label>
              <input
                type="text"
                placeholder="Ex: Zouiligue"
                value={rechercheMedecin}
                onChange={(e) => setRechercheMedecin(e.target.value)}
                className="w-full text-xs border border-pine-100 rounded px-2.5 py-2 focus:outline-none focus:border-pine-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-pine-400 uppercase tracking-wider mb-1">
              Choisir le Médecin
            </label>
            {medecinsFiltres.length === 0 ? (
              <p className="text-xs text-clay-500 py-2 italic">Aucun médecin disponible.</p>
            ) : (
              <select
                value={medecinId || ''}
                onChange={(e) => setMedecinId(Number(e.target.value))}
                className="w-full text-xs border border-pine-100 rounded px-2.5 py-2.5 focus:outline-none focus:border-pine-400 bg-white"
              >
                {medecinsFiltres.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.prenom} {m.nom} — {m.specialite}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Confirmation Form */}
        {creneauChoisi ? (
          <div className="border border-pine-100 rounded p-5 bg-white shadow-sm space-y-4">
            <p className="font-display text-lg text-pine-600 font-semibold">Confirmer la réservation</p>
            <div className="bg-linen-100/30 border border-linen-200/50 rounded px-4 py-3 text-xs text-pine-500 space-y-1">
              <p className="font-semibold text-sm text-pine-600">
                Dr. {medecins.find(m => m.id === medecinId)?.prenom} {medecins.find(m => m.id === medecinId)?.nom}
              </p>
              <p className="font-mono-tab">
                📅 Date: {new Date(creneauChoisi.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="font-mono-tab">
                🕒 Heure: {creneauChoisi.heure_debut.slice(0, 5)} – {creneauChoisi.heure_fin.slice(0, 5)}
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-pine-400 uppercase tracking-wider mb-1">
                Type de consultation
              </label>
              <div className="flex gap-2">
                {[
                  ['presentiel', 'Présentiel'],
                  ['video', 'Appel vidéo (simulation)'],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setTypeConsultation(v)}
                    className={`flex-1 py-2 rounded text-xs font-semibold transition ${
                      typeConsultation === v
                        ? 'bg-pine-600 text-linen-50 border border-pine-600 shadow-sm'
                        : 'border border-pine-100 text-pine-500 hover:bg-pine-50'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-pine-400 uppercase tracking-wider mb-1">
                Motif (facultatif)
              </label>
              <textarea
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                rows={3}
                className="w-full border border-pine-100 rounded text-xs px-3 py-2 focus:outline-none focus:border-pine-400 bg-linen-50/10"
                placeholder="Ex: Consultation de contrôle, fièvre, etc."
              />
            </div>

            {erreur && <p className="text-clay-500 text-xs">{erreur}</p>}

            <div className="flex gap-2">
              <button
                onClick={confirmerReservation}
                disabled={envoi}
                className="flex-1 bg-pine-600 text-linen-50 py-2.5 rounded font-semibold text-xs hover:bg-pine-700 transition disabled:opacity-60"
              >
                {envoi ? 'Réservation en cours…' : 'Confirmer et Payer'}
              </button>
              <button
                onClick={() => setCreneauChoisi(null)}
                className="px-4 py-2.5 rounded border border-pine-100 text-pine-400 text-xs hover:text-pine-600"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-linen-100/20 border border-pine-100/40 rounded p-4 text-center">
            <p className="text-pine-400 text-xs">
              👈 Sélectionnez un créneau libre (point vert) dans le carnet du médecin à droite pour démarrer le processus de réservation.
            </p>
          </div>
        )}
      </div>

      {/* Ledger Column */}
      <div className="bg-white border border-pine-100 rounded shadow-sm p-4">
        <CreneauxLedger creneaux={creneaux} onReserver={setCreneauChoisi} />
      </div>
    </div>
  )
}
