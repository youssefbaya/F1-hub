import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Drivers from './pages/Drivers'
import Calendar from './pages/Calendar'
import Teams from './pages/Teams'
import Circuits from './pages/Circuits'
import DriverProfile from './pages/DriverProfile'
import Cursor from './components/Cursor'
import TeamProfile from './pages/TeamProfile'

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('f1hub-theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('f1hub-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <>
      <Cursor />
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drivers/:driverId" element={<DriverProfile />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/circuits" element={<Circuits />} />
        <Route path="/teams/:teamId" element={<TeamProfile />} />
      </Routes>
    </>
  )
}
export default App