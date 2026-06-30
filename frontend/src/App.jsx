import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VideoCall from './pages/VideoCall'

import PatientLayout from './pages/patient/PatientLayout'
import BookAppointment from './pages/patient/BookAppointment'
import Payment from './pages/patient/Payment'
import MyAppointments from './pages/patient/MyAppointments'

import DoctorLayout from './pages/doctor/DoctorLayout'
import ManageSchedule from './pages/doctor/ManageSchedule'
import DoctorAppointments from './pages/doctor/DoctorAppointments'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminPayments from './pages/admin/AdminPayments'

export default function App() {
  return (
    <div className="min-h-screen bg-linen-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />

        <Route
          path="/appel-video/:id"
          element={
            <ProtectedRoute rolesAutorises={['patient', 'medecin']}>
              <VideoCall />
            </ProtectedRoute>
          }
        />

        {/* Espace Patient */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute rolesAutorises={['patient']}>
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BookAppointment />} />
          <Route path="rendez-vous" element={<MyAppointments />} />
          <Route path="paiement/:appointmentId" element={<Payment />} />
        </Route>

        {/* Espace Médecin */}
        <Route
          path="/medecin"
          element={
            <ProtectedRoute rolesAutorises={['medecin']}>
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManageSchedule />} />
          <Route path="rendez-vous" element={<DoctorAppointments />} />
        </Route>

        {/* Espace Administrateur */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute rolesAutorises={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="utilisateurs" element={<ManageUsers />} />
          <Route path="rendez-vous" element={<AdminAppointments />} />
          <Route path="paiements" element={<AdminPayments />} />
        </Route>
      </Routes>
    </div>
  )
}
