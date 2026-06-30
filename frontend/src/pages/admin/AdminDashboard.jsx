import { useEffect, useState } from 'react'
import api from '../../api/axios'
import {
  Users, CalendarDays, Banknote, Stethoscope,
  CheckCircle2, Clock, XCircle, TrendingUp,
  Activity, Video, Building2, Loader2, AlertCircle
} from 'lucide-react'

const MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

const statutConfig = {
  confirme:   { label: 'Confirmé',   icon: CheckCircle2, cls: 'bg-emerald-100 text-emerald-700' },
  en_attente: { label: 'En attente', icon: Clock,         cls: 'bg-amber-100   text-amber-700'   },
  annule:     { label: 'Annulé',     icon: XCircle,       cls: 'bg-red-100     text-red-700'     },
}

function StatCard({ icon: Icon, label, value, sub, accentColor, barColor }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${accentColor}18` }}
        >
          <Icon size={20} style={{ color: accentColor }} />
        </div>
        <TrendingUp size={14} className="text-slate-200 group-hover:text-slate-300 transition-colors mt-1" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-bold mt-1" style={{ color: accentColor }}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-1 rounded-r-2xl" style={{ background: accentColor }} />
    </div>
  )
}

function BarChart({ data }) {
  if (!data || data.length === 0) return (
    <div className="h-36 flex flex-col items-center justify-center text-slate-300 gap-2">
      <Activity size={24} />
      <span className="text-sm italic">Aucune donnée disponible</span>
    </div>
  )
  const max = Math.max(...data.map(d => d.total), 1)
  return (
    <div className="flex items-end gap-2 h-36 px-1">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
          <span className="text-xs font-bold text-pine-600">{d.total}</span>
          <div
            className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-default"
            style={{
              height: `${Math.max((d.total / max) * 100, 4)}%`,
              background: 'linear-gradient(to top, #2b5048, #b48b2a)'
            }}
            title={`${MONTH_NAMES[d.month - 1]} ${d.year}: ${d.total} RDV`}
          />
          <span className="text-[10px] text-slate-400 truncate w-full text-center">
            {MONTH_NAMES[d.month - 1]}
          </span>
        </div>
      ))}
    </div>
  )
}

function DonutSegment({ offset, pct, color }) {
  return (
    <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="4"
      strokeDasharray={`${pct} ${100 - pct}`}
      strokeDashoffset={-offset}
    />
  )
}

function DonutChart({ confirmed, pending, cancelled }) {
  const total = confirmed + pending + cancelled || 1
  const pC = Math.round((confirmed / total) * 100)
  const pP = Math.round((pending  / total) * 100)
  const pX = Math.round((cancelled / total) * 100)

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="4"/>
          <DonutSegment offset={0}       pct={pC} color="#10b981" />
          <DonutSegment offset={pC}      pct={pP} color="#f59e0b" />
          <DonutSegment offset={pC + pP} pct={pX} color="#ef4444" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-pine-700">{total}</span>
          <span className="text-[9px] text-slate-400 uppercase tracking-wide">Total</span>
        </div>
      </div>
      <div className="space-y-2.5 text-sm">
        {[
          { Icon: CheckCircle2, color: '#10b981', label: 'Confirmés',  count: confirmed },
          { Icon: Clock,        color: '#f59e0b', label: 'En attente', count: pending   },
          { Icon: XCircle,      color: '#ef4444', label: 'Annulés',    count: cancelled },
        ].map(({ Icon, color, label, count }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon size={14} style={{ color }} />
            <span className="text-slate-500">{label}</span>
            <span className="ml-auto font-bold text-slate-800">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    api.get('/admin/dashboard')
      .then(res => { setStats(res.data); setLoading(false) })
      .catch(() => { setError('Impossible de charger les statistiques.'); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-3">
      <Loader2 size={32} className="text-pine-400 animate-spin" />
      <p className="text-slate-400 text-sm">Chargement du tableau de bord…</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-red-600">
      <AlertCircle size={20} />
      <span className="text-sm">{error}</span>
    </div>
  )

  const {
    total_users, total_patients, total_medecins,
    total_appointments, confirmed_appointments, pending_appointments, cancelled_appointments,
    total_revenue, pending_revenue,
    monthly_appointments, recent_appointments, top_medecins
  } = stats

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pine-600/10 flex items-center justify-center">
          <Activity size={20} className="text-pine-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl text-slate-800 font-semibold">Vue d'ensemble</h2>
          <p className="text-sm text-slate-400 mt-0.5">Statistiques en temps réel de votre cabinet</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Utilisateurs"
          value={total_users}
          sub={`${total_patients} patients · ${total_medecins} médecins`}
          accentColor="#3b82f6"
        />
        <StatCard
          icon={CalendarDays}
          label="Rendez-vous"
          value={total_appointments}
          sub={`${confirmed_appointments} confirmés`}
          accentColor="#2b5048"
        />
        <StatCard
          icon={Banknote}
          label="Revenus payés"
          value={`${Number(total_revenue).toFixed(2)} €`}
          sub={`${Number(pending_revenue).toFixed(2)} € en attente`}
          accentColor="#b48b2a"
        />
        <StatCard
          icon={Stethoscope}
          label="Médecins actifs"
          value={total_medecins}
          sub={`${total_patients} patients inscrits`}
          accentColor="#10b981"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-pine-600" />
            <h3 className="font-display text-lg text-slate-800 font-semibold">Rendez-vous mensuels</h3>
          </div>
          <p className="text-xs text-slate-400 mb-6">6 derniers mois</p>
          <BarChart data={monthly_appointments} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={16} className="text-pine-600" />
            <h3 className="font-display text-lg text-slate-800 font-semibold">Statuts des RDV</h3>
          </div>
          <p className="text-xs text-slate-400 mb-6">Répartition globale</p>
          <DonutChart
            confirmed={confirmed_appointments}
            pending={pending_appointments}
            cancelled={cancelled_appointments}
          />
        </div>
      </div>

      {/* Recent Activity + Top Doctors */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Appointments Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <CalendarDays size={16} className="text-pine-600" />
            <h3 className="font-display text-lg text-slate-800 font-semibold flex-1">Activité récente</h3>
            <span className="text-xs text-slate-400">10 derniers RDV</span>
          </div>
          <div className="overflow-x-auto">
            {recent_appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-300">
                <CalendarDays size={28} />
                <span className="text-sm italic">Aucun rendez-vous récent.</span>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    {['Patient', 'Médecin', 'Date', 'Statut', 'Type'].map(h => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recent_appointments.map((appt) => {
                    const cfg = statutConfig[appt.statut] || { label: appt.statut, icon: Clock, cls: 'bg-slate-100 text-slate-600' }
                    const StatusIcon = cfg.icon
                    return (
                      <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-slate-800">{appt.patient}</td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-700">{appt.medecin}</p>
                          {appt.specialite && <p className="text-xs text-slate-400">{appt.specialite}</p>}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                          {appt.date || '—'}
                          {appt.heure && <span className="text-slate-400 text-xs"> · {appt.heure}</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
                            <StatusIcon size={11} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            {appt.type === 'video'
                              ? <><Video size={13} className="text-blue-400" /> Vidéo</>
                              : <><Building2 size={13} className="text-slate-400" /> Présentiel</>
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Doctors */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Stethoscope size={16} className="text-pine-600" />
            <div>
              <h3 className="font-display text-lg text-slate-800 font-semibold leading-none">Top Médecins</h3>
              <p className="text-xs text-slate-400 mt-0.5">Par nombre de rendez-vous</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {top_medecins.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2 text-slate-300">
                <Stethoscope size={24} />
                <span className="text-sm italic">Aucun médecin.</span>
              </div>
            ) : (
              top_medecins.map((m, i) => {
                const maxCount = top_medecins[0].count || 1
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-700 truncate">{m.nom}</p>
                        <p className="text-xs text-slate-400 truncate">{m.specialite || '—'}</p>
                      </div>
                      <span className="font-bold text-pine-600 text-sm flex-shrink-0 flex items-center gap-1">
                        <CalendarDays size={12} className="text-pine-400" />
                        {m.count}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max((m.count / maxCount) * 100, 4)}%`,
                          background: 'linear-gradient(to right, #2b5048, #b48b2a)'
                        }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
