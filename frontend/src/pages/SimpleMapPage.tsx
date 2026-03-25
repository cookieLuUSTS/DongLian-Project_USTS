import { useState, useEffect, useRef } from 'react'
import { Box, Text, Button } from '@chakra-ui/react'

// 声明全局变量
declare global {
  interface Window {
    AMap: any
  }
}

const SimpleMapPage = () => {
  const [map, setMap] = useState<any>(null)
  const [mapLoadError, setMapLoadError] = useState<string | null>(null)
  
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('Checking AMap availability...')
    
    // 检查高德地图API是否加载
    if (typeof window !== 'undefined' && window.AMap) {
      console.log('AMap is available, initializing map...')
      initMap()
    } else {
      console.error('AMap is not available')
      setMapLoadError('高德地图API未加载')
    }
  }, [])

  const initMap = () => {
    try {
      console.log('Starting map initialization...')
      console.log('Map ref current:', mapRef.current)
      
      if (!mapRef.current) {
        console.error('Map container not found')
        setMapLoadError('地图容器未找到')
        return
      }
      
      if (!window.AMap) {
        console.error('AMap object is not available')
        setMapLoadError('高德地图API未加载')
        return
      }
      
      const AMap = window.AMap
      console.log('AMap object:', AMap)
      
      const mapInstance = new AMap.Map(mapRef.current, {
        zoom: 15,
        center: [120.5117, 31.2878],
        resizeEnable: true
      })
      
      console.log('Map instance created:', mapInstance)
      setMap(mapInstance)
      setMapLoadError(null)
      
      console.log('地图初始化成功')
    } catch (error) {
      console.error('地图初始化失败:', error)
      setMapLoadError('地图初始化失败')
    }
  }

  return (
    <Box p="4">
      <Text fontSize="xl" fontWeight="bold" mb="4">简单地图测试</Text>
      
      <Box 
        ref={mapRef} 
        h="500px" 
        w="100%" 
        bg="gray.200"
        position="relative"
      >
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
          >
            <Text fontSize="xl" fontWeight="bold" mb="2">地图加载失败</Text>
            <Text color="gray.600" mb="6" textAlign="center">
              {mapLoadError}
              <br />
              请检查网络连接或稍后重试
            </Text>
            <Button onClick={initMap}>
              重新加载地图
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SimpleMapPage