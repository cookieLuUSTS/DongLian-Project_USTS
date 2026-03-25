import { Outlet } from 'react-router-dom'
import { Box, Flex, HStack, Link, Button, useColorModeValue, IconButton, Badge, Tooltip, Divider, Text as ChakraText, Container } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { Home, MapPin, Users, Search, MessageCircle, Activity, User, LogOut, Menu as MenuIcon, X, Heart, Star, Sparkles, Cloud, Sun, Moon, Music, Gamepad, Zap, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { notificationApi } from '../services/api'

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const color = useColorModeValue('gray.800', 'white')
  
  useEffect(() => {
    const handleScroll = () => {
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, user])
  
  const fetchUnreadCount = async () => {
    if (!user?.id) return
    try {
      const response = await notificationApi.getNotifications(user.id)
      const unread = (response.data || []).filter((n: any) => !n.isRead).length
      setUnreadCount(unread)
    } catch (error) {
      console.error('获取未读通知数量失败')
    }
  }
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const navItems = [
    { path: '/', icon: <Home size={24} />, label: '首页', color: 'blue' },
    { path: '/athletes', icon: <Users size={24} />, label: '运动员', color: 'purple' },
    { path: '/map', icon: <MapPin size={24} />, label: '地图', color: 'green' },
    { path: '/match', icon: <Search size={24} />, label: '匹配', color: 'orange' },
    { path: '/social', icon: <MessageCircle size={24} />, label: '社交', color: 'pink' },
    { path: '/create-activity', icon: <Activity size={24} />, label: '创建活动', color: 'red' }
  ]
  
  return (
    <Box 
      minH="100vh" 
      position="relative"
      display="flex"
      flexDirection="column"
    >
      {/* 顶部装饰元素 */}
      <Box position="absolute" top="0" left="0" right="0" zIndex="1" opacity="0.3">
        <Flex justify="space-around" paddingTop="1rem">
          <Sparkles size={30} color="accent.500" />
          <Heart size={25} color="danger.500" />
          <Star size={28} color="accent.500" />
          <Zap size={30} color="secondary.500" />
          <Cloud size={30} color="secondary.400" />
        </Flex>
      </Box>
      
      {/* 导航栏 */}
      <Flex 
        as="nav" 
        bg="transparent"
        color="primary.800"
        align="center" 
        justify="space-between"
        padding="1.5rem 2rem"
        boxShadow="none"
        position="sticky"
        top="0"
        zIndex="100"
        backdropFilter="blur(20px)"
        transition="all 0.3s ease"
        borderBottom="4px solid"
        borderBottomColor="primary.400"
      >
        <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
          <Box 
            fontSize="3xl" 
            fontWeight="bold"
            bgGradient="linear(to-r, primary.500, secondary.500, accent.500)"
            bgClip="text"
            _hover={{ transform: 'scale(1.15) rotate(3deg)' }}
            transition="all 0.3s ease"
            display="flex"
            alignItems="center"
            gap="0.8rem"
          >
            <Sparkles size={32} color="accent.500" />
            动联
            <Heart size={24} color="danger.500" />
          </Box>
        </Link>
        
        {/* 桌面导航 */}
        <HStack spacing="8" display={{ base: 'none', md: 'flex' }}>
          {navItems.map((item) => (
            <Tooltip key={item.path} label={item.label} placement="bottom" hasArrow>
              <Link 
                as={RouterLink} 
                to={item.path} 
                _hover={{ textDecoration: 'none' }}
              >
                <Box 
                  p="1rem"
                  borderRadius="25px"
                  _hover={{ 
                    bg: `${item.color}.200`,
                    color: `${item.color}.600`,
                    transform: 'scale(1.2) rotate(5deg)',
                    boxShadow: `0 6px 16px rgba(${item.color === 'blue' ? '59, 130, 246' : item.color === 'green' ? '16, 185, 129' : item.color === 'purple' ? '139, 92, 246' : item.color === 'orange' ? '245, 158, 11' : item.color === 'pink' ? '236, 72, 153' : item.color === 'red' ? '239, 68, 68' : '59, 130, 246'}, 0.4), 0 0 30px rgba(${item.color === 'blue' ? '59, 130, 246' : item.color === 'green' ? '16, 185, 129' : item.color === 'purple' ? '139, 92, 246' : item.color === 'orange' ? '245, 158, 11' : item.color === 'pink' ? '236, 72, 153' : item.color === 'red' ? '239, 68, 68' : '59, 130, 246'}, 0.2)`
                  }}
                  transition="all 0.3s ease"
                  color={location.pathname === item.path ? `${item.color}.600` : color}
                  bg={location.pathname === item.path ? `${item.color}.100` : 'transparent'}
                  border="3px solid"
                  borderColor={location.pathname === item.path ? `${item.color}.400` : 'transparent'}
                >
                  {item.icon}
                </Box>
              </Link>
            </Tooltip>
          ))}
          
          {isAuthenticated ? (
            <>
              <Tooltip label="通知中心" placement="bottom" hasArrow>
                <Link 
                  as={RouterLink} 
                  to="/notifications" 
                  _hover={{ textDecoration: 'none' }}
                  position="relative"
                >
                  <Box 
                    p="1rem"
                    borderRadius="25px"
                    _hover={{ 
                      bg: "orange.200",
                      color: "orange.600",
                      transform: 'scale(1.2) rotate(5deg)',
                      boxShadow: '0 6px 16px rgba(249, 115, 22, 0.4), 0 0 30px rgba(249, 115, 22, 0.2)'
                    }}
                    transition="all 0.3s ease"
                    color={location.pathname === '/notifications' ? "orange.600" : color}
                    bg={location.pathname === '/notifications' ? "orange.100" : 'transparent'}
                    border="3px solid"
                    borderColor={location.pathname === '/notifications' ? "orange.400" : 'transparent'}
                  >
                    <Bell size={24} />
                    {unreadCount > 0 && (
                      <Badge
                        position="absolute"
                        top="-1"
                        right="-1"
                        colorScheme="red"
                        borderRadius="full"
                        minW="20px"
                        h="20px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Box>
                </Link>
              </Tooltip>
              <Tooltip label="个人中心" placement="bottom" hasArrow>
                <Link 
                  as={RouterLink} 
                  to={`/profile/${user?.id}`} 
                  _hover={{ textDecoration: 'none' }}
                >
                  <Box 
                    p="1rem"
                    borderRadius="25px"
                    _hover={{ 
                      bg: "anime.blue.200",
                      color: "anime.blue.600",
                      transform: 'scale(1.2) rotate(-5deg)',
                      boxShadow: '0 6px 16px rgba(112, 161, 255, 0.4), 0 0 30px rgba(112, 161, 255, 0.2)'
                    }}
                    transition="all 0.3s ease"
                    color={location.pathname.includes('/profile') ? "anime.blue.600" : color}
                    bg={location.pathname.includes('/profile') ? "anime.blue.100" : 'transparent'}
                    border="3px solid"
                    borderColor={location.pathname.includes('/profile') ? "anime.blue.400" : 'transparent'}
                  >
                    <User size={28} />
                  </Box>
                </Link>
              </Tooltip>
              <Button 
                leftIcon={<LogOut size={20} />}
                variant="solid"
                colorScheme="danger"
                onClick={handleLogout}
                _hover={{ 
                  bg: "danger.600",
                  color: "white",
                  transform: 'scale(1.15) rotate(3deg)',
                  boxShadow: '0 6px 16px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.3)'
                }}
                transition="all 0.3s ease"
                borderRadius="25px"
                px={8}
                fontWeight="bold"
                fontSize="1rem"
              >
                登出
              </Button>
            </>
          ) : (
            <Button 
              as={RouterLink} 
              to="/login"
              colorScheme="primary"
              variant="solid"
              _hover={{ 
                transform: 'scale(1.15) rotate(-3deg)',
                boxShadow: '0 8px 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)'
              }}
              transition="all 0.3s ease"
              borderRadius="25px"
              px={8}
              fontWeight="bold"
              fontSize="1rem"
              leftIcon={<Star size={20} />}
            >
              登录
            </Button>
          )}
        </HStack>
        
        {/* 移动端菜单按钮 */}
        <IconButton
          icon={isOpen ? <X size={28} /> : <MenuIcon size={28} />}
          variant="ghost"
          display={{ base: 'flex', md: 'none' }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "关闭菜单" : "打开菜单"}
          color={color}
          _hover={{ transform: 'scale(1.15) rotate(10deg)' }}
          transition="all 0.3s ease"
        />
      </Flex>
      
      {/* 移动端导航菜单 */}
      {isOpen && (
        <Flex
          direction="column"
          bg="transparent"
          color="primary.800"
          padding="1.5rem 2rem"
          boxShadow="none"
          display={{ base: 'flex', md: 'none' }}
          position="sticky"
          top="90px"
          zIndex="99"
          backdropFilter="blur(15px)"
          borderBottom="3px solid"
          borderBottomColor="primary.400"
        >
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              as={RouterLink} 
              to={item.path} 
              padding="1.2rem"
              borderBottom="2px solid" 
              borderColor="primary.200"
              _hover={{ 
                color: `${item.color}.600`,
                bg: `${item.color}.100`,
                transform: 'translateX(10px)'
              }}
              transition="all 0.3s ease"
              onClick={() => setIsOpen(false)}
            >
              <HStack spacing="1.5rem">
                <Box 
                  p="0.5rem"
                  borderRadius="15px"
                  bg={`${item.color}.100`}
                  color={`${item.color}.600`}
                >
                  {item.icon}
                </Box>
                <ChakraText fontSize="1.1rem" fontWeight="bold">{item.label}</ChakraText>
                {location.pathname === item.path && (
                  <Badge colorScheme={item.color} size="sm" borderRadius="10px" px={3}>
                    当前
                  </Badge>
                )}
              </HStack>
            </Link>
          ))}
          <Divider marginY="1.5rem" borderColor="primary.300" />
          {isAuthenticated ? (
            <>
              <Link 
                as={RouterLink} 
                to={`/profile/${user?.id}`} 
                padding="1.2rem"
                _hover={{ 
                  color: "anime.blue.600",
                  bg: "anime.blue.100",
                  transform: 'translateX(10px)'
                }}
                transition="all 0.3s ease"
                onClick={() => setIsOpen(false)}
              >
                <HStack spacing="1.5rem">
                  <Box 
                    p="0.5rem"
                    borderRadius="15px"
                    bg="anime.blue.100"
                    color="anime.blue.600"
                  >
                    <User size={24} />
                  </Box>
                  <ChakraText fontSize="1.1rem" fontWeight="bold">个人中心</ChakraText>
                  {location.pathname.includes('/profile') && (
                    <Badge colorScheme="blue" size="sm" borderRadius="10px" px={3}>
                      当前
                    </Badge>
                  )}
                </HStack>
              </Link>
              <Button 
                leftIcon={<LogOut size={20} />}
                variant="ghost"
                onClick={handleLogout}
                padding="1.2rem"
                _hover={{ 
                  color: "danger.600",
                  bg: "danger.100",
                  transform: 'translateX(10px)'
                }}
                transition="all 0.3s ease"
                fontSize="1.1rem"
                fontWeight="bold"
              >
                登出
              </Button>
            </>
          ) : (
            <Button 
              as={RouterLink} 
              to="/login"
              colorScheme="primary"
              variant="solid"
              _hover={{ 
                transform: 'scale(1.05)'
              }}
              transition="all 0.3s ease"
              borderRadius="25px"
              px={8}
              py={6}
              fontSize="1.1rem"
              fontWeight="bold"
              onClick={() => setIsOpen(false)}
              leftIcon={<Star size={20} />}
            >
              登录
            </Button>
          )}
        </Flex>
      )}
      
      {/* 主内容 */}
      <Container maxW="container.xl" flex="1" padding="3rem 1.5rem" position="relative" zIndex="10">
        <Box 
          bg="transparent"
          backdropFilter="blur(10px)"
          borderRadius="30px"
          padding="3rem"
          boxShadow="none"
          border="3px solid"
          borderColor="primary.300"
        >
          <Outlet />
        </Box>
      </Container>
      
      {/* 页脚 */}
      <Box 
        as="footer" 
        bg="transparent"
        color="primary.800"
        padding="4rem 2rem"
        marginTop="auto"
        backdropFilter="blur(15px)"
        borderTop="4px solid"
        borderColor="primary.400"
        boxShadow="none"
      >
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          marginBottom="3rem"
        >
          <Box 
            fontSize="2.5xl" 
            fontWeight="bold"
            bgGradient="linear(to-r, primary.500, secondary.500, accent.500)"
            bgClip="text"
            marginBottom={{ base: '1.5rem', md: '0' }}
            display="flex"
            alignItems="center"
            gap="0.5rem"
          >
            <Sparkles size={28} color="accent.500" />
            动联
            <Heart size={20} color="danger.500" />
          </Box>
          <HStack spacing="6" marginBottom={{ base: '1.5rem', md: '0' }}>
            <Link as={RouterLink} to="/" _hover={{ color: 'primary.500', transform: 'scale(1.1)' }} transition="all 0.3s ease" fontWeight="bold">首页</Link>
            <Link as={RouterLink} to="/athletes" _hover={{ color: 'anime.purple', transform: 'scale(1.1)' }} transition="all 0.3s ease" fontWeight="bold">运动员</Link>
            <Link as={RouterLink} to="/social" _hover={{ color: 'anime.pink', transform: 'scale(1.1)' }} transition="all 0.3s ease" fontWeight="bold">社交</Link>
          </HStack>
        </Flex>
        <Divider marginBottom="3rem" borderColor="primary.300" />
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
        >
          <Box fontSize="sm" color="primary.700" fontWeight="medium">
            © 2024 动联科技 - 让运动更简单
          </Box>
          <HStack spacing="6">
            <Link href="#" _hover={{ color: 'primary.500', transform: 'scale(1.1)' }} transition="all 0.3s ease" fontWeight="medium">关于我们</Link>
            <Link href="#" _hover={{ color: 'primary.500', transform: 'scale(1.1)' }} transition="all 0.3s ease" fontWeight="medium">隐私政策</Link>
            <Link href="#" _hover={{ color: 'primary.500', transform: 'scale(1.1)' }} transition="all 0.3s ease" fontWeight="medium">服务条款</Link>
          </HStack>
        </Flex>
      </Box>
      
      {/* 底部装饰元素 */}
      <Box position="absolute" bottom="0" left="0" right="0" zIndex="1" opacity="0.3">
        <Flex justify="space-around" paddingBottom="1rem">
          <Music size={30} color="anime.pink" />
          <Gamepad size={28} color="anime.blue" />
          <Sun size={30} color="accent.500" />
          <Moon size={25} color="anime.purple" />
          <Sparkles size={28} color="secondary.500" />
        </Flex>
      </Box>
    </Box>
  )
}

export default Layout
