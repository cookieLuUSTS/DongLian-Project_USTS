import { Box, Heading, FormControl, FormLabel, Input, Button, VStack, Text, Link, useToast } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { userApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await userApi.login({ phone, password })
      const user = {
        id: response.data._id,
        username: response.data.username,
        phone: response.data.phone
      }
      login(user, response.data.token)
      toast({
        title: '登录成功',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      navigate('/')
    } catch (error: any) {
      toast({
        title: '登录失败',
        description: error.response?.data?.message || '请检查手机号和密码',
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
        登录
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="2rem">
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
          <Button type="submit" colorScheme="blue" width="100%" marginTop="1rem" isLoading={isLoading}>
            登录
          </Button>
          <Text textAlign="center">
            还没有账号？ <Link as={RouterLink} to="/register" color="blue.500">立即注册</Link>
          </Text>
        </VStack>
      </form>
    </Box>
  )
}

export default Login
