import { useState, useEffect } from 'react'
import { Box, VStack, HStack, Text, Badge, Card, CardBody, Avatar, Spinner, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, Input, IconButton, useToast } from '@chakra-ui/react'
import { Bell, MessageCircle, UserPlus, Check, Send, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { notificationApi, messageApi, userApi } from '../services/api'

interface Notification {
  _id: string
  type: string
  title: string
  content: string
  data: any
  isRead: boolean
  createdAt: string
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  const toast = useToast()
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  
  useEffect(() => {
    if (userId) {
      fetchNotifications()
    }
  }, [userId])
  
  const fetchNotifications = async () => {
    if (!userId) return
    
    setIsLoading(true)
    try {
      const response = await notificationApi.getNotifications(userId)
      setNotifications(response.data || [])
    } catch (error: any) {
      toast({
        title: '获取通知失败',
        status: 'error',
        duration: 3000
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await notificationApi.markAsRead(notification._id)
        setNotifications(prev => prev.map(n => 
          n._id === notification._id ? { ...n, isRead: true } : n
        ))
      } catch (error) {
        console.error('标记已读失败')
      }
    }
    
    if (notification.type === 'join') {
      navigate(`/activity/${notification.data?.activityId}`)
    } else if (notification.type === 'message') {
      setSelectedNotification(notification)
      setShowMessageModal(true)
      fetchMessages(notification.data?.activityId, notification.data?.senderId)
    }
  }
  
  const fetchMessages = async (activityId: string, otherUserId: string) => {
    if (!userId || !activityId || !otherUserId) return
    
    try {
      const response = await messageApi.getMessages(activityId, userId, otherUserId)
      setMessages(response.data || [])
    } catch (error) {
      console.error('获取消息失败')
    }
  }
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedNotification) return
    
    setIsSending(true)
    try {
      await messageApi.sendMessage({
        activityId: selectedNotification.data?.activityId,
        senderId: userId,
        receiverId: selectedNotification.data?.senderId,
        content: newMessage.trim()
      })
      
      setNewMessage('')
      if (selectedNotification.data?.activityId && selectedNotification.data?.senderId) {
        fetchMessages(selectedNotification.data.activityId, selectedNotification.data.senderId)
      }
      
      toast({
        title: '消息发送成功',
        status: 'success',
        duration: 2000
      })
    } catch (error) {
      toast({
        title: '发送失败',
        status: 'error',
        duration: 3000
      })
    } finally {
      setIsSending(false)
    }
  }
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'join':
        return <UserPlus size={20} color="#3182CE" />
      case 'message':
        return <MessageCircle size={20} color="#38A169" />
      default:
        return <Bell size={20} color="#718096" />
    }
  }
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'join':
        return 'blue'
      case 'message':
        return 'green'
      default:
        return 'gray'
    }
  }
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return date.toLocaleDateString()
  }
  
  if (isLoading) {
    return (
      <Box p="8" textAlign="center">
        <Spinner size="lg" />
        <Text mt="4" color="gray.500">加载中...</Text>
      </Box>
    )
  }
  
  return (
    <Box maxW="600px" margin="0 auto" padding="2rem">
      <HStack justify="space-between" mb="6">
        <Text fontSize="2xl" fontWeight="bold">通知中心</Text>
        <Badge colorScheme="blue">
          {notifications.filter(n => !n.isRead).length} 条未读
        </Badge>
      </HStack>
      
      {notifications.length > 0 ? (
        <VStack spacing="3" align="stretch">
          {notifications.map(notification => (
            <Card
              key={notification._id}
              cursor="pointer"
              onClick={() => handleNotificationClick(notification)}
              bg={notification.isRead ? 'white' : 'blue.50'}
              borderLeft={notification.isRead ? 'none' : '4px solid'}
              borderLeftColor={`${getNotificationColor(notification.type)}.500`}
              _hover={{ boxShadow: 'md' }}
              transition="all 0.2s"
            >
              <CardBody>
                <HStack spacing="3">
                  <Box
                    p="2"
                    borderRadius="full"
                    bg={`${getNotificationColor(notification.type)}.100`}
                  >
                    {getNotificationIcon(notification.type)}
                  </Box>
                  <Box flex="1">
                    <HStack justify="space-between">
                      <Text fontWeight="600">{notification.title}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatTime(notification.createdAt)}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" mt="1">
                      {notification.content}
                    </Text>
                    {!notification.isRead && (
                      <Badge colorScheme="red" fontSize="xs" mt="2">未读</Badge>
                    )}
                  </Box>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      ) : (
        <Box textAlign="center" py="12">
          <Bell size={48} color="#CBD5E0" />
          <Text color="gray.500" mt="4">暂无通知</Text>
        </Box>
      )}
      
      <Modal isOpen={showMessageModal} onClose={() => setShowMessageModal(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>消息对话</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="3" maxH="400px" overflowY="auto">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <Box
                    key={msg._id || index}
                    w="100%"
                    display="flex"
                    justifyContent={msg.senderId === userId ? 'flex-end' : 'flex-start'}
                  >
                    <Box
                      maxW="70%"
                      p="3"
                      borderRadius="lg"
                      bg={msg.senderId === userId ? 'blue.500' : 'gray.100'}
                      color={msg.senderId === userId ? 'white' : 'black'}
                    >
                      <Text fontSize="sm">{msg.content}</Text>
                      <Text fontSize="xs" color={msg.senderId === userId ? 'blue.200' : 'gray.500'} mt="1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </Box>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">暂无消息记录</Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack w="100%">
              <Input
                flex="1"
                placeholder="输入消息..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <IconButton
                aria-label="发送"
                icon={<Send size={18} />}
                colorScheme="blue"
                onClick={handleSendMessage}
                isLoading={isSending}
                isDisabled={!newMessage.trim()}
              />
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Notifications
