import { Box, Heading, FormControl, FormLabel, Input, Button, VStack, Select, Textarea, useToast, HStack, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, IconButton, Spinner } from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { activityApi } from '../services/api'
import { MapPin, X, Target } from 'lucide-react'

declare global {
  interface Window {
    AMap: any
  }
}

const CreateActivity = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sport, setSport] = useState('basketball')
  const [locationName, setLocationName] = useState('')
  const [coordinates, setCoordinates] = useState<{lng: number, lat: number} | null>(null)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('10')
  const [level, setLevel] = useState('intermediate')
  const [isLoading, setIsLoading] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [tempMarker, setTempMarker] = useState<any>(null)
  const [tempCoordinates, setTempCoordinates] = useState<{lng: number, lat: number} | null>(null)
  const [tempLocationName, setTempLocationName] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  
  const toast = useToast()
  const navigate = useNavigate()
  const mapRef = useRef<HTMLDivElement>(null)
  
  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }
  
  const getMinEndTime = () => {
    if (!startTime) return getMinDateTime()
    const start = new Date(startTime)
    start.setMinutes(start.getMinutes() + 30)
    return start.toISOString().slice(0, 16)
  }
  
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime)
      const end = new Date(endTime)
      if (end <= start) {
        setEndTime('')
      }
    }
  }, [startTime])
  
  const initMap = () => {
    if (!mapRef.current || !window.AMap) return
    
    const AMap = window.AMap
    const mapInstance = new AMap.Map(mapRef.current, {
      zoom: 14,
      center: coordinates ? [coordinates.lng, coordinates.lat] : [116.4074, 39.9042]
    })
    
    setMap(mapInstance)
    
    if (coordinates) {
      const marker = new AMap.Marker({
        position: [coordinates.lng, coordinates.lat],
        map: mapInstance
      })
      setTempMarker(marker)
      setTempCoordinates(coordinates)
      setTempLocationName(locationName)
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
    
    if (!coordinates) {
      getCurrentLocation(mapInstance, AMap)
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
          
          currentMap.setCenter([lng, lat])
          currentMap.setZoom(15)
          
          if (tempMarker) {
            tempMarker.setMap(null)
          }
          
          const marker = new currentAMap.Marker({
            position: [lng, lat],
            map: currentMap
          })
          setTempMarker(marker)
          setTempCoordinates({ lng, lat })
          
          currentAMap.plugin('AMap.Geocoder', function() {
            const geocoder = new currentAMap.Geocoder()
            geocoder.getAddress([lng, lat], function(status: string, result: any) {
              if (status === 'complete' && result.regeocode) {
                setTempLocationName(result.regeocode.formattedAddress)
              }
              setIsLocating(false)
            })
          })
          
          toast({
            title: '已定位到您的位置',
            status: 'success',
            duration: 2000
          })
        },
        () => {
          setIsLocating(false)
          toast({
            title: '定位失败，请手动选择位置',
            status: 'warning',
            duration: 2000
          })
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
  
  useEffect(() => {
    if (showMapModal) {
      setTimeout(initMap, 100)
    }
  }, [showMapModal])
  
  const handleConfirmLocation = () => {
    if (tempCoordinates) {
      setCoordinates(tempCoordinates)
      setLocationName(tempLocationName)
      setShowMapModal(false)
    }
  }
  
  const handleClearLocation = () => {
    setCoordinates(null)
    setLocationName('')
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!startTime) {
      toast({
        title: '请选择开始时间',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }
    
    if (!endTime) {
      toast({
        title: '请选择结束时间',
        description: '结束时间必须晚于开始时间',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }
    
    if (!coordinates) {
      toast({
        title: '请选择活动地点',
        description: '点击"在地图上选择"按钮来选择活动位置',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }
    
    setIsLoading(true)
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        toast({
          title: '请先登录',
          status: 'error',
          duration: 3000,
          isClosable: true
        })
        navigate('/login')
        return
      }
      
      const locationData = {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat]
      }
      
      await activityApi.create({
        title,
        description,
        sport,
        organizer: userId,
        location: locationData,
        locationName,
        startTime,
        endTime,
        maxParticipants: parseInt(maxParticipants),
        level
      })
      
      toast({
        title: '活动创建成功！',
        description: '即将跳转到个人中心',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      
      setTimeout(() => {
        navigate(`/profile/${userId}`)
      }, 1500)
    } catch (error: any) {
      toast({
        title: '创建活动失败',
        description: error.response?.data?.message || '请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const sportOptions = [
    { value: 'basketball', label: '篮球' },
    { value: 'football', label: '足球' },
    { value: 'tennis', label: '网球' },
    { value: 'badminton', label: '羽毛球' },
    { value: 'swimming', label: '游泳' },
    { value: 'gym', label: '健身' }
  ]
  
  const levelOptions = [
    { value: 'beginner', label: '初学者' },
    { value: 'intermediate', label: '中级' },
    { value: 'advanced', label: '高级' }
  ]
  
  return (
    <Box maxW="600px" margin="0 auto" padding="2rem" borderRadius="8px" boxShadow="md" bg="white">
      <Heading as="h1" size="lg" marginBottom="2rem" textAlign="center">
        创建活动
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="1.5rem">
          <FormControl id="title" isRequired>
            <FormLabel>活动标题</FormLabel>
            <Input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="请输入活动标题"
            />
          </FormControl>
          
          <FormControl id="description" isRequired>
            <FormLabel>活动描述</FormLabel>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="请输入活动描述"
              rows={4}
            />
          </FormControl>
          
          <FormControl id="sport" isRequired>
            <FormLabel>运动类型</FormLabel>
            <Select value={sport} onChange={(e) => setSport(e.target.value)}>
              {sportOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </FormControl>
          
          <FormControl id="location" isRequired>
            <FormLabel>活动地点</FormLabel>
            {coordinates ? (
              <Box>
                <HStack 
                  p="3" 
                  bg="blue.50" 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor="blue.200"
                >
                  <MapPin size={20} color="#3182CE" />
                  <Text flex="1" fontSize="sm" noOfLines={2}>{locationName || '已选择位置'}</Text>
                  <IconButton
                    aria-label="清除位置"
                    icon={<X size={16} />}
                    size="sm"
                    variant="ghost"
                    onClick={handleClearLocation}
                  />
                </HStack>
                <Button 
                  mt="2" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowMapModal(true)}
                >
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
          
          <FormControl id="startTime" isRequired>
            <FormLabel>开始时间</FormLabel>
            <Input 
              type="datetime-local" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)}
              min={getMinDateTime()}
            />
          </FormControl>
          
          <FormControl id="endTime" isRequired>
            <FormLabel>结束时间</FormLabel>
            <Input 
              type="datetime-local" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)}
              min={getMinEndTime()}
              disabled={!startTime}
            />
            {!startTime && (
              <Text color="gray.500" fontSize="sm" mt="1">请先选择开始时间</Text>
            )}
            {startTime && (
              <Text color="gray.500" fontSize="sm" mt="1">结束时间必须晚于开始时间</Text>
            )}
          </FormControl>
          
          <FormControl id="maxParticipants" isRequired>
            <FormLabel>最大参与人数</FormLabel>
            <Input 
              type="number" 
              value={maxParticipants} 
              onChange={(e) => setMaxParticipants(e.target.value)} 
              min="2"
            />
          </FormControl>
          
          <FormControl id="level" isRequired>
            <FormLabel>运动水平</FormLabel>
            <Select value={level} onChange={(e) => setLevel(e.target.value)}>
              {levelOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </FormControl>
          
          <Button 
            type="submit" 
            colorScheme="blue" 
            width="100%" 
            marginTop="1rem" 
            isLoading={isLoading}
          >
            创建活动
          </Button>
        </VStack>
      </form>
      
      <Modal isOpen={showMapModal} onClose={() => setShowMapModal(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>选择活动地点</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6">
            <Box mb="4">
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">点击地图选择位置，或点击定位按钮定位到当前位置</Text>
                <Button
                  size="sm"
                  leftIcon={isLocating ? <Spinner size="xs" /> : <Target size={14} />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => getCurrentLocation()}
                  isLoading={isLocating}
                >
                  定位我的位置
                </Button>
              </HStack>
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
    </Box>
  )
}

export default CreateActivity
