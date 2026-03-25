import { useState, useEffect, useRef } from 'react'
import { Box, Flex, HStack, Text, useToast, IconButton, Button, VStack, Badge, Card, CardBody, Avatar, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Select, Spinner, Alert } from '@chakra-ui/react'
import { Target, ZoomIn, ZoomOut, MapPin, Calendar, Clock, Users, Navigation } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { activityApi } from '../services/api'

declare global {
  interface Window {
    AMap: any
  }
}

const MapPage = () => {
  const [map, setMap] = useState<any>(null)
  const [userMarker, setUserMarker] = useState<any>(null)
  const [mapLoadError, setMapLoadError] = useState<string | null>(null)
  const [activityMarkers, setActivityMarkers] = useState<any[]>([])
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null)
  const [nearbyActivities, setNearbyActivities] = useState<any[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(false)
  const [selectedSport, setSelectedSport] = useState('all')
  const [selectedDistance, setSelectedDistance] = useState('10000')
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joiningActivity, setJoiningActivity] = useState<any>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const navigate = useNavigate()
  
  const sportOptions = [
    { value: 'all', label: '全部', color: 'blue' },
    { value: 'basketball', label: '篮球', color: 'orange' },
    { value: 'football', label: '足球', color: 'green' },
    { value: 'badminton', label: '羽毛球', color: 'purple' },
    { value: 'tennis', label: '网球', color: 'yellow' },
    { value: 'swimming', label: '游泳', color: 'cyan' },
    { value: 'gym', label: '健身', color: 'pink' }
  ]
  
  const distanceOptions = [
    { value: '1000', label: '1公里' },
    { value: '3000', label: '3公里' },
    { value: '5000', label: '5公里' },
    { value: '10000', label: '10公里' },
    { value: '20000', label: '20公里' }
  ]
  
  useEffect(() => {
    const checkAMapAvailability = () => {
      if (typeof window !== 'undefined' && window.AMap) {
        initMap()
        return true
      }
      return false
    }
    
    if (!checkAMapAvailability()) {
      const checkAMap = setInterval(() => {
        if (checkAMapAvailability()) {
          clearInterval(checkAMap)
        }
      }, 500)
      
      const timeout = setTimeout(() => {
        clearInterval(checkAMap)
        toast({ title: '高德地图API加载失败', status: 'error', duration: 5000 })
        setMapLoadError('高德地图API加载失败')
      }, 10000)
      
      return () => {
        clearInterval(checkAMap)
        clearTimeout(timeout)
      }
    }
  }, [toast])
  
  const initMap = () => {
    try {
      if (!mapRef.current || !window.AMap) {
        setMapLoadError('地图容器未找到')
        return
      }
      
      const AMap = window.AMap
      const mapInstance = new AMap.Map(mapRef.current, {
        zoom: 14,
        center: [120.5117, 31.2878],
        resizeEnable: true
      })
      
      setMap(mapInstance)
      setMapLoadError(null)
      
      AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], function() {
        mapInstance.addControl(new AMap.Scale())
        mapInstance.addControl(new AMap.ToolBar())
      })
      
      getCurrentLocation(mapInstance, AMap)
      
      toast({ title: '地图加载成功', status: 'success', duration: 2000 })
    } catch (error) {
      toast({ title: '地图加载失败', status: 'error', duration: 3000 })
      setMapLoadError('地图初始化失败')
    }
  }
  
  const getCurrentLocation = (mapInstance?: any, AMap?: any) => {
    const currentMap = mapInstance || map
    const currentAMap = AMap || window.AMap
    
    if (!currentMap || !currentAMap) return
    
    setIsLocating(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lng = position.coords.longitude
          const lat = position.coords.latitude
          const pos: [number, number] = [lng, lat]
          
          setCurrentPosition(pos)
          currentMap.setCenter(pos)
          currentMap.setZoom(15)
          
          if (userMarker) {
            userMarker.setMap(null)
          }
          
          const newUserMarker = new currentAMap.Marker({
            position: pos,
            map: currentMap,
            content: `
              <div style="
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: 4px solid white;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z"/>
                </svg>
              </div>
            `,
            offset: new currentAMap.Pixel(-20, -40)
          })
          
          setUserMarker(newUserMarker)
          setIsLocating(false)
          
          fetchNearbyActivities(lat, lng)
          
          toast({
            title: '已定位到您的位置',
            status: 'success',
            duration: 2000
          })
        },
        () => {
          setIsLocating(false)
          toast({
            title: '定位失败，使用默认位置',
            status: 'warning',
            duration: 2000
          })
          const defaultPos: [number, number] = [120.5117, 31.2878]
          setCurrentPosition(defaultPos)
          currentMap.setCenter(defaultPos)
          fetchNearbyActivities(defaultPos[1], defaultPos[0])
        }
      )
    } else {
      setIsLocating(false)
      toast({
        title: '浏览器不支持定位',
        status: 'warning',
        duration: 2000
      })
    }
  }
  
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
  
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}米`
    }
    return `${distance.toFixed(1)}公里`
  }
  
  const fetchNearbyActivities = async (lat: number, lng: number) => {
    setIsLoadingActivities(true)
    try {
      const params: any = {
        lat,
        lng,
        distance: selectedDistance
      }
      
      if (selectedSport !== 'all') {
        params.sport = selectedSport
      }
      
      let activities: any[] = []
      
      try {
        const response = await activityApi.getNearby(params)
        activities = response.data || []
      } catch (nearbyError) {
        const allResponse = await activityApi.getAll()
        activities = (allResponse.data || []).filter((a: any) => a.status === 'active')
      }
      
      activities = activities.map((activity: any) => {
        if (activity.location?.coordinates) {
          const activityLat = activity.location.coordinates[1]
          const activityLng = activity.location.coordinates[0]
          activity.distance = calculateDistance(lat, lng, activityLat, activityLng)
        }
        return activity
      })
      
      activities.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0))
      
      setNearbyActivities(activities)
      renderActivityMarkers(activities)
    } catch (error: any) {
      toast({
        title: '获取活动失败',
        status: 'error',
        duration: 3000
      })
    } finally {
      setIsLoadingActivities(false)
    }
  }
  
  const renderActivityMarkers = (activities: any[]) => {
    if (!map || !window.AMap) {
      console.log('地图未初始化')
      return
    }
    
    activityMarkers.forEach(marker => marker.setMap(null))
    
    const AMap = window.AMap
    const markers: any[] = []
    
    const sportColors: Record<string, string> = {
      basketball: '#FF6B00',
      football: '#00B894',
      badminton: '#9B59B6',
      tennis: '#F1C40F',
      swimming: '#00CED1',
      gym: '#E91E63'
    }
    
    console.log('渲染活动标记，活动数量:', activities.length)
    
    activities.forEach(activity => {
      if (activity.location?.coordinates) {
        const lng = activity.location.coordinates[0]
        const lat = activity.location.coordinates[1]
        const color = sportColors[activity.sport] || '#3182CE'
        
        console.log('创建标记:', activity.title, '位置:', lng, lat)
        
        const marker = new AMap.Marker({
          position: [lng, lat],
          map: map,
          content: `<div style="
            background: ${color};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
          ">${getSportEmoji(activity.sport)}</div>`
        })
        
        marker.on('click', () => {
          setSelectedActivity(activity)
          map.setCenter([lng, lat])
          map.setZoom(16)
        })
        
        markers.push(marker)
      }
    })
    
    setActivityMarkers(markers)
  }
  
  const getSportEmoji = (sport: string) => {
    const emojis: Record<string, string> = {
      basketball: '🏀',
      football: '⚽',
      badminton: '🏸',
      tennis: '🎾',
      swimming: '🏊',
      gym: '💪'
    }
    return emojis[sport] || '🏃'
  }
  
  const getSportLabel = (sport: string) => {
    const labels: Record<string, string> = {
      basketball: '篮球',
      football: '足球',
      badminton: '羽毛球',
      tennis: '网球',
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
  
  const formatLocation = (activity: any) => {
    if (activity.locationName) {
      return activity.locationName
    }
    if (activity.location?.coordinates) {
      return `${activity.location.coordinates[1].toFixed(4)}, ${activity.location.coordinates[0].toFixed(4)}`
    }
    return '未设置位置'
  }
  
  const handleJoinActivity = async () => {
    if (!joiningActivity) return
    
    const userId = localStorage.getItem('userId')
    if (!userId) {
      toast({
        title: '请先登录',
        status: 'warning',
        duration: 2000
      })
      navigate('/login')
      return
    }
    
    try {
      await activityApi.join(joiningActivity._id, { userId })
      
      toast({
        title: '报名成功！',
        description: '等待组织者确认',
        status: 'success',
        duration: 3000
      })
      
      setShowJoinModal(false)
      setJoiningActivity(null)
      
      if (currentPosition) {
        fetchNearbyActivities(currentPosition[1], currentPosition[0])
      }
    } catch (error: any) {
      toast({
        title: '报名失败',
        description: error.response?.data?.message || '请稍后重试',
        status: 'error',
        duration: 3000
      })
    }
  }
  
  useEffect(() => {
    if (currentPosition && map) {
      fetchNearbyActivities(currentPosition[1], currentPosition[0])
    }
  }, [selectedSport, selectedDistance])
  
  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      <Box flex="1" display="flex" flexDirection="row">
        <Box w="380px" bg="white" p="4" overflowY="auto" borderRight="1px solid" borderRightColor="gray.200" boxShadow="sm">
          <HStack justify="space-between" mb="4">
            <Text fontSize="xl" fontWeight="bold" color="blue.600">
              附近活动
            </Text>
            <HStack>
              <Navigation size={16} color="#3182CE" />
              <Text fontSize="sm" color="gray.500">
                {currentPosition ? '已定位' : '定位中...'}
              </Text>
            </HStack>
          </HStack>
          
          <VStack spacing="3" mb="4">
            <Box w="100%">
              <Text fontSize="sm" color="gray.600" mb="2">运动类型</Text>
              <Flex flexWrap="wrap" gap="2">
                {sportOptions.map(opt => (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={selectedSport === opt.value ? 'solid' : 'outline'}
                    colorScheme={opt.color}
                    onClick={() => setSelectedSport(opt.value)}
                    borderRadius="full"
                  >
                    {opt.label}
                  </Button>
                ))}
              </Flex>
            </Box>
            
            <Box w="100%">
              <Text fontSize="sm" color="gray.600" mb="2">搜索范围</Text>
              <Select
                value={selectedDistance}
                onChange={(e) => setSelectedDistance(e.target.value)}
                size="sm"
              >
                {distanceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </Box>
            
            <Button
              w="100%"
              colorScheme="blue"
              size="sm"
              onClick={() => currentPosition && fetchNearbyActivities(currentPosition[1], currentPosition[0])}
              isLoading={isLoadingActivities}
            >
              刷新活动
            </Button>
          </VStack>
          
          <Box mt="4">
            <Text fontSize="sm" color="gray.600" mb="2">
              找到 {nearbyActivities.length} 个活动
            </Text>
            <VStack spacing="3" align="stretch" maxH="calc(100vh - 380px)" overflowY="auto">
              {nearbyActivities.length > 0 ? (
                nearbyActivities.map(activity => (
                  <Card
                    key={activity._id}
                    size="sm"
                    cursor="pointer"
                    onClick={() => setSelectedActivity(activity)}
                    bg={selectedActivity?._id === activity._id ? 'blue.50' : 'white'}
                    borderColor={selectedActivity?._id === activity._id ? 'blue.300' : 'gray.200'}
                    borderWidth="1px"
                    _hover={{ boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <CardBody p="3">
                      <HStack justify="space-between" mb="2">
                        <HStack>
                          <Text fontSize="lg">{getSportEmoji(activity.sport)}</Text>
                          <Text fontWeight="600" fontSize="sm">{activity.title}</Text>
                        </HStack>
                        <Badge colorScheme="green">{getSportLabel(activity.sport)}</Badge>
                      </HStack>
                      
                      <VStack align="start" spacing="1" fontSize="xs" color="gray.600">
                        <HStack>
                          <MapPin size={12} />
                          <Text noOfLines={1}>{formatLocation(activity)}</Text>
                        </HStack>
                        <HStack>
                          <Calendar size={12} />
                          <Text>{new Date(activity.startTime).toLocaleDateString()}</Text>
                        </HStack>
                        <HStack>
                          <Clock size={12} />
                          <Text>
                            {new Date(activity.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                            {new Date(activity.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </Text>
                        </HStack>
                        <HStack>
                          <Users size={12} />
                          <Text>
                            {activity.participants?.filter((p: any) => p.status === 'accepted').length || 0} / {activity.maxParticipants} 人
                          </Text>
                        </HStack>
                      </VStack>
                      
                      <HStack mt="2" justify="space-between">
                        <HStack>
                          <Avatar size="xs" src={activity.organizer?.avatar} />
                          <Text fontSize="xs" color="gray.500">{activity.organizer?.username}</Text>
                        </HStack>
                        <HStack spacing="2">
                          {activity.distance !== undefined && (
                            <Badge colorScheme="blue" fontSize="xs">
                              {formatDistance(activity.distance)}
                            </Badge>
                          )}
                          <Button
                            size="xs"
                            colorScheme="blue"
                            onClick={(e) => {
                              e.stopPropagation()
                              setJoiningActivity(activity)
                              setShowJoinModal(true)
                            }}
                          >
                            报名
                          </Button>
                        </HStack>
                      </HStack>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <Text color="gray.500" textAlign="center" py="8">
                  {isLoadingActivities ? '加载中...' : '附近暂无活动'}
                </Text>
              )}
            </VStack>
          </Box>
        </Box>
        
        <Box flex="1" position="relative">
          <Box ref={mapRef} w="100%" h="100%" position="absolute" top="0" left="0">
            {mapLoadError && (
              <Box
                position="absolute"
                inset="0"
                bg="white"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                p="8"
                zIndex="2000"
              >
                <Box mb="4" fontSize="4xl">🗺️</Box>
                <Text fontSize="xl" fontWeight="bold" mb="2">地图加载失败</Text>
                <Text color="gray.600" mb="6" textAlign="center">{mapLoadError}</Text>
                <Button colorScheme="blue" onClick={initMap}>重新加载地图</Button>
              </Box>
            )}
          </Box>
          
          <Box
            position="absolute"
            bottom="24px"
            right="24px"
            zIndex="2000"
            bg="white"
            borderRadius="8px"
            boxShadow="md"
            p="8px"
            display="flex"
            flexDirection="column"
            gap="8px"
          >
            <IconButton
              icon={isLocating ? <Spinner size="sm" /> : <Target size={20} />}
              variant="solid"
              colorScheme="purple"
              aria-label="定位"
              onClick={() => getCurrentLocation()}
              size="sm"
              isLoading={isLocating}
            />
            <IconButton
              icon={<ZoomIn size={20} />}
              variant="ghost"
              aria-label="放大"
              onClick={() => map && map.zoomIn()}
              size="sm"
            />
            <IconButton
              icon={<ZoomOut size={20} />}
              variant="ghost"
              aria-label="缩小"
              onClick={() => map && map.zoomOut()}
              size="sm"
            />
          </Box>
          
          {currentPosition && (
            <Alert
              position="absolute"
              top="16px"
              left="50%"
              transform="translateX(-50%)"
              zIndex="2000"
              status="info"
              borderRadius="full"
              py="2"
              px="4"
              maxW="300px"
            >
              <Navigation size={16} />
              <Text fontSize="sm" ml="2">我的位置：已定位</Text>
            </Alert>
          )}
          
          {selectedActivity && (
            <Box
              position="absolute"
              bottom="24px"
              left="24px"
              zIndex="2000"
              bg="white"
              borderRadius="12px"
              boxShadow="lg"
              p="4"
              maxW="320px"
            >
              <HStack justify="space-between" mb="3">
                <HStack>
                  <Text fontSize="2xl">{getSportEmoji(selectedActivity.sport)}</Text>
                  <Text fontWeight="bold" fontSize="lg">{selectedActivity.title}</Text>
                </HStack>
                <IconButton
                  aria-label="关闭"
                  icon={<Text>×</Text>}
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedActivity(null)}
                />
              </HStack>
              
              <VStack align="start" spacing="2" fontSize="sm" mb="3">
                <Text color="gray.600">{selectedActivity.description}</Text>
                <HStack>
                  <MapPin size={14} color="#718096" />
                  <Text color="gray.600">{formatLocation(selectedActivity)}</Text>
                </HStack>
                <HStack>
                  <Calendar size={14} color="#718096" />
                  <Text color="gray.600">{new Date(selectedActivity.startTime).toLocaleString()}</Text>
                </HStack>
                <HStack>
                  <Users size={14} color="#718096" />
                  <Text color="gray.600">
                    {selectedActivity.participants?.filter((p: any) => p.status === 'accepted').length || 0} / {selectedActivity.maxParticipants} 人
                  </Text>
                </HStack>
                <HStack>
                  <Badge colorScheme="purple">{getLevelLabel(selectedActivity.level)}</Badge>
                  {selectedActivity.distance !== undefined && (
                    <Badge colorScheme="blue">{formatDistance(selectedActivity.distance)}</Badge>
                  )}
                </HStack>
              </VStack>
              
              <HStack>
                <Button
                  flex="1"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    setJoiningActivity(selectedActivity)
                    setShowJoinModal(true)
                  }}
                >
                  报名参加
                </Button>
                <Button
                  flex="1"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/activity/${selectedActivity._id}`)}
                >
                  查看详情
                </Button>
              </HStack>
            </Box>
          )}
        </Box>
      </Box>
      
      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>确认报名</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {joiningActivity && (
              <VStack align="start" spacing="3">
                <HStack>
                  <Text fontSize="xl">{getSportEmoji(joiningActivity.sport)}</Text>
                  <Text fontWeight="bold">{joiningActivity.title}</Text>
                </HStack>
                <Text color="gray.600">{joiningActivity.description}</Text>
                <HStack>
                  <Calendar size={16} />
                  <Text>{new Date(joiningActivity.startTime).toLocaleString()}</Text>
                </HStack>
                <HStack>
                  <MapPin size={16} />
                  <Text>{formatLocation(joiningActivity)}</Text>
                </HStack>
                {joiningActivity.distance !== undefined && (
                  <HStack>
                    <Navigation size={16} />
                    <Text>距离您 {formatDistance(joiningActivity.distance)}</Text>
                  </HStack>
                )}
                <Text fontSize="sm" color="blue.500">
                  报名后需要等待组织者确认
                </Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr="3" onClick={() => setShowJoinModal(false)}>取消</Button>
            <Button colorScheme="blue" onClick={handleJoinActivity}>确认报名</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default MapPage
