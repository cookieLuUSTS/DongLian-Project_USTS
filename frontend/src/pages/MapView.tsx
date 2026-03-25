import { Box, Heading, HStack, Select, Text, VStack, Card, CardBody, CardHeader, Divider, useColorModeValue, Flex, Icon } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { MapPin, Activity, Users, Clock } from 'lucide-react'

const MapView = () => {
  const [sportType, setSportType] = useState('all')
  const [venues, setVenues] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const bgColor = useColorModeValue('white', 'gray.900')
  
  useEffect(() => {
    // 使用苏州市的模拟数据
    setVenues([
      {
        id: 1,
        name: '苏州体育中心篮球场',
        type: 'basketball',
        location: '苏州市姑苏区三香路1131号',
        availableSlots: 2
      },
      {
        id: 2,
        name: '苏州工业园区羽毛球馆',
        type: 'badminton',
        location: '苏州市工业园区现代大道128号',
        availableSlots: 3
      },
      {
        id: 3,
        name: '苏州太湖足球公园',
        type: 'football',
        location: '苏州市吴中区太湖大道1号',
        availableSlots: 1
      }
    ])
    
    setActivities([
      {
        id: 1,
        title: '周末篮球友谊赛',
        sport: 'basketball',
        location: '苏州体育中心篮球场',
        time: '2024-01-20 14:00'
      },
      {
        id: 2,
        title: '羽毛球双打',
        sport: 'badminton',
        location: '苏州工业园区羽毛球馆',
        time: '2024-01-19 19:00'
      }
    ])
  }, [])
  
  return (
    <Box>
      <Box marginBottom="1rem">
        <Heading as="h1" size="lg" marginBottom="1rem">
          苏州运动场地和活动
        </Heading>
        <HStack spacing="1rem">
          <Select value={sportType} onChange={(e) => setSportType(e.target.value)}>
            <option value="all">所有运动</option>
            <option value="basketball">篮球</option>
            <option value="football">足球</option>
            <option value="tennis">网球</option>
            <option value="badminton">羽毛球</option>
            <option value="swimming">游泳</option>
            <option value="gym">健身</option>
          </Select>
        </HStack>
      </Box>
      
      {/* 苏州市地图 */}
      <Box 
        width="100%" 
        height="600px" 
        marginBottom="2rem"
        borderRadius="lg"
        boxShadow="md"
        overflow="hidden"
        position="relative"
        bg="blue.50"
      >
        {/* 使用更可靠的地图图片 */}
        <Box
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgGradient="linear(to-br, blue.100, blue.200)"
        >
          <Box textAlign="center" p="4rem">
            <Text fontSize="2xl" fontWeight="bold" color="blue.700" marginBottom="1rem">
              苏州市地图
            </Text>
            <Text fontSize="lg" color="blue.600" marginBottom="2rem">
              显示苏州市的运动场地和活动
            </Text>
            <Box 
              width="80%" 
              height="300px" 
              bg="white" 
              borderRadius="lg" 
              boxShadow="md"
              margin="0 auto"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid blue.300"
            >
              <Text color="blue.500">苏州市地图区域</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      
      <VStack spacing="2rem" width="100%">
        {/* 场地列表 */}
        <Box width="100%">
          <Flex align="center" gap="1rem" marginBottom="1rem">
            <Icon as={Activity} color="blue.500" />
            <Heading as="h2" size="md">
              苏州运动场地
            </Heading>
          </Flex>
          <VStack spacing="1rem" align="stretch">
            {venues.map(venue => (
              <Card key={venue.id} bg={bgColor} boxShadow="md" _hover={{ boxShadow: "lg" }}>
                <CardHeader>
                  <Heading as="h3" size="sm">{venue.name}</Heading>
                </CardHeader>
                <CardBody>
                  <HStack spacing="2rem" marginBottom="1rem">
                    <Flex align="center" gap="0.5rem">
                      <MapPin size={16} color="blue.500" />
                      <Text>{venue.location}</Text>
                    </Flex>
                    <Box 
                      bg="green.50" 
                      p="0.5rem 1rem" 
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      gap="0.5rem"
                    >
                      <Text fontSize="sm" color="green.600" fontWeight="bold">
                        可用场地: {venue.availableSlots}
                      </Text>
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>
        
        <Divider />
        
        {/* 活动列表 */}
        <Box width="100%">
          <Flex align="center" gap="1rem" marginBottom="1rem">
            <Icon as={Users} color="green.500" />
            <Heading as="h2" size="md">
              苏州运动活动
            </Heading>
          </Flex>
          <VStack spacing="1rem" align="stretch">
            {activities.map(activity => (
              <Card key={activity.id} bg={bgColor} boxShadow="md" _hover={{ boxShadow: "lg" }}>
                <CardHeader>
                  <Heading as="h3" size="sm">{activity.title}</Heading>
                </CardHeader>
                <CardBody>
                  <HStack spacing="2rem" marginBottom="1rem">
                    <Flex align="center" gap="0.5rem">
                      <MapPin size={16} color="green.500" />
                      <Text>{activity.location}</Text>
                    </Flex>
                    <Flex align="center" gap="0.5rem">
                      <Clock size={16} color="purple.500" />
                      <Text>{activity.time}</Text>
                    </Flex>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default MapView
