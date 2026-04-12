import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCurrentSeason } from '../services/ergast'
import styles from './Calendar.module.css'

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
      } catch(e) {
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

  return (
    <main className={styles.main}>

      {/* header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className={styles.eyebrow}>Formula 1 · 2025</p>
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

      {/* race list */}
      <div className={styles.raceList}>
        {races.map((race, i) => {
          const status = getRaceStatus(race)
          const isExpanded = expandedRace === race.round
          const raceDate = new Date(race.date)

          return (
            <motion.div
              key={race.round}
              className={`${styles.raceCard} ${styles[status]}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              onClick={() => toggleRace(race.round)}
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
                  <span className={styles.raceCountry}>{race.Circuit.Location.country}</span>
                  <span className={styles.raceLocality}>{race.Circuit.Location.locality}</span>
                </div>

                <div className={styles.raceRight}>
                  <span className={styles.raceDate}>
                    {raceDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className={`${styles.raceBadge} ${styles[`badge_${status}`]}`}>
                    {status === 'completed' ? '✓ Done' : status === 'next' ? '⚡ Next' : 'Upcoming'}
                  </span>
                </div>

                <span className={`${styles.expandIcon} ${isExpanded ? styles.expandIconOpen : ''}`}>▾</span>
              </div>

              {/* expanded session schedule */}
              <motion.div
                className={styles.sessions}
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div className={styles.sessionsInner}>
                  {race.FirstPractice && (
                    <div className={styles.session}>
                      <span className={styles.sessionName}>FP1</span>
                      <span className={styles.sessionDate}>{new Date(race.FirstPractice.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <span className={styles.sessionTime}>{race.FirstPractice.time?.slice(0, 5) || '--:--'}</span>
                    </div>
                  )}
                  {race.SecondPractice && (
                    <div className={styles.session}>
                      <span className={styles.sessionName}>FP2</span>
                      <span className={styles.sessionDate}>{new Date(race.SecondPractice.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <span className={styles.sessionTime}>{race.SecondPractice.time?.slice(0, 5) || '--:--'}</span>
                    </div>
                  )}
                  {race.ThirdPractice && (
                    <div className={styles.session}>
                      <span className={styles.sessionName}>FP3</span>
                      <span className={styles.sessionDate}>{new Date(race.ThirdPractice.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <span className={styles.sessionTime}>{race.ThirdPractice.time?.slice(0, 5) || '--:--'}</span>
                    </div>
                  )}
                  {race.Sprint && (
                    <div className={styles.session}>
                      <span className={styles.sessionName}>Sprint</span>
                      <span className={styles.sessionDate}>{new Date(race.Sprint.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <span className={styles.sessionTime}>{race.Sprint.time?.slice(0, 5) || '--:--'}</span>
                    </div>
                  )}
                  {race.Qualifying && (
                    <div className={styles.session}>
                      <span className={styles.sessionName}>Qualifying</span>
                      <span className={styles.sessionDate}>{new Date(race.Qualifying.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <span className={styles.sessionTime}>{race.Qualifying.time?.slice(0, 5) || '--:--'}</span>
                    </div>
                  )}
                  <div className={`${styles.session} ${styles.sessionRace}`}>
                    <span className={styles.sessionName}>Race</span>
                    <span className={styles.sessionDate}>{raceDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span className={styles.sessionTime}>{race.time?.slice(0, 5) || '--:--'}</span>
                  </div>
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