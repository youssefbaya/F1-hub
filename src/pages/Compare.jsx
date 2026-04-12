import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Compare.module.css'
import { CURRENT_2026_STANDINGS } from '../services/ergast.js'

const BASE = 'https://api.jolpi.ca/ergast/f1'

const ALL_DRIVERS = [
  { id: 'norris',         name: 'Lando Norris',      code: 'NOR', team: 'McLaren',       color: '#FF8000', img: 'lando_norris',           debut: 2019 },
  { id: 'piastri',        name: 'Oscar Piastri',      code: 'PIA', team: 'McLaren',       color: '#FF8000', img: 'oscar_piastri',           debut: 2023 },
  { id: 'max_verstappen', name: 'Max Verstappen',     code: 'VER', team: 'Red Bull',      color: '#3671C6', img: 'max_verstappen',          debut: 2015 },
  { id: 'hadjar',         name: 'Isack Hadjar',       code: 'HAD', team: 'Red Bull',      color: '#3671C6', img: 'isack_hadjar',            debut: 2025 },
  { id: 'leclerc',        name: 'Charles Leclerc',    code: 'LEC', team: 'Ferrari',       color: '#E8002D', img: 'charles_leclerc',         debut: 2018 },
  { id: 'hamilton',       name: 'Lewis Hamilton',     code: 'HAM', team: 'Ferrari',       color: '#E8002D', img: 'lewis_hamilton',          debut: 2007 },
  { id: 'russell',        name: 'George Russell',     code: 'RUS', team: 'Mercedes',      color: '#27F4D2', img: 'george_russell',          debut: 2019 },
  { id: 'antonelli',      name: 'Kimi Antonelli',     code: 'ANT', team: 'Mercedes',      color: '#27F4D2', img: 'andrea_kimi_antonelli',   debut: 2025 },
  { id: 'alonso',         name: 'Fernando Alonso',    code: 'ALO', team: 'Aston Martin',  color: '#229971', img: 'fernando_alonso',         debut: 2001 },
  { id: 'stroll',         name: 'Lance Stroll',       code: 'STR', team: 'Aston Martin',  color: '#229971', img: 'lance_stroll',            debut: 2017 },
  { id: 'gasly',          name: 'Pierre Gasly',       code: 'GAS', team: 'Alpine',        color: '#FF87BC', img: 'pierre_gasly',            debut: 2017 },
  { id: 'colapinto',      name: 'Franco Colapinto',   code: 'COL', team: 'Alpine',        color: '#FF87BC', img: 'franco_colapinto',        debut: 2024 },
  { id: 'ocon',           name: 'Esteban Ocon',       code: 'OCO', team: 'Haas F1 Team',  color: '#B6BABD', img: 'esteban_ocon',            debut: 2016 },
  { id: 'bearman',        name: 'Oliver Bearman',     code: 'BEA', team: 'Haas F1 Team',  color: '#B6BABD', img: 'oliver_bearman',          debut: 2025 },
  { id: 'lawson',         name: 'Liam Lawson',        code: 'LAW', team: 'Racing Bulls',  color: '#6692FF', img: 'liam_lawson',             debut: 2023 },
  { id: 'lindblad',       name: 'Arvid Lindblad',     code: 'LIN', team: 'Racing Bulls',  color: '#6692FF', img: 'arvid_lindblad',          debut: 2026 },
  { id: 'albon',          name: 'Alexander Albon',    code: 'ALB', team: 'Williams',      color: '#64C4FF', img: 'alexander_albon',         debut: 2019 },
  { id: 'sainz',          name: 'Carlos Sainz',       code: 'SAI', team: 'Williams',      color: '#64C4FF', img: 'carlos_sainz',            debut: 2015 },
  { id: 'hulkenberg',     name: 'Nico Hülkenberg',    code: 'HUL', team: 'Audi',          color: '#B20000', img: 'nico_hulkenberg',         debut: 2010 },
  { id: 'bortoleto',      name: 'Gabriel Bortoleto',  code: 'BOR', team: 'Audi',          color: '#B20000', img: 'gabriel_bortoleto',       debut: 2025 },
  { id: 'bottas',         name: 'Valtteri Bottas',    code: 'BOT', team: 'Cadillac',      color: '#C8AA6E', img: 'valtteri_bottas',         debut: 2013 },
  { id: 'perez',          name: 'Sergio Perez',       code: 'PER', team: 'Cadillac',      color: '#C8AA6E', img: 'sergio_perez',            debut: 2011 },
]

const DEBUT_YEARS = {
  'max_verstappen': 2015, 'hamilton': 2007, 'leclerc': 2018,
  'norris': 2019, 'piastri': 2023, 'russell': 2019,
  'antonelli': 2025, 'alonso': 2001, 'stroll': 2017,
  'gasly': 2017, 'colapinto': 2024, 'ocon': 2016,
  'bearman': 2025, 'lawson': 2023, 'lindblad': 2026,
  'albon': 2019, 'sainz': 2015, 'hulkenberg': 2010,
  'bortoleto': 2025, 'bottas': 2013, 'perez': 2011,
  'hadjar': 2025,
}

async function fetchCareerData(driverId) {
  if (driverId === 'lindblad') {
    const s = CURRENT_2026_STANDINGS.find(d => d.Driver.driverId === 'lindblad')
    return { wins: 0, championships: 0, seasons: 1, points: parseInt(s?.points || 0), position: parseInt(s?.position || 22), podiums: 0 }
  }

  try {
    const infoRes = await fetch(`${BASE}/drivers/${driverId}.json`).then(r => r.json())
    const ergastId = infoRes.MRData?.DriverTable?.Drivers?.[0]?.driverId || driverId
    const debutYear = DEBUT_YEARS[ergastId] || 2015
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - debutYear + 1 }, (_, i) => debutYear + i)

    const results = await Promise.all(
      years.map(year =>
        fetch(`${BASE}/${year}/drivers/${ergastId}/driverStandings.json`)
          .then(r => r.ok ? r.json() : null).catch(() => null)
      )
    )

    const seasons = results
      .filter(Boolean)
      .map(d => d.MRData?.StandingsTable?.StandingsLists?.[0])
      .filter(Boolean)

    const currentYear2026Standing = CURRENT_2026_STANDINGS.find(d => d.Driver.driverId === driverId)

    const wins = seasons.filter(s => parseInt(s.season) < currentYear)
      .reduce((sum, s) => sum + parseInt(s.DriverStandings?.[0]?.wins || 0), 0)
    const championships = seasons.filter(s => parseInt(s.season) < currentYear)
      .filter(s => s.DriverStandings?.[0]?.position === '1').length
    const podiumsApprox = Math.round(wins * 2.8)

    return {
      wins,
      championships,
      seasons: seasons.length,
      points: parseInt(currentYear2026Standing?.points || 0),
      position: parseInt(currentYear2026Standing?.position || 22),
      podiums: podiumsApprox,
    }
  } catch(e) {
    return { wins: 0, championships: 0, seasons: 0, points: 0, position: 22, podiums: 0 }
  }
}

function DriverSelector({ value, onChange, side }) {
  const [open, setOpen] = useState(false)
  const driver = ALL_DRIVERS.find(d => d.id === value)

  return (
    <div className={styles.selector}>
      <button
        className={styles.selectorBtn}
        style={{ borderColor: driver?.color || 'var(--line)' }}
        onClick={() => setOpen(!open)}
      >
        {driver ? (
          <>
            <div className={styles.selectorImg}>
              <img src={`/drivers/${driver.img}.avif`} alt={driver.name} className={styles.selectorPhoto} onError={e => e.target.style.display = 'none'} />
            </div>
            <div className={styles.selectorInfo}>
              <span className={styles.selectorName}>{driver.name}</span>
              <span className={styles.selectorTeam} style={{ color: driver.color }}>{driver.team}</span>
            </div>
          </>
        ) : (
          <span className={styles.selectorPlaceholder}>Select a driver</span>
        )}
        <span className={`${styles.selectorChevron} ${open ? styles.selectorChevronOpen : ''}`}>›</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.selectorDropdown}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {ALL_DRIVERS.map(d => (
              <button
                key={d.id}
                className={`${styles.selectorOption} ${value === d.id ? styles.selectorOptionActive : ''}`}
                style={{ '--opt-color': d.color }}
                onClick={() => { onChange(d.id); setOpen(false) }}
              >
                <div className={styles.optImg}>
                  <img src={`/drivers/${d.img}.avif`} alt={d.name} className={styles.optPhoto} onError={e => e.target.style.display = 'none'} />
                </div>
                <div className={styles.optInfo}>
                  <span className={styles.optName}>{d.name}</span>
                  <span className={styles.optTeam} style={{ color: d.color }}>{d.team}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatBar({ label, val1, val2, color1, color2, format }) {
  const max = Math.max(val1, val2, 1)
  const pct1 = (val1 / max) * 100
  const pct2 = (val2 / max) * 100
  const fmt = format || (v => v)

  return (
    <div className={styles.statRow}>
      <div className={styles.statLeft}>
        <motion.div
          className={styles.statBarLeft}
          initial={{ width: 0 }}
          animate={{ width: `${pct1}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ background: color1 }}
        />
        <span className={styles.statVal} style={{ color: val1 > val2 ? color1 : 'var(--white)' }}>{fmt(val1)}</span>
      </div>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statRight}>
        <span className={styles.statVal} style={{ color: val2 > val1 ? color2 : 'var(--white)' }}>{fmt(val2)}</span>
        <motion.div
          className={styles.statBarRight}
          initial={{ width: 0 }}
          animate={{ width: `${pct2}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ background: color2 }}
        />
      </div>
    </div>
  )
}

function Compare() {
  const navigate = useNavigate()
  const [driver1Id, setDriver1Id] = useState('max_verstappen')
  const [driver2Id, setDriver2Id] = useState('hamilton')
  const [data1, setData1] = useState(null)
  const [data2, setData2] = useState(null)
  const [loading, setLoading] = useState(false)

  const d1 = ALL_DRIVERS.find(d => d.id === driver1Id)
  const d2 = ALL_DRIVERS.find(d => d.id === driver2Id)

  useEffect(() => {
    if (!driver1Id || !driver2Id) return
    setLoading(true)
    setData1(null)
    setData2(null)
    Promise.all([
      fetchCareerData(driver1Id),
      fetchCareerData(driver2Id),
    ]).then(([d1, d2]) => {
      setData1(d1)
      setData2(d2)
      setLoading(false)
    })
  }, [driver1Id, driver2Id])

  return (
    <main className={styles.main}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className={styles.eyebrow}>Formula 1 · 2026 Season</p>
        <h1 className={styles.title}>Compare Drivers</h1>
      </motion.div>

      {/* selectors */}
      <div className={styles.selectors}>
        <DriverSelector value={driver1Id} onChange={setDriver1Id} side="left" />
        <div className={styles.vsBlock}>
          <span className={styles.vs}>VS</span>
        </div>
        <DriverSelector value={driver2Id} onChange={setDriver2Id} side="right" />
      </div>

      {/* driver cards */}
      {d1 && d2 && (
        <motion.div
          className={styles.driverCards}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[{d: d1, side: 'left'}, {d: d2, side: 'right'}].map(({ d, side }) => (
            <motion.div
              key={d.id}
              className={styles.driverCard}
              style={{ '--dc': d.color, borderColor: d.color }}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/drivers/${d.id}`)}
            >
              <div className={styles.driverCardTop} style={{ borderColor: d.color }}>
                <img
                  src={`/drivers/${d.img}.avif`}
                  alt={d.name}
                  className={styles.driverCardPhoto}
                  onError={e => e.target.style.display = 'none'}
                />
              </div>
              <div className={styles.driverCardBody}>
                <p className={styles.driverCardName}>{d.name}</p>
                <p className={styles.driverCardTeam} style={{ color: d.color }}>{d.team}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* stats comparison */}
      {data1 && data2 && d1 && d2 && (
        <motion.div
          className={styles.statsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.statsHeader}>
            <span style={{ color: d1.color }}>{d1.code}</span>
            <span className={styles.statsHeaderLabel}>Career Stats</span>
            <span style={{ color: d2.color }}>{d2.code}</span>
          </div>

          <div className={styles.statsRows}>
            <StatBar label="Championships" val1={data1.championships} val2={data2.championships} color1={d1.color} color2={d2.color} />
            <StatBar label="Career Wins"   val1={data1.wins}          val2={data2.wins}          color1={d1.color} color2={d2.color} />
            <StatBar label="Est. Podiums"  val1={data1.podiums}       val2={data2.podiums}       color1={d1.color} color2={d2.color} />
            <StatBar label="Seasons"       val1={data1.seasons}       val2={data2.seasons}       color1={d1.color} color2={d2.color} />
            <StatBar label="2026 Points"   val1={data1.points}        val2={data2.points}        color1={d1.color} color2={d2.color} />
            <StatBar label="2026 Position" val1={23 - data1.position} val2={23 - data2.position} color1={d1.color} color2={d2.color} format={v => `P${23 - v}`} />
          </div>
        </motion.div>
      )}

      {loading && (
        <div className={styles.loadingState}>
          <motion.div
            className={styles.loadingBar}
            initial={{ width: 0 }}
            animate={{ width: '40%' }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          />
          <p className={styles.loadingText}>Loading career data...</p>
        </div>
      )}
    </main>
  )
}

export default Compare