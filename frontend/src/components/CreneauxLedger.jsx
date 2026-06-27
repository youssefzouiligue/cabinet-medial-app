/**
 * CreneauxLedger — l'élément signature de l'application.
 * Affiche les créneaux horaires comme un véritable carnet de rendez-vous :
 * regroupés par jour, avec un point vert pulsé pour les créneaux libres
 * et un cadenas pour les créneaux indisponibles, conformément au cahier
 * des charges ("horaires disponibles en vert, indisponibles avec icône
 * de verrouillage").
 */
export default function CreneauxLedger({ creneaux, onReserver, actionsMedecin }) {
  if (!creneaux || creneaux.length === 0) {
    return (
      <p className="text-pine-400 font-mono-tab text-sm py-8 text-center border border-dashed border-pine-100 rounded">
        Aucun créneau pour le moment.
      </p>
    )
  }

  const parJour = creneaux.reduce((acc, c) => {
    acc[c.date] = acc[c.date] || []
    acc[c.date].push(c)
    return acc
  }, {})

  return (
    <div className="ledger-scroll max-h-[520px] overflow-y-auto rounded-sm border border-pine-100 bg-white">
      {Object.entries(parJour).map(([date, creneauxDuJour]) => (
        <div key={date}>
          <div className="sticky top-0 bg-pine-600 text-linen-50 px-4 py-2 font-display text-sm tracking-wide">
            {new Date(date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </div>
          <ul className="divide-y divide-pine-50">
            {creneauxDuJour.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-linen-50 transition"
              >
                <div className="flex items-center gap-3">
                  {c.disponible ? (
                    <span className="slot-dot-available" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true" className="text-pine-300">🔒</span>
                  )}
                  <span className="font-mono-tab text-sm text-pine-600">
                    {c.heure_debut.slice(0, 5)} – {c.heure_fin.slice(0, 5)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      c.disponible
                        ? 'bg-pine-50 text-pine-500'
                        : 'bg-linen-200 text-pine-300'
                    }`}
                  >
                    {c.disponible ? 'disponible' : 'réservé'}
                  </span>
                </div>

                {onReserver && c.disponible && (
                  <button
                    onClick={() => onReserver(c)}
                    className="text-sm font-semibold text-clay-500 hover:text-clay-600 transition"
                  >
                    Réserver →
                  </button>
                )}

                {actionsMedecin && actionsMedecin(c)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
