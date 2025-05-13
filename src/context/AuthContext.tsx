import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  username: string
  avatar: string
  email_verified: boolean
}

interface AuthContextProps {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedIsAuth = localStorage.getItem('isAuth')
    if (storedUser && storedIsAuth === 'true') {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isAuth', JSON.stringify(true))
    setUser(userData)
    navigate('/')
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isAuth')
    setUser(null)
    navigate('/signin')
  }

  const isAuthenticated = () => {
    return localStorage.getItem('isAuth') === 'true'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children} {/* Render children only after loading is complete */}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
