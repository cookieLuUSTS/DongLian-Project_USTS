import { Box, Heading, Text, Button, VStack, HStack, Tag, Card, CardBody, CardHeader, Avatar, useToast } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { MapPin, Clock, Phone, Star, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { venueApi, sensorApi } from '../services/api'

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [venue, setVenue] = useState<any>(null)
  const [sensorData, setSensorData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  
  useEffect(() => {
    const fetchVenueDetail = async () => {
      try {
        const [venueResponse, sensorResponse] = await Promise.all([
          venueApi.getById(id || '1'),
          sensorApi.getVenueSensors(id || '1')
        ])
        setVenue(venueResponse.data)
        setSensorData(sensorResponse.data)
      } catch (error: any) {
        console.error('获取场地详情失败:', error)
        // 使用模拟数据
        setVenue({
          id: id || '1',
          name: '中央公园篮球场',
          address: '北京市朝阳区中央公园内',
          type: 'basketball',
          capacity: 10,
          availableSlots: 2,
          facilities: ['休息区', '更衣室', '淋浴间', '停车场'],
          openingHours: '08:00 - 22:00',
          contact: '13800138000',
          rating: 4.5,
          reviews: [
            {
              id: 1,
              userId: 1,
              username: '张三',
              avatar: 'https://via.placeholder.com/50',
              rating: 5,
              comment: '场地很好，设施齐全',
              createdAt: '2024-01-15'
            },
            {
              id: 2,
              userId: 2,
              username: '李四',
              avatar: 'https://via.placeholder.com/50',
              rating: 4,
              comment: '位置方便，人不多',
              createdAt: '2024-01-10'
            }
          ]
        })
        
        // 模拟传感器数据
        setSensorData([
          {
            id: 1,
            sensorId: 'sensor-001',
            type: 'occupancy',
            value: 8,
            unit: '人',
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            sensorId: 'sensor-002',
            type: 'temperature',
            value: 22,
            unit: '°C',
            timestamp: new Date().toISOString()
          },
          {
            id: 3,
            sensorId: 'sensor-003',
            type: 'humidity',
            value: 45,
            unit: '%',
            timestamp: new Date().toISOString()
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchVenueDetail()
  }, [id, toast])
  
  if (isLoading) {
    return <Box>加载中...</Box>
  }
  
  if (!venue) {
    return <Box>场地不存在</Box>
  }
  
  return (
    <Box>
      <Heading as="h1" size="xl" marginBottom="2rem">
        {venue.name}
      </Heading>
      
      <VStack align="start" spacing="2rem" marginBottom="3rem">
        <HStack spacing="1rem">
          <Tag colorScheme="green">
            {venue.type === 'basketball' ? '篮球场' : venue.type === 'badminton' ? '羽毛球场' : '足球场'}
          </Tag>
          <HStack spacing="0.5rem">
            <Star size={16} color="gold" />
            <Text>{venue.rating}</Text>
          </HStack>
        </HStack>
        
        <VStack align="start" spacing="1rem">
          <HStack spacing="0.5rem">
            <MapPin size={16} />
            <Text>{venue.address}</Text>
          </HStack>
          <HStack spacing="0.5rem">
            <Clock size={16} />
            <Text>营业时间: {venue.openingHours}</Text>
          </HStack>
          <HStack spacing="0.5rem">
            <Phone size={16} />
            <Text>联系电话: {venue.contact}</Text>
          </HStack>
          <HStack spacing="0.5rem">
            <Users size={16} />
            <Text>容量: {venue.capacity} 人</Text>
          </HStack>
          <Text color="green.600" fontWeight="medium">
            可用场地: {venue.availableSlots}
          </Text>
        </VStack>
        
        <Box>
          <Heading as="h2" size="md" marginBottom="1rem">
            设施
          </Heading>
          <HStack spacing="1rem" flexWrap="wrap">
            {venue.facilities?.map((facility: string, index: number) => (
              <Tag key={index} colorScheme="blue">
                {facility}
              </Tag>
            ))}
          </HStack>
        </Box>
        
        <Button colorScheme="blue" size="lg">
          预订场地
        </Button>
      </VStack>
      
      <Box marginBottom="3rem">
        <Heading as="h2" size="md" marginBottom="1rem">
          实时数据
        </Heading>
        <HStack spacing="2rem" flexWrap="wrap">
          {sensorData.map((sensor, index) => (
            <Card key={index} boxShadow="sm" padding="1.5rem" minWidth="200px">
              <VStack align="center" spacing="1rem">
                <Text fontWeight="medium">
                  {sensor.type === 'occupancy' ? '当前人数' : sensor.type === 'temperature' ? '温度' : '湿度'}
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {sensor.value} {sensor.unit}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(sensor.timestamp).toLocaleString()}
                </Text>
              </VStack>
            </Card>
          ))}
        </HStack>
      </Box>
      
      <Box>
        <Heading as="h2" size="md" marginBottom="1rem">
          用户评价
        </Heading>
        <VStack spacing="2rem" align="stretch">
          {venue.reviews?.map((review: any) => (
            <Card key={review.id} boxShadow="sm">
              <CardHeader>
                <HStack spacing="1rem">
                  <Avatar size="sm" src={review.avatar} />
                  <Box>
                    <Text fontWeight="medium">{review.username}</Text>
                    {/*<Rating value={review.rating} size="sm" isReadOnly ></Rating>*/}
                  </Box>
                </HStack>
              </CardHeader>
              <CardBody>
                <Text>{review.comment}</Text>
                <Text fontSize="sm" color="gray.500" marginTop="1rem">
                  {review.createdAt}
                </Text>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>
    </Box>
  )
}

export default VenueDetail
