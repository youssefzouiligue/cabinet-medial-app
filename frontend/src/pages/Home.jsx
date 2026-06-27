import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
export default function Home() {
  const [medecins, setMedecins] = useState([])
  const [recherche, setRecherche] = useState('')
  const [specialiteFiltre, setSpecialiteFiltre] = useState('')
  const [specialites, setSpecialites] = useState([])
  useEffect(() => {
    api.get('/medecins').then((res) => {
      setMedecins(res.data)
      // Extract unique specialties
      const uniqueSpecs = [...new Set(res.data.map((m) => m.specialite).filter(Boolean))]
      setSpecialites(uniqueSpecs)
    }).catch(() => {})
  }, [])
  // Filter doctors based on search and specialty
  const medecinsFiltres = medecins.filter((m) => {
    const nomComplet = `${m.prenom} ${m.nom}`.toLowerCase()
    const matchRecherche = nomComplet.includes(recherche.toLowerCase())
    const matchSpecialite = specialiteFiltre === '' || m.specialite === specialiteFiltre
    return matchRecherche && matchSpecialite
  })
  return (
    <main className="bg-linen-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-24 px-6 max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-center">
        {/* Ambient background accents */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-32 w-[28rem] h-[28rem] rounded-full bg-honey-400/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 w-[24rem] h-[24rem] rounded-full bg-pine-400/10 blur-3xl" />
        <div className="md:col-span-7 space-y-7 relative">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-honey-400/10 text-honey-600 text-xs font-mono tracking-widest uppercase border border-honey-300/30 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-honey-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-honey-500" />
            </span>
            Cabinet Médical Numérique
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-[4.25rem] text-pine-600 font-semibold leading-[1.05] tracking-tight">
            Votre santé, simplifiée et à portée de clic.
          </h1>
          <p className="text-pine-500/90 text-lg md:text-xl max-w-xl leading-relaxed">
            Consultez les disponibilités de nos médecins specialists en temps réel, réservez des consultations physiques ou en visioconférence, et confirmez instantanément.
          </p>
          <div className="flex flex-wrap gap-4 pt-3">
            <Link
              to="/inscription"
              className="bg-pine-600 text-linen-50 px-8 py-3.5 rounded-lg font-semibold text-sm shadow-lg shadow-pine-600/20 hover:bg-pine-700 hover:shadow-xl hover:shadow-pine-600/25 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-400 focus-visible:ring-offset-2"
            >
              Créer mon compte patient
            </Link>
            <Link
              to="/connexion"
              className="border border-pine-200 bg-white text-pine-600 px-8 py-3.5 rounded-lg font-semibold text-sm hover:border-pine-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-300 focus-visible:ring-offset-2"
            >
              Me connecter
            </Link>
          </div>
        </div>
        {/* Doctor List Preview Card */}
        <div className="md:col-span-5 relative bg-white border border-pine-100 rounded-2xl p-7 shadow-xl shadow-pine-900/5 space-y-6">
          <div aria-hidden="true" className="absolute top-0 left-7 right-7 h-[3px] rounded-full bg-gradient-to-r from-honey-400 via-honey-300 to-transparent" />
          <div>
            <h3 className="font-display text-2xl text-pine-600 font-semibold">Nos Médecins</h3>
            <p className="text-xs text-pine-400 mt-1.5">Recherchez et filtrez pour réserver votre créneau.</p>
          </div>
          {/* Filters Form */}
          <div className="space-y-2.5">
            <input
              type="text"
              placeholder="🔍 Rechercher par nom (ex: Zouiligue)"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full text-xs border border-pine-100 rounded-lg px-3.5 py-2.5 placeholder:text-pine-300 focus:outline-none focus:ring-2 focus:ring-honey-400/30 focus:border-honey-400 bg-linen-50/30 transition"
            />

            <select
              value={specialiteFiltre}
              onChange={(e) => setSpecialiteFiltre(e.target.value)}
              className="w-full text-xs border border-pine-100 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-honey-400/30 focus:border-honey-400 bg-white text-pine-600 transition cursor-pointer"
            >
              <option value="">Tous les spécialistes</option>
              {specialites.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
          {/* List */}
          <div className="max-h-[220px] overflow-y-auto ledger-scroll -mx-1">
            {medecinsFiltres.length === 0 ? (
              <p className="text-pine-400 text-xs py-8 text-center italic">
                Aucun médecin ne correspond à votre recherche.
              </p>
            ) : (
              <ul className="divide-y divide-pine-50">
                {medecinsFiltres.map((m) => (
                  <li key={m.id} className="py-3.5 flex items-center justify-between hover:bg-linen-50/40 px-3 mx-1 rounded-lg transition-colors duration-150">
                    <div>
                      <p className="font-semibold text-sm text-pine-600">
                        {m.prenom} {m.nom}
                      </p>
                      <p className="text-xs text-pine-400 font-mono-tab mt-0.5">{m.specialite}</p>
                    </div>
                    <Link
                      to="/inscription"
                      className="group text-xs font-semibold text-honey-500 hover:text-honey-600 transition flex items-center gap-1.5"
                    >
                      Prendre RDV <span className="slot-dot-available" />
                      <svg aria-hidden="true" className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-0.5" viewBox="0 0 12 12" fill="none">
                        <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      {/* Benefits / Features Section */}
      <section className="bg-white border-t border-b border-pine-100 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            ['📅 Calendrier dynamique', 'Visualisez instantanément en vert les créneaux disponibles et en gris/cadenas les créneaux déjà réservés.', 'border-honey-400'],
            ['📹 Consultation par vidéo', 'Optez pour des visioconférences sécurisées ou des visites en présentiel au cabinet selon vos besoins.', 'border-pine-400'],
            ['💳 Paiement en ligne test', 'Validez vos réservations en toute sécurité avec une simulation de paiement par carte bancaire.', 'border-clay-500'],
          ].map(([titre, texte, borderColor]) => (
            <div key={titre} className={`bg-linen-50/40 border-t-2 ${borderColor} rounded-b-xl p-7 space-y-3 hover:bg-linen-50/70 hover:shadow-md hover:-translate-y-1 transition-all duration-200`}>
              <h3 className="font-display text-xl text-pine-600 font-semibold">{titre}</h3>
              <p className="text-pine-500 text-sm leading-relaxed">{texte}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}