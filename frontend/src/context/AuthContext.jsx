import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setChargement(false)
      return
    }
    api
      .get('/me')
      .then((res) => {
        setUser(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      })
      .finally(() => setChargement(false))
  }, [])

  async function connexion(email, password) {
    const res = await api.post('/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  async function inscription(donnees) {
    const res = await api.post('/register', donnees)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  async function deconnexion() {
    try {
      await api.post('/logout')
    } catch {
      // on déconnecte localement même si la requête échoue
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, chargement, connexion, inscription, deconnexion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
