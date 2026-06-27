import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function VideoCall() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [duree, setDuree] = useState(0)
  const [rdv, setRdv] = useState(null)
  const [chargement, setChargement] = useState(true)

  // Fetch appointment to check whether lien_video is a real URL
  useEffect(() => {
    const endpoint =
      user?.role === 'medecin' ? '/medecin/rendez-vous' : '/patient/rendez-vous'

    api.get(endpoint).then((res) => {
      const found = res.data.find((r) => String(r.id) === String(id))
      if (found) {
        // If real external URL, redirect immediately
        if (found.lien_video?.startsWith('http')) {
          window.location.href = found.lien_video
          return
        }
        setRdv(found)
      }
      setChargement(false)
    }).catch(() => setChargement(false))
  }, [id, user])

  // Timer for the simulation
  useEffect(() => {
    if (chargement) return
    const t = setInterval(() => setDuree((d) => d + 1), 1000)
    return () => clearInterval(t)
  }, [chargement])

  const minutes  = String(Math.floor(duree / 60)).padStart(2, '0')
  const secondes = String(duree % 60).padStart(2, '0')

  if (chargement) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="text-pine-400 font-mono-tab text-sm">Connexion à la salle vidéo…</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-pine-700 rounded-sm p-2">
        <div className="flex items-center justify-between text-linen-50 px-3 py-2">
          <span className="font-mono-tab text-xs uppercase tracking-widest text-honey-400">
            ● Consultation vidéo (simulation) — RDV #{id}
          </span>
          <span className="font-mono-tab text-sm">{minutes}:{secondes}</span>
        </div>

        <div className="aspect-video bg-pine-900 rounded-sm flex items-center justify-center relative">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-pine-600 flex items-center justify-center text-linen-50 font-display text-2xl mx-auto mb-3">
              {user?.prenom?.[0]}
            </div>
            <p className="text-linen-100 text-sm">
              Vous êtes connecté en tant que {user?.role === 'medecin' ? 'médecin' : 'patient'}.
            </p>
            <p className="text-pine-300 text-xs mt-1 font-mono-tab">
              Ceci est une simulation pédagogique — aucun flux vidéo réel n'est transmis.
            </p>
            {/* Show a hint if no real link was set */}
            {!rdv?.lien_video?.startsWith('http') && user?.role === 'patient' && (
              <p className="text-honey-400 text-xs mt-3 font-mono-tab border border-honey-400/30 rounded px-3 py-1.5 inline-block">
                ⚠ Le médecin n'a pas encore défini de lien d'appel réel.
              </p>
            )}
          </div>

          <div className="absolute bottom-4 right-4 w-28 h-20 bg-pine-700 border border-pine-500 rounded-sm flex items-center justify-center text-linen-50 text-xs">
            Caméra locale
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 py-4">
          <button className="w-11 h-11 rounded-full bg-pine-600 text-linen-50 flex items-center justify-center">
            🎤
          </button>
          <button className="w-11 h-11 rounded-full bg-pine-600 text-linen-50 flex items-center justify-center">
            🎥
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-5 h-11 rounded-full bg-clay-500 text-linen-50 font-semibold hover:bg-clay-600 transition"
          >
            Terminer l'appel
          </button>
        </div>
      </div>
    </main>
  )
}
