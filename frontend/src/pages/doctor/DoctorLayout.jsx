import { NavLink, Outlet } from 'react-router-dom'

export default function DoctorLayout() {
  const lien = ({ isActive }) =>
    `px-4 py-2 text-sm font-semibold rounded-sm transition ${
      isActive ? 'bg-pine-600 text-linen-50' : 'text-pine-500 hover:bg-pine-50'
    }`

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-pine-600 mb-6">Espace Médecin</h1>
      <nav className="flex gap-2 mb-8 border-b border-pine-100 pb-4">
        <NavLink to="/medecin" end className={lien}>Mon calendrier</NavLink>
        <NavLink to="/medecin/rendez-vous" className={lien}>Rendez-vous</NavLink>
      </nav>
      <Outlet />
    </main>
  )
}
