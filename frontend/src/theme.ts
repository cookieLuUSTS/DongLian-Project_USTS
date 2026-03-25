import { extendTheme } from '@chakra-ui/react'

const colors = {
  primary: {
    50: '#FFEBFF',
    100: '#FFC1FF',
    200: '#FF94FF',
    300: '#FF66FF',
    400: '#FF33FF',
    500: '#FF00FF', // 主色-亮粉色
    600: '#CC00CC',
    700: '#990099',
    800: '#660066',
    900: '#330033',
  },
  secondary: {
    50: '#E0F7FF',
    100: '#B3E5FF',
    200: '#80D4FF',
    300: '#4DC3FF',
    400: '#1AB2FF',
    500: '#0099FF', // 辅助色-亮蓝色
    600: '#0077CC',
    700: '#005599',
    800: '#003366',
    900: '#001133',
  },
  accent: {
    50: '#FFF5E6',
    100: '#FFE6CC',
    200: '#FFD499',
    300: '#FFC166',
    400: '#FFAE33',
    500: '#FF9900', // 辅助色-亮橙色
    600: '#CC7A00',
    700: '#995C00',
    800: '#663D00',
    900: '#331F00',
  },
  warning: {
    50: '#FFF5E6',
    100: '#FFE6CC',
    200: '#FFD499',
    300: '#FFC166',
    400: '#FFAE33',
    500: '#FF9900', // 辅助色-橙色
    600: '#CC7A00',
    700: '#995C00',
    800: '#663D00',
    900: '#331F00',
  },
  danger: {
    50: '#FFE6E6',
    100: '#FFCCCC',
    200: '#FF9999',
    300: '#FF6666',
    400: '#FF3333',
    500: '#FF0000', // 辅助色-红色
    600: '#CC0000',
    700: '#990000',
    800: '#660000',
    900: '#330000',
  },
  sport: {
    basketball: '#FF6B6B', // 红色
    football: '#4ECDC4',   // 青色
    badminton: '#45B7D1',  // 蓝色
    tennis: '#96CEB4',     // 绿色
    swimming: '#FFEAA7',   // 黄色
    volleyball: '#DDA0DD', // 紫色
  },
  anime: {
    pink: '#FF6B81',
    blue: '#70A1FF',
    purple: '#9B59B6',
    yellow: '#F1C40F',
    green: '#2ECC71',
    red: '#E74C3C',
    magical: '#9B59B6',
    pastel: '#F8BBD0',
    rainbow: '#FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD',
  },
}

const theme = extendTheme({
  colors,
  fonts: {
    heading: '"Comic Sans MS", "Arial Rounded MT Bold", "Segoe UI", Arial, sans-serif',
    body: '"Comic Sans MS", "Arial Rounded MT Bold", "Segoe UI", Arial, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: '25px',
        boxShadow: '0 6px 12px rgba(255, 0, 255, 0.2), 0 0 20px rgba(255, 0, 255, 0.1)',
        _hover: {
          boxShadow: '0 8px 16px rgba(255, 0, 255, 0.3), 0 0 30px rgba(255, 0, 255, 0.2)',
          transform: 'translateY(-3px) scale(1.05) rotate(1deg)',
        },
        _active: {
          transform: 'translateY(0) scale(0.98)',
        },
      },
    },
    Card: {
      baseStyle: {
        borderRadius: '25px',
        boxShadow: '0 10px 20px rgba(255, 0, 255, 0.15), 0 0 30px rgba(255, 0, 255, 0.1)',
        border: '3px solid',
        borderColor: 'primary.400',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,235,255,0.9) 100%)',
      },
    },
    Input: {
      baseStyle: {
        borderRadius: '20px',
        border: '3px solid',
        borderColor: 'primary.400',
        _focus: {
          borderColor: 'primary.500',
          boxShadow: '0 0 0 5px rgba(255, 0, 255, 0.2), 0 0 20px rgba(255, 0, 255, 0.1)',
          transform: 'scale(1.02) rotate(0.5deg)',
        },
      },
    },
    Box: {
      baseStyle: {
        borderRadius: '20px',
      },
    },
  },
  styles: {
    global: {
      body: {
        background: 'linear-gradient(135deg, #FFEBFF 0%, #E0F7FF 50%, #FFF5E6 100%)',
        backgroundAttachment: 'fixed',
      },
    },
  },
})

export default theme
