const STATUTS = {
  en_attente_paiement: { label: 'En attente de paiement', classe: 'bg-honey-400/20 text-honey-500' },
  confirme: { label: 'Confirmé', classe: 'bg-pine-50 text-pine-500' },
  annule: { label: 'Annulé', classe: 'bg-clay-500/10 text-clay-500' },
  termine: { label: 'Terminé', classe: 'bg-linen-200 text-pine-400' },
}

/**
 * Returns true if lien_video is a real external URL (not the auto-generated "salle-XXXX" stub).
 */
function isRealUrl(lien) {
  return lien && lien.startsWith('http')
}

export default function AppointmentCard({ rdv, autrePersonne, children }) {
  const statut = STATUTS[rdv.statut] || STATUTS.en_attente_paiement
  const isVideo = rdv.type_consultation === 'video'
  const isConfirme = rdv.statut === 'confirme'
  const hasRealLink = isRealUrl(rdv.lien_video)

  // Patient can join if confirmed + has any lien_video (real URL or simulation)
  const peutAppelVideo = isVideo && isConfirme && rdv.lien_video

  return (
    <div className="border border-pine-100 rounded-sm bg-white p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg text-pine-600">
            {new Date(rdv.schedule?.date).toLocaleDateString('fr-FR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}{' '}
            · {rdv.schedule?.heure_debut?.slice(0, 5)}
          </p>
          <p className="text-sm text-pine-400">{autrePersonne}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statut.classe}`}>
          {statut.label}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-pine-500 flex-wrap">
        <span className="font-mono-tab text-xs uppercase tracking-wide border border-pine-100 rounded px-2 py-0.5">
          {isVideo ? '📹 Appel vidéo' : '🏥 Présentiel'}
        </span>
        {rdv.statut === 'confirme' && rdv.payment?.statut === 'reussi' && (
          <span className="stamp-confirme">✓ payé</span>
        )}
        {/* Show badge if doctor has already set a real meeting link */}
        {isVideo && hasRealLink && (
          <span className="text-xs font-semibold text-pine-500 bg-pine-50 border border-pine-200 rounded px-2 py-0.5">
            🔗 Lien disponible
          </span>
        )}
        {/* Warn patient if confirmed but no real link yet */}
        {isVideo && isConfirme && !hasRealLink && (
          <span className="text-xs text-honey-500 bg-honey-400/10 border border-honey-300 rounded px-2 py-0.5">
            ⏳ Lien en attente du médecin
          </span>
        )}
      </div>

      {rdv.motif && <p className="text-sm text-pine-500 italic">« {rdv.motif} »</p>}

      {/* Join call button — real external URL or internal simulation */}
      {peutAppelVideo && (
        hasRealLink ? (
          <a
            href={rdv.lien_video}
            target="_blank"
            rel="noreferrer"
            className="self-start inline-flex items-center gap-2 text-sm font-semibold bg-pine-600 text-linen-50 px-4 py-2 rounded-sm hover:bg-pine-700 transition"
          >
            ▶ Rejoindre l'appel vidéo
          </a>
        ) : (
          <a
            href={`/appel-video/${rdv.id}`}
            className="self-start inline-flex items-center gap-2 text-sm font-semibold bg-pine-600 text-linen-50 px-4 py-2 rounded-sm hover:bg-pine-700 transition"
          >
            ▶ Démarrer la simulation vidéo
          </a>
        )
      )}

      {children}
    </div>
  )
}
