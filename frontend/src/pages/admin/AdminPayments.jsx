import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminPayments() {
  const [paiements, setPaiements] = useState([])
  const [chargement, setChargement] = useState(true)

  // Filters state
  const [rechercheTexte, setRechercheTexte] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('')

  useEffect(() => {
    api.get('/admin/paiements')
      .then((res) => setPaiements(res.data))
      .finally(() => setChargement(false))
  }, [])

  // Filter logic locally
  const paiementsFiltres = paiements.filter((p) => {
    const refTrans = p.reference_transaction.toLowerCase()
    const nomPatient = p.appointment?.patient
      ? `${p.appointment.patient.prenom} ${p.appointment.patient.nom}`.toLowerCase()
      : ''
    const query = rechercheTexte.toLowerCase()
    const matchTexte = refTrans.includes(query) || nomPatient.includes(query)
    
    const matchStatut = filtreStatut === '' || p.statut === filtreStatut
    
    return matchTexte && matchStatut
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
              Rechercher Transaction / Patient
            </span>
            <input
              type="text"
              placeholder="🔍 Réf. ou Nom du Patient"
              value={rechercheTexte}
              onChange={(e) => setRechercheTexte(e.target.value)}
              className="text-xs border border-pine-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-pine-400 min-w-[200px]"
            />
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-semibold text-pine-400 uppercase tracking-wider">
              Statut du Paiement
            </span>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="text-xs border border-pine-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-pine-400 bg-white text-pine-600 font-medium"
            >
              <option value="">Tous les statuts</option>
              <option value="reussi">Réussi</option>
              <option value="echoue">Échoué</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-mono text-pine-400 self-end md:self-center">
          {paiementsFiltres.length} transaction(s) trouvée(s)
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-pine-100 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-linen-50 border-b border-pine-100 text-left text-pine-400 font-mono-tab text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Référence Transaction</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Médecin</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Date de Paiement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pine-50 text-pine-600">
              {paiementsFiltres.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-pine-400">
                    Aucun paiement ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                paiementsFiltres.map((p) => (
                  <tr key={p.id} className="hover:bg-linen-50/20 transition">
                    <td className="px-6 py-4 font-mono-tab font-semibold text-pine-500">
                      {p.reference_transaction}
                    </td>
                    <td className="px-6 py-4">
                      {p.appointment?.patient ? (
                        <div>
                          <p className="font-semibold text-pine-600">
                            {p.appointment.patient.prenom} {p.appointment.patient.nom}
                          </p>
                          <p className="text-xs text-pine-400">{p.appointment.patient.email}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-clay-500 italic">Patient inconnu</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.appointment?.medecin ? (
                        <div>
                          <p className="font-semibold text-pine-600">
                            {p.appointment.medecin.prenom} {p.appointment.medecin.nom}
                          </p>
                          <p className="text-xs text-pine-400">{p.appointment.medecin.specialite}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-clay-500 italic">Médecin inconnu</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono-tab font-semibold text-base text-pine-700">
                      {p.montant} MAD
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          p.statut === 'reussi'
                            ? 'bg-pine-50 text-pine-500 border border-pine-200/30'
                            : 'bg-clay-500/10 text-clay-500 border border-clay-500/20'
                        }`}
                      >
                        {p.statut === 'reussi' ? 'Réussi' : 'Échoué'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-pine-400 font-mono-tab">
                      {new Date(p.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
