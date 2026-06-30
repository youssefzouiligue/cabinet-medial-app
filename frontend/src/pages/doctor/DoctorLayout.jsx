import { NavLink, Outlet } from 'react-router-dom'
import { CalendarRange, CalendarCheck, Stethoscope } from 'lucide-react'

export default function DoctorLayout() {
  const lien = ({ isActive }) =>
    `flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 ${
      isActive ? 'bg-pine-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
    }`

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-100 shadow-sm flex flex-col pt-8 pb-6 px-4 gap-1 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-pine-600 flex items-center justify-center flex-shrink-0">
              <Stethoscope size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-pine-700 leading-none">Cabinet Médical</p>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Espace Médecin</span>
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2">Menu</p>

          <NavLink to="/medecin" end className={lien}>
            <CalendarRange size={17} />
            Mon calendrier
          </NavLink>
          <NavLink to="/medecin/rendez-vous" className={lien}>
            <CalendarCheck size={17} />
            Rendez-vous
          </NavLink>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b border-slate-100 px-8 py-4">
            <h1 className="font-display text-lg text-pine-700 font-semibold leading-none">Espace Médecin</h1>
            <span className="text-xs text-slate-400">Gérez vos créneaux et rendez-vous</span>
          </header>
          <div className="px-8 py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  )
}
