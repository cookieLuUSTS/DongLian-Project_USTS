import { Box, Heading, Text, Button, VStack, HStack, Tag, Card, CardBody, Avatar, useToast, Input } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { MapPin, Clock, Users } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { activityApi } from '../services/api'
import socketService from '../services/socket'

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [activity, setActivity] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  
  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await activityApi.getById(id || '1')
        setActivity(response.data)
      } catch (error: any) {
        console.error('获取活动详情失败:', error)
        // 使用模拟数据
        setActivity({
          id: id || '1',
          title: '周末篮球友谊赛',
          description: '欢迎喜欢篮球的朋友一起来打球，水平不限，重在参与',
          sport: 'basketball',
          organizer: {
            id: 1,
            username: '张三',
            avatar: 'https://via.placeholder.com/50'
          },
          participants: [
            {
              id: 1,
              userId: 1,
              username: '张三',
              avatar: 'https://via.placeholder.com/50',
              status: 'accepted'
            },
            {
              id: 2,
              userId: 2,
              username: '李四',
              avatar: 'https://via.placeholder.com/50',
              status: 'accepted'
            },
            {
              id: 3,
              userId: 3,
              username: '王五',
              avatar: 'https://via.placeholder.com/50',
              status: 'pending'
            }
          ],
          location: '中央公园篮球场',
          startTime: '2024-01-20 14:00',
          endTime: '2024-01-20 16:00',
          maxParticipants: 10,
          level: 'intermediate',
          status: 'active'
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchActivityDetail()
  }, [id])
  
  useEffect(() => {
    // 连接Socket.io
    socketService.connect()
    
    // 加入活动聊天室
    if (id) {
      socketService.joinActivity(id)
    }
    
    // 监听消息
    socketService.onMessage((data) => {
      setMessages(prev => [...prev, data])
    })
    
    // 初始化消息
    setMessages([
      {
        username: '张三',
        message: '大家几点到？',
        timestamp: new Date().toISOString()
      },
      {
        username: '李四',
        message: '我13:30到',
        timestamp: new Date().toISOString()
      }
    ])
    
    return () => {
      // 离开活动聊天室
      if (id) {
        socketService.leaveActivity(id)
      }
      // 断开连接
      socketService.disconnect()
    }
  }, [id])
  
  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const handleJoinActivity = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      toast({
        title: '请先登录',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }
    
    setIsJoining(true)
    try {
      await activityApi.join(id || '1', { userId })
      toast({
        title: '申请加入成功',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      // 刷新活动详情
      const response = await activityApi.getById(id || '1')
      setActivity(response.data)
    } catch (error: any) {
      toast({
        title: '加入失败',
        description: error.response?.data?.message || '请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsJoining(false)
    }
  }
  
  const handleSendMessage = () => {
    const userId = localStorage.getItem('userId')
    const username = localStorage.getItem('username') || '用户'
    
    if (!userId || !message.trim()) {
      return
    }
    
    if (id) {
      socketService.sendMessage(id, message, userId, username)
      setMessage('')
    }
  }
  
  if (isLoading) {
    return <Box>加载中...</Box>
  }
  
  if (!activity) {
    return <Box>活动不存在</Box>
  }
  
  return (
    <Box>
      <Heading as="h1" size="xl" marginBottom="2rem">
        {activity.title}
      </Heading>
      
      <VStack align="start" spacing="2rem" marginBottom="3rem">
        <HStack spacing="1rem">
          <Tag colorScheme="blue">
            {activity.sport === 'basketball' ? '篮球' : activity.sport === 'badminton' ? '羽毛球' : '足球'}
          </Tag>
          <Tag colorScheme="green">
            {activity.level === 'beginner' ? '初学者' : activity.level === 'intermediate' ? '中级' : '高级'}
          </Tag>
        </HStack>
        
        <Text>{activity.description}</Text>
        
        <VStack align="start" spacing="1rem">
          <HStack spacing="0.5rem">
            <MapPin size={16} />
            <Text>{activity.location}</Text>
          </HStack>
          <HStack spacing="0.5rem">
            <Clock size={16} />
            <Text>时间: {activity.startTime} - {activity.endTime}</Text>
          </HStack>
          <HStack spacing="0.5rem">
            <Users size={16} />
            <Text>人数: {activity.participants?.filter((p: any) => p.status === 'accepted').length || 0}/{activity.maxParticipants}</Text>
          </HStack>
        </VStack>
        
        <Box>
          <Heading as="h2" size="md" marginBottom="1rem">
            组织者
          </Heading>
          <HStack spacing="1rem">
            <Avatar size="sm" src={activity.organizer?.avatar || 'https://via.placeholder.com/50'} />
            <Text>{activity.organizer?.username || '未知'}</Text>
          </HStack>
        </Box>
        
        <Button colorScheme="blue" size="lg" onClick={handleJoinActivity} isLoading={isJoining}>
          加入活动
        </Button>
      </VStack>
      
      <Box>
        <Heading as="h2" size="md" marginBottom="1rem">
          参与者
        </Heading>
        <HStack spacing="1rem" flexWrap="wrap">
          {activity.participants?.map((participant: any) => (
            <Card key={participant.id || participant.userId} boxShadow="sm" padding="1rem">
              <VStack align="center" spacing="0.5rem">
                <Avatar size="sm" src={participant.avatar || 'https://via.placeholder.com/50'} />
                <Text fontSize="sm">{participant.username}</Text>
                <Tag size="sm" colorScheme={participant.status === 'accepted' ? 'green' : 'orange'}>
                  {participant.status === 'accepted' ? '已确认' : '待确认'}
                </Tag>
              </VStack>
            </Card>
          ))}
        </HStack>
      </Box>
      
      <Box marginTop="3rem">
        <Heading as="h2" size="md" marginBottom="1rem">
          聊天
        </Heading>
        <Card boxShadow="sm" height="400px" display="flex" flexDirection="column">
          <CardBody flex="1" overflowY="auto" paddingBottom="0">
            <VStack align="stretch" spacing="1rem">
              {messages.map((msg, index) => (
                <HStack key={index} spacing="1rem">
                  <Avatar size="sm" src="https://via.placeholder.com/50" />
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium">{msg.username}</Text>
                    <Text fontSize="sm">{msg.message}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Text>
                  </Box>
                </HStack>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          </CardBody>
          <Box padding="1rem" borderTop="1px solid" borderColor="gray.200">
            <HStack spacing="1rem">
              <Input 
                placeholder="输入消息..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button colorScheme="blue" size="sm" onClick={handleSendMessage}>
                发送
              </Button>
            </HStack>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

export default ActivityDetail
