import { useState, useEffect } from 'react'
import { Box, Flex, IconButton, Menu, MenuButton, MenuList, MenuItem, useToast } from '@chakra-ui/react'
import { Palette, Map, RefreshCw } from 'lucide-react'

// 背景主题类型
type BackgroundTheme = {
  id: string
  name: string
  type: 'solid' | 'gradient' | 'image'
  value: string
  thumbnail: string
}

// 地图样式类型
type MapStyle = {
  id: string
  name: string
  value: string
  thumbnail: string
}

// 背景主题选项
const BACKGROUND_THEMES: BackgroundTheme[] = [
  {
    id: 'default',
    name: '默认蓝天',
    type: 'gradient',
    value: `radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 30%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 35%),
      radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.5) 0%, transparent 40%),
      radial-gradient(circle at 60% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 30%),
      linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #E6F7FF 100%)`,
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=light%20blue%20sky%20with%20white%20clouds&image_size=square'
  },
  {
    id: 'sports',
    name: '运动场景',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20scene%20with%20basketball%20court%20and%20athletes%20dynamic%20action&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20scene%20with%20basketball%20court%20and%20athletes%20dynamic%20action&image_size=square'
  },
  {
    id: 'anime',
    name: '二次元游戏',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20game%20style%20background%20with%20colorful%20characters%20and%20fantasy%20elements%20vibrant%20colors&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20game%20style%20background%20with%20colorful%20characters%20and%20fantasy%20elements%20vibrant%20colors&image_size=square'
  },
  {
    id: 'anime_girl',
    name: '二次元少女',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20cute%20girl%20with%20colorful%20hair%20and%20sporty%20outfit%20vibrant%20colors&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20cute%20girl%20with%20colorful%20hair%20and%20sporty%20outfit%20vibrant%20colors&image_size=square'
  },
  {
    id: 'anime_sports',
    name: '二次元运动',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20sports%20scene%20with%20characters%20playing%20basketball%20and%20other%20sports%20vibrant%20colors&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20sports%20scene%20with%20characters%20playing%20basketball%20and%20other%20sports%20vibrant%20colors&image_size=square'
  },
  {
    id: 'anime_magic',
    name: '二次元魔法',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20magic%20scene%20with%20colorful%20spells%20and%20fantasy%20elements%20vibrant%20colors&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20magic%20scene%20with%20colorful%20spells%20and%20fantasy%20elements%20vibrant%20colors&image_size=square'
  },
  {
    id: 'anime_school',
    name: '二次元校园',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20school%20campus%20with%20colorful%20buildings%20and%20students%20vibrant%20colors&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20school%20campus%20with%20colorful%20buildings%20and%20students%20vibrant%20colors&image_size=square'
  },
  {
    id: 'anime_fantasy',
    name: '二次元奇幻',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20fantasy%20world%20with%20magic%20castles%20and%20colorful%20creatures%20vibrant%20colors&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20fantasy%20world%20with%20magic%20castles%20and%20colorful%20creatures%20vibrant%20colors&image_size=square'
  },
  {
    id: 'anime_sports_girls',
    name: '二次元运动少女',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20cute%20girls%20playing%20sports%20basketball%20volleyball%20colorful%20uniforms&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20cute%20girls%20playing%20sports%20basketball%20volleyball%20colorful%20uniforms&image_size=square'
  },
  {
    id: 'anime_gradient',
    name: '二次元渐变',
    type: 'gradient',
    value: `radial-gradient(circle at 20% 30%, rgba(255, 107, 129, 0.4) 0%, transparent 30%),
      radial-gradient(circle at 80% 20%, rgba(112, 161, 255, 0.3) 0%, transparent 35%),
      radial-gradient(circle at 40% 70%, rgba(155, 89, 182, 0.5) 0%, transparent 40%),
      radial-gradient(circle at 60% 80%, rgba(241, 196, 15, 0.3) 0%, transparent 30%),
      linear-gradient(135deg, #FF6B81 0%, #70A1FF 50%, #9B59B6 100%)`,
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20anime%20style%20gradient%20background%20with%20pink%20blue%20purple%20colors&image_size=square'
  },
  {
    id: 'anime_energetic',
    name: '意气风发',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20energetic%20character%20with%20confident%20pose%20and%20vibrant%20colors&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20energetic%20character%20with%20confident%20pose%20and%20vibrant%20colors&image_size=square'
  },
  {
    id: 'anime_sports_hero',
    name: '运动英雄',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20sports%20hero%20with%20victory%20pose%20energetic%20expression&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20sports%20hero%20with%20victory%20pose%20energetic%20expression&image_size=square'
  },
  {
    id: 'anime_dynamic',
    name: '动感活力',
    type: 'image',
    value: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20dynamic%20action%20scene%20with%20energetic%20characters&image_size=landscape_16_9',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20dynamic%20action%20scene%20with%20energetic%20characters&image_size=square'
  }
]

// 地图样式选项
const MAP_STYLES: MapStyle[] = [
  {
    id: 'default',
    name: '默认样式',
    value: 'default',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20map%20style%20with%20streets%20and%20buildings&image_size=square'
  },
  {
    id: 'dark',
    name: '深色模式',
    value: 'dark',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dark%20map%20style%20with%20night%20mode&image_size=square'
  },
  {
    id: 'satellite',
    name: '卫星影像',
    value: 'satellite',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=satellite%20map%20view%20from%20above&image_size=square'
  },
  {
    id: 'anime',
    name: '二次元风格',
    value: 'anime',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20map%20with%20colorful%20buildings&image_size=square'
  },
  {
    id: 'anime_colorful',
    name: '二次元彩色',
    value: 'anime_colorful',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20anime%20style%20map%20with%20vibrant%20colors&image_size=square'
  },
  {
    id: 'anime_magical',
    name: '二次元魔法',
    value: 'anime_magical',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20magic%20style%20map%20with%20magical%20elements&image_size=square'
  }
]

// 背景主题管理器组件
const BackgroundThemeManager: React.FC = () => {
  const [selectedBackground, setSelectedBackground] = useState<BackgroundTheme>(BACKGROUND_THEMES[0])
  const [selectedMapStyle, setSelectedMapStyle] = useState<MapStyle>(MAP_STYLES[0])
  const toast = useToast()

  // 应用背景主题
  const applyBackgroundTheme = (theme: BackgroundTheme) => {
    setSelectedBackground(theme)
    localStorage.setItem('backgroundTheme', JSON.stringify(theme))
    
    // 应用背景和动画
    const appElement = document.getElementById('root')
    
    // 移除所有之前的背景元素
    const oldBackgrounds = document.querySelectorAll('.background-animation')
    oldBackgrounds.forEach(el => el.remove())
    
    // 创建新的背景元素
    const backgroundElement = document.createElement('div')
    backgroundElement.className = 'background-animation'
    backgroundElement.style.position = 'fixed'
    backgroundElement.style.top = '0'
    backgroundElement.style.left = '0'
    backgroundElement.style.right = '0'
    backgroundElement.style.bottom = '0'
    backgroundElement.style.backgroundImage = theme.type === 'image' ? `url(${theme.value})` : theme.value
    backgroundElement.style.backgroundRepeat = 'no-repeat'
    backgroundElement.style.backgroundPosition = 'center'
    backgroundElement.style.backgroundSize = 'cover'
    backgroundElement.style.zIndex = '-1'
    
    // 移除动画，保持背景静止
    backgroundElement.style.animation = 'none'
    
    // 添加到DOM
    try {
      if (appElement && appElement.parentNode) {
        appElement.parentNode.insertBefore(backgroundElement, appElement)
      } else {
        // 如果root元素不存在，直接添加到body
        document.body.appendChild(backgroundElement)
      }
    } catch (error) {
      console.error('插入背景元素失败:', error)
      // 如果插入失败，直接添加到body
      document.body.appendChild(backgroundElement)
    }
    
    toast({
      title: '背景主题已更新',
      status: 'success',
      duration: 2000
    })
  }

  // 应用地图样式
  const applyMapStyle = (style: MapStyle) => {
    setSelectedMapStyle(style)
    localStorage.setItem('mapStyle', JSON.stringify(style))
    
    // 通知地图组件更新样式
    window.dispatchEvent(new CustomEvent('mapStyleChange', { detail: style }))
    
    toast({
      title: '地图样式已更新',
      status: 'success',
      duration: 2000
    })
  }

  // 随机切换背景
  const randomizeBackground = () => {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_THEMES.length)
    const randomTheme = BACKGROUND_THEMES[randomIndex]
    applyBackgroundTheme(randomTheme)
  }

  // 初始化背景
  useEffect(() => {
    // 添加动画样式
    const style = document.createElement('style')
    style.id = 'background-animation-styles'
    style.textContent = `
      /* 默认动画 */
      @keyframes defaultAnimation {
        0%, 100% {
          transform: scale(1) rotate(0deg) translateY(0);
        }
        25% {
          transform: scale(1.05) rotate(1deg) translateY(-5px);
        }
        50% {
          transform: scale(1) rotate(0deg) translateY(0);
        }
        75% {
          transform: scale(1.05) rotate(-1deg) translateY(5px);
        }
      }

      /* 二次元动画 */
      @keyframes animeAnimation {
        0%, 100% {
          transform: scale(1) rotate(0deg) translateY(0);
        }
        25% {
          transform: scale(1.1) rotate(2deg) translateY(-10px);
        }
        50% {
          transform: scale(1) rotate(0deg) translateY(0);
        }
        75% {
          transform: scale(1.1) rotate(-2deg) translateY(10px);
        }
      }

      /* 运动动画 */
      @keyframes sportsAnimation {
        0%, 100% {
          transform: scale(1) translateY(0);
        }
        50% {
          transform: scale(1.08) translateY(-8px);
        }
      }

      /* 意气风发动画 */
      @keyframes energeticAnimation {
        0%, 100% {
          transform: scale(1) rotate(0deg) translateY(0);
        }
        25% {
          transform: scale(1.15) rotate(3deg) translateY(-15px);
        }
        50% {
          transform: scale(1) rotate(0deg) translateY(0);
        }
        75% {
          transform: scale(1.15) rotate(-3deg) translateY(15px);
        }
      }
    `
    document.head.appendChild(style)

    // 加载保存的背景
    const savedBackground = localStorage.getItem('backgroundTheme')
    const savedMapStyle = localStorage.getItem('mapStyle')

    if (savedBackground) {
      const parsed = JSON.parse(savedBackground)
      const theme = BACKGROUND_THEMES.find(t => t.id === parsed.id) || BACKGROUND_THEMES[0]
      applyBackgroundTheme(theme)
    } else {
      // 应用默认主题
      applyBackgroundTheme(BACKGROUND_THEMES[0])
    }

    if (savedMapStyle) {
      const parsed = JSON.parse(savedMapStyle)
      const style = MAP_STYLES.find(s => s.id === parsed.id) || MAP_STYLES[0]
      setSelectedMapStyle(style)
      // 通知地图组件更新样式
      window.dispatchEvent(new CustomEvent('mapStyleChange', { detail: style }))
    }

    return () => {
      const styleElement = document.getElementById('background-animation-styles')
      if (styleElement) {
        styleElement.remove()
      }
    }
  }, [])

  return (
    <Box position="fixed" top="20px" right="20px" zIndex="1000">
      <Flex direction="column" gap="2">
        {/* 背景主题选择 */}
        <Menu>
          <MenuButton as={IconButton} icon={<Palette size={20} />} colorScheme="blue" variant="solid" aria-label="选择背景主题" />
          <MenuList maxW="300px">
            <MenuItem fontWeight="bold" mb="2">选择背景主题</MenuItem>
            {BACKGROUND_THEMES.map(theme => (
              <MenuItem key={theme.id} onClick={() => {
                applyBackgroundTheme(theme)
              }}>
                <Flex align="center" gap="3" w="100%">
                  <Box w="40px" h="40px" borderRadius="4px" overflow="hidden">
                    <img src={theme.thumbnail} alt={theme.name} width="100%" height="100%" style={{ objectFit: 'cover' }} />
                  </Box>
                  <Box flex="1">
                    <Box fontWeight={selectedBackground.id === theme.id ? 'bold' : 'normal'}>
                      {theme.name}
                    </Box>
                    {selectedBackground.id === theme.id && (
                      <Box fontSize="xs" color="green.500">当前选中</Box>
                    )}
                  </Box>
                </Flex>
              </MenuItem>
            ))}
            <MenuItem onClick={randomizeBackground}>
              <Flex align="center" gap="2">
                <RefreshCw size={16} />
                <Box>随机背景</Box>
              </Flex>
            </MenuItem>
          </MenuList>
        </Menu>

        {/* 地图样式选择 */}
        <Menu>
          <MenuButton as={IconButton} icon={<Map size={20} />} colorScheme="green" variant="solid" aria-label="选择地图样式" />
          <MenuList maxW="300px">
            <MenuItem fontWeight="bold" mb="2">选择地图样式</MenuItem>
            {MAP_STYLES.map(style => (
              <MenuItem key={style.id} onClick={() => applyMapStyle(style)}>
                <Flex align="center" gap="3" w="100%">
                  <Box w="40px" h="40px" borderRadius="4px" overflow="hidden">
                    <img src={style.thumbnail} alt={style.name} width="100%" height="100%" style={{ objectFit: 'cover' }} />
                  </Box>
                  <Box flex="1">
                    <Box fontWeight={selectedMapStyle.id === style.id ? 'bold' : 'normal'}>
                      {style.name}
                    </Box>
                    {selectedMapStyle.id === style.id && (
                      <Box fontSize="xs" color="green.500">当前选中</Box>
                    )}
                  </Box>
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  )
}

export default BackgroundThemeManager
