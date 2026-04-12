import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Drivers from './pages/Drivers'
import Calendar from './pages/Calendar'
import Teams from './pages/Teams'
import Circuits from './pages/Circuits'
import Cursor from './components/Cursor'
import DriverProfile from './pages/DriverProfile'


function App() {
  return (
    <>
      <Cursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drivers/:driverId" element={<DriverProfile />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/circuits" element={<Circuits />} />
        
      </Routes>
    </>
  )
}
export default App