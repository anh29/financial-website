import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../types'

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
    try {
      const storedUser = localStorage.getItem('user')
      const storedIsAuth = localStorage.getItem('isAuth')

      if (storedUser && storedIsAuth === 'true') {
        const parsedUser = JSON.parse(storedUser)
        // Validate that the parsed user has required fields
        if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.name) {
          setUser(parsedUser)
        } else {
          // If user data is invalid, clear storage
          localStorage.removeItem('user')
          localStorage.removeItem('isAuth')
          setUser(null)
        }
      }
    } catch (error) {
      // If there's any error parsing the stored user, clear storage
      console.error('Error parsing stored user:', error)
      localStorage.removeItem('user')
      localStorage.removeItem('isAuth')
      setUser(null)
    }
  }, [])

  const login = (userData: User) => {
    try {
      console.log('userData', userData)
      // Validate user data before saving
      if (!userData || !userData.id || !userData.username) {
        throw new Error('Invalid user data')
      }

      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('isAuth', 'true')
      setUser(userData)
      navigate('/')
    } catch (error) {
      console.error('Error saving user data:', error)
      // Clear any potentially corrupted data
      localStorage.removeItem('user')
      localStorage.removeItem('isAuth')
      setUser(null)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isAuth')
    setUser(null)
    navigate('/signin')
  }

  const isAuthenticated = () => {
    try {
      const storedUser = localStorage.getItem('user')
      const storedIsAuth = localStorage.getItem('isAuth')

      if (!storedUser || storedIsAuth !== 'true') {
        return false
      }

      const parsedUser = JSON.parse(storedUser)
      return !!(parsedUser && parsedUser.id && parsedUser.email && parsedUser.name)
    } catch {
      return false
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
