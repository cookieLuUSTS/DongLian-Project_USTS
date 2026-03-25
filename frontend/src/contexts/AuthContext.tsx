import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // 从localStorage中加载用户信息
    const loadUser = () => {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const username = localStorage.getItem('username')
      const email = localStorage.getItem('email')
      
      if (token && userId && username && email) {
        setUser({ id: userId, username, email })
      }
      setIsLoading(false)
    }
    
    loadUser()
  }, [])
  
  const login = (user: User, token: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('username', user.username)
    localStorage.setItem('email', user.email)
    setUser(user)
  }
  
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    setUser(null)
  }
  
  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
