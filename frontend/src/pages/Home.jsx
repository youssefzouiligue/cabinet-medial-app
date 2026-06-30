import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { CalendarCheck2, Video, CreditCard, ArrowRight, Search } from 'lucide-react'

const FEATURES = [
  {
    Icon: CalendarCheck2,
    title: 'Calendrier intelligent',
    desc: 'Visualisez les créneaux disponibles en temps réel. Réservez en quelques secondes auprès de votre spécialiste.',
    accent: '#2b5048',
    grad: 'from-pine-600/10 to-transparent',
  },
  {
    Icon: Video,
    title: 'Consultation par vidéo',
    desc: 'Consultez depuis chez vous via notre système de visioconférence sécurisé. Lien partagé automatiquement.',
    accent: '#b48b2a',
    grad: 'from-honey-500/10 to-transparent',
  },
  {
    Icon: CreditCard,
    title: 'Paiement en ligne',
    desc: 'Confirmez vos consultations avec un paiement sécurisé. Reçu instantané et historique complet.',
    accent: '#7c3d2f',
    grad: 'from-clay-600/10 to-transparent',
  },
]

const STATS = [
  { value: '500+', label: 'Patients satisfaits' },
  { value: '30+',  label: 'Médecins spécialistes' },
  { value: '98%',  label: 'Taux de satisfaction' },
  { value: '24h',  label: 'Support disponible' },
]

export default function Home() {
  const [medecins, setMedecins]             = useState([])
  const [recherche, setRecherche]           = useState('')
  const [specialiteFiltre, setSpecialiteFiltre] = useState('')
  const [specialites, setSpecialites]       = useState([])
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    api.get('/medecins').then((res) => {
      setMedecins(res.data)
      const uniqueSpecs = [...new Set(res.data.map((m) => m.specialite).filter(Boolean))]
      setSpecialites(uniqueSpecs)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const medecinsFiltres = medecins.filter((m) => {
    const nomComplet = `${m.prenom} ${m.nom}`.toLowerCase()
    const matchRecherche  = nomComplet.includes(recherche.toLowerCase())
    const matchSpecialite = specialiteFiltre === '' || m.specialite === specialiteFiltre
    return matchRecherche && matchSpecialite
  })

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center" style={{ background: 'linear-gradient(135deg, #0f2419 0%, #1a3d30 40%, #0d2218 100%)' }}>
        {/* Decorative blobs */}
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #b48b2a 0%, transparent 70%)' }} />
          <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #2b5048 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(ellipse, #fff 0%, transparent 70%)' }} />
        </div>

        {/* Grid pattern overlay */}
        <div aria-hidden className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left: copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ background: 'rgba(180,139,42,0.15)', color: '#e8b84b', border: '1px solid rgba(180,139,42,0.25)' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: '#e8b84b' }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#e8b84b' }} />
              </span>
              Cabinet Médical Numérique
            </div>

            <h1 className="font-display text-white leading-[1.08] tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
              Votre santé,{' '}
              <span style={{ background: 'linear-gradient(135deg, #e8b84b, #f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                simplifiée
              </span>{' '}
              et à portée de clic.
            </h1>

            <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Consultez nos médecins spécialistes en temps réel, réservez des consultations physiques ou en visioconférence, et confirmez instantanément depuis n'importe où.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/inscription"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #2b5048, #3d6b60)', color: '#fff', boxShadow: '0 4px 24px rgba(43,80,72,0.4)' }}>
                Créer mon compte gratuit
                <ArrowRight size={16} />
              </Link>
              <Link to="/connexion"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
                Se connecter
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold" style={{ color: '#e8b84b' }}>{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Doctor finder card */}
          <div className="relative">
            {/* Glow */}
            <div aria-hidden className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl"
              style={{ background: 'radial-gradient(ellipse, #2b5048 0%, transparent 70%)' }} />

            <div className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
              {/* Card header */}
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">Trouver un médecin</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {medecins.length} spécialistes disponibles
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Search */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input
                      type="text"
                      placeholder="Rechercher par nom…"
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                      className="w-full text-sm py-2.5 pl-9 pr-3 rounded-lg outline-none transition"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                  <select
                    value={specialiteFiltre}
                    onChange={(e) => setSpecialiteFiltre(e.target.value)}
                    className="text-sm py-2.5 px-3 rounded-lg outline-none transition cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }}
                  >
                    <option value="" style={{ background: '#1a3d30' }}>Toutes spécialités</option>
                    {specialites.map((spec) => (
                      <option key={spec} value={spec} style={{ background: '#1a3d30' }}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Doctor list */}
                <div className="max-h-64 overflow-y-auto space-y-1 ledger-scroll">
                  {loading ? (
                    <div className="flex items-center justify-center py-8 gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Chargement…</span>
                    </div>
                  ) : medecinsFiltres.length === 0 ? (
                    <p className="text-center py-8 text-sm italic" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Aucun médecin trouvé.
                    </p>
                  ) : (
                    medecinsFiltres.map((m) => (
                      <div key={m.id}
                        className="flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-150 group"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ background: 'rgba(43,80,72,0.6)', color: '#a8d5c8' }}>
                            {m.prenom?.[0]}{m.nom?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">Dr. {m.prenom} {m.nom}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{m.specialite || 'Généraliste'}</p>
                          </div>
                        </div>
                        <Link to="/inscription"
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1.5"
                          style={{ background: 'rgba(180,139,42,0.2)', color: '#e8b84b', border: '1px solid rgba(180,139,42,0.2)' }}>
                          RDV →
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" aria-hidden>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 69.3C120 59 240 37 360 32C480 27 600 37 720 42.7C840 48 960 48 1080 42.7C1200 37 1320 27 1380 21.3L1440 16V80H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ background: '#f0faf7', color: '#2b5048', border: '1px solid #d1ede6' }}>
              Fonctionnalités
            </span>
            <h2 className="font-display text-4xl font-semibold text-slate-800 mb-4">
              Tout ce qu'il vous faut pour{' '}
              <span style={{ color: '#2b5048' }}>votre santé</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
              Une plateforme complète pour gérer vos consultations médicales en toute simplicité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map(({ Icon, title, desc, accent, grad }) => (
              <div key={title}
                className="relative rounded-2xl p-8 overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default"
                style={{ border: '1px solid #f1f5f4' }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                    style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}>
                    <Icon size={24} style={{ color: accent }} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-800 mb-3">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #0f2419 0%, #1a3d30 100%)' }}>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-display text-4xl font-semibold text-white">
            Prêt à prendre soin de{' '}
            <span style={{ background: 'linear-gradient(135deg, #e8b84b, #f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              votre santé ?
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-lg leading-relaxed">
            Créez votre compte patient gratuitement et prenez rendez-vous en moins de 2 minutes.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/inscription"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #2b5048, #3d6b60)', color: '#fff', boxShadow: '0 4px 24px rgba(43,80,72,0.5)' }}>
              Créer mon compte
            </Link>
            <Link to="/connexion"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
              Déjà un compte ?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 text-center text-xs py-6">
        © {new Date().getFullYear()} Cabinet Médical Numérique. Tous droits réservés.
      </footer>
    </main>
  )
}