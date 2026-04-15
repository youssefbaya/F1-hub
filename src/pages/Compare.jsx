import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Compare.module.css'

const ALL_DRIVERS = [
  { id: 'norris', name: 'Lando Norris', code: 'NOR', team: 'McLaren', color: '#FF8000', img: 'lando_norris', debut: 2019 },
  { id: 'piastri', name: 'Oscar Piastri', code: 'PIA', team: 'McLaren', color: '#FF8000', img: 'oscar_piastri', debut: 2023 },
  { id: 'max_verstappen', name: 'Max Verstappen', code: 'VER', team: 'Red Bull', color: '#3671C6', img: 'max_verstappen', debut: 2015 },
  { id: 'hadjar', name: 'Isack Hadjar', code: 'HAD', team: 'Red Bull', color: '#3671C6', img: 'isack_hadjar', debut: 2025 },
  { id: 'leclerc', name: 'Charles Leclerc', code: 'LEC', team: 'Ferrari', color: '#E8002D', img: 'charles_leclerc', debut: 2018 },
  { id: 'hamilton', name: 'Lewis Hamilton', code: 'HAM', team: 'Ferrari', color: '#E8002D', img: 'lewis_hamilton', debut: 2007 },
  { id: 'russell', name: 'George Russell', code: 'RUS', team: 'Mercedes', color: '#27F4D2', img: 'george_russell', debut: 2019 },
  { id: 'antonelli', name: 'Kimi Antonelli', code: 'ANT', team: 'Mercedes', color: '#27F4D2', img: 'andrea_kimi_antonelli', debut: 2025 },
  { id: 'alonso', name: 'Fernando Alonso', code: 'ALO', team: 'Aston Martin', color: '#229971', img: 'fernando_alonso', debut: 2001 },
  { id: 'stroll', name: 'Lance Stroll', code: 'STR', team: 'Aston Martin', color: '#229971', img: 'lance_stroll', debut: 2017 },
  { id: 'gasly', name: 'Pierre Gasly', code: 'GAS', team: 'Alpine', color: '#FF87BC', img: 'pierre_gasly', debut: 2017 },
  { id: 'colapinto', name: 'Franco Colapinto', code: 'COL', team: 'Alpine', color: '#FF87BC', img: 'franco_colapinto', debut: 2024 },
  { id: 'ocon', name: 'Esteban Ocon', code: 'OCO', team: 'Haas F1 Team', color: '#B6BABD', img: 'esteban_ocon', debut: 2016 },
  { id: 'bearman', name: 'Oliver Bearman', code: 'BEA', team: 'Haas F1 Team', color: '#B6BABD', img: 'oliver_bearman', debut: 2025 },
  { id: 'lawson', name: 'Liam Lawson', code: 'LAW', team: 'Racing Bulls', color: '#6692FF', img: 'liam_lawson', debut: 2023 },
  { id: 'lindblad', name: 'Arvid Lindblad', code: 'LIN', team: 'Racing Bulls', color: '#6692FF', img: 'arvid_lindblad', debut: 2026 },
  { id: 'albon', name: 'Alexander Albon', code: 'ALB', team: 'Williams', color: '#64C4FF', img: 'alexander_albon', debut: 2019 },
  { id: 'sainz', name: 'Carlos Sainz', code: 'SAI', team: 'Williams', color: '#64C4FF', img: 'carlos_sainz', debut: 2015 },
  { id: 'hulkenberg', name: 'Nico Hülkenberg', code: 'HUL', team: 'Audi', color: '#B20000', img: 'nico_hulkenberg', debut: 2010 },
  { id: 'bortoleto', name: 'Gabriel Bortoleto', code: 'BOR', team: 'Audi', color: '#B20000', img: 'gabriel_bortoleto', debut: 2025 },
  { id: 'bottas', name: 'Valtteri Bottas', code: 'BOT', team: 'Cadillac', color: '#C8AA6E', img: 'valtteri_bottas', debut: 2013 },
  { id: 'perez', name: 'Sergio Perez', code: 'PER', team: 'Cadillac', color: '#C8AA6E', img: 'sergio_perez', debut: 2011 },
]

const START_YEAR = 1985

async function fetchCareerData(driverId, fromYear, toYear) {
  try {
    const [driverRes, standingsRes] = await Promise.all([
      fetch(`/api/driver?driverId=${driverId}`)
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`/api/standings`)
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null),
    ])

    if (!driverRes?.driver) {
      return {
        championships: 0,
        wins: 0,
        seasons: 0,
        points: 0,
        position: null,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        dnfs: 0,
        racesTotal: 0,
        winRate: 0,
        podiumRate: 0,
        poleRate: 0,
      }
    }

    const currentYear = new Date().getFullYear()
    const currentStanding = standingsRes?.standings?.find(
      d => d.Driver.driverId === driverId
    )

    const seasonSummaries = (driverRes.seasonSummaries || []).filter((s) => {
      const year = Number(s.season)
      return year >= fromYear && year <= toYear
    })

    const championships = seasonSummaries.filter(
      s => Number(s.championshipPosition) === 1
    ).length

    const wins = seasonSummaries.reduce((sum, s) => sum + Number(s.wins || 0), 0)
    const podiums = seasonSummaries.reduce((sum, s) => sum + Number(s.podiums || 0), 0)
    const poles = seasonSummaries.reduce((sum, s) => sum + Number(s.poles || 0), 0)
    const fastestLaps = seasonSummaries.reduce((sum, s) => sum + Number(s.fastestLaps || 0), 0)
    const dnfs = seasonSummaries.reduce((sum, s) => sum + Number(s.dnfs || 0), 0)

    const racesTotal = seasonSummaries.reduce((sum, s) => {
      const races = Number(s.races || 0)
      return sum + races
    }, 0)

    const safeRacesTotal = racesTotal > 0 ? racesTotal : 0
    const hasBrokenRaceCount = safeRacesTotal < wins || safeRacesTotal < podiums || safeRacesTotal < poles

    const winRate = !hasBrokenRaceCount && safeRacesTotal > 0 ? (wins / safeRacesTotal) * 100 : 0
    const podiumRate = !hasBrokenRaceCount && safeRacesTotal > 0 ? (podiums / safeRacesTotal) * 100 : 0
    const poleRate = !hasBrokenRaceCount && safeRacesTotal > 0 ? (poles / safeRacesTotal) * 100 : 0

    return {
      championships,
      wins,
      seasons: seasonSummaries.length,
      points:
        fromYear <= currentYear && toYear >= currentYear
          ? Number(currentStanding?.points || 0)
          : seasonSummaries.reduce((sum, s) => sum + Number(s.points || 0), 0),
      position:
        fromYear <= currentYear && toYear >= currentYear
          ? Number(currentStanding?.position || 0)
          : null,
      podiums,
      poles,
      fastestLaps,
      dnfs,
      racesTotal: safeRacesTotal,
      winRate,
      podiumRate,
      poleRate,
    }
  } catch (e) {
    return {
      championships: 0,
      wins: 0,
      seasons: 0,
      points: 0,
      position: null,
      podiums: 0,
      poles: 0,
      fastestLaps: 0,
      dnfs: 0,
      racesTotal: 0,
      winRate: 0,
      podiumRate: 0,
      poleRate: 0,
    }
  }
}

function DriverSelector({ value, onChange }) {
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
              <img
                src={`/drivers/${driver.img}.avif`}
                alt={driver.name}
                className={styles.selectorPhoto}
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
            <div className={styles.selectorInfo}>
              <span className={styles.selectorName}>{driver.name}</span>
              <span className={styles.selectorTeam} style={{ color: driver.color }}>
                {driver.team}
              </span>
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
                onClick={() => {
                  onChange(d.id)
                  setOpen(false)
                }}
              >
                <div className={styles.optImg}>
                  <img
                    src={`/drivers/${d.img}.avif`}
                    alt={d.name}
                    className={styles.optPhoto}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                </div>
                <div className={styles.optInfo}>
                  <span className={styles.optName}>{d.name}</span>
                  <span className={styles.optTeam} style={{ color: d.color }}>
                    {d.team}
                  </span>
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
  const d1Wins = val1 > val2
  const d2Wins = val2 > val1

  return (
    <div className={styles.statRow}>
      <div className={styles.statLeft}>
        <span className={styles.statVal} style={{ color: d1Wins ? color1 : 'var(--white)' }}>
          {fmt(val1)}
        </span>
        <motion.div
          className={styles.statBarLeft}
          initial={{ width: 0 }}
          animate={{ width: `${pct1}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ background: color1, opacity: d1Wins ? 1 : 0.4 }}
        />
      </div>

      <span className={styles.statLabel}>{label}</span>

      <div className={styles.statRight}>
        <motion.div
          className={styles.statBarRight}
          initial={{ width: 0 }}
          animate={{ width: `${pct2}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ background: color2, opacity: d2Wins ? 1 : 0.4 }}
        />
        <span className={styles.statVal} style={{ color: d2Wins ? color2 : 'var(--white)' }}>
          {fmt(val2)}
        </span>
      </div>
    </div>
  )
}

function RadarChart({ data1, data2, d1, d2 }) {
  const size = 340
  const cx = size / 2
  const cy = size / 2
  const r = 130

  const stats = [
    { label: 'Championships', v1: data1.championships, v2: data2.championships },
    { label: 'Wins', v1: data1.wins, v2: data2.wins },
    { label: 'Podiums', v1: data1.podiums, v2: data2.podiums },
    { label: 'Win Rate %', v1: data1.winRate, v2: data2.winRate },
    { label: 'Podium Rate %', v1: data1.podiumRate, v2: data2.podiumRate },
    { label: 'Pole Rate %', v1: data1.poleRate, v2: data2.poleRate },
  ]

  const n = stats.length
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2

  const point = (i, pct) => ({
    x: cx + r * pct * Math.cos(angle(i)),
    y: cy + r * pct * Math.sin(angle(i)),
  })

  const polygon = (vals) => {
    const maxes = stats.map(s => Math.max(s.v1, s.v2, 1))
    return vals.map((v, i) => {
      const pct = v / maxes[i]
      const p = point(i, pct)
      return `${p.x},${p.y}`
    }).join(' ')
  }

  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <div className={styles.radarWrap}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxHeight: 360 }}>
        {gridLevels.map(level => (
          <polygon
            key={level}
            points={Array.from({ length: n }, (_, i) => {
              const p = point(i, level)
              return `${p.x},${p.y}`
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {stats.map((_, i) => {
          const p = point(i, 1)
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          )
        })}

        <polygon
          points={polygon(stats.map(s => s.v1))}
          fill={d1.color}
          fillOpacity="0.2"
          stroke={d1.color}
          strokeWidth="2"
        />

        <polygon
          points={polygon(stats.map(s => s.v2))}
          fill={d2.color}
          fillOpacity="0.2"
          stroke={d2.color}
          strokeWidth="2"
        />

        {stats.map((s, i) => {
          const p = point(i, 1.22)
          const anchor = p.x < cx - 5 ? 'end' : p.x > cx + 5 ? 'start' : 'middle'
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize="10"
              fill="var(--grey)"
              fontFamily="var(--mono)"
              letterSpacing="0.05em"
            >
              {s.label}
            </text>
          )
        })}
      </svg>

      <div className={styles.radarLegend}>
        <span style={{ color: d1.color, fontFamily: 'var(--mono)', fontSize: 11 }}>● {d1.code}</span>
        <span style={{ color: d2.color, fontFamily: 'var(--mono)', fontSize: 11 }}>● {d2.code}</span>
      </div>
    </div>
  )
}

function YearSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles.yearSelectWrap} ref={wrapperRef}>
      <button
        type="button"
        className={`${styles.yearSelectBtn} ${open ? styles.yearSelectBtnOpen : ''}`}
        onClick={() => setOpen((s) => !s)}
      >
        <span>{value}</span>
        <span className={`${styles.yearSelectChevron} ${open ? styles.yearSelectChevronOpen : ''}`}>
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.yearSelectMenu}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            {options.map((year) => (
              <button
                key={year}
                type="button"
                className={`${styles.yearSelectOption} ${value === year ? styles.yearSelectOptionActive : ''}`}
                onClick={() => {
                  onChange(year)
                  setOpen(false)
                }}
              >
                {year}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Compare() {
  const currentYear = new Date().getFullYear()
  const allYearOptions = Array.from(
    { length: currentYear - START_YEAR + 1 },
    (_, i) => START_YEAR + i
  )

  const [driver1Id, setDriver1Id] = useState('max_verstappen')
  const [driver2Id, setDriver2Id] = useState('hamilton')
  const [fromYear, setFromYear] = useState(2025)
  const [toYear, setToYear] = useState(currentYear)
  const [data1, setData1] = useState(null)
  const [data2, setData2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState('bars')

  const d1 = ALL_DRIVERS.find(d => d.id === driver1Id)
  const d2 = ALL_DRIVERS.find(d => d.id === driver2Id)

  useEffect(() => {
    if (!driver1Id || !driver2Id) return
    if (fromYear > toYear) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setData1(null)
      setData2(null)

      const [r1, r2] = await Promise.all([
        fetchCareerData(driver1Id, fromYear, toYear),
        fetchCareerData(driver2Id, fromYear, toYear),
      ])

      if (!cancelled) {
        setData1(r1)
        setData2(r2)
        setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [driver1Id, driver2Id, fromYear, toYear])

  return (
    <main className={styles.main}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className={styles.eyebrow}>Formula 1 · Comparison Tool</p>
        <h1 className={styles.title}>Compare Drivers</h1>
      </motion.div>

      <div className={styles.selectors}>
        <DriverSelector value={driver1Id} onChange={setDriver1Id} />
        <div className={styles.vsBlock}>
          <span className={styles.vs}>VS</span>
        </div>
        <DriverSelector value={driver2Id} onChange={setDriver2Id} />
      </div>

      <div className={styles.yearFilter}>
        <span className={styles.yearFilterLabel}>Period</span>

        <div className={styles.yearGroup}>
          <label className={styles.yearLabel}>From</label>
          <YearSelect
            value={fromYear}
            onChange={(year) => {
              setFromYear(year)
              if (year > toYear) setToYear(year)
            }}
            options={allYearOptions.filter(y => y <= toYear)}
          />
        </div>

        <div className={styles.yearGroup}>
          <label className={styles.yearLabel}>To</label>
          <YearSelect
            value={toYear}
            onChange={(year) => {
              setToYear(year)
              if (year < fromYear) setFromYear(year)
            }}
            options={allYearOptions.filter(y => y >= fromYear)}
          />
        </div>

        <button
          className={styles.resetBtn}
          onClick={() => {
            setFromYear(2025)
            setToYear(currentYear)
          }}
        >
          Reset
        </button>
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <motion.div
            className={styles.loadingBar}
            initial={{ width: '0%' }}
            animate={{ width: '60%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
          <p className={styles.loadingText}>Loading comparison data...</p>
        </div>
      )}

      {data1 && data2 && d1 && d2 && !loading && (
        <motion.div
          className={styles.statsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.statsHeader}>
            <span style={{ color: d1.color }}>{d1.code}</span>
            <span className={styles.statsHeaderLabel}>
              {fromYear === toYear ? `${fromYear}` : `${fromYear} — ${toYear}`}
            </span>
            <span style={{ color: d2.color }}>{d2.code}</span>
          </div>

          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${view === 'bars' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('bars')}
            >
              ▬ Bars
            </button>
            <button
              className={`${styles.viewBtn} ${view === 'radar' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('radar')}
            >
              ◈ Radar
            </button>
          </div>

          {view === 'bars' && (
            <div className={styles.statsRows}>
              <StatBar label="Championships" val1={data1.championships} val2={data2.championships} color1={d1.color} color2={d2.color} />
              <StatBar label="Wins" val1={data1.wins} val2={data2.wins} color1={d1.color} color2={d2.color} />
              <StatBar label="Podiums" val1={data1.podiums} val2={data2.podiums} color1={d1.color} color2={d2.color} />
              <StatBar label="Pole Positions" val1={data1.poles} val2={data2.poles} color1={d1.color} color2={d2.color} />
              <StatBar label="Fastest Laps" val1={data1.fastestLaps} val2={data2.fastestLaps} color1={d1.color} color2={d2.color} />
              <StatBar label="Total Races" val1={data1.racesTotal} val2={data2.racesTotal} color1={d1.color} color2={d2.color} />
              <StatBar label="DNFs" val1={data1.dnfs} val2={data2.dnfs} color1={d1.color} color2={d2.color} />
              <StatBar
                label="Win Rate"
                val1={data1.winRate}
                val2={data2.winRate}
                color1={d1.color}
                color2={d2.color}
                format={(v) => `${v.toFixed(1)}%`}
              />

              <StatBar
                label="Podium Rate"
                val1={data1.podiumRate}
                val2={data2.podiumRate}
                color1={d1.color}
                color2={d2.color}
                format={(v) => `${v.toFixed(1)}%`}
              />

              <StatBar
                label="Pole Rate"
                val1={data1.poleRate}
                val2={data2.poleRate}
                color1={d1.color}
                color2={d2.color}
                format={(v) => `${v.toFixed(1)}%`}
              />
              <StatBar
                label={fromYear === toYear ? `${fromYear} Points` : 'Points in Range'}
                val1={data1.points}
                val2={data2.points}
                color1={d1.color}
                color2={d2.color}
              />

              {data1.position && data2.position && fromYear <= currentYear && toYear >= currentYear && (
                <StatBar
                  label="Current Position"
                  val1={23 - data1.position}
                  val2={23 - data2.position}
                  color1={d1.color}
                  color2={d2.color}
                  format={v => `P${23 - v}`}
                />
              )}
            </div>
          )}

          {view === 'radar' && (
            <RadarChart data1={data1} data2={data2} d1={d1} d2={d2} />
          )}
        </motion.div>
      )}
    </main>
  )
}

export default Compare