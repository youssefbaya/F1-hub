import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCurrentSeason } from '../services/ergast'
import styles from './Calendar.module.css'
import { useNavigate } from 'react-router-dom'

const COUNTRY_FLAGS = {
  'Australia': 'au', 'China': 'cn', 'Japan': 'jp',
  'Bahrain': 'bh', 'Saudi Arabia': 'sa', 'USA': 'us',
  'United States': 'us', 'Italy': 'it', 'Monaco': 'mc',
  'Canada': 'ca', 'Spain': 'es', 'Austria': 'at',
  'UK': 'gb', 'Great Britain': 'gb', 'Hungary': 'hu',
  'Belgium': 'be', 'Netherlands': 'nl', 'Singapore': 'sg',
  'Qatar': 'qa', 'Mexico': 'mx', 'Brazil': 'br',
  'UAE': 'ae', 'Abu Dhabi': 'ae', 'Azerbaijan': 'az',
  'Las Vegas': 'us', 'Miami': 'us',
}

function formatLocalTime(date, time) {
  if (!date || !time) return { date: '--', time: '--:--', tz: '' }
  const utcStr = `${date}T${time}`
  const dt = new Date(utcStr)
  const localDate = dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const localTime = dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const offset = -dt.getTimezoneOffset() / 60
  const tzLabel = `UTC${offset >= 0 ? '+' : ''}${offset}`
  return { date: localDate, time: localTime, tz: tzLabel }
}

function Calendar() {
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRace, setExpandedRace] = useState(null)
  const today = new Date()

  useEffect(() => {
    async function fetchRaces() {
      try {
        const data = await getCurrentSeason()
        setRaces(data)
        // auto expand next race
        const next = data.find(r => new Date(r.date) >= today)
        if (next) setExpandedRace(next.round)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchRaces()
  }, [])

  const getRaceStatus = (race) => {
    const raceDate = new Date(race.date)
    if (raceDate < today) return 'completed'
    const diff = raceDate - today
    if (diff < 1000 * 60 * 60 * 24 * 7) return 'next'
    return 'upcoming'
  }

  const completedRaces = races.filter(r => getRaceStatus(r) === 'completed')
  const progress = races.length > 0 ? (completedRaces.length / races.length) * 100 : 0

  const navigate = useNavigate()

  const toggleRace = (round) => {
    setExpandedRace(expandedRace === round ? null : round)
  }

  if (loading) return (
    <div className={styles.loader}>
      <motion.div
        className={styles.loaderBar}
        initial={{ width: 0 }}
        animate={{ width: '60vw' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      <p className={styles.loaderText}>Loading season calendar...</p>
    </div>
  )

  // get user timezone label once
  const userTz = (() => {
    const offset = -new Date().getTimezoneOffset() / 60
    return `UTC${offset >= 0 ? '+' : ''}${offset}`
  })()

  return (
    <main className={styles.main}>

      {/* header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className={styles.eyebrow}>Formula 1 · 2026</p>
        <h1 className={styles.title}>Race <em>Calendar</em></h1>
        <div className={styles.seasonProgress}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>Season progress</span>
            <span className={styles.progressValue}>{completedRaces.length} / {races.length} races</span>
          </div>
          <div className={styles.progressTrack}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
            />
            <div className={styles.progressCar} style={{ left: `${progress}%` }}>🏎</div>
          </div>
        </div>
      </motion.div>

      {/* timezone notice */}
      <div className={styles.tzNotice}>
        <span className={styles.tzIcon}>🕐</span>
        <span>All times shown in your local timezone — <strong>{userTz}</strong></span>
      </div>

      {/* race list */}
      <div className={styles.raceList}>
        {races.map((race, i) => {
          const status = getRaceStatus(race)
          const isExpanded = expandedRace === race.round
          const raceDate = new Date(race.date)
          const flagCode = COUNTRY_FLAGS[race.Circuit.Location.country] || 'un'

          const sessions = [
            race.FirstPractice && { name: 'FP1', ...formatLocalTime(race.FirstPractice.date, race.FirstPractice.time), isRace: false },
            race.SecondPractice && { name: race.Sprint ? 'Sprint Quali' : 'FP2', ...formatLocalTime(race.SecondPractice.date, race.SecondPractice.time), isRace: false },
            race.ThirdPractice && { name: 'FP3', ...formatLocalTime(race.ThirdPractice.date, race.ThirdPractice.time), isRace: false },
            race.Sprint && { name: 'Sprint', ...formatLocalTime(race.Sprint.date, race.Sprint.time), isRace: false },
            race.Qualifying && { name: 'Qualifying', ...formatLocalTime(race.Qualifying.date, race.Qualifying.time), isRace: false },
            { name: 'Race', ...formatLocalTime(race.date, race.time), isRace: true },
          ].filter(Boolean)

          return (
            <motion.div
              key={race.round}
              className={`${styles.raceCard} ${styles[status]}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              onClick={() => {
                if (status === 'completed') {
                  navigate(`/race/${race.season}/${race.round}`)
                } else {
                  toggleRace(race.round)
                }
              }}
            >
              <div className={styles.raceMain}>
                <div className={styles.raceLeft}>
                  <span className={styles.raceRound}>R{race.round}</span>
                  <div className={styles.raceInfo}>
                    <h3 className={styles.raceName}>{race.raceName}</h3>
                    <p className={styles.raceCircuit}>{race.Circuit.circuitName}</p>
                  </div>
                </div>

                <div className={styles.raceCenter}>
                  <img
                    src={`https://flagcdn.com/24x18/${flagCode}.png`}
                    alt={race.Circuit.Location.country}
                    className={styles.raceFlag}
                  />
                  <div>
                    <span className={styles.raceCountry}>{race.Circuit.Location.country}</span>
                    <span className={styles.raceLocality}>{race.Circuit.Location.locality}</span>
                  </div>
                </div>

                <div className={styles.raceRight}>
                  <span className={styles.raceDate}>
                    {raceDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className={`${styles.raceBadge} ${styles[`badge_${status}`]}`}>
                    {status === 'completed' ? '✓ Done' : status === 'next' ? '⚡ Next' : 'Upcoming'}
                  </span>
                </div>

                <span
                  className={`${styles.expandIcon} ${isExpanded ? styles.expandIconOpen : ''}`}
                  onClick={e => {
                    e.stopPropagation()
                    toggleRace(race.round)
                  }}
                >▾</span>
              </div>

              {/* expanded sessions */}
              <motion.div
                className={styles.sessions}
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div className={styles.sessionsInner}>
                  {sessions.map(s => (
                    <div key={s.name} className={`${styles.session} ${s.isRace ? styles.sessionRace : ''}`}>
                      <span className={styles.sessionName}>{s.name}</span>
                      <span className={styles.sessionDate}>{s.date}</span>
                      <div className={styles.sessionTimeWrap}>
                        <span className={styles.sessionTime}>{s.time}</span>
                        <span className={styles.sessionTz}>{s.tz}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </main>
  )
}
export default Calendar