import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Drivers.module.css'
import { CURRENT_2026_STANDINGS } from '../services/ergast.js'

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

const DRIVER_FLAGS = {
  'norris': 'gb', 'piastri': 'au', 'max_verstappen': 'nl',
  'hadjar': 'fr', 'leclerc': 'mc', 'hamilton': 'gb',
  'russell': 'gb', 'antonelli': 'it', 'alonso': 'es',
  'stroll': 'ca', 'gasly': 'fr', 'colapinto': 'ar',
  'ocon': 'fr', 'bearman': 'gb', 'lawson': 'nz',
  'lindblad': 'gb', 'albon': 'th', 'sainz': 'es',
  'hulkenberg': 'de', 'bortoleto': 'br', 'bottas': 'fi',
  'perez': 'mx',
}

const DRIVERS = [
  { id: 'max_verstappen', name: 'Max Verstappen', code: 'VER', number: 3, team: 'Red Bull', color: '#3671C6' },
  { id: 'hadjar', name: 'Isack Hadjar', code: 'HAD', number: 6, team: 'Red Bull', color: '#3671C6' },
  { id: 'norris', name: 'Lando Norris', code: 'NOR', number: 1, team: 'McLaren', color: '#FF8000' },
  { id: 'piastri', name: 'Oscar Piastri', code: 'PIA', number: 81, team: 'McLaren', color: '#FF8000' },
  { id: 'leclerc', name: 'Charles Leclerc', code: 'LEC', number: 16, team: 'Ferrari', color: '#E8002D' },
  { id: 'hamilton', name: 'Lewis Hamilton', code: 'HAM', number: 44, team: 'Ferrari', color: '#E8002D' },
  { id: 'russell', name: 'George Russell', code: 'RUS', number: 63, team: 'Mercedes', color: '#27F4D2' },
  { id: 'antonelli', name: 'Kimi Antonelli', code: 'ANT', number: 12, team: 'Mercedes', color: '#27F4D2' },
  { id: 'alonso', name: 'Fernando Alonso', code: 'ALO', number: 14, team: 'Aston Martin', color: '#229971' },
  { id: 'stroll', name: 'Lance Stroll', code: 'STR', number: 18, team: 'Aston Martin', color: '#229971' },
  { id: 'gasly', name: 'Pierre Gasly', code: 'GAS', number: 10, team: 'Alpine', color: '#FF87BC' },
  { id: 'colapinto', name: 'Franco Colapinto', code: 'COL', number: 43, team: 'Alpine', color: '#FF87BC' },
  { id: 'ocon', name: 'Esteban Ocon', code: 'OCO', number: 31, team: 'Haas F1 Team', color: '#B6BABD' },
  { id: 'bearman', name: 'Oliver Bearman', code: 'BEA', number: 87, team: 'Haas F1 Team', color: '#B6BABD' },
  { id: 'lawson', name: 'Liam Lawson', code: 'LAW', number: 30, team: 'Racing Bulls', color: '#6692FF' },
  { id: 'lindblad', name: 'Arvid Lindblad', code: 'LIN', number: 41, team: 'Racing Bulls', color: '#6692FF' },
  { id: 'albon', name: 'Alexander Albon', code: 'ALB', number: 23, team: 'Williams', color: '#64C4FF' },
  { id: 'sainz', name: 'Carlos Sainz', code: 'SAI', number: 55, team: 'Williams', color: '#64C4FF' },
  { id: 'hulkenberg', name: 'Nico Hülkenberg', code: 'HUL', number: 27, team: 'Audi', color: '#B20000' },
  { id: 'bortoleto', name: 'Gabriel Bortoleto', code: 'BOR', number: 5, team: 'Audi', color: '#B20000' },
  { id: 'bottas', name: 'Valtteri Bottas', code: 'BOT', number: 77, team: 'Cadillac', color: '#C8AA6E' },
  { id: 'perez', name: 'Sergio Perez', code: 'PER', number: 11, team: 'Cadillac', color: '#C8AA6E' },
]

function DriverCard({ driver, standing }) {
  const navigate = useNavigate()
  const flag = DRIVER_FLAGS[driver.id]

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px) scale(1.015)`
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)'
  }

  return (
    <motion.div
      className={styles.card}
      style={{ '--team-color': driver.color }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/drivers/${driver.id}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* top colour bar */}
      <div className={styles.cardBar} style={{ background: driver.color }} />

      {/* photo */}
      <div className={styles.cardPhoto}>
        <img
          src={`/drivers/${DRIVER_IMAGES[driver.id] || driver.id}.avif`}
          alt={driver.name}
          className={styles.cardPhotoImg}
          onError={e => { e.target.style.display = 'none' }}
        />
        {/* bottom gradient fade */}
        <div className={styles.cardPhotoGradient} style={{ background: `linear-gradient(to top, var(--surface) 0%, transparent 60%)` }} />

        {/* number badge */}
        <div className={styles.cardNumber} style={{ color: driver.color, borderColor: `${driver.color}40`, background: 'rgba(0,0,0,0.55)' }}>
          {driver.number}
        </div>

        {/* hover stats overlay */}
        <div className={styles.cardOverlay}>
          <div className={styles.overlayStats}>
            <div className={styles.overlayStat}>
              <span className={styles.overlayStatVal} style={{ color: driver.color }}>
                {standing?.position ? `P${standing.position}` : '—'}
              </span>
              <span className={styles.overlayStatLabel}>Position</span>
            </div>
            <div className={styles.overlayStat}>
              <span className={styles.overlayStatVal} style={{ color: driver.color }}>
                {standing?.points || '0'}
              </span>
              <span className={styles.overlayStatLabel}>Points</span>
            </div>
            <div className={styles.overlayStat}>
              <span className={styles.overlayStatVal} style={{ color: driver.color }}>
                {standing?.wins || '0'}
              </span>
              <span className={styles.overlayStatLabel}>Wins</span>
            </div>
          </div>
          <p className={styles.overlayHint}>View Profile →</p>
        </div>
      </div>

      {/* card body */}
      <div className={styles.cardBody}>
        <div className={styles.cardNameRow}>
          {flag && (
            <img
              src={`https://flagcdn.com/16x12/${flag}.png`}
              alt=""
              className={styles.cardFlag}
            />
          )}
          <p className={styles.cardName}>{driver.name}</p>
        </div>
        <p className={styles.cardTeam} style={{ color: driver.color }}>{driver.team}</p>
      </div>

      {/* team colour glow on hover */}
      <div className={styles.cardGlow} />
    </motion.div>
  )
}

function Drivers() {
  // build standings lookup from hardcoded data
  const standingsMap = {}
  CURRENT_2026_STANDINGS.forEach(s => {
    standingsMap[s.Driver.driverId] = {
      position: s.position,
      points: s.points,
      wins: s.wins,
    }
  })

  return (
    <main className={styles.main}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className={styles.eyebrow}>Formula 1 · 2026 Season</p>
        <h1 className={styles.title}>Drivers</h1>
      </motion.div>

      <div className={styles.grid}>
        {DRIVERS.map((driver, i) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <DriverCard
              driver={driver}
              standing={standingsMap[driver.id]}
            />
          </motion.div>
        ))}
      </div>
    </main>
  )
}

export default Drivers