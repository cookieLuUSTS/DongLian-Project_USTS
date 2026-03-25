import { Box, Heading, VStack, HStack, Text, Card, CardBody, CardHeader, Image, useToast, Badge, Avatar, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Select, Textarea, Grid, Button, Input } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { Heart, MessageSquare, MapPin, Clock, Camera, Users, Target, Flag, Star, Trophy, Lock, Eye, Calendar, PlayCircle, CalendarCheck, Plus, RefreshCw, Filter, MapPin as MapPinIcon, Target as Bullseye, Star as StarIcon } from 'lucide-react'
import { StyledCard, StyledButton, StyledInput, StyledSelect, StyledTextarea, StyledBadge, StyledContainer } from '../components/styles'

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  image: string;
  sport: string;
  sportColor: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  location: string;
  hot: number;
}

interface BuddyRequest {
  id: number;
  user: {
    avatar: string;
  };
  title: string;
  sport: string;
  sportColor: string;
  content: string;
  location: string;
  time: string;
}

interface Event {
  id: number;
  title: string;
  status: string;
  statusText: string;
  image: string;
  content: string;
  viewers?: number;
  time?: string;
  result?: string;
  location: string;
}

const SocialPage = () => {
  const [activeTab, setActiveTab] = useState('moments')
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [commentsVisible, setCommentsVisible] = useState<number[]>([])
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({})
  const [posts, setPosts] = useState<Post[]>([])
  const [buddyRequests, setBuddyRequests] = useState<BuddyRequest[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [nearbyPlayers, setNearbyPlayers] = useState<any[]>([])
  const [challenges, setChallenges] = useState<any[]>([])
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false)
  const [isOrganizeEventModalOpen, setIsOrganizeEventModalOpen] = useState(false)
  const [isInitiateMatchModalOpen, setIsInitiateMatchModalOpen] = useState(false)
  const [isAllAchievementsModalOpen, setIsAllAchievementsModalOpen] = useState(false)
  const [eventForm, setEventForm] = useState({
    name: '',
    type: '足球',
    time: '',
    location: '',
    recruitmentInfo: '',
    recruitmentCount: 1,
    contactInfo: ''
  })
  const [matchForm, setMatchForm] = useState({
    type: '足球',
    time: '',
    location: '',
    players: 4,
    description: '',
    contact: ''
  })
  const toast = useToast()

  // 模拟数据
  useEffect(() => {
    // 精彩瞬间数据
    setPosts([
      {
        id: 1,
        user: {
          name: '篮球爱好者',
          avatar: 'https://picsum.photos/seed/user1/100/100'
        },
        image: 'https://picsum.photos/seed/basketball1/400/300',
        sport: '篮球',
        sportColor: 'blue',
        content: '今天的扣篮太帅了！手感火热🔥',
        time: '2小时前',
        likes: 42,
        comments: 12,
        location: '中央体育馆',
        hot: 95
      },
      {
        id: 2,
        user: {
          name: '羽球达人',
          avatar: 'https://picsum.photos/seed/user2/100/100'
        },
        image: 'https://picsum.photos/seed/badminton/400/300',
        sport: '羽毛球',
        sportColor: 'green',
        content: '新拍到手，感觉羽毛球场就是我的天下！',
        time: '4小时前',
        likes: 36,
        comments: 8,
        location: '羽毛球场',
        hot: 88
      },
      {
        id: 3,
        user: {
          name: '足球小子',
          avatar: 'https://picsum.photos/seed/user3/100/100'
        },
        image: 'https://picsum.photos/seed/football/400/300',
        sport: '足球',
        sportColor: 'yellow',
        content: '今天的进球太精彩了！团队配合完美💯',
        time: '6小时前',
        likes: 56,
        comments: 18,
        location: '足球场',
        hot: 92
      },
      {
        id: 4,
        user: {
          name: '排球少女',
          avatar: 'https://picsum.photos/seed/user4/100/100'
        },
        image: 'https://picsum.photos/seed/volleyball/400/300',
        sport: '排球',
        sportColor: 'purple',
        content: '今天的比赛太激烈了，最终还是赢了！',
        time: '8小时前',
        likes: 28,
        comments: 6,
        location: '排球场',
        hot: 76
      },
      {
        id: 5,
        user: {
          name: '跑步达人',
          avatar: 'https://picsum.photos/seed/user5/100/100'
        },
        image: 'https://picsum.photos/seed/running/400/300',
        sport: '跑步',
        sportColor: 'red',
        content: '今天完成了10公里，感觉自己越来越强了！',
        time: '12小时前',
        likes: 32,
        comments: 9,
        location: '城市公园',
        hot: 81
      }
    ])

    // 寻找搭子数据
    setBuddyRequests([
      {
        id: 1,
        user: {
          avatar: 'https://picsum.photos/seed/buddy1/100/100'
        },
        title: '寻找羽毛球固定搭档',
        sport: '羽毛球',
        sportColor: 'green',
        content: '每周六上午10点，XX羽毛球馆，找固定混双搭档，水平3-4级',
        location: 'XX羽毛球馆',
        time: '每周六 10:00'
      },
      {
        id: 2,
        user: {
          avatar: 'https://picsum.photos/seed/buddy2/100/100'
        },
        title: '寻找篮球队友',
        sport: '篮球',
        sportColor: 'blue',
        content: '每周日下午2点，XX篮球场，找3v3队友，水平中等',
        location: 'XX篮球场',
        time: '每周日 14:00'
      },
      {
        id: 3,
        user: {
          avatar: 'https://picsum.photos/seed/buddy3/100/100'
        },
        title: '寻找足球爱好者',
        sport: '足球',
        sportColor: 'yellow',
        content: '每周五晚上7点，XX足球场，找5人制足球队友',
        location: 'XX足球场',
        time: '每周五 19:00'
      },
      {
        id: 4,
        user: {
          avatar: 'https://picsum.photos/seed/buddy4/100/100'
        },
        title: '寻找跑步伙伴',
        sport: '跑步',
        sportColor: 'red',
        content: '每天早上6点，城市公园，找跑步伙伴，距离5-10公里',
        location: '城市公园',
        time: '每天 06:00'
      }
    ])

    // 赛事数据
    setEvents([
      {
        id: 1,
        title: 'XX足球队 vs YY足球队',
        status: 'live',
        statusText: '直播中',
        image: 'https://picsum.photos/seed/live1/200/200',
        content: 'XX足球场 | 7人制足球赛',
        viewers: 128,
        location: 'XX足球场'
      },
      {
        id: 2,
        title: '城市篮球联赛总决赛',
        status: 'upcoming',
        statusText: '即将开始',
        image: 'https://picsum.photos/seed/live2/200/200',
        content: '中央体育馆 | 篮球总决赛',
        time: '明天 19:30',
        location: '中央体育馆'
      },
      {
        id: 3,
        title: '羽毛球精英赛',
        status: 'ended',
        statusText: '已结束',
        image: 'https://picsum.photos/seed/live3/200/200',
        content: 'XX羽毛球馆 | 单打比赛',
        result: '张三 2:1 李四',
        location: 'XX羽毛球馆'
      },
      {
        id: 4,
        title: '城市马拉松比赛',
        status: 'upcoming',
        statusText: '即将开始',
        image: 'https://picsum.photos/seed/live4/200/200',
        content: '城市中心 | 全程马拉松',
        time: '下周日 08:00',
        location: '城市中心'
      }
    ])

    // 附近球友数据
    setNearbyPlayers([
      {
        id: 1,
        name: '篮球爱好者',
        sport: '篮球',
        distance: '500m'
      },
      {
        id: 2,
        name: '羽球达人',
        sport: '羽毛球',
        distance: '800m'
      },
      {
        id: 3,
        name: '足球小子',
        sport: '足球',
        distance: '1.2km'
      },
      {
        id: 4,
        name: '跑步达人',
        sport: '跑步',
        distance: '1.5km'
      },
      {
        id: 5,
        name: '排球少女',
        sport: '排球',
        distance: '2km'
      }
    ])

    // 待应战数据
    setChallenges([
      {
        id: 1,
        title: 'XX足球队 vs 待定',
        time: '周六下午3点',
        location: 'XX足球场',
        type: '7人制'
      },
      {
        id: 2,
        title: '篮球爱好者队 vs 待定',
        time: '周日上午10点',
        location: '中央体育馆',
        type: '5v5'
      },
      {
        id: 3,
        title: '羽毛球精英队 vs 待定',
        time: '周五晚上7点',
        location: 'XX羽毛球馆',
        type: '双打'
      },
      {
        id: 4,
        title: '排球爱好者队 vs 待定',
        time: '下周一晚上8点',
        location: 'XX排球场',
        type: '6v6'
      }
    ])
  }, [])

  // 切换标签
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // 处理点赞
  const handleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId))
    } else {
      setLikedPosts([...likedPosts, postId])
    }
  }

  // 切换评论显示
  const toggleComments = (postId: number) => {
    if (commentsVisible.includes(postId)) {
      setCommentsVisible(commentsVisible.filter(id => id !== postId))
    } else {
      setCommentsVisible([...commentsVisible, postId])
    }
  }

  // 处理评论输入变化
  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }))
  }

  // 发送评论
  const handleSendComment = (postId: number) => {
    const comment = commentInputs[postId]
    if (comment && comment.trim()) {
      toast({
        title: '评论成功',
        description: '您的评论已发布',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      setCommentInputs(prev => ({
        ...prev,
        [postId]: ''
      }))
    }
  }

  // 处理发布需求
  const handlePublishBuddy = () => {
    toast({
      title: '发布成功',
      description: '您的搭子需求已发布',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
  }

  // 处理立即匹配
  const handleMatch = () => {
    toast({
      title: '匹配中',
      description: '正在为您寻找合适的对手...',
      status: 'info',
      duration: 3000,
      isClosable: true
    })
  }

  // 处理创建队伍
  const handleCreateTeam = () => {
    toast({
      title: '创建成功',
      description: '您的队伍已创建',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
  }

  // 处理组织赛事
  const handleOrganizeEvent = () => {
    toast({
      title: '发布成功',
      description: '您的赛事已发布',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
    setIsOrganizeEventModalOpen(false)
  }

  // 处理发起约战
  const handleInitiateMatch = () => {
    toast({
      title: '发布成功',
      description: '您的约战已发布',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
    setIsInitiateMatchModalOpen(false)
  }

  // 处理成就点击
  const handleAchievementClick = (achievement: any) => {
    setSelectedAchievement(achievement)
    setIsAchievementModalOpen(true)
  }

  // 处理事件表单变化
  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 处理约战表单变化
  const handleMatchFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMatchForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 处理刷新附近球友
  const handleRefreshNearbyPlayers = () => {
    toast({
      title: '刷新成功',
      description: '已更新附近球友列表',
      status: 'success',
      duration: 2000,
      isClosable: true
    })
  }

  // 处理刷新待应战
  const handleRefreshChallenges = () => {
    toast({
      title: '刷新成功',
      description: '已更新待应战列表',
      status: 'success',
      duration: 2000,
      isClosable: true
    })
  }

  return (
    <StyledContainer position="relative" minH="100vh">
      <Box maxWidth="800px" margin="0 auto" padding="2rem">
        <Heading as="h1" size="lg" marginBottom="2rem" textAlign="center">
          社区生态
        </Heading>

        {/* 功能导航 */}
        <HStack spacing="4" marginBottom="4rem" wrap="wrap" justifyContent="center">
          <Button 
            onClick={() => handleTabChange('moments')}
            colorScheme={activeTab === 'moments' ? 'blue' : 'gray'}
            leftIcon={<Camera />}
            flex="1" minWidth="150px"
          >
            精彩瞬间
          </Button>
          <Button 
            onClick={() => handleTabChange('buddies')}
            colorScheme={activeTab === 'buddies' ? 'green' : 'gray'}
            leftIcon={<Users />}
            flex="1" minWidth="150px"
          >
            寻找搭子
          </Button>
          <Button 
            onClick={() => handleTabChange('match')}
            colorScheme={activeTab === 'match' ? 'yellow' : 'gray'}
            leftIcon={<Target />}
            flex="1" minWidth="150px"
          >
            约战大厅
          </Button>
          <Button 
            onClick={() => handleTabChange('events')}
            colorScheme={activeTab === 'events' ? 'purple' : 'gray'}
            leftIcon={<Flag />}
            flex="1" minWidth="150px"
          >
            实况赛事
          </Button>
        </HStack>

        {/* 精彩瞬间 */}
        {activeTab === 'moments' && (
          <Box>
            <HStack justifyContent="space-between" marginBottom="1rem">
              <Heading as="h2" size="md">精彩瞬间</Heading>
              <StyledButton size="sm" colorScheme="blue">查看更多</StyledButton>
            </HStack>
            <VStack spacing="4" align="stretch">
              {posts.map(post => (
                <StyledCard key={post.id}>
                  <Box position="relative">
                    <Image src={post.image} alt={post.sport} height="240px" objectFit="cover" />
                    <Badge 
                      position="absolute" 
                      top="8px" 
                      left="8px" 
                      colorScheme={post.sportColor}
                    >
                      {post.sport}
                    </Badge>
                  </Box>
                  <CardBody>
                    <HStack marginBottom="1rem">
                      <Avatar src={post.user.avatar} size="sm" />
                      <Box>
                        <Text fontWeight="medium">{post.user.name}</Text>
                        <Text fontSize="xs" color="gray.500">{post.time}</Text>
                      </Box>
                    </HStack>
                    <Text marginBottom="1rem">{post.content}</Text>
                    <HStack justifyContent="space-between" alignItems="center">
                      <HStack spacing="4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          leftIcon={<Heart color={likedPosts.includes(post.id) ? "red" : "gray.500"} />}
                          onClick={() => handleLike(post.id)}
                        >
                          {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          leftIcon={<MessageSquare />}
                          onClick={() => toggleComments(post.id)}
                        >
                          {post.comments}
                        </Button>
                      </HStack>
                      <Text fontSize="xs" color="gray.500" display="flex" alignItems="center">
                        <MapPin size="14" style={{ marginRight: '4px' }} />
                        {post.location}
                      </Text>
                    </HStack>
                  </CardBody>
                </StyledCard>
              ))}
            </VStack>
          </Box>
        )}

        {/* 寻找搭子 */}
        {activeTab === 'buddies' && (
          <Box>
            <HStack justifyContent="space-between" marginBottom="1rem">
              <Heading as="h2" size="md">寻找搭子</Heading>
              <StyledButton size="sm" colorScheme="blue" onClick={handlePublishBuddy}>发布需求</StyledButton>
            </HStack>
            <StyledCard>
              <CardBody>
                <VStack spacing="4" align="stretch">
                  {buddyRequests.map((request, index) => (
                    <Box key={request.id} borderBottom={index < buddyRequests.length - 1 ? '1px solid' : 'none'} borderColor="gray.100" pb={index < buddyRequests.length - 1 ? '4' : '0'}>
                      <HStack>
                        <Avatar src={request.user.avatar} size="md" />
                        <Box flex="1">
                          <HStack justifyContent="space-between" marginBottom="4px">
                            <Text fontWeight="medium">{request.title}</Text>
                            <Badge colorScheme={request.sportColor}>{request.sport}</Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600" marginBottom="8px">{request.content}</Text>
                          <HStack justifyContent="space-between" fontSize="xs" color="gray.500">
                            <HStack spacing="4">
                              <Text display="flex" alignItems="center">
                                <MapPin size="12" style={{ marginRight: '4px' }} />
                                {request.location}
                              </Text>
                              <Text display="flex" alignItems="center">
                                <Clock size="12" style={{ marginRight: '4px' }} />
                                {request.time}
                              </Text>
                            </HStack>
                            <Button size="xs" colorScheme="blue">了解详情</Button>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </StyledCard>
          </Box>
        )}

        {/* 约战大厅 */}
        {activeTab === 'match' && (
          <Box>
            <HStack justifyContent="space-between" marginBottom="1rem">
              <Heading as="h2" size="md">约战大厅</Heading>
              <StyledButton size="sm" colorScheme="blue" onClick={() => setIsInitiateMatchModalOpen(true)}>
                发起约战
              </StyledButton>
            </HStack>
            <HStack spacing="4" wrap="wrap">
              {/* 个人约战 */}
              <StyledCard flex="1" minWidth="300px">
                <CardHeader>
                  <Heading as="h3" size="sm">个人约战</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing="3" align="stretch">
                    <StyledButton colorScheme="blue" leftIcon={<Target />} onClick={handleMatch}>
                      立即匹配
                    </StyledButton>
                    <Box border="1px solid" borderColor="gray.200" borderRadius="lg" p="4">
                      <HStack justifyContent="space-between" marginBottom="2">
                        <Text fontWeight="medium">附近球友</Text>
                        <StyledButton leftIcon={<RefreshCw size={16} />} variant="ghost" size="sm" onClick={handleRefreshNearbyPlayers}>
                          刷新
                        </StyledButton>
                      </HStack>
                      <Box>
                        <VStack spacing="2" align="stretch">
                          {nearbyPlayers.map(player => (
                            <Box key={player.id} bg="gray.50" p="3" borderRadius="lg">
                              <HStack justifyContent="space-between">
                                <Avatar src={`https://picsum.photos/seed/player${player.id}/100/100`} size="sm" />
                                <Text fontSize="sm">{player.name}</Text>
                                <Badge colorScheme={player.sport === '篮球' ? 'blue' : player.sport === '羽毛球' ? 'green' : 'yellow'}>
                                  {player.sport}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">{player.distance}</Text>
                              </HStack>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    </Box>
                  </VStack>
                </CardBody>
              </StyledCard>

              {/* 团队约战 */}
              <StyledCard flex="1" minWidth="300px">
                <CardHeader>
                  <Heading as="h3" size="sm">团队约战</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing="3" align="stretch">
                    <StyledButton colorScheme="green" leftIcon={<Users />} onClick={handleCreateTeam}>
                      创建队伍
                    </StyledButton>
                    <Box border="1px solid" borderColor="gray.200" borderRadius="lg" p="4">
                      <HStack justifyContent="space-between" marginBottom="2">
                        <Text fontWeight="medium">待应战</Text>
                        <StyledButton leftIcon={<RefreshCw size={16} />} variant="ghost" size="sm" onClick={handleRefreshChallenges}>
                          刷新
                        </StyledButton>
                      </HStack>
                      <VStack spacing="3" align="stretch">
                        {challenges.map(challenge => (
                          <Box key={challenge.id} bg="gray.50" p="3" borderRadius="lg">
                            <Text fontSize="sm" marginBottom="1">{challenge.title}</Text>
                            <Text fontSize="xs" color="gray.500">{challenge.time}，{challenge.location}，{challenge.type}</Text>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  </VStack>
                </CardBody>
              </StyledCard>
            </HStack>
          </Box>
        )}

        {/* 实况赛事 */}
        {activeTab === 'events' && (
          <Box>
            <HStack justifyContent="space-between" marginBottom="1rem">
              <Heading as="h2" size="md">实况赛事</Heading>
              <StyledButton size="sm" colorScheme="blue" onClick={() => setIsOrganizeEventModalOpen(true)}>组织赛事</StyledButton>
            </HStack>
            <StyledCard>
              <CardBody>
                <VStack spacing="4" align="stretch">
                  {events.map((event, index) => (
                    <Box key={event.id} borderBottom={index < events.length - 1 ? '1px solid' : 'none'} borderColor="gray.100" pb={index < events.length - 1 ? '4' : '0'}>
                      <HStack>
                        <Box position="relative" marginRight="4">
                          <Image src={event.image} alt={event.title} width="96px" height="96px" objectFit="cover" borderRadius="lg" />
                          {event.status === 'live' && (
                            <Box position="absolute" inset="0" bg="black" opacity="0.3" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                              <PlayCircle color="white" size="24" />
                            </Box>
                          )}
                        </Box>
                        <Box flex="1">
                          <HStack justifyContent="space-between" marginBottom="4px">
                            <Text fontWeight="medium">{event.title}</Text>
                            <Badge 
                              colorScheme={event.status === 'live' ? 'red' : event.status === 'upcoming' ? 'blue' : 'gray'}
                            >
                              {event.statusText}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600" marginBottom="8px">{event.content}</Text>
                          <HStack spacing="4" fontSize="xs" color="gray.500">
                            {event.status === 'live' && (
                              <Text display="flex" alignItems="center">
                                <Eye size="12" style={{ marginRight: '4px' }} />
                                {event.viewers}人观看
                              </Text>
                            )}
                            <Text display="flex" alignItems="center">
                              <MapPin size="12" style={{ marginRight: '4px' }} />
                              {event.location}
                            </Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </StyledCard>
          </Box>
        )}

        {/* 运动成就 */}
        <Box marginTop="4rem">
          <HStack justifyContent="space-between" marginBottom="1rem">
            <Heading as="h2" size="md">运动成就</Heading>
            <StyledButton size="sm" colorScheme="blue" onClick={() => setIsAllAchievementsModalOpen(true)}>查看全部</StyledButton>
          </HStack>
          <StyledCard>
            <CardBody>
              <HStack spacing="4" marginBottom="4" wrap="wrap">
                <Box bg="gray.50" p="4" borderRadius="lg" flex="1" minWidth="120px" textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500">12</Text>
                  <Text fontSize="sm" color="gray.600">去过的球场</Text>
                </Box>
                <Box bg="gray.50" p="4" borderRadius="lg" flex="1" minWidth="120px" textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">28</Text>
                  <Text fontSize="sm" color="gray.600">参与的组局</Text>
                </Box>
                <Box bg="gray.50" p="4" borderRadius="lg" flex="1" minWidth="120px" textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="yellow.500">15</Text>
                  <Text fontSize="sm" color="gray.600">搭档的球友</Text>
                </Box>
                <Box bg="gray.50" p="4" borderRadius="lg" flex="1" minWidth="120px" textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="purple.500">8</Text>
                  <Text fontSize="sm" color="gray.600">解锁的成就</Text>
                </Box>
              </HStack>
            </CardBody>
          </StyledCard>
        </Box>

        {/* 成就详情弹窗 */}
        <Modal isOpen={isAchievementModalOpen} onClose={() => setIsAchievementModalOpen(false)}>
          <ModalOverlay />
          <ModalContent maxW="md" textAlign="center">
            <ModalBody p="6">
              {selectedAchievement && (
                <>
                  <Box 
                    w="128px" 
                    h="128px" 
                    borderRadius="full" 
                    bg={selectedAchievement.color} 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    mx="auto" 
                    mb="4"
                  >
                    {selectedAchievement.icon}
                  </Box>
                  <Heading as="h3" size="lg" mb="2">{selectedAchievement.title}</Heading>
                  <Text color="gray.600">{selectedAchievement.description}</Text>
                </>
              )}
            </ModalBody>
            <ModalFooter justifyContent="center">
              <StyledButton colorScheme="blue" onClick={() => setIsAchievementModalOpen(false)}>
                关闭
              </StyledButton>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* 组织赛事弹窗 */}
        <Modal isOpen={isOrganizeEventModalOpen} onClose={() => setIsOrganizeEventModalOpen(false)}>
          <ModalOverlay />
          <ModalContent maxW="md">
            <ModalHeader>组织赛事</ModalHeader>
            <ModalCloseButton />
            <ModalBody p="6">
              <VStack spacing="4" align="stretch">
                <div>
                  <Text mb="1" fontSize="sm" fontWeight="medium">赛事名称</Text>
                  <Input 
                    name="name" 
                    value={eventForm.name} 
                    onChange={handleEventFormChange} 
                    placeholder="输入赛事名称"
                  />
                </div>
                <div>
                  <Text mb="1" fontSize="sm" fontWeight="medium">赛事类型</Text>
                  <Select 
                    name="type" 
                    value={eventForm.type} 
                    onChange={handleEventFormChange}
                  >
                    <option value="足球">足球</option>
                    <option value="篮球">篮球</option>
                    <option value="羽毛球">羽毛球</option>
                    <option value="排球">排球</option>
                  </Select>
                </div>
                <div>
                  <Text mb="1" fontSize="sm" fontWeight="medium">赛事时间</Text>
                  <Input 
                    name="time" 
                    type="datetime-local" 
                    value={eventForm.time} 
                    onChange={handleEventFormChange}
                  />
                </div>
                <div>
                  <Text mb="1" fontSize="sm" fontWeight="medium">赛事地点</Text>
                  <Input 
                    name="location" 
                    value={eventForm.location} 
                    onChange={handleEventFormChange} 
                    placeholder="输入赛事地点"
                  />
                </div>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <StyledButton variant="ghost" onClick={() => setIsOrganizeEventModalOpen(false)}>
                取消
              </StyledButton>
              <StyledButton colorScheme="blue" onClick={handleOrganizeEvent}>
                发布
              </StyledButton>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* 发起约战弹窗 */}
        <Modal isOpen={isInitiateMatchModalOpen} onClose={() => setIsInitiateMatchModalOpen(false)}>
          <ModalOverlay />
          <ModalContent maxW="md">
            <ModalHeader>发起约战</ModalHeader>
            <ModalCloseButton />
            <ModalBody p="6">
              <VStack spacing="4" align="stretch">
                <div>
                  <Text mb="1" fontSize="sm" fontWeight="medium">约战类型</Text>
                  <Select 
                    name="type" 
                    value={matchForm.type} 
                    onChange={handleMatchFormChange}
                  >
                    <option value="足球">足球</option>
                    <option value="篮球">篮球</option>
                    <option value="羽毛球">羽毛球</option>
                    <option value="排球">排球</option>
                  </Select>
                </div>
                <div>
                  <Text mb="1" fontSize="sm" fontWeight="medium">约战时间</Text>
                  <Input 
                    name="time" 
                    type="datetime-local" 
                    value={matchForm.time} 
                    onChange={handleMatchFormChange}
                  />
                </div>
                <div>
                  <Text mb="1" fontSize="sm" fontWeight="medium">约战地点</Text>
                  <Input 
                    name="location" 
                    value={matchForm.location} 
                    onChange={handleMatchFormChange} 
                    placeholder="输入约战地点"
                  />
                </div>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <StyledButton variant="ghost" onClick={() => setIsInitiateMatchModalOpen(false)}>
                取消
              </StyledButton>
              <StyledButton colorScheme="blue" onClick={handleInitiateMatch}>
                发布
              </StyledButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </StyledContainer>
  )
}

export default SocialPage