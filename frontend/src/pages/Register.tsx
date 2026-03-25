import { Box, Heading, FormControl, FormLabel, Input, Button, VStack, Text, Link, Select, useToast } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { userApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [sports, setSports] = useState('basketball')
  const [level, setLevel] = useState('beginner')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await userApi.register({ username, phone, password, sports: [sports], level })
      const user = {
        id: response.data._id,
        username: response.data.username,
        phone: response.data.phone
      }
      login(user, response.data.token)
      toast({
        title: '注册成功',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      navigate('/')
    } catch (error: any) {
      toast({
        title: '注册失败',
        description: error.response?.data?.message || '注册失败，请重试',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Box maxW="400px" margin="0 auto" padding="2rem" borderRadius="8px" boxShadow="md">
      <Heading as="h1" size="lg" marginBottom="2rem" textAlign="center">
        注册
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="1.5rem">
          <FormControl id="username">
            <FormLabel>用户名</FormLabel>
            <Input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </FormControl>
          <FormControl id="phone">
            <FormLabel>手机号</FormLabel>
            <Input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>密码</FormLabel>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </FormControl>
          <FormControl id="sports">
            <FormLabel>喜欢的运动</FormLabel>
            <Select value={sports} onChange={(e) => setSports(e.target.value)}>
              <option value="basketball">篮球</option>
              <option value="football">足球</option>
              <option value="tennis">网球</option>
              <option value="badminton">羽毛球</option>
              <option value="swimming">游泳</option>
              <option value="gym">健身</option>
            </Select>
          </FormControl>
          <FormControl id="level">
            <FormLabel>运动水平</FormLabel>
            <Select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="beginner">初学者</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="blue" width="100%" marginTop="1rem" isLoading={isLoading}>
            注册
          </Button>
          <Text textAlign="center">
            已有账号？ <Link as={RouterLink} to="/login" color="blue.500">立即登录</Link>
          </Text>
        </VStack>
      </form>
    </Box>
  )
}

export default Register
