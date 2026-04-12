import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Navbar.module.css'

// Team colours for driver cards
const TEAM_COLORS = {
  'Red Bull':       '#3671C6',
  'Mercedes':       '#27F4D2',
  'Ferrari':        '#E8002D',
  'McLaren':        '#FF8000',
  'Aston Martin':   '#229971',
  'Alpine':         '#FF87BC',
  'Haas F1 Team':   '#B6BABD',
  'RB F1 Team':     '#6692FF',
  'Williams':       '#64C4FF',
  'Cadillac':       '#333333',
}

const ALL_DRIVERS = [
  { id: 'max_verstappen', name: 'Max Verstappen',    code: 'VER', number: 3,  team: 'Red Bull' },
  { id: 'hadjar',       name: 'Isack Hadjar',        code: 'HAD', number: 6,  team: 'Red Bull' },
  { id: 'norris',       name: 'Lando Norris',       code: 'NOR', number: 1,  team: 'McLaren' },
  { id: 'piastri',      name: 'Oscar Piastri',       code: 'PIA', number: 81, team: 'McLaren' },
  { id: 'leclerc',      name: 'Charles Leclerc',     code: 'LEC', number: 16, team: 'Ferrari' },
  { id: 'hamilton',     name: 'Lewis Hamilton',      code: 'HAM', number: 44, team: 'Ferrari' },
  { id: 'russell',      name: 'George Russell',      code: 'RUS', number: 63, team: 'Mercedes' },
  { id: 'antonelli',    name: 'Kimi Antonelli',      code: 'ANT', number: 12, team: 'Mercedes' },
  { id: 'alonso',       name: 'Fernando Alonso',     code: 'ALO', number: 14, team: 'Aston Martin' },
  { id: 'stroll',       name: 'Lance Stroll',        code: 'STR', number: 18, team: 'Aston Martin' },
  { id: 'gasly',        name: 'Pierre Gasly',        code: 'GAS', number: 10, team: 'Alpine' },
  { id: 'colapinto',    name: 'Franco Colapinto',    code: 'COL', number: 43, team: 'Alpine' },
  { id: 'ocon',         name: 'Esteban Ocon',        code: 'OCO', number: 31, team: 'Haas F1 Team' },
  { id: 'bearman',      name: 'Oliver Bearman',      code: 'BEA', number: 87, team: 'Haas F1 Team' },
  { id: 'lawson',       name: 'Liam Lawson',         code: 'LAW', number: 30, team: 'Racing Bulls' },
  { id: 'lindblad',     name: 'Arvid Lindblad',      code: 'LIN', number: 41, team: 'Racing Bulls' },
  { id: 'albon',        name: 'Alexander Albon',     code: 'ALB', number: 23, team: 'Williams' },
  { id: 'sainz',        name: 'Carlos Sainz',        code: 'SAI', number: 55, team: 'Williams' },
  { id: 'hulkenberg',   name: 'Nico Hülkenberg',     code: 'HUL', number: 27, team: 'Audi' },
  { id: 'bortoleto',    name: 'Gabriel Bortoleto',   code: 'BOR', number: 5,  team: 'Audi' },
  { id: 'bottas',       name: 'Valtteri Bottas',     code: 'BOT', number: 77, team: 'Cadillac' },
  { id: 'perez',        name: 'Sergio Perez',        code: 'PER', number: 11, team: 'Cadillac' },
]

const ALL_TEAMS = [
  { id: 'mclaren',      name: 'McLaren',          color: '#FF8000' },
  { id: 'red_bull',     name: 'Red Bull Racing',  color: '#3671C6' },
  { id: 'ferrari',      name: 'Ferrari',          color: '#E8002D' },
  { id: 'mercedes',     name: 'Mercedes',         color: '#27F4D2' },
  { id: 'aston_martin', name: 'Aston Martin',     color: '#229971' },
  { id: 'alpine',       name: 'Alpine',           color: '#FF87BC' },
  { id: 'haas',         name: 'Haas F1 Team',     color: '#B6BABD' },
  { id: 'rb',           name: 'Racing Bulls',     color: '#6692FF' },
  { id: 'williams',     name: 'Williams',         color: '#64C4FF' },
  { id: 'audi',         name: 'Audi',             color: '#B20000' },
  { id: 'cadillac',     name: 'Cadillac',         color: '#C8AA6E' },
]

const ALL_CIRCUITS = [
  { id: 'bahrain',      name: 'Bahrain',      country: 'Bahrain',      flagCode: 'bh' },
  { id: 'jeddah',       name: 'Jeddah',       country: 'Saudi Arabia', flagCode: 'sa' },
  { id: 'albert_park',  name: 'Melbourne',    country: 'Australia',    flagCode: 'au' },
  { id: 'shanghai',     name: 'Shanghai',     country: 'China',        flagCode: 'cn' },
  { id: 'miami',        name: 'Miami',        country: 'USA',          flagCode: 'us' },
  { id: 'imola',        name: 'Imola',        country: 'Italy',        flagCode: 'it' },
  { id: 'monaco',       name: 'Monaco',       country: 'Monaco',       flagCode: 'mc' },
  { id: 'villeneuve',   name: 'Montreal',     country: 'Canada',       flagCode: 'ca' },
  { id: 'catalunya',    name: 'Barcelona',    country: 'Spain',        flagCode: 'es' },
  { id: 'red_bull_ring',name: 'Spielberg',    country: 'Austria',      flagCode: 'at' },
  { id: 'silverstone',  name: 'Silverstone',  country: 'UK',           flagCode: 'gb' },
  { id: 'hungaroring',  name: 'Budapest',     country: 'Hungary',      flagCode: 'hu' },
  { id: 'spa',          name: 'Spa',          country: 'Belgium',      flagCode: 'be' },
  { id: 'zandvoort',    name: 'Zandvoort',    country: 'Netherlands',  flagCode: 'nl' },
  { id: 'monza',        name: 'Monza',        country: 'Italy',        flagCode: 'it' },
  { id: 'baku',         name: 'Baku',         country: 'Azerbaijan',   flagCode: 'az' },
  { id: 'marina_bay',   name: 'Singapore',    country: 'Singapore',    flagCode: 'sg' },
  { id: 'suzuka',       name: 'Suzuka',       country: 'Japan',        flagCode: 'jp' },
  { id: 'losail',       name: 'Lusail',       country: 'Qatar',        flagCode: 'qa' },
  { id: 'cota',         name: 'Austin',       country: 'USA',          flagCode: 'us' },
  { id: 'rodriguez',    name: 'Mexico City',  country: 'Mexico',       flagCode: 'mx' },
  { id: 'interlagos',   name: 'São Paulo',    country: 'Brazil',       flagCode: 'br' },
  { id: 'vegas',        name: 'Las Vegas',    country: 'USA',          flagCode: 'us' },
  { id: 'yas_marina',   name: 'Abu Dhabi',    country: 'UAE',          flagCode: 'ae' },
]

function DriverCard({ driver }) {
  const color = TEAM_COLORS[driver.team] || '#888'
  return (
    <Link to={`/drivers/${driver.id}`} className={styles.driverCard}>
      <div className={styles.driverCardImg} style={{ borderColor: color }}>
        <img
          src={`/drivers/${driver.id}.avif`}
          alt={driver.name}
          className={styles.driverCardPhoto}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div className={styles.driverCardFallback} style={{ display: 'none', borderColor: color }}>
          <span style={{ color }}>{driver.code}</span>
        </div>
      </div>
      <div className={styles.driverCardInfo}>
        <span className={styles.driverCardName}>{driver.name.split(' ').pop()}</span>
        <span className={styles.driverCardNum} style={{ color }}>{driver.number}</span>
      </div>
    </Link>
  )
}

function TeamCard({ team }) {
  return (
    <Link to={`/teams`} className={styles.teamCard}>
      <div className={styles.teamCardBar} style={{ background: team.color }} />
      <div className={styles.teamCardImg}>
        <img
          src={`/teams/${team.id}.avif`}
          alt={team.name}
          className={styles.teamCardLogo}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        <span className={styles.teamCardFallback} style={{ display: 'none', color: team.color }}>
          {team.name.charAt(0)}
        </span>
      </div>
      <span className={styles.teamCardName}>{team.name}</span>
    </Link>
  )
}

function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [glitchLogo, setGlitchLogo] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const closeTimer = useRef(null)
 const [liveSession, setLiveSession] = useState(null)

  const NAV_LINKS = [
    { path: '/', label: 'Home', dropdown: null },
    { path: '/drivers', label: 'Drivers', dropdown: 'drivers' },
    { path: '/calendar', label: 'Calendar', dropdown: null },
    { path: '/circuits', label: 'Circuits', dropdown: 'circuits' },
    { path: '/teams', label: 'Teams', dropdown: 'teams' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setOpenDropdown(null)
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
  async function checkLive() {
  try {
    const res = await fetch('https://api.openf1.org/v1/sessions?session_key=latest')
    if (!res.ok) return
    const data = await res.json()
    if (!data.length) return
    const session = data[0]
    const now = new Date()
    const start = new Date(session.date_start)
    const end = new Date(session.date_end)

    if (now >= start && now <= end && session.meeting_name) {
       setLiveSession(session)
    } else {
       setLiveSession(null)
    }
  } catch(e) {}
}
  checkLive()
  const interval = setInterval(checkLive, 300000)
  return () => clearInterval(interval)
}, [])

  const handleLogoHover = () => {
    setGlitchLogo(true)
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(80, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.3)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.36)
    } catch(e) {}
    setTimeout(() => setGlitchLogo(false), 400)
  }

  const handleLinkEnter = (key) => {
    clearTimeout(closeTimer.current)
    setOpenDropdown(key)
    setHoveredLink(key)
  }

  const handleLinkLeave = () => {
    closeTimer.current = setTimeout(() => {
      setOpenDropdown(null)
      setHoveredLink(null)
    }, 300)
  }

  const handleDropdownEnter = () => clearTimeout(closeTimer.current)
  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => {
      setOpenDropdown(null)
      setHoveredLink(null)
    }, 300)
  }

useEffect(() => {
  async function checkLive() {
    try {
      const res = await fetch('https://api.openf1.org/v1/sessions?session_key=latest')
      if (!res.ok) return
      const data = await res.json()
      if (!data.length) return
      const session = data[0]
      const now = new Date()
      const start = new Date(session.date_start)
      const end = new Date(session.date_end)
      if (now >= start && now <= end) {
        setLiveSession(session)
      } else {
        setLiveSession(null)
      }
    } catch(e) {}
  }
  checkLive()
  const interval = setInterval(checkLive, 60000) // check every minute
  return () => clearInterval(interval)
}, [])

  const renderDropdown = (type) => {
    if (type === 'drivers') return (
      <div className={styles.dropdownDrivers}>
        <div className={styles.dropdownHeader}>
          <span>2026 Drivers</span>
          <Link to="/drivers" className={styles.dropdownViewAll}>View standings →</Link>
        </div>
        <div className={styles.driverGrid}>
          {ALL_DRIVERS.map(d => <DriverCard key={d.id} driver={d} />)}
        </div>
      </div>
    )

    if (type === 'teams') return (
      <div className={styles.dropdownTeams}>
        <div className={styles.dropdownHeader}>
          <span>2026 Teams</span>
          <Link to="/teams" className={styles.dropdownViewAll}>View standings →</Link>
        </div>
        <div className={styles.teamGrid}>
          {ALL_TEAMS.map(t => <TeamCard key={t.id} team={t} />)}
        </div>
      </div>
    )

    if (type === 'circuits') return (
      <div className={styles.dropdownCircuits}>
        <div className={styles.dropdownHeader}>
          <span>2025 Circuits</span>
          <Link to="/circuits" className={styles.dropdownViewAll}>View all →</Link>
        </div>
        <div className={styles.circuitList}>
          {ALL_CIRCUITS.map(c => (
  <Link key={c.id} to="/circuits" className={styles.circuitItem}>
    <img
  src={`https://flagcdn.com/24x18/${c.flagCode}.png`}
  alt={c.country}
  className={styles.circuitItemFlag}
/>
    <div>
      <span className={styles.circuitItemName}>{c.name}</span>
      <span className={styles.circuitItemCountry}>{c.country}</span>
    </div>
  </Link>
))}
        </div>
      </div>
    )
    return null
  }

  return (
    <>
      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Link
          to="/"
          className={`${styles.logo} ${glitchLogo ? styles.logoGlitch : ''}`}
          onMouseEnter={handleLogoHover}
        >
          <span className={styles.logoF}>F</span>
          <span className={styles.logoNum}>1</span>
          <span className={styles.logoSep} />
          <span className={styles.logoHub}>HUB</span>
          {glitchLogo && (
            <>
              <span className={styles.glitchClone1}>F1</span>
              <span className={styles.glitchClone2}>F1</span>
            </>
          )}
        </Link>

        <div className={styles.links}>
          {NAV_LINKS.map((l) => {
            const isActive = location.pathname === l.path ||
              location.pathname.startsWith(l.path + '/') && l.path !== '/'
            return (
              <div
                key={l.path}
                className={styles.linkWrap}
                onMouseEnter={() => handleLinkEnter(l.dropdown || l.path)}
                onMouseLeave={handleLinkLeave}
              >
                <Link
                  to={l.path}
                  className={`${styles.link} ${isActive ? styles.active : ''}`}
                >
                  <span className={styles.linkInner}>
                    {l.label}
                    {l.dropdown && (
                      <span className={`${styles.chevron} ${openDropdown === l.dropdown ? styles.chevronOpen : ''}`}>›</span>
                    )}
                  </span>
                  {isActive && (
                    <motion.div
                      className={styles.activeLine}
                      layoutId="activeLine"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {l.dropdown && openDropdown === l.dropdown && (
                    <motion.div
                      className={`${styles.dropdown} ${styles[`dropdown_${l.dropdown}`]}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {renderDropdown(l.dropdown)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className={styles.navRight}>
          <div className={styles.liveWrap}>
             <div className={`${styles.liveIndicator} ${liveSession ? styles.liveIndicatorActive : ''}`} onClick={() => console.log('liveSession:', liveSession)}>
            <span className={`${styles.liveDot} ${liveSession ? styles.liveDotActive : ''}`} />
            <span className={styles.liveText}>{liveSession ? 'Live' : 'Offline'}</span>
          </div>
          <div className={styles.liveTooltip}>
         {liveSession
         ? `🔴 ${liveSession.session_name} — ${liveSession.meeting_name}`
         : 'No session currently live'
         }
         </div>
         </div>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className={styles.menuBgNum}>F1</span>
            {NAV_LINKS.map((l, i) => (
              <motion.div
                key={l.path}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ delay: i * 0.08 + 0.1 }}
              >
                <Link
                  to={l.path}
                  className={`${styles.mobileLink} ${location.pathname === l.path ? styles.mobileLinkActive : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={styles.mobileLinkNum}>0{i + 1}</span>
                  <span className={styles.mobileLinkLabel}>{l.label}</span>
                  <span className={styles.mobileLinkArrow}>→</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
  
}
export default Navbar