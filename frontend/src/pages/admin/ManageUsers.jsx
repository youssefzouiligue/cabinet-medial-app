import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function ManageUsers() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [filtreRole, setFiltreRole] = useState('')
  const [message, setMessage] = useState(null)
  const [erreur, setErreur] = useState(null)

  // Creation Form State
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [specialite, setSpecialite] = useState('')
  const [creationLoading, setCreationLoading] = useState(false)
  const [creationErreurs, setCreationErreurs] = useState({})

  // Maintenance Loading States
  const [seedLoading, setSeedLoading] = useState(false)
  const [clearLoading, setClearLoading] = useState(false)

  function charger() {
    api.get('/admin/utilisateurs', { params: filtreRole ? { role: filtreRole } : {} })
      .then((res) => {
        setUtilisateurs(res.data)
      })
      .catch((err) => {
        setErreur('Impossible de charger les utilisateurs.')
      })
  }

  useEffect(() => {
    charger()
  }, [filtreRole])

  async function basculerActif(u) {
    try {
      await api.put(`/admin/utilisateurs/${u.id}`, { actif: !u.actif })
      setMessage(`Le statut de ${u.prenom} ${u.nom} a été mis à jour.`)
      setTimeout(() => setMessage(null), 4000)
      charger()
    } catch (err) {
      setErreur("Erreur lors de la mise à jour du statut.")
      setTimeout(() => setErreur(null), 4000)
    }
  }

  async function supprimer(u) {
    if (!confirm(`Supprimer définitivement le compte de ${u.prenom} ${u.nom} ?`)) return
    try {
      await api.delete(`/admin/utilisateurs/${u.id}`)
      setMessage(`L'utilisateur ${u.prenom} ${u.nom} a été supprimé.`)
      setTimeout(() => setMessage(null), 4000)
      charger()
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de la suppression de l'utilisateur."
      setErreur(msg)
      setTimeout(() => setErreur(null), 4000)
    }
  }

  async function handleCreerUtilisateur(e) {
    e.preventDefault()
    setCreationLoading(true)
    setCreationErreurs({})
    setMessage(null)
    setErreur(null)

    try {
      await api.post('/admin/utilisateurs', {
        nom,
        prenom,
        email,
        telephone,
        password,
        role,
        specialite: role === 'medecin' ? specialite : null,
      })

      setMessage('Utilisateur créé avec succès !')
      setTimeout(() => setMessage(null), 5000)
      
      // Reset form
      setNom('')
      setPrenom('')
      setEmail('')
      setTelephone('')
      setPassword('')
      setRole('patient')
      setSpecialite('')
      
      charger()
    } catch (err) {
      if (err.response?.status === 422) {
        setCreationErreurs(err.response.data.errors || {})
      } else {
        setErreur(err.response?.data?.message || 'Erreur lors de la création de l\'utilisateur.')
      }
    } finally {
      setCreationLoading(false)
    }
  }

  async function handleSeedFactories() {
    if (!confirm('Générer des données fictives de démonstration (5 médecins, 10 patients avec des créneaux horaires) ?')) return
    setSeedLoading(true)
    setMessage(null)
    setErreur(null)
    try {
      const res = await api.post('/admin/seed-factories')
      setMessage(res.data.message)
      charger()
    } catch (err) {
      setErreur('Erreur lors de la génération des données fictives.')
    } finally {
      setSeedLoading(false)
    }
  }

  async function handleClearDatabase() {
    if (!confirm('ATTENTION: Cette action supprimera tous les rendez-vous, paiements, créneaux et utilisateurs (SAUF votre propre compte admin). Confirmer ?')) return
    setClearLoading(true)
    setMessage(null)
    setErreur(null)
    try {
      const res = await api.post('/admin/clear-database')
      setMessage(res.data.message)
      charger()
    } catch (err) {
      setErreur('Erreur lors du nettoyage de la base de données.')
    } finally {
      setClearLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      {/* Colonne Gauche: Formulaire et Maintenance */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Formulaire de création */}
        <div className="bg-white border border-pine-100 rounded p-6 shadow-sm">
          <h2 className="font-display text-xl text-pine-600 mb-4 pb-2 border-b border-pine-50">
            Ajouter un utilisateur
          </h2>
          <form onSubmit={handleCreerUtilisateur} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-pine-500 uppercase tracking-wide mb-1">
                Prénom
              </label>
              <input
                type="text"
                required
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full text-sm border border-pine-100 rounded px-3 py-2 focus:outline-none focus:border-pine-400 bg-linen-50/20"
                placeholder="Ex: Youssef"
              />
              {creationErreurs.prenom && (
                <p className="text-xs text-clay-500 mt-1">{creationErreurs.prenom[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-pine-500 uppercase tracking-wide mb-1">
                Nom
              </label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full text-sm border border-pine-100 rounded px-3 py-2 focus:outline-none focus:border-pine-400 bg-linen-50/20"
                placeholder="Ex: Zouiligue"
              />
              {creationErreurs.nom && (
                <p className="text-xs text-clay-500 mt-1">{creationErreurs.nom[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-pine-500 uppercase tracking-wide mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm border border-pine-100 rounded px-3 py-2 focus:outline-none focus:border-pine-400 bg-linen-50/20"
                placeholder="Ex: medecin@cabinet.test"
              />
              {creationErreurs.email && (
                <p className="text-xs text-clay-500 mt-1">{creationErreurs.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-pine-500 uppercase tracking-wide mb-1">
                Téléphone
              </label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full text-sm border border-pine-100 rounded px-3 py-2 focus:outline-none focus:border-pine-400 bg-linen-50/20"
                placeholder="Ex: 0600000000"
              />
              {creationErreurs.telephone && (
                <p className="text-xs text-clay-500 mt-1">{creationErreurs.telephone[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-pine-500 uppercase tracking-wide mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm border border-pine-100 rounded px-3 py-2 focus:outline-none focus:border-pine-400 bg-linen-50/20"
                placeholder="Minimum 6 caractères"
              />
              {creationErreurs.password && (
                <p className="text-xs text-clay-500 mt-1">{creationErreurs.password[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-pine-500 uppercase tracking-wide mb-1">
                Rôle
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-sm border border-pine-100 rounded px-3 py-2 focus:outline-none focus:border-pine-400 bg-white"
              >
                <option value="patient">Patient</option>
                <option value="medecin">Médecin</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            {role === 'medecin' && (
              <div>
                <label className="block text-xs font-semibold text-pine-500 uppercase tracking-wide mb-1">
                  Spécialité
                </label>
                <input
                  type="text"
                  required
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                  className="w-full text-sm border border-pine-100 rounded px-3 py-2 focus:outline-none focus:border-pine-400 bg-linen-50/20"
                  placeholder="Ex: Généraliste, Cardiologue"
                />
                {creationErreurs.specialite && (
                  <p className="text-xs text-clay-500 mt-1">{creationErreurs.specialite[0]}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={creationLoading}
              className="w-full bg-pine-500 text-linen-50 hover:bg-pine-600 transition py-2.5 rounded font-semibold text-sm shadow-sm disabled:opacity-50"
            >
              {creationLoading ? 'Création en cours…' : 'Créer l\'utilisateur'}
            </button>
          </form>
        </div>

        {/* Section de Maintenance */}
        <div className="bg-white border border-pine-100 rounded p-6 shadow-sm space-y-4">
          <h2 className="font-display text-xl text-pine-600 pb-2 border-b border-pine-50">
            Maintenance du Cabinet
          </h2>
          <p className="text-xs text-pine-400 leading-relaxed">
            Ces utilitaires permettent de tester rapidement l'application avec un grand volume de données de test.
          </p>
          
          <button
            onClick={handleSeedFactories}
            disabled={seedLoading}
            className="w-full border border-pine-200 text-pine-600 hover:bg-pine-50 transition py-2 rounded text-xs font-semibold disabled:opacity-50"
          >
            {seedLoading ? 'Génération en cours…' : '⚡ Générer des données démo (Factories)'}
          </button>

          <button
            onClick={handleClearDatabase}
            disabled={clearLoading}
            className="w-full border border-clay-500 text-clay-500 hover:bg-clay-500/5 transition py-2 rounded text-xs font-semibold disabled:opacity-50"
          >
            {clearLoading ? 'Nettoyage en cours…' : '🗑 Réinitialiser / Vider la base de données'}
          </button>
        </div>
      </div>

      {/* Colonne Droite: Filtres et Liste des utilisateurs */}
      <div className="lg:col-span-2 space-y-4">
        {/* Messages de retour */}
        {message && (
          <div className="bg-pine-50 border border-pine-200 text-pine-600 text-sm px-4 py-3 rounded">
            {message}
          </div>
        )}
        {erreur && (
          <div className="bg-clay-500/10 border border-clay-500/20 text-clay-600 text-sm px-4 py-3 rounded">
            {erreur}
          </div>
        )}

        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-1.5 bg-linen-100/50 p-1 rounded-full border border-pine-100/30">
            {[
              ['', 'Tous'],
              ['patient', 'Patients'],
              ['medecin', 'Médecins'],
              ['admin', 'Admins'],
            ].map(([val, labels]) => (
              <button
                key={val}
                onClick={() => setFiltreRole(val)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  filtreRole === val
                    ? 'bg-pine-600 text-linen-50 shadow-sm'
                    : 'text-pine-500 hover:text-pine-700'
                }`}
              >
                {labels}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono-tab text-pine-400">
            {utilisateurs.length} utilisateur(s) trouvé(s)
          </span>
        </div>

        <div className="border border-pine-100 rounded bg-white shadow-sm divide-y divide-pine-50">
          {utilisateurs.length === 0 ? (
            <div className="px-6 py-12 text-center text-pine-400 text-sm">
              Aucun utilisateur ne correspond à ce filtre.
            </div>
          ) : (
            utilisateurs.map((u) => {
              const badgeColors = {
                admin: 'bg-honey-400/10 text-honey-500 border border-honey-300/30',
                medecin: 'bg-pine-50 text-pine-500 border border-pine-200/30',
                patient: 'bg-linen-100 text-pine-600 border border-linen-200/50',
              }[u.role] || 'bg-gray-100 text-gray-800'

              return (
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-4 hover:bg-linen-50/20 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-semibold text-pine-600 text-base">
                        {u.prenom} {u.nom}
                      </p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${badgeColors}`}>
                        {u.role === 'medecin' ? `Dr · ${u.specialite || 'Médecin'}` : u.role}
                      </span>
                    </div>
                    <div className="text-xs text-pine-400 space-y-0.5">
                      <p>📧 {u.email}</p>
                      {u.telephone && <p>📞 {u.telephone}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        u.actif ? 'bg-pine-50 text-pine-500' : 'bg-clay-500/10 text-clay-500'
                      }`}
                    >
                      {u.actif ? 'Actif' : 'Bloqué'}
                    </span>
                    
                    <button
                      onClick={() => basculerActif(u)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded transition ${
                        u.actif
                          ? 'border border-honey-500/20 text-honey-500 hover:bg-honey-400/5'
                          : 'border border-pine-200 text-pine-500 hover:bg-pine-50'
                      }`}
                    >
                      {u.actif ? 'Bloquer' : 'Débloquer'}
                    </button>
                    
                    <button
                      onClick={() => supprimer(u)}
                      className="text-xs font-semibold px-3 py-1.5 rounded border border-clay-500/20 text-clay-500 hover:bg-clay-500/5 transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
