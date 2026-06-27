import { NavLink, Outlet } from 'react-router-dom'

export default function PatientLayout() {
  const lien = ({ isActive }) =>
    `px-4 py-2 text-sm font-semibold rounded-sm transition ${
      isActive ? 'bg-pine-600 text-linen-50' : 'text-pine-500 hover:bg-pine-50'
    }`

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-pine-600 mb-6">Espace Patient</h1>
      <nav className="flex gap-2 mb-8 border-b border-pine-100 pb-4">
        <NavLink to="/patient" end className={lien}>Prendre rendez-vous</NavLink>
        <NavLink to="/patient/rendez-vous" className={lien}>Mes rendez-vous</NavLink>
      </nav>
      <Outlet />
    </main>
  )
}
