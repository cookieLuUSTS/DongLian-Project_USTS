import { Box, Heading, Button, VStack, HStack, Input, Card, CardBody, CardHeader, Divider, Text, useToast } from '@chakra-ui/react'
import { useState } from 'react'

interface User {
  id: number;
  username: string;
  basketballPoints: number;
  runningPoints: number;
  footballPoints: number;
  badmintonPoints: number;
  [key: string]: number | string;
}

const MatchPage = () => {
  const [username, setUsername] = useState('测试人员')
  const [basketballPoints, setBasketballPoints] = useState('2000')
  const [runningPoints, setRunningPoints] = useState('2000')
  const [footballPoints, setFootballPoints] = useState('2000')
  const [badmintonPoints, setBadmintonPoints] = useState('2000')
  const [activeSport, setActiveSport] = useState('')
  const [showOptions, setShowOptions] = useState({
    basketball: false,
    running: false,
    football: false,
    badminton: false
  })
  const [matchedUsers, setMatchedUsers] = useState<User[]>([])
  const [showMatchResult, setShowMatchResult] = useState(false)
  const [showChatRoom, setShowChatRoom] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{type: string; username?: string; content: string}[]>([])
  const [currentMatchCount, setCurrentMatchCount] = useState(6)
  const [currentSportType, setCurrentSportType] = useState('')
  const toast = useToast()

  // 生成随机用户名
  const generateUsername = () => {
    const prefixes = ['User', 'Player', 'Gamer', 'Member']
    const suffix = Math.floor(Math.random() * 1000)
    return prefixes[Math.floor(Math.random() * prefixes.length)] + suffix
  }

  // 生成随机积分（100-5000）
  const generatePoints = () => {
    return Math.floor(Math.random() * 4901) + 100
  }

  // 生成1000个虚拟用户
  const userPool = (() => {
    const pool: User[] = []
    for (let i = 0; i < 1000; i++) {
      pool.push({
        id: i + 1,
        username: generateUsername(),
        basketballPoints: generatePoints(),
        runningPoints: generatePoints(),
        footballPoints: generatePoints(),
        badmintonPoints: generatePoints()
      })
    }
    return pool
  })()

  // 验证积分是否在有效范围内
  const validatePoints = (points: string, sportName: string) => {
    const numPoints = parseInt(points)
    if (isNaN(numPoints) || numPoints < 100 || numPoints > 5000) {
      toast({
        title: '输入错误',
        description: `${sportName}积分必须在100-5000之间，请重新输入！`,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return false
    }
    return true
  }

  // 获取当前用户信息
  const getCurrentUser = (): User | null => {
    // 验证篮球积分
    if (!validatePoints(basketballPoints, '篮球')) {
      return null
    }
    
    // 验证跑步积分
    if (!validatePoints(runningPoints, '跑步')) {
      return null
    }
    
    // 验证足球积分
    if (!validatePoints(footballPoints, '足球')) {
      return null
    }
    
    // 验证羽毛球积分
    if (!validatePoints(badmintonPoints, '羽毛球')) {
      return null
    }
    
    const user: User = {
      id: 0,
      username: username,
      basketballPoints: parseInt(basketballPoints),
      runningPoints: parseInt(runningPoints),
      footballPoints: parseInt(footballPoints),
      badmintonPoints: parseInt(badmintonPoints)
    }
    
    return user
  }

  // 匹配积分相近的用户
  const matchUsers = (count: number, sportType: string) => {
    // 更新当前匹配数量和运动类型
    setCurrentMatchCount(count)
    setCurrentSportType(sportType)
    
    // 获取当前用户
    const currentUser = getCurrentUser()
    
    // 如果用户信息验证失败，终止匹配
    if (!currentUser) {
      return
    }
    
    // 根据运动类型选择相应的积分属性
    let pointsProperty: string
    switch (sportType) {
      case 'basketball':
        pointsProperty = 'basketballPoints'
        break
      case 'running':
        pointsProperty = 'runningPoints'
        break
      case 'football':
        pointsProperty = 'footballPoints'
        break
      case 'badminton':
        pointsProperty = 'badmintonPoints'
        break
      default:
        pointsProperty = 'basketballPoints'
    }
    
    // 复制用户池并按相应积分排序
    const sortedUsers = [...userPool].sort((a, b) => {
      const aPoints = a[pointsProperty] as number;
      const bPoints = b[pointsProperty] as number;
      return aPoints - bPoints;
    })
    
    // 找到与当前用户积分相近的位置
    let targetIndex = sortedUsers.findIndex(user => {
      const userPoints = user[pointsProperty] as number;
      const currentUserPoints = currentUser[pointsProperty] as number;
      return userPoints >= currentUserPoints;
    })
    if (targetIndex === -1) targetIndex = sortedUsers.length - 1
    
    // 计算需要匹配的其他用户数量
    const otherUsersCount = count - 1
    
    // 确保有足够的用户
    let startIndex = Math.max(0, targetIndex - Math.floor(otherUsersCount / 2))
    if (startIndex + otherUsersCount > sortedUsers.length) {
      startIndex = sortedUsers.length - otherUsersCount
    }
    
    // 加入随机性，确保每次匹配都不同
    const randomOffset = Math.floor(Math.random() * 5) - 2 // -2, -1, 0, 1, 2
    startIndex = Math.max(0, Math.min(startIndex + randomOffset, sortedUsers.length - otherUsersCount))
    
    // 选择连续的用户（积分相近）
    const otherUsers = sortedUsers.slice(startIndex, startIndex + otherUsersCount)
    
    // 将当前用户与其他用户组合
    const matched = [currentUser, ...otherUsers]
    
    // 按相应积分排序
    matched.sort((a, b) => {
      const aPoints = a[pointsProperty] as number;
      const bPoints = b[pointsProperty] as number;
      return aPoints - bPoints;
    })
    
    setMatchedUsers(matched)
    setShowMatchResult(true)
  }

  // 进入聊天室
  const enterChatRoom = () => {
    // 验证用户信息
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return
    }
    
    setShowChatRoom(true)
    setMessages([])
    
    // 显示进入聊天室的消息
    setMessages(prev => [...prev, {
      type: 'system',
      content: '匹配成功！您已进入聊天室。'
    }])
    
    // 其他用户发送欢迎消息
    const otherUsers = matchedUsers.filter(user => user.username !== currentUser.username)
    
    if (otherUsers.length > 0) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'user',
          username: otherUsers[0].username,
          content: '大家好！很高兴认识大家！'
        }])
      }, 1000)
      
      if (otherUsers.length > 1) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'user',
            username: otherUsers[1].username,
            content: '准备好一起运动了吗？'
          }])
        }, 2000)
      }
    }
  }

  // 退出聊天室
  const exitChatRoom = () => {
    setShowChatRoom(false)
    setMessages([])
  }

  // 生成随机回复
  const generateReply = () => {
    const replies = [
      '好的！',
      '没问题！',
      '我同意',
      '听起来不错',
      '加油！',
      '一起努力！',
      '好主意',
      '是的',
      '太棒了',
      '我准备好了'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }

  // 发送消息
  const sendMessage = () => {
    if (message.trim()) {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        return
      }
      
      setMessages(prev => [...prev, {
        type: 'own',
        username: currentUser.username,
        content: message
      }])
      
      // 清空输入框
      setMessage('')
      
      // 模拟其他用户回复
      const otherUsers = matchedUsers.filter(user => user.username !== currentUser.username)
      
      if (otherUsers.length > 0) {
        setTimeout(() => {
          const randomUserIndex = Math.floor(Math.random() * otherUsers.length)
          setMessages(prev => [...prev, {
            type: 'user',
            username: otherUsers[randomUserIndex].username,
            content: generateReply()
          }])
        }, 1000 + Math.random() * 2000)
      }
    }
  }

  // 重新匹配
  const rematch = () => {
    matchUsers(currentMatchCount, currentSportType)
  }

  // 选择运动类型
  const selectSport = (sport: string) => {
    setActiveSport(sport)
    setShowOptions({
      basketball: sport === 'basketball',
      running: sport === 'running',
      football: sport === 'football',
      badminton: sport === 'badminton'
    })
  }

  return (
    <Box maxWidth="800px" margin="0 auto" padding="2rem">
      <Heading as="h1" size="lg" marginBottom="2rem" textAlign="center">
        运动匹配系统
      </Heading>

      {/* 用户信息 */}
      <Card mb="2rem" boxShadow="md">
        <CardHeader>
          <Heading as="h2" size="md">用户信息</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing="1rem" align="stretch">
            <HStack>
              <Text width="120px">用户名:</Text>
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="请输入用户名"
              />
            </HStack>
            <HStack>
              <Text width="120px">篮球积分:</Text>
              <Input 
                type="number" 
                value={basketballPoints} 
                onChange={(e) => setBasketballPoints(e.target.value)} 
                placeholder="100-5000"
              />
            </HStack>
            <HStack>
              <Text width="120px">跑步积分:</Text>
              <Input 
                type="number" 
                value={runningPoints} 
                onChange={(e) => setRunningPoints(e.target.value)} 
                placeholder="100-5000"
              />
            </HStack>
            <HStack>
              <Text width="120px">足球积分:</Text>
              <Input 
                type="number" 
                value={footballPoints} 
                onChange={(e) => setFootballPoints(e.target.value)} 
                placeholder="100-5000"
              />
            </HStack>
            <HStack>
              <Text width="120px">羽毛球积分:</Text>
              <Input 
                type="number" 
                value={badmintonPoints} 
                onChange={(e) => setBadmintonPoints(e.target.value)} 
                placeholder="100-5000"
              />
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* 运动类型选择 */}
      <Heading as="h2" size="md" marginBottom="1rem">选择运动类型</Heading>
      <HStack spacing="1rem" marginBottom="2rem" wrap="wrap">
        <Button 
          colorScheme={activeSport === 'basketball' ? 'blue' : 'gray'} 
          onClick={() => selectSport('basketball')}
        >
          篮球
        </Button>
        <Button 
          colorScheme={activeSport === 'running' ? 'green' : 'gray'} 
          onClick={() => selectSport('running')}
        >
          跑步
        </Button>
        <Button 
          colorScheme={activeSport === 'football' ? 'red' : 'gray'} 
          onClick={() => selectSport('football')}
        >
          足球
        </Button>
        <Button 
          colorScheme={activeSport === 'badminton' ? 'purple' : 'gray'} 
          onClick={() => selectSport('badminton')}
        >
          羽毛球
        </Button>
      </HStack>

      {/* 运动模式选择 */}
      {showOptions.basketball && (
        <Box marginBottom="2rem">
          <Heading as="h3" size="sm" marginBottom="1rem">篮球模式</Heading>
          <HStack spacing="1rem" wrap="wrap">
            <Button onClick={() => matchUsers(10, 'basketball')}>5VS5 (10人)</Button>
            <Button onClick={() => matchUsers(6, 'basketball')}>3VS3 (6人)</Button>
            <Button onClick={() => matchUsers(2, 'basketball')}>1VS1 (2人)</Button>
          </HStack>
        </Box>
      )}

      {showOptions.running && (
        <Box marginBottom="2rem">
          <Heading as="h3" size="sm" marginBottom="1rem">跑步模式</Heading>
          <Button onClick={() => matchUsers(Math.floor(Math.random() * 5) + 2, 'running')}>
            随机匹配 (2-6人)
          </Button>
        </Box>
      )}

      {showOptions.football && (
        <Box marginBottom="2rem">
          <Heading as="h3" size="sm" marginBottom="1rem">足球模式</Heading>
          <HStack spacing="1rem" wrap="wrap">
            <Button onClick={() => matchUsers(22, 'football')}>11VS11 (22人)</Button>
            <Button onClick={() => matchUsers(14, 'football')}>7VS7 (14人)</Button>
            <Button onClick={() => matchUsers(10, 'football')}>5VS5 (10人)</Button>
          </HStack>
        </Box>
      )}

      {showOptions.badminton && (
        <Box marginBottom="2rem">
          <Heading as="h3" size="sm" marginBottom="1rem">羽毛球模式</Heading>
          <HStack spacing="1rem" wrap="wrap">
            <Button onClick={() => matchUsers(2, 'badminton')}>单打 (2人)</Button>
            <Button onClick={() => matchUsers(4, 'badminton')}>双打 (4人)</Button>
          </HStack>
        </Box>
      )}

      {/* 匹配结果 */}
      {showMatchResult && (
        <Box marginBottom="2rem">
          <Divider marginBottom="1rem" />
          <Heading as="h2" size="md" marginBottom="1rem">匹配结果</Heading>
          <VStack spacing="1rem" align="stretch">
            {matchedUsers.map((user, index) => {
              let pointsLabel = ''
              let pointsValue = 0
              
              switch (currentSportType) {
                case 'basketball':
                  pointsLabel = '篮球积分'
                  pointsValue = user.basketballPoints
                  break
                case 'running':
                  pointsLabel = '跑步积分'
                  pointsValue = user.runningPoints
                  break
                case 'football':
                  pointsLabel = '足球积分'
                  pointsValue = user.footballPoints
                  break
                case 'badminton':
                  pointsLabel = '羽毛球积分'
                  pointsValue = user.badmintonPoints
                  break
              }
              
              return (
                <Card key={index} bg={user.username === username ? '#ffebee' : 'white'} boxShadow="md">
                  <CardBody>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">
                        {user.username} {user.username === username && '(你)'}
                      </Text>
                      <Text>{pointsLabel}: {pointsValue}</Text>
                    </HStack>
                  </CardBody>
                </Card>
              )
            })}
          </VStack>
          <HStack spacing="1rem" marginTop="1rem">
            <Button onClick={rematch}>重新匹配</Button>
            <Button colorScheme="blue" onClick={enterChatRoom}>确认匹配结果</Button>
          </HStack>
        </Box>
      )}

      {/* 聊天室 */}
      {showChatRoom && (
        <Box marginBottom="2rem">
          <Divider marginBottom="1rem" />
          <Card boxShadow="md">
            <CardHeader>
              <HStack justifyContent="space-between">
                <Heading as="h2" size="md">聊天室</Heading>
                <Button size="sm" colorScheme="red" onClick={exitChatRoom}>退出</Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <Box height="400px" border="1px solid #e2e8f0" borderRadius="md" padding="1rem" overflowY="auto" marginBottom="1rem">
                {messages.map((msg, index) => (
                  <Box key={index} marginBottom="1rem">
                    {msg.type === 'system' && (
                      <Text textAlign="center" color="gray.500">{msg.content}</Text>
                    )}
                    {msg.type === 'user' && (
                      <Box>
                        <Text fontWeight="bold">{msg.username}:</Text>
                        <Text>{msg.content}</Text>
                      </Box>
                    )}
                    {msg.type === 'own' && (
                      <Box textAlign="right">
                        <Text fontWeight="bold">{msg.username} (你):</Text>
                        <Text>{msg.content}</Text>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
              <HStack spacing="1rem">
                <Input 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="输入消息..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage}>发送</Button>
              </HStack>
            </CardBody>
          </Card>
        </Box>
      )}
    </Box>
  )
}

export default MatchPage