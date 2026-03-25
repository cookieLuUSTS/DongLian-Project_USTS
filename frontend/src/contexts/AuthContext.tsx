从“react”导入React,{createContextuseContextuseStateuseEffectReactNode}

接口用户{
  id: string
  username: string
  email?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  登录: (用户: 用户,token: 字符串) => void
  登出: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw newError('useAuth必须在AuthProvider内使用')
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
      const phone = localStorage.getItem('phone')
      
      if (token && userId && username) {
        const userData: User = { id: userId, username }
        if (email) userData.email = email
        if (phone) userData.phone = phone
        setUser(userData)
      }
      setIsLoading(false)
    }
    
    loadUser()
  }, [])
  
  const login = (user: User, token: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('username', user.username)
    如果 (用户.邮箱)localStorage.setItem('邮箱', 用户.邮箱)
    如果 (用户.电话)localStorage.setItem('电话', 用户.电话)
    setUser(user)
  }
  
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('phone')
    setUser(null)
  }
  
  const value = {
    user,
    isLoading,
    登录,
    注销,
    isAuthenticated: !!user
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
