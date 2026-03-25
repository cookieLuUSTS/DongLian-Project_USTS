import { Box, Heading, Avatar, Text, Button, VStack, HStack, Tag, Card, CardBody, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, FormControl, FormLabel, Input, Select, Textarea, IconButton, Badge, useDisclosure } from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Star, Calendar, Clock, Users, Edit, Trash2, Plus, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { userApi, activityApi } from '../services/api'

declare global {
  interface Window {
    AMap: any
  }
}

const Profile = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [myActivities, setMyActivities] = useState<any[]>([])
  const [joinedActivities, setJoinedActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingActivity, setEditingActivity] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [tempCoordinates, setTempCoordinates] = useState<{lng: number, lat: number} | null>(null)
  const [tempLocationName, setTempLocationName] = useState('')
  const [tempMarker, setTempMarker] = useState<any>(null)
  const toast = useToast()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  
  const currentUserId = localStorage.getItem('userId')
  const isOwnProfile = currentUserId === id
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userApi.getProfile(id || '')
        setUser(response.data)
        
        const activitiesRes = await activityApi.getAll()
        const allActivities = activitiesRes.data || []
        
        const created = allActivities.filter((a: any) => a.organizer?._id === id || a.organizer === id)
        setMyActivities(created)
        
        const joined = allActivities.filter((a: any) => 
          a.participants?.some((p: any) => p.userId?._id === id || p.userId === id)
        )
        setJoinedActivities(joined)
      } catch (error: any) {
        toast({
          title: '获取个人信息失败',
          description: error.response?.data?.message || '请稍后重试',
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchUserProfile()
    }
  }, [id, toast])
  
  const initMap = () => {
    if (!mapRef.current || !window.AMap) return
    
    const AMap = window.AMap
    const coords = editingActivity?.location?.coordinates || [116.4074, 39.9042]
    
    const mapInstance = new AMap.Map(mapRef.current, {
      zoom: 14,
      center: coords
    })
    
    if (editingActivity?.location?.coordinates) {
      const marker = new AMap.Marker({
        position: coords,
        map: mapInstance
      })
      setTempMarker(marker)
      setTempCoordinates({ lng: coords[0], lat: coords[1] })
      setTempLocationName(editingActivity.locationName || '')
    }
    
    mapInstance.on('click', async (e: any) => {
      const lng = e.lnglat.getLng()
      const lat = e.lnglat.getLat()
      
      if (tempMarker) {
        tempMarker.setMap(null)
      }
      
      const marker = new AMap.Marker({
        position: [lng, lat],
        map: mapInstance
      })
      setTempMarker(marker)
      setTempCoordinates({ lng, lat })
      
      AMap.plugin('AMap.Geocoder', function() {
        const geocoder = new AMap.Geocoder()
        geocoder.getAddress([lng, lat], function(status: string, result: any) {
          if (status === 'complete' && result.regeocode) {
            setTempLocationName(result.regeocode.formattedAddress)
          }
        })
      })
    })
  }
  
  useEffect(() => {
    if (showMapModal) {
      setTimeout(initMap, 100)
    }
  }, [showMapModal])
  
  const handleConfirmLocation = () => {
    if (tempCoordinates && editingActivity) {
      setEditingActivity({
        ...editingActivity,
        location: {
          type: 'Point',
          coordinates: [tempCoordinates.lng, tempCoordinates.lat]
        },
        locationName: tempLocationName
      })
      setShowMapModal(false)
    }
  }
  
  const handleEditActivity = (activity: any) => {
    setEditingActivity({
      ...activity,
      startTime: activity.startTime?.slice(0, 16) || '',
      endTime: activity.endTime?.slice(0, 16) || ''
    })
    setTempCoordinates(null)
    setTempLocationName('')
    onEditOpen()
  }
  
  const getMinEndTime = () => {
    if (!editingActivity?.startTime) return ''
    const start = new Date(editingActivity.startTime)
    start.setMinutes(start.getMinutes() + 30)
    return start.toISOString().slice(0, 16)
  }
  
  const handleUpdateActivity = async () => {
    if (!editingActivity) return
    
    setIsUpdating(true)
    try {
      const updateData: any = {
        title: editingActivity.title,
        description: editingActivity.description,
        sport: editingActivity.sport,
        startTime: editingActivity.startTime,
        endTime: editingActivity.endTime,
        maxParticipants: editingActivity.maxParticipants,
        level: editingActivity.level,
        status: editingActivity.status
      }
      
      if (editingActivity.location?.coordinates) {
        updateData.location = editingActivity.location
      }
      
      await activityApi.update(editingActivity._id, updateData)
      
      toast({
        title: '活动更新成功',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      
      setMyActivities(prev => prev.map(a => 
        a._id === editingActivity._id ? { ...a, ...editingActivity } : a
      ))
      
      onEditClose()
      setEditingActivity(null)
    } catch (error: any) {
      toast({
        title: '更新失败',
        description: error.response?.data?.message || '请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsUpdating(false)
    }
  }
  
  const handleDeleteActivity = async () => {
    if (!deletingActivityId) return
    
    try {
      await activityApi.delete(deletingActivityId)
      
      toast({
        title: '活动已删除',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      
      setMyActivities(prev => prev.filter(a => a._id !== deletingActivityId))
      onDeleteClose()
      setDeletingActivityId(null)
    } catch (error: any) {
      toast({
        title: '删除失败',
        description: error.response?.data?.message || '请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }
  
  const confirmDelete = (activityId: string) => {
    setDeletingActivityId(activityId)
    onDeleteOpen()
  }
  
  const getSportLabel = (sport: string) => {
    const labels: Record<string, string> = {
      basketball: '篮球',
      football: '足球',
      tennis: '网球',
      badminton: '羽毛球',
      swimming: '游泳',
      gym: '健身'
    }
    return labels[sport] || sport
  }
  
  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: '初学者',
      intermediate: '中级',
      advanced: '高级'
    }
    return labels[level] || level
  }
  
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: '进行中',
      completed: '已完成',
      cancelled: '已取消'
    }
    return labels[status] || status
  }
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'green',
      completed: 'blue',
      cancelled: 'red'
    }
    return colors[status] || 'gray'
  }
  
  if (isLoading) {
    return <Box p="8" textAlign="center">加载中...</Box>
  }
  
  if (!user) {
    return <Box p="8" textAlign="center">用户不存在</Box>
  }
  
  return (
    <Box maxW="800px" margin="0 auto" padding="2rem">
      <VStack align="center" spacing="1.5rem" marginBottom="2rem">
        <Avatar size="2xl" src={user.avatar} />
        <Heading as="h1" size="lg">{user.username}</Heading>
        <Text color="gray.600">{user.bio || '这个人很懒，什么都没写~'}</Text>
        <HStack spacing="1rem">
          <Tag colorScheme="blue">
            {getLevelLabel(user.level)}
          </Tag>
          <HStack spacing="0.5rem">
            <Star size={16} color="gold" />
            <Text>{user.rating || 0}</Text>
          </HStack>
        </HStack>
        {isOwnProfile && (
          <Button colorScheme="blue" onClick={() => navigate('/create-activity')} leftIcon={<Plus size={18} />}>
            创建新活动
          </Button>
        )}
      </VStack>
      
      <Box marginBottom="2rem">
        <Heading as="h2" size="sm" marginBottom="1rem" color="gray.600">
          喜欢的运动
        </Heading>
        <HStack spacing="0.5rem" flexWrap="wrap">
          {user.sports?.length > 0 ? user.sports.map((sport: string, index: number) => (
            <Tag key={index} colorScheme="green" mb="2">
              {getSportLabel(sport)}
            </Tag>
          )) : <Text color="gray.500">暂无</Text>}
        </HStack>
      </Box>
      
      <Tabs variant="enclosed">
        <TabList>
          <Tab>我创建的活动 ({myActivities.length})</Tab>
          <Tab>我参与的活动 ({joinedActivities.length})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px="0">
            {myActivities.length > 0 ? (
              <VStack spacing="1rem" align="stretch">
                {myActivities.map(activity => (
                  <Card key={activity._id} boxShadow="sm" _hover={{ boxShadow: 'md' }} transition="all 0.2s">
                    <CardBody>
                      <HStack justify="space-between" align="start">
                        <Box flex="1" cursor="pointer" onClick={() => navigate(`/activity/${activity._id}`)}>
                          <HStack mb="2">
                            <Heading size="sm">{activity.title}</Heading>
                            <Badge colorScheme={getStatusColor(activity.status)}>
                              {getStatusLabel(activity.status)}
                            </Badge>
                          </HStack>
                          <HStack spacing="1rem" mb="2">
                            <Tag size="sm" colorScheme="blue">{getSportLabel(activity.sport)}</Tag>
                            <Tag size="sm" colorScheme="purple">{getLevelLabel(activity.level)}</Tag>
                          </HStack>
                          <VStack align="start" spacing="1" fontSize="sm" color="gray.600">
                            <HStack>
                              <MapPin size={14} />
                              <Text noOfLines={1}>
                                {activity.locationName || 
                                  (activity.location?.coordinates 
                                    ? `${activity.location.coordinates[1].toFixed(4)}, ${activity.location.coordinates[0].toFixed(4)}`
                                    : '未设置位置')}
                              </Text>
                            </HStack>
                            <HStack>
                              <Calendar size={14} />
                              <Text>{new Date(activity.startTime).toLocaleString()}</Text>
                            </HStack>
                            <HStack>
                              <Users size={14} />
                              <Text>
                                {activity.participants?.filter((p: any) => p.status === 'accepted').length || 0} / {activity.maxParticipants} 人
                              </Text>
                            </HStack>
                          </VStack>
                        </Box>
                        {isOwnProfile && (
                          <HStack>
                            <IconButton
                              aria-label="编辑"
                              icon={<Edit size={16} />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditActivity(activity)}
                            />
                            <IconButton
                              aria-label="删除"
                              icon={<Trash2 size={16} />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => confirmDelete(activity._id)}
                            />
                          </HStack>
                        )}
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500" textAlign="center" py="8">
                暂无创建的活动
              </Text>
            )}
          </TabPanel>
          <TabPanel px="0">
            {joinedActivities.length > 0 ? (
              <VStack spacing="1rem" align="stretch">
                {joinedActivities.map(activity => (
                  <Card key={activity._id} boxShadow="sm" _hover={{ boxShadow: 'md' }} transition="all 0.2s" cursor="pointer" onClick={() => navigate(`/activity/${activity._id}`)}>
                    <CardBody>
                      <HStack mb="2">
                        <Heading size="sm">{activity.title}</Heading>
                        <Badge colorScheme={getStatusColor(activity.status)}>
                          {getStatusLabel(activity.status)}
                        </Badge>
                      </HStack>
                      <HStack spacing="1rem" mb="2">
                        <Tag size="sm" colorScheme="blue">{getSportLabel(activity.sport)}</Tag>
                      </HStack>
                      <HStack spacing="1rem" fontSize="sm" color="gray.600">
                        <HStack>
                          <Calendar size={14} />
                          <Text>{new Date(activity.startTime).toLocaleString()}</Text>
                        </HStack>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500" textAlign="center" py="8">
                暂无参与的活动
              </Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>编辑活动</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingActivity && (
              <VStack spacing="1rem">
                <FormControl>
                  <FormLabel>活动标题</FormLabel>
                  <Input 
                    value={editingActivity.title} 
                    onChange={(e) => setEditingActivity({...editingActivity, title: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>活动描述</FormLabel>
                  <Textarea 
                    value={editingActivity.description}
                    onChange={(e) => setEditingActivity({...editingActivity, description: e.target.value})}
                    rows={3}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>运动类型</FormLabel>
                  <Select 
                    value={editingActivity.sport}
                    onChange={(e) => setEditingActivity({...editingActivity, sport: e.target.value})}
                  >
                    <option value="basketball">篮球</option>
                    <option value="football">足球</option>
                    <option value="tennis">网球</option>
                    <option value="badminton">羽毛球</option>
                    <option value="swimming">游泳</option>
                    <option value="gym">健身</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>活动地点</FormLabel>
                  {editingActivity.location?.coordinates ? (
                    <Box>
                      <HStack p="3" bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.200">
                        <MapPin size={20} color="#3182CE" />
                        <Text flex="1" fontSize="sm" noOfLines={2}>{editingActivity.locationName || '已选择位置'}</Text>
                        <IconButton
                          aria-label="清除位置"
                          icon={<X size={16} />}
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingActivity({...editingActivity, location: null, locationName: ''})}
                        />
                      </HStack>
                      <Button mt="2" size="sm" variant="outline" onClick={() => setShowMapModal(true)}>
                        重新选择位置
                      </Button>
                    </Box>
                  ) : (
                    <Button 
                      w="100%" 
                      leftIcon={<MapPin size={18} />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => setShowMapModal(true)}
                    >
                      在地图上选择位置
                    </Button>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>开始时间</FormLabel>
                  <Input 
                    type="datetime-local"
                    value={editingActivity.startTime}
                    onChange={(e) => setEditingActivity({...editingActivity, startTime: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>结束时间</FormLabel>
                  <Input 
                    type="datetime-local"
                    value={editingActivity.endTime}
                    onChange={(e) => setEditingActivity({...editingActivity, endTime: e.target.value})}
                    min={getMinEndTime()}
                  />
                  <Text color="gray.500" fontSize="sm" mt="1">结束时间必须晚于开始时间</Text>
                </FormControl>
                <FormControl>
                  <FormLabel>最大参与人数</FormLabel>
                  <Input 
                    type="number"
                    value={editingActivity.maxParticipants}
                    onChange={(e) => setEditingActivity({...editingActivity, maxParticipants: parseInt(e.target.value)})}
                    min="2"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>运动水平</FormLabel>
                  <Select 
                    value={editingActivity.level}
                    onChange={(e) => setEditingActivity({...editingActivity, level: e.target.value})}
                  >
                    <option value="beginner">初学者</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>活动状态</FormLabel>
                  <Select 
                    value={editingActivity.status}
                    onChange={(e) => setEditingActivity({...editingActivity, status: e.target.value})}
                  >
                    <option value="active">进行中</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                  </Select>
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr="3" onClick={onEditClose}>取消</Button>
            <Button colorScheme="blue" onClick={handleUpdateActivity} isLoading={isUpdating}>保存</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      <Modal isOpen={showMapModal} onClose={() => setShowMapModal(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>选择活动地点</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6">
            <Box mb="4">
              <Text fontSize="sm" color="gray.600">点击地图选择位置</Text>
              {tempLocationName && (
                <HStack mt="2" p="2" bg="gray.50" borderRadius="md">
                  <MapPin size={16} color="#3182CE" />
                  <Text fontSize="sm" noOfLines={2}>{tempLocationName}</Text>
                </HStack>
              )}
            </Box>
            <Box ref={mapRef} h="400px" borderRadius="md" overflow="hidden" />
            <HStack mt="4" justify="flex-end">
              <Button variant="ghost" onClick={() => setShowMapModal(false)}>取消</Button>
              <Button 
                colorScheme="blue" 
                onClick={handleConfirmLocation}
                isDisabled={!tempCoordinates}
              >
                确认位置
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>确认删除</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>确定要删除这个活动吗？此操作不可撤销。</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr="3" onClick={onDeleteClose}>取消</Button>
            <Button colorScheme="red" onClick={handleDeleteActivity}>删除</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Profile
