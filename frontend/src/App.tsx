import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Profile from './pages/Profile.tsx'
import VenueDetail from './pages/VenueDetail.tsx'
import ActivityDetail from './pages/ActivityDetail.tsx'
import CreateActivity from './pages/CreateActivity.tsx'
import Athletes from './pages/Athletes.tsx'
import MatchPage from './pages/MatchPage.tsx'
import SocialPage from './pages/SocialPage.tsx'
import MapPage from './pages/MapPage.tsx'
import SimpleMapPage from './pages/SimpleMapPage.tsx'
import Notifications from './pages/Notifications.tsx'
import Layout from './components/Layout.tsx'
import BackgroundThemeManager from './components/BackgroundThemeManager.tsx'

function App() {
  return (
    <>
      <BackgroundThemeManager />
      <div style={{ minHeight: '100vh', position: 'relative', zIndex: '1' }}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="venue/:id" element={<VenueDetail />} />
              <Route path="activity/:id" element={<ActivityDetail />} />
              <Route path="create-activity" element={<CreateActivity />} />
              <Route path="athletes" element={<Athletes />} />
              <Route path="match" element={<MatchPage />} />
              <Route path="social" element={<SocialPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="simple-map" element={<SimpleMapPage />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </div>
    </>
  )
}

export default App
