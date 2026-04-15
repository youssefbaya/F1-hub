import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Drivers.module.css'
import { getDriverStandings } from '../services/ergast.js'

const DRIVER_IMAGES = {
  norris: 'lando_norris',
  piastri: 'oscar_piastri',
  max_verstappen: 'max_verstappen',
  hadjar: 'isack_hadjar',
  leclerc: 'charles_leclerc',
  hamilton: 'lewis_hamilton',
  russell: 'george_russell',
  antonelli: 'andrea_kimi_antonelli',
  alonso: 'fernando_alonso',
  stroll: 'lance_stroll',
  gasly: 'pierre_gasly',
  colapinto: 'franco_colapinto',
  ocon: 'esteban_ocon',
  bearman: 'oliver_bearman',
  lawson: 'liam_lawson',
  lindblad: 'arvid_lindblad',
  albon: 'alexander_albon',
  sainz: 'carlos_sainz',
  hulkenberg: 'nico_hulkenberg',
  bortoleto: 'gabriel_bortoleto',
  bottas: 'valtteri_bottas',
  perez: 'sergio_perez',
  vettel: 'sebastian_vettel',
  rosberg: 'nico_rosberg',
  raikkonen: 'kimi_raikkonen',
  massa: 'felipe_massa',
  button: 'jenson_button',
  webber: 'mark_webber',
  schumacher: 'michael_schumacher',
}

const NATIONALITY_TO_FLAG = {
  Dutch: 'nl',
  French: 'fr',
  'Monégasque': 'mc',
  British: 'gb',
  Italian: 'it',
  Australian: 'au',
  Spanish: 'es',
  Canadian: 'ca',
  Argentine: 'ar',
  'New Zealander': 'nz',
  Thai: 'th',
  German: 'de',
  Brazilian: 'br',
  Finnish: 'fi',
  Mexican: 'mx',
}

const TEAM_COLORS = {
  McLaren: '#FF8000',
  'Red Bull': '#3671C6',
  'Red Bull Racing': '#3671C6',
  Ferrari: '#E8002D',
  Mercedes: '#27F4D2',
  'Aston Martin': '#229971',
  'Alpine F1 Team': '#FF87BC',
  Alpine: '#FF87BC',
  'Haas F1 Team': '#B6BABD',
  Haas: '#B6BABD',
  'Racing Bulls': '#6692FF',
  'RB F1 Team': '#6692FF',
  Williams: '#64C4FF',
  Audi: '#B20000',
  Sauber: '#52E252',
  Cadillac: '#C8AA6E',
  Renault: '#FFF500',
  Lotus: '#C0B000',
  Brawn: '#D8E600',
  'BMW Sauber': '#52E252',
  Toyota: '#D9D9D9',
  BAR: '#B0B0B0',
  Benetton: '#2A8F5B',
  Jordan: '#E8D000',
  Jaguar: '#0B6B3A',
  Minardi: '#1F3C88',
  'Toro Rosso': '#1E5BC6',
  'AlphaTauri': '#4E7C9B',
}

function getFlagCode(driver) {
  return NATIONALITY_TO_FLAG[driver.nationality] || null
}

function getDisplayName(driver) {
  return `${driver.givenName} ${driver.familyName}`
}

function getDisplayNumber(driver) {
  return driver.permanentNumber ? Number(driver.permanentNumber) : '—'
}

function getStandingMeta(driverId, standingsMap) {
  return standingsMap[driverId] || null
}

function getDriverColor(driverId, standingsMap) {
  const standing = standingsMap[driverId]
  const team = standing?.Constructors?.[0]?.name
  return TEAM_COLORS[team] || 'var(--accent)'
}

function DriverCard({ driver, standing, standingsMap }) {
  const navigate = useNavigate()
  const flag = getFlagCode(driver)
  const color = getDriverColor(driver.driverId, standingsMap)

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px) scale(1.015)`
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform =
      'perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)'
  }

  const displayName = getDisplayName(driver)
  const imageKey = DRIVER_IMAGES[driver.driverId] || driver.driverId
  const currentTeam = standing?.Constructors?.[0]?.name || 'Retired / historical'

  return (
    <motion.div
      className={styles.card}
      style={{ '--team-color': color }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/drivers/${driver.driverId}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.cardBar} style={{ background: color }} />

      <div className={styles.cardPhoto}>
        <img
          src={`/drivers/${imageKey}.avif`}
          alt={displayName}
          className={styles.cardPhotoImg}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div
          className={styles.cardPhotoGradient}
          style={{ background: 'linear-gradient(to top, var(--surface) 0%, transparent 60%)' }}
        />

        <div
          className={styles.cardNumber}
          style={{
            color,
            borderColor: `${color}40`,
            background: 'rgba(0,0,0,0.55)',
          }}
        >
          {getDisplayNumber(driver)}
        </div>

        <div className={styles.cardOverlay}>
          <div className={styles.overlayStats}>
            <div className={styles.overlayStat}>
              <span className={styles.overlayStatVal} style={{ color }}>
                {standing?.position ? `P${standing.position}` : '—'}
              </span>
              <span className={styles.overlayStatLabel}>Position</span>
            </div>
            <div className={styles.overlayStat}>
              <span className={styles.overlayStatVal} style={{ color }}>
                {standing?.points || '—'}
              </span>
              <span className={styles.overlayStatLabel}>Points</span>
            </div>
            <div className={styles.overlayStat}>
              <span className={styles.overlayStatVal} style={{ color }}>
                {standing?.wins || '—'}
              </span>
              <span className={styles.overlayStatLabel}>Wins</span>
            </div>
          </div>
          <p className={styles.overlayHint}>View Profile →</p>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardNameRow}>
          {flag && (
            <img
              src={`https://flagcdn.com/16x12/${flag}.png`}
              alt=""
              className={styles.cardFlag}
            />
          )}
          <p className={styles.cardName}>{displayName}</p>
        </div>
        <p className={styles.cardTeam} style={{ color }}>{currentTeam}</p>
      </div>

      <div className={styles.cardGlow} />
    </motion.div>
  )
}

function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showActiveOnly, setShowActiveOnly] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [driversRes, standingsRes] = await Promise.all([
          fetch('/api/drivers').then(r => r.json()),
          getDriverStandings(),
        ])

        setDrivers(driversRes.drivers || [])
        setStandings(standingsRes || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const standingsMap = useMemo(() => {
    const map = {}
    standings.forEach(s => {
      map[s.Driver.driverId] = s
    })
    return map
  }, [standings])

  const filteredDrivers = useMemo(() => {
    let list = [...drivers]

    if (showActiveOnly) {
      list = list.filter(d => standingsMap[d.driverId])
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(d => {
        const name = `${d.givenName} ${d.familyName}`.toLowerCase()
        return (
          name.includes(q) ||
          d.driverId?.toLowerCase().includes(q) ||
          d.code?.toLowerCase().includes(q) ||
          d.nationality?.toLowerCase().includes(q)
        )
      })
    }

    return list.sort((a, b) => {
      const aStanding = standingsMap[a.driverId]
      const bStanding = standingsMap[b.driverId]

      if (showActiveOnly) {
        return Number(aStanding?.position || 999) - Number(bStanding?.position || 999)
      }

      const aActive = !!aStanding
      const bActive = !!bStanding

      if (aActive && !bActive) return -1
      if (!aActive && bActive) return 1

      return `${a.familyName}`.localeCompare(`${b.familyName}`)
    })
  }, [drivers, standingsMap, query, showActiveOnly])

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Formula 1</p>
          <h1 className={styles.title}>Drivers</h1>
        </div>
        <p>Loading drivers...</p>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className={styles.eyebrow}>Formula 1 · Driver Database</p>
        <h1 className={styles.title}>Drivers</h1>
      </motion.div>

      <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search drivers..."
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid var(--border-color, #333)',
            background: 'var(--surface)',
            color: 'var(--text)',
          }}
        />

        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
          />
          Show active drivers only
        </label>
      </div>

      <div className={styles.grid}>
        {filteredDrivers.map((driver, i) => (
          <motion.div
            key={driver.driverId}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <DriverCard
              driver={driver}
              standing={getStandingMeta(driver.driverId, standingsMap)}
              standingsMap={standingsMap}
            />
          </motion.div>
        ))}
      </div>
    </main>
  )
}

export default Drivers