import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Navbar.module.css'

const TEAM_COLORS = {
  'McLaren': '#FF8000',
  'Red Bull': '#3671C6',
  'Red Bull Racing': '#3671C6',
  'Ferrari': '#E8002D',
  'Mercedes': '#27F4D2',
  'Aston Martin': '#229971',
  'Alpine': '#FF87BC',
  'Alpine F1 Team': '#FF87BC',
  'Haas F1 Team': '#B6BABD',
  'Haas': '#B6BABD',
  'Racing Bulls': '#6692FF',
  'Williams': '#64C4FF',
  'Audi': '#B20000',
  'Cadillac': '#C8AA6E',
}

const DRIVER_IMAGES = {
  'norris': 'lando_norris',
  'piastri': 'oscar_piastri',
  'max_verstappen': 'max_verstappen',
  'hadjar': 'isack_hadjar',
  'leclerc': 'charles_leclerc',
  'hamilton': 'lewis_hamilton',
  'russell': 'george_russell',
  'antonelli': 'andrea_kimi_antonelli',
  'alonso': 'fernando_alonso',
  'stroll': 'lance_stroll',
  'gasly': 'pierre_gasly',
  'colapinto': 'franco_colapinto',
  'ocon': 'esteban_ocon',
  'bearman': 'oliver_bearman',
  'lawson': 'liam_lawson',
  'lindblad': 'arvid_lindblad',
  'albon': 'alexander_albon',
  'sainz': 'carlos_sainz',
  'hulkenberg': 'nico_hulkenberg',
  'bortoleto': 'gabriel_bortoleto',
  'bottas': 'valtteri_bottas',
  'perez': 'sergio_perez',
}

const ALL_DRIVERS = [
  { id: 'max_verstappen', name: 'Max Verstappen', code: 'VER', number: 3, team: 'Red Bull' },
  { id: 'hadjar', name: 'Isack Hadjar', code: 'HAD', number: 6, team: 'Red Bull' },
  { id: 'norris', name: 'Lando Norris', code: 'NOR', number: 1, team: 'McLaren' },
  { id: 'piastri', name: 'Oscar Piastri', code: 'PIA', number: 81, team: 'McLaren' },
  { id: 'leclerc', name: 'Charles Leclerc', code: 'LEC', number: 16, team: 'Ferrari' },
  { id: 'hamilton', name: 'Lewis Hamilton', code: 'HAM', number: 44, team: 'Ferrari' },
  { id: 'russell', name: 'George Russell', code: 'RUS', number: 63, team: 'Mercedes' },
  { id: 'antonelli', name: 'Kimi Antonelli', code: 'ANT', number: 12, team: 'Mercedes' },
  { id: 'alonso', name: 'Fernando Alonso', code: 'ALO', number: 14, team: 'Aston Martin' },
  { id: 'stroll', name: 'Lance Stroll', code: 'STR', number: 18, team: 'Aston Martin' },
  { id: 'gasly', name: 'Pierre Gasly', code: 'GAS', number: 10, team: 'Alpine' },
  { id: 'colapinto', name: 'Franco Colapinto', code: 'COL', number: 43, team: 'Alpine' },
  { id: 'ocon', name: 'Esteban Ocon', code: 'OCO', number: 31, team: 'Haas F1 Team' },
  { id: 'bearman', name: 'Oliver Bearman', code: 'BEA', number: 87, team: 'Haas F1 Team' },
  { id: 'lawson', name: 'Liam Lawson', code: 'LAW', number: 30, team: 'Racing Bulls' },
  { id: 'lindblad', name: 'Arvid Lindblad', code: 'LIN', number: 41, team: 'Racing Bulls' },
  { id: 'albon', name: 'Alexander Albon', code: 'ALB', number: 23, team: 'Williams' },
  { id: 'sainz', name: 'Carlos Sainz', code: 'SAI', number: 55, team: 'Williams' },
  { id: 'hulkenberg', name: 'Nico Hülkenberg', code: 'HUL', number: 27, team: 'Audi' },
  { id: 'bortoleto', name: 'Gabriel Bortoleto', code: 'BOR', number: 5, team: 'Audi' },
  { id: 'bottas', name: 'Valtteri Bottas', code: 'BOT', number: 77, team: 'Cadillac' },
  { id: 'perez', name: 'Sergio Perez', code: 'PER', number: 11, team: 'Cadillac' },
]

const ALL_TEAMS = [
  { id: 'mclaren', name: 'McLaren', color: '#FF8000' },
  { id: 'red_bull', name: 'Red Bull Racing', color: '#3671C6' },
  { id: 'ferrari', name: 'Ferrari', color: '#E8002D' },
  { id: 'mercedes', name: 'Mercedes', color: '#27F4D2' },
  { id: 'aston_martin', name: 'Aston Martin', color: '#229971' },
  { id: 'alpine', name: 'Alpine', color: '#FF87BC' },
  { id: 'haas', name: 'Haas F1 Team', color: '#B6BABD' },
  { id: 'rb', name: 'Racing Bulls', color: '#6692FF' },
  { id: 'williams', name: 'Williams', color: '#64C4FF' },
  { id: 'audi', name: 'Audi', color: '#B20000' },
  { id: 'cadillac', name: 'Cadillac', color: '#C8AA6E' },
]

const ALL_CIRCUITS = [
  { id: 'bahrain', name: 'Bahrain', country: 'Bahrain', flagCode: 'bh' },
  { id: 'jeddah', name: 'Jeddah', country: 'Saudi Arabia', flagCode: 'sa' },
  { id: 'albert_park', name: 'Melbourne', country: 'Australia', flagCode: 'au' },
  { id: 'shanghai', name: 'Shanghai', country: 'China', flagCode: 'cn' },
  { id: 'miami', name: 'Miami', country: 'USA', flagCode: 'us' },
  { id: 'imola', name: 'Imola', country: 'Italy', flagCode: 'it' },
  { id: 'monaco', name: 'Monaco', country: 'Monaco', flagCode: 'mc' },
  { id: 'villeneuve', name: 'Montreal', country: 'Canada', flagCode: 'ca' },
  { id: 'catalunya', name: 'Barcelona', country: 'Spain', flagCode: 'es' },
  { id: 'red_bull_ring', name: 'Spielberg', country: 'Austria', flagCode: 'at' },
  { id: 'silverstone', name: 'Silverstone', country: 'UK', flagCode: 'gb' },
  { id: 'hungaroring', name: 'Budapest', country: 'Hungary', flagCode: 'hu' },
  { id: 'spa', name: 'Spa', country: 'Belgium', flagCode: 'be' },
  { id: 'zandvoort', name: 'Zandvoort', country: 'Netherlands', flagCode: 'nl' },
  { id: 'monza', name: 'Monza', country: 'Italy', flagCode: 'it' },
  { id: 'baku', name: 'Baku', country: 'Azerbaijan', flagCode: 'az' },
  { id: 'marina_bay', name: 'Singapore', country: 'Singapore', flagCode: 'sg' },
  { id: 'suzuka', name: 'Suzuka', country: 'Japan', flagCode: 'jp' },
  { id: 'losail', name: 'Lusail', country: 'Qatar', flagCode: 'qa' },
  { id: 'cota', name: 'Austin', country: 'USA', flagCode: 'us' },
  { id: 'rodriguez', name: 'Mexico City', country: 'Mexico', flagCode: 'mx' },
  { id: 'interlagos', name: 'São Paulo', country: 'Brazil', flagCode: 'br' },
  { id: 'vegas', name: 'Las Vegas', country: 'USA', flagCode: 'us' },
  { id: 'yas_marina', name: 'Abu Dhabi', country: 'UAE', flagCode: 'ae' },
]

const ALL_EXTRAS = [
  { id: 'max', name: 'Max Verstappen', sub: 'GT3 · Nürburgring · Records', path: '/max' },
  { id: 'season-overview', name: 'Season Overview', path: '/season-overview' },
  { id: 'seasons', name: 'Seasons', path: '/seasons' },
]

const NAV_LINKS = [
  { path: '/', label: 'Home', num: '01', dropdown: null },
  { path: '/drivers', label: 'Drivers', num: '02', dropdown: 'drivers' },
  { path: '/compare', label: 'Compare', num: '03', dropdown: null },
  { path: '/calendar', label: 'Calendar', num: '04', dropdown: null },
  { path: '/circuits', label: 'Circuits', num: '05', dropdown: 'circuits' },
  { path: '/teams', label: 'Teams', num: '06', dropdown: 'teams' },
  { path: '/extras', label: 'Extras', num: '07', dropdown: 'extras', noLink: true },
]
function DriverCard({ driver }) {
  const color = TEAM_COLORS[driver.team] || '#888'
  return (
    <Link to={`/drivers/${driver.id}`} className={styles.driverCard}>
      <div className={styles.driverCardImg} style={{ borderColor: color }}>
        <img
          src={`/drivers/${DRIVER_IMAGES[driver.id] || driver.id}.avif`}
          alt={driver.name}
          className={styles.driverCardPhoto}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div className={styles.driverCardFallback} style={{ display: 'none' }}>
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
    <Link to={`/teams/${team.id}`} className={styles.teamCard}>
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

function Navbar({ toggleTheme, theme, onSearchOpen }) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [glitchLogo, setGlitchLogo] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [liveSession, setLiveSession] = useState(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    const handleMutation = () => {
      setScrolled(document.body.classList.contains('scrolled'))
    }
    const observer = new MutationObserver(handleMutation)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // scroll progress for non-home pages
  useEffect(() => {
    const handleContainerScroll = (e) => {
      const el = e.target
      const total = el.scrollHeight - el.clientHeight
      setScrollProgress(total > 0 ? (el.scrollTop / total) * 100 : 0)
      setScrolled(el.scrollTop > 20)
    }
    const container = document.getElementById('main-scroll')
    if (container) {
      container.addEventListener('scroll', handleContainerScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleContainerScroll)
    }
  }, [location.pathname])

  useEffect(() => {
    setOpenDropdown(null)
    setMenuOpen(false)
    setScrollProgress(0)
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
      } catch (e) { }
    }
    checkLive()
    const interval = setInterval(checkLive, 300000)
    return () => clearInterval(interval)
  }, [])

  const handleLogoHover = () => {
    setGlitchLogo(true)
    try {

    } catch (e) { }
    setTimeout(() => setGlitchLogo(false), 400)
  }

  const handleLinkEnter = (key) => {
    clearTimeout(closeTimer.current)
    setOpenDropdown(key)
  }
  const handleLinkLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 500)
  }
  const handleDropdownEnter = () => clearTimeout(closeTimer.current)
  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 300)
  }

  const renderDropdown = (type) => {
    if (type === 'drivers') return (
      <div className={styles.dropdownDrivers}>
        <div className={styles.dropdownHeader}>
          <span>2026 Drivers</span>
          <div className={styles.dropdownHeaderRight}>
            <Link to="/drivers" className={styles.dropdownViewAll}>View all →</Link>
            <Link to="/drivers/old" className={styles.oldDriversBtn}>Old Drivers</Link>
          </div>
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
          <Link to="/teams" className={styles.dropdownViewAll}>View all →</Link>
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
            <Link key={c.id} to={`/circuits?track=${c.id}`} className={styles.circuitItem}>
              <img src={`https://flagcdn.com/24x18/${c.flagCode}.png`} alt={c.country} className={styles.circuitItemFlag} />
              <div>
                <span className={styles.circuitItemName}>{c.name}</span>
                <span className={styles.circuitItemCountry}>{c.country}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )

    if (type === 'extras') return (
      <div className={styles.dropdownExtras}>
        <div className={styles.dropdownHeader}>
          <span>Special Pages</span>
        </div>
        <div className={styles.extrasList}>
          {ALL_EXTRAS.map(e => (
            <Link key={e.id} to={e.path} className={styles.extrasItem}>
              <div>
                <span className={styles.extrasName}>{e.name}</span>

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
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* scroll progress bar at bottom */}
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* logo */}
        <Link to="/" className={styles.logo} onMouseEnter={handleLogoHover}>
          <img
            src="/logo.png"
            alt="F1 Hub"
            className={styles.logoImg}
            onError={e => e.target.style.display = 'none'}
          />

        </Link>

        {/* nav links — timing tower style */}
        <div className={styles.links}>
          {NAV_LINKS.map((l) => {
            const isActive = location.pathname === l.path ||
              (l.path !== '/' && location.pathname.startsWith(l.path + '/'))
            return (
              <div
                key={l.path}
                className={styles.linkWrap}
                onMouseEnter={() => handleLinkEnter(l.dropdown || l.path)}
                onMouseLeave={handleLinkLeave}
              >
                {l.noLink ? (
                  <div className={`${styles.link} ${styles.linkNoClick}`}>
                    <span className={styles.linkNum}>{l.num}</span>
                    <span className={styles.linkLabel}>{l.label}</span>
                    {l.dropdown && (
                      <span className={`${styles.chevron} ${openDropdown === l.dropdown ? styles.chevronOpen : ''}`}>›</span>
                    )}
                  </div>
                ) : (
                  <Link
                    to={l.path}
                    className={`${styles.link} ${isActive ? styles.active : ''}`}
                  >
                    <span className={styles.linkNum}>{l.num}</span>
                    <span className={styles.linkLabel}>{l.label}</span>
                    {l.dropdown && (
                      <span className={`${styles.chevron} ${openDropdown === l.dropdown ? styles.chevronOpen : ''}`}>›</span>
                    )}
                  </Link>
                )}

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

        {/* right side */}
        <div className={styles.navRight}>
          <button className={styles.searchBtn} onClick={onSearchOpen} title="Search (/)">
            <span className={styles.searchIcon}>⌕</span>
            <span className={styles.searchText}>Search drivers, teams...    </span>
          </button>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className={`${styles.themeIcon} ${theme === 'light' ? styles.themeIconLight : ''}`} />
          </button>

          {/* broadcast-style live indicator */}
          <div className={styles.liveWrap}>
            <div className={`${styles.livePill} ${liveSession ? styles.livePillActive : ''}`}>
              <span className={`${styles.liveDot} ${liveSession ? styles.liveDotActive : ''}`} />
              <span className={styles.liveLabel}>{liveSession ? '● ON AIR' : '○ OFFLINE'}</span>
            </div>
            <div className={styles.liveTooltip}>
              {liveSession
                ? `🔴 ${liveSession.session_name} — ${liveSession.meeting_name}`
                : 'No session currently live'
              }
            </div>
          </div>

          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              className={styles.mobileMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={styles.mobileMenuTop}>
                <span className={styles.mobileMenuTitle}>Menu</span>
              </div>

              <div className={styles.mobileLinks}>
                {NAV_LINKS.map((l, i) => (
                  <motion.div
                    key={l.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: i * 0.06 + 0.1 }}
                  >
                    {l.dropdown === 'extras' ? (
                      <Link
                        to="/max"
                        className={styles.mobileLink}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className={styles.mobileLinkLabel}>{l.label}</span>
                        <span className={styles.mobileLinkNum}>{l.num}</span>
                      </Link>
                    ) : l.noLink ? (
                      <div className={styles.mobileLink}>
                        <span className={styles.mobileLinkLabel}>{l.label}</span>
                        <span className={styles.mobileLinkNum}>{l.num}</span>
                      </div>
                    ) : (
                      <Link
                        to={l.path}
                        className={`${styles.mobileLink} ${location.pathname === l.path ? styles.mobileLinkActive : ''}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className={styles.mobileLinkLabel}>{l.label}</span>
                        <span className={styles.mobileLinkNum}>{l.num}</span>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className={styles.mobileMenuBottom}>
                <span className={styles.mobileMenuFooter}>F1 HUB · 2026</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
export default Navbar