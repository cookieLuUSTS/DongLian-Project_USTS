import { Box, Heading, Grid, Card, CardBody, CardHeader, Text, Tag, VStack, HStack, Flex, Avatar, Button } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'

// 导入动画变体
import { cardVariants, buttonVariants } from '../components/animations'

// 导入运动员数据
import athletesData from '../../athletes-data.json'

const Athletes = () => {
  return (
    <Box>
      <Heading as="h1" size="xl" marginBottom="2rem">
        运动员列表
      </Heading>
      
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="2rem">
        {athletesData.map((athlete, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            custom={index}
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: 'xl' }}
            transition={{ duration: 0.3 }}
          >
            <Card boxShadow="md" borderRadius="lg" overflow="hidden">
              <CardHeader p="1.5rem">
                <Flex align="center" gap="1rem">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <Avatar src={athlete.avatar} size="md" name={athlete.username} />
                  </motion.div>
                  <VStack align="start" spacing="0.5rem">
                    <motion.h3
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Heading size="sm" fontWeight="bold">
                        {athlete.username}
                      </Heading>
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Text fontSize="sm" color="gray.600">
                        {athlete.email}
                      </Text>
                    </motion.p>
                  </VStack>
                </Flex>
              </CardHeader>
              <CardBody p="1.5rem">
                <VStack align="start" spacing="1rem">
                  {/* 运动类型 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" marginBottom="0.5rem">
                        运动类型
                      </Text>
                      <HStack spacing="0.5rem" flexWrap="wrap">
                        {athlete.sports.map((sport: string, idx: number) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Tag colorScheme="blue" size="sm">
                              {sport === 'basketball' ? '篮球' : 
                               sport === 'football' ? '足球' : 
                               sport === 'badminton' ? '羽毛球' : 
                               sport === 'tennis' ? '网球' : 
                               sport === 'swimming' ? '游泳' : '健身'}
                            </Tag>
                          </motion.div>
                        ))}
                      </HStack>
                    </Box>
                  </motion.div>
                  
                  {/* 水平等级 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" marginBottom="0.5rem">
                        水平等级
                      </Text>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                      >
                        <Tag colorScheme={
                          athlete.level === 'beginner' ? 'green' : 
                          athlete.level === 'intermediate' ? 'blue' : 'red'
                        } size="sm">
                          {athlete.level === 'beginner' ? '初学者' : 
                           athlete.level === 'intermediate' ? '中级' : '高级'}
                        </Tag>
                      </motion.div>
                    </Box>
                  </motion.div>
                  
                  {/* 标签 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" marginBottom="0.5rem">
                        标签
                      </Text>
                      <HStack spacing="0.5rem" flexWrap="wrap">
                        {athlete.tags.map((tag: string, idx: number) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Tag colorScheme="purple" size="sm">
                              {tag}
                            </Tag>
                          </motion.div>
                        ))}
                      </HStack>
                    </Box>
                  </motion.div>
                  
                  {/* 需求 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" marginBottom="0.5rem">
                        需求
                      </Text>
                      <HStack spacing="0.5rem" flexWrap="wrap">
                        {athlete.needs.map((need: string, idx: number) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Tag colorScheme="orange" size="sm">
                              {need}
                            </Tag>
                          </motion.div>
                        ))}
                      </HStack>
                    </Box>
                  </motion.div>
                  
                  {/* 个人简介 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" marginBottom="0.5rem">
                        个人简介
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {athlete.bio}
                      </Text>
                    </Box>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.div
                     
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <RouterLink to={`/profile/${athlete.username}`}>
                        查看详情
                      </RouterLink>
                    </motion.div>
                  </motion.div>
                </VStack>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </Grid>
    </Box>
  )
}

export default Athletes
