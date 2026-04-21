import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import Search from './components/Search'
import Home from './pages/Home'
import Drivers from './pages/Drivers'
import DriverProfile from './pages/DriverProfile'
import OldDrivers from './pages/OldDrivers'
import Calendar from './pages/Calendar'
import Teams from './pages/Teams'
import TeamProfile from './pages/TeamProfile'
import Circuits from './pages/Circuits'
import Compare from './pages/Compare'
import RaceResult from './pages/RaceResult'
import Max from './pages/Max'
import Seasons from './pages/Seasons'
import SeasonOverview from './pages/SeasonOverview'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('f1hub-theme') || 'dark')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('f1hub-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <>
      <Cursor />
      <Navbar toggleTheme={toggleTheme} theme={theme} onSearchOpen={() => setSearchOpen(true)} />
      <AnimatePresence>
        {searchOpen && <Search onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drivers/:driverId" element={<DriverProfile />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/drivers/old" element={<OldDrivers />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/teams/:teamId" element={<TeamProfile />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/circuits" element={<Circuits />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/race/:season/:round" element={<RaceResult />} />
        <Route path="/max" element={<Max />} />
        <Route path="/season-overview" element={<SeasonOverview />} />
        <Route path="/seasons" element={<Seasons />} />
        <Route path="/seasons/:year" element={<SeasonOverview />} />
      </Routes>
    </>
  )
}

export default App