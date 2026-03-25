import { Heading, VStack, HStack, Text, Box, Card, CardBody, CardHeader, Image, Button, Grid, Badge, Avatar, Wrap, WrapItem, Progress, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Divider } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { StyledContainer, HeroSection, StyledCard, StyledButton } from '../components/styles'
import { Users, MapPin, Target, Flag, Heart, Star, Activity, Calendar, Clock, Camera, Award, TrendingUp, BookOpen, Map, Building, Zap, BarChart2, ThumbsUp, MessageSquare, Share2 } from 'lucide-react'

const Home = () => {
  return (
    <StyledContainer>
      {/* 英雄区域 */}
      <HeroSection 
        bg="transparent" 
        p="8rem 3rem" 
        marginBottom="4rem" 
        zIndex="1"
        position="relative"
        overflow="hidden"
      >
        <VStack align="start" spacing="2rem" position="relative" zIndex="2">
          <Heading as="h1" size="4xl" color="secondary.500" fontWeight="bold">
            发现附近的运动
          </Heading>
          <Text fontSize="xl" color="gray.700" maxWidth="600px">
            动联 - 让运动更简单，让社交更有趣。在这里，你可以找到附近的球友，组织比赛，分享精彩瞬间。
          </Text>
          <HStack spacing="4">
            <Button 
              as={RouterLink} 
              to="/athletes" 
              bg="primary.500" 
              color="white" 
              variant="solid" 
              size="lg"
              leftIcon={<Users />}
            >
              查看运动员
            </Button>
            <Button 
              as={RouterLink} 
              to="/map" 
              bg="secondary.500" 
              color="white" 
              variant="solid" 
              size="lg"
              leftIcon={<MapPin />}
            >
              查看地图
            </Button>
          </HStack>
        </VStack>
      </HeroSection>

      {/* 功能模块 */}
      <Box marginBottom="6rem">
        <Heading as="h2" size="2xl" textAlign="center" marginBottom="4rem">
          核心功能
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="4">
          <StyledCard>
            <CardHeader>
              <Box fontSize="3xl" color="blue.500" mb="4">
                <Users />
              </Box>
              <Heading as="h3" size="md">寻找搭子</Heading>
            </CardHeader>
            <CardBody>
              <Text>找到附近的运动伙伴，一起组队打球，不再孤单。</Text>
              <Button as={RouterLink} to="/social" colorScheme="blue" mt="4">
                立即寻找
              </Button>
            </CardBody>
          </StyledCard>

          <StyledCard>
            <CardHeader>
              <Box fontSize="3xl" color="green.500" mb="4">
                <Target />
              </Box>
              <Heading as="h3" size="md">约战大厅</Heading>
            </CardHeader>
            <CardBody>
              <Text>发起或响应约战，找到合适的对手，提升自己的技能。</Text>
              <Button as={RouterLink} to="/social" colorScheme="green" mt="4">
                立即约战
              </Button>
            </CardBody>
          </StyledCard>

          <StyledCard>
            <CardHeader>
              <Box fontSize="3xl" color="purple.500" mb="4">
                <Flag />
              </Box>
              <Heading as="h3" size="md">实况赛事</Heading>
            </CardHeader>
            <CardBody>
              <Text>观看精彩赛事直播，为喜欢的队伍加油助威。</Text>
              <Button as={RouterLink} to="/social" colorScheme="purple" mt="4">
                观看赛事
              </Button>
            </CardBody>
          </StyledCard>

          <StyledCard>
            <CardHeader>
              <Box fontSize="3xl" color="pink.500" mb="4">
                <Camera />
              </Box>
              <Heading as="h3" size="md">精彩瞬间</Heading>
            </CardHeader>
            <CardBody>
              <Text>分享运动中的精彩瞬间，记录每一个值得纪念的时刻。</Text>
              <Button as={RouterLink} to="/social" colorScheme="pink" mt="4">
                分享瞬间
              </Button>
            </CardBody>
          </StyledCard>
        </Grid>
      </Box>

      {/* 运动类型展示 */}
      <Box marginBottom="6rem">
        <Heading as="h2" size="2xl" textAlign="center" marginBottom="4rem">
          热门运动
        </Heading>
        <Wrap spacing="4" justify="center">
          <WrapItem>
            <Box p="6" bg="blue.50" borderRadius="lg" textAlign="center" _hover={{ transform: 'scale(1.05)', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)' }} transition="all 0.3s ease">
              <Box fontSize="3xl" color="blue.500" mb="3">🏀</Box>
              <Text fontWeight="bold">篮球</Text>
              <Text fontSize="sm" color="gray.600">1,245 人参与</Text>
            </Box>
          </WrapItem>
          <WrapItem>
            <Box p="6" bg="green.50" borderRadius="lg" textAlign="center" _hover={{ transform: 'scale(1.05)', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)' }} transition="all 0.3s ease">
              <Box fontSize="3xl" color="green.500" mb="3">⚽</Box>
              <Text fontWeight="bold">足球</Text>
              <Text fontSize="sm" color="gray.600">987 人参与</Text>
            </Box>
          </WrapItem>
          <WrapItem>
            <Box p="6" bg="purple.50" borderRadius="lg" textAlign="center" _hover={{ transform: 'scale(1.05)', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.15)' }} transition="all 0.3s ease">
              <Box fontSize="3xl" color="purple.500" mb="3">🏸</Box>
              <Text fontWeight="bold">羽毛球</Text>
              <Text fontSize="sm" color="gray.600">1,567 人参与</Text>
            </Box>
          </WrapItem>
          <WrapItem>
            <Box p="6" bg="yellow.50" borderRadius="lg" textAlign="center" _hover={{ transform: 'scale(1.05)', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.15)' }} transition="all 0.3s ease">
              <Box fontSize="3xl" color="yellow.500" mb="3">🏐</Box>
              <Text fontWeight="bold">排球</Text>
              <Text fontSize="sm" color="gray.600">756 人参与</Text>
            </Box>
          </WrapItem>
          <WrapItem>
            <Box p="6" bg="red.50" borderRadius="lg" textAlign="center" _hover={{ transform: 'scale(1.05)', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)' }} transition="all 0.3s ease">
              <Box fontSize="3xl" color="red.500" mb="3">🏃</Box>
              <Text fontWeight="bold">跑步</Text>
              <Text fontSize="sm" color="gray.600">2,134 人参与</Text>
            </Box>
          </WrapItem>
          <WrapItem>
            <Box p="6" bg="teal.50" borderRadius="lg" textAlign="center" _hover={{ transform: 'scale(1.05)', boxShadow: '0 10px 25px rgba(20, 184, 166, 0.15)' }} transition="all 0.3s ease">
              <Box fontSize="3xl" color="teal.500" mb="3">🏊</Box>
              <Text fontWeight="bold">游泳</Text>
              <Text fontSize="sm" color="gray.600">876 人参与</Text>
            </Box>
          </WrapItem>
        </Wrap>
      </Box>

      {/* 热门活动 */}
      <Box marginBottom="6rem">
        <HStack justifyContent="space-between" alignItems="center" marginBottom="4rem">
          <Heading as="h2" size="2xl">
            热门活动
          </Heading>
          <Button as={RouterLink} to="/social" colorScheme="blue">
            查看全部
          </Button>
        </HStack>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
          <StyledCard>
            <Box position="relative">
              <Image src="https://picsum.photos/seed/activity1/400/200" alt="篮球比赛" height="200px" objectFit="cover" />
              <Badge position="absolute" top="8px" left="8px" colorScheme="blue">
                篮球
              </Badge>
            </Box>
            <CardBody>
              <Heading as="h3" size="md" marginBottom="2">
                周末篮球友谊赛
              </Heading>
              <HStack spacing="4" marginBottom="4">
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <Calendar size="16" style={{ marginRight: '4px' }} />
                  本周六 14:00
                </Text>
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <MapPin size="16" style={{ marginRight: '4px' }} />
                  中央体育馆
                </Text>
              </HStack>
              <Button as={RouterLink} to="/social" colorScheme="blue" w="full">
                报名参加
              </Button>
            </CardBody>
          </StyledCard>

          <StyledCard>
            <Box position="relative">
              <Image src="https://picsum.photos/seed/activity2/400/200" alt="足球比赛" height="200px" objectFit="cover" />
              <Badge position="absolute" top="8px" left="8px" colorScheme="yellow">
                足球
              </Badge>
            </Box>
            <CardBody>
              <Heading as="h3" size="md" marginBottom="2">
                5人制足球赛
              </Heading>
              <HStack spacing="4" marginBottom="4">
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <Calendar size="16" style={{ marginRight: '4px' }} />
                  本周五 19:00
                </Text>
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <MapPin size="16" style={{ marginRight: '4px' }} />
                  XX足球场
                </Text>
              </HStack>
              <Button as={RouterLink} to="/social" colorScheme="yellow" w="full">
                报名参加
              </Button>
            </CardBody>
          </StyledCard>

          <StyledCard>
            <Box position="relative">
              <Image src="https://picsum.photos/seed/activity3/400/200" alt="羽毛球比赛" height="200px" objectFit="cover" />
              <Badge position="absolute" top="8px" left="8px" colorScheme="green">
                羽毛球
              </Badge>
            </Box>
            <CardBody>
              <Heading as="h3" size="md" marginBottom="2">
                羽毛球双打比赛
              </Heading>
              <HStack spacing="4" marginBottom="4">
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <Calendar size="16" style={{ marginRight: '4px' }} />
                  本周日 10:00
                </Text>
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <MapPin size="16" style={{ marginRight: '4px' }} />
                  XX羽毛球馆
                </Text>
              </HStack>
              <Button as={RouterLink} to="/social" colorScheme="green" w="full">
                报名参加
              </Button>
            </CardBody>
          </StyledCard>
        </Grid>
      </Box>

      {/* 推荐场馆 */}
      <Box marginBottom="6rem">
        <HStack justifyContent="space-between" alignItems="center" marginBottom="4rem">
          <Heading as="h2" size="2xl">
            推荐场馆
          </Heading>
          <Button as={RouterLink} to="/map" colorScheme="green">
            查看全部
          </Button>
        </HStack>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
          <StyledCard>
            <Box position="relative">
              <Image src="https://picsum.photos/seed/venue1/400/200" alt="中央体育馆" height="200px" objectFit="cover" />
              <Badge position="absolute" top="8px" left="8px" colorScheme="blue">
                综合场馆
              </Badge>
            </Box>
            <CardBody>
              <Heading as="h3" size="md" marginBottom="2">
                中央体育馆
              </Heading>
              <HStack spacing="4" marginBottom="4">
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <MapPin size="16" style={{ marginRight: '4px' }} />
                  市中心
                </Text>
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <Star size="16" style={{ marginRight: '4px' }} />
                  4.8
                </Text>
              </HStack>
              <Text marginBottom="4" fontSize="sm" color="gray.600">
                设施齐全，环境优美，适合各种球类运动
              </Text>
              <Button as={RouterLink} to="/map" colorScheme="blue" w="full">
                查看详情
              </Button>
            </CardBody>
          </StyledCard>

          <StyledCard>
            <Box position="relative">
              <Image src="https://picsum.photos/seed/venue2/400/200" alt="阳光足球场" height="200px" objectFit="cover" />
              <Badge position="absolute" top="8px" left="8px" colorScheme="green">
                足球场
              </Badge>
            </Box>
            <CardBody>
              <Heading as="h3" size="md" marginBottom="2">
                阳光足球场
              </Heading>
              <HStack spacing="4" marginBottom="4">
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <MapPin size="16" style={{ marginRight: '4px' }} />
                  城东新区
                </Text>
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <Star size="16" style={{ marginRight: '4px' }} />
                  4.6
                </Text>
              </HStack>
              <Text marginBottom="4" fontSize="sm" color="gray.600">
                专业足球场，草皮质量好，灯光设施完善
              </Text>
              <Button as={RouterLink} to="/map" colorScheme="green" w="full">
                查看详情
              </Button>
            </CardBody>
          </StyledCard>

          <StyledCard>
            <Box position="relative">
              <Image src="https://picsum.photos/seed/venue3/400/200" alt="飞羽羽毛球馆" height="200px" objectFit="cover" />
              <Badge position="absolute" top="8px" left="8px" colorScheme="purple">
                羽毛球馆
              </Badge>
            </Box>
            <CardBody>
              <Heading as="h3" size="md" marginBottom="2">
                飞羽羽毛球馆
              </Heading>
              <HStack spacing="4" marginBottom="4">
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <MapPin size="16" style={{ marginRight: '4px' }} />
                  城西
                </Text>
                <Text display="flex" alignItems="center" fontSize="sm" color="gray.600">
                  <Star size="16" style={{ marginRight: '4px' }} />
                  4.9
                </Text>
              </HStack>
              <Text marginBottom="4" fontSize="sm" color="gray.600">
                专业羽毛球场地，通风良好，服务周到
              </Text>
              <Button as={RouterLink} to="/map" colorScheme="purple" w="full">
                查看详情
              </Button>
            </CardBody>
          </StyledCard>
        </Grid>
      </Box>

      {/* 运动成就 */}
      <Box marginBottom="6rem">
        <Heading as="h2" size="2xl" textAlign="center" marginBottom="4rem">
          运动成就
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="4">
          <Box bg="white" p="6" borderRadius="lg" textAlign="center" boxShadow="sm">
            <Box fontSize="3xl" fontWeight="bold" color="blue.500" mb="2">
              1,245
            </Box>
            <Text color="gray.600">活跃用户</Text>
          </Box>
          <Box bg="white" p="6" borderRadius="lg" textAlign="center" boxShadow="sm">
            <Box fontSize="3xl" fontWeight="bold" color="green.500" mb="2">
              328
            </Box>
            <Text color="gray.600">组织的活动</Text>
          </Box>
          <Box bg="white" p="6" borderRadius="lg" textAlign="center" boxShadow="sm">
            <Box fontSize="3xl" fontWeight="bold" color="yellow.500" mb="2">
              56
            </Box>
            <Text color="gray.600">赛事直播</Text>
          </Box>
          <Box bg="white" p="6" borderRadius="lg" textAlign="center" boxShadow="sm">
            <Box fontSize="3xl" fontWeight="bold" color="purple.500" mb="2">
              892
            </Box>
            <Text color="gray.600">分享的瞬间</Text>
          </Box>
        </Grid>
      </Box>

      {/* 运动数据统计 */}
      <Box marginBottom="6rem">
        <Heading as="h2" size="2xl" textAlign="center" marginBottom="4rem">
          运动数据
        </Heading>
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap="6">
          <StyledCard>
            <CardHeader>
              <Heading as="h3" size="md">本周运动趋势</Heading>
            </CardHeader>
            <CardBody>
              <Box marginBottom="4">
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>周一</Text>
                  <Text>128</Text>
                </HStack>
                <Progress value={45} colorScheme="blue" height="8px" borderRadius="4px" />
              </Box>
              <Box marginBottom="4">
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>周二</Text>
                  <Text>156</Text>
                </HStack>
                <Progress value={55} colorScheme="blue" height="8px" borderRadius="4px" />
              </Box>
              <Box marginBottom="4">
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>周三</Text>
                  <Text>189</Text>
                </HStack>
                <Progress value={65} colorScheme="blue" height="8px" borderRadius="4px" />
              </Box>
              <Box marginBottom="4">
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>周四</Text>
                  <Text>145</Text>
                </HStack>
                <Progress value={50} colorScheme="blue" height="8px" borderRadius="4px" />
              </Box>
              <Box marginBottom="4">
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>周五</Text>
                  <Text>210</Text>
                </HStack>
                <Progress value={75} colorScheme="blue" height="8px" borderRadius="4px" />
              </Box>
              <Box marginBottom="4">
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>周六</Text>
                  <Text>289</Text>
                </HStack>
                <Progress value={95} colorScheme="blue" height="8px" borderRadius="4px" />
              </Box>
              <Box>
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>周日</Text>
                  <Text>256</Text>
                </HStack>
                <Progress value={85} colorScheme="blue" height="8px" borderRadius="4px" />
              </Box>
            </CardBody>
          </StyledCard>
          
          <StyledCard>
            <CardHeader>
              <Heading as="h3" size="md">运动类型分布</Heading>
            </CardHeader>
            <CardBody>
              <Box marginBottom="4">
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>跑步</Text>
                  <Text>35%</Text>
                </HStack>
                <Progress value={35} colorScheme="red" height="8px" borderRadius="4px" />
              </Box>
              <Box marginBottom="4">
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>羽毛球</Text>
                  <Text>25%</Text>
                </HStack>
                <Progress value={25} colorScheme="purple" height="8px" borderRadius="4px" />
              </Box>
              <Box marginBottom="4">
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>篮球</Text>
                  <Text>20%</Text>
                </HStack>
                <Progress value={20} colorScheme="blue" height="8px" borderRadius="4px" />
              </Box>
              <Box marginBottom="4">
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>足球</Text>
                  <Text>15%</Text>
                </HStack>
                <Progress value={15} colorScheme="green" height="8px" borderRadius="4px" />
              </Box>
              <Box>
                <HStack justifyContent="space-between" marginBottom="2">
                  <Text>其他</Text>
                  <Text>5%</Text>
                </HStack>
                <Progress value={5} colorScheme="yellow" height="8px" borderRadius="4px" />
              </Box>
            </CardBody>
          </StyledCard>
        </Grid>
      </Box>

      {/* 用户评价 */}
      <Box marginBottom="6rem">
        <Heading as="h2" size="2xl" textAlign="center" marginBottom="4rem">
          用户评价
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
          <StyledCard>
            <CardBody>
              <HStack spacing="4" marginBottom="4">
                <Avatar src="https://picsum.photos/seed/user1/100/100" size="md" />
                <Box>
                  <Text fontWeight="medium">篮球爱好者</Text>
                  <HStack spacing="1">
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                  </HStack>
                </Box>
              </HStack>
              <Text>
                "通过这个平台，我找到了很多篮球伙伴，每周都会一起打球，真的很棒！" 
              </Text>
            </CardBody>
          </StyledCard>

          <StyledCard>
            <CardBody>
              <HStack spacing="4" marginBottom="4">
                <Avatar src="https://picsum.photos/seed/user2/100/100" size="md" />
                <Box>
                  <Text fontWeight="medium">羽球达人</Text>
                  <HStack spacing="1">
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                    <Star color="gray.300" size="16" />
                  </HStack>
                </Box>
              </HStack>
              <Text>
                "平台的约战功能很实用，我已经参加了很多羽毛球比赛，水平提高了不少。" 
              </Text>
            </CardBody>
          </StyledCard>

          <StyledCard>
            <CardBody>
              <HStack spacing="4" marginBottom="4">
                <Avatar src="https://picsum.photos/seed/user3/100/100" size="md" />
                <Box>
                  <Text fontWeight="medium">足球小子</Text>
                  <HStack spacing="1">
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                    <Star color="yellow.500" size="16" />
                  </HStack>
                </Box>
              </HStack>
              <Text>
                "实况赛事直播功能很赞，我可以观看很多精彩的足球比赛，支持！" 
              </Text>
            </CardBody>
          </StyledCard>
        </Grid>
      </Box>

      {/* 行动号召 */}
      <Box bg="primary.500" p="8" borderRadius="lg" textAlign="center" marginBottom="6rem">
        <Heading as="h2" size="2xl" color="white" marginBottom="4">
          开始你的运动社交之旅
        </Heading>
        <Text fontSize="lg" color="white" marginBottom="6" maxWidth="600px" mx="auto">
          加入动联，找到志同道合的运动伙伴，一起享受运动的乐趣！
        </Text>
        <HStack justifyContent="center" spacing="4">
          <Button as={RouterLink} to="/register" bg="white" color="primary.500" variant="solid" size="lg">
            立即注册
          </Button>
          <Button as={RouterLink} to="/login" bg="transparent" color="white" variant="outline" size="lg" borderColor="white">
            登录
          </Button>
        </HStack>
      </Box>
    </StyledContainer>
  )
}

export default Home