import { useState, useEffect, useRef } from 'react'
import CountdownTimer from '../components/CountdownTimer'
import { getNextRace, getDriverStandings, getConstructorStandings, getLastRaceResults } from '../services/ergast'
import styles from './Home.module.css'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

function Home() {
  const [nextRace, setNextRace] = useState(null)
  const [driverStandings, setDriverStandings] = useState([])
  const [constructorStandings, setConstructorStandings] = useState([])
  const [lastRace, setLastRace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(0)
  const [selectedSession, setSelectedSession] = useState(null)
  const containerRef = useRef(null)
  const modalRef = useRef(null)
  const { scrollY } = useScroll({ container: containerRef })
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, -60])

  useEffect(() => {
    async function fetchAll() {
      try {
        const [next, drivers, constructors, last] = await Promise.all([
          getNextRace(),
          getDriverStandings(),
          getConstructorStandings(),
          getLastRaceResults(),
        ])
        setNextRace(next)
        setDriverStandings(drivers)
        setConstructorStandings(constructors)
        setLastRace(last)
      } catch(e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      const index = Math.round(container.scrollTop / window.innerHeight)
      setActiveSection(index)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [loading])

  const scrollToSection = (i) => {
    const container = containerRef.current
    if (!container) return
    container.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' })
    setActiveSection(i)
  }

  const handleModalMouseMove = (e) => {
    const card = modalRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -8
    const rotateY = ((x - cx) / cx) * 8
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    card.style.setProperty('--mx', `${x}px`)
    card.style.setProperty('--my', `${y}px`)
  }

  const handleModalMouseLeave = () => {
    const card = modalRef.current
    if (!card) return
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)'
  }

  if (loading) return (
    <div className={styles.loader}>
      <motion.div
        className={styles.loaderBar}
        initial={{ width: 0 }}
        animate={{ width: '60vw' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      <motion.p
        className={styles.loaderText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Loading race data...
      </motion.p>
    </div>
  )

  const raceDate = nextRace ? new Date(`${nextRace.date}T${nextRace.time || '00:00:00'}`) : null
  const podium = lastRace?.Results?.slice(0, 3) || []

  const buildSessions = (race) => {
    if (!race) return []
    return [
      race.FirstPractice && {
        label: 'FP1',
        date: race.FirstPractice.date,
        time: race.FirstPractice.time,
        type: 'practice'
      },
      race.SecondPractice && {
        label: race.Sprint ? 'Sprint Quali' : 'FP2',
        date: race.SecondPractice.date,
        time: race.SecondPractice.time,
        type: race.Sprint ? 'sprintQuali' : 'practice'
      },
      race.Sprint && {
        label: 'Sprint',
        date: race.Sprint.date,
        time: race.Sprint.time,
        type: 'sprint'
      },
      race.ThirdPractice && {
        label: 'FP3',
        date: race.ThirdPractice.date,
        time: race.ThirdPractice.time,
        type: 'practice'
      },
      race.Qualifying && {
        label: 'Qualifying',
        date: race.Qualifying.date,
        time: race.Qualifying.time,
        type: 'quali'
      },
      race.date && {
        label: 'Race',
        date: race.date,
        time: race.time,
        type: 'race'
      },
    ].filter(Boolean)
  }

  const sessions = buildSessions(nextRace)

  return (
    <div className={styles.container} ref={containerRef}>

      <div className={styles.dotNav}>
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            className={`${styles.dot} ${activeSection === i ? styles.dotActive : ''}`}
            onClick={() => scrollToSection(i)}
          />
        ))}
      </div>

      {/* SECTION 0 — HERO */}
      <section className={styles.fullSection}>
        <div className={styles.heroGlow} />
        <motion.div
          className={styles.heroContent}
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.div
            className={styles.raceFlag}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🏁
          </motion.div>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Round {nextRace?.round} · {nextRace?.Circuit?.Location?.country}
          </motion.p>
          <motion.h1
            className={styles.raceName}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {nextRace?.raceName}
          </motion.h1>
          <motion.p
            className={styles.circuit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {nextRace?.Circuit?.circuitName}
          </motion.p>
          {raceDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <CountdownTimer targetDate={raceDate} />
            </motion.div>
          )}

          <motion.div
            className={styles.sessions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {sessions.map((session, i) => {
              const localDateTime = session.time
                ? new Date(`${session.date}T${session.time}`)
                : new Date(session.date)
              const localDate = localDateTime.toLocaleDateString('en-GB', {
                weekday: 'short', day: 'numeric', month: 'short'
              })
              const localTime = localDateTime.toLocaleTimeString('en-GB', {
                hour: '2-digit', minute: '2-digit'
              })
              const isPast = localDateTime < new Date()
              return (
                <div
                  key={i}
                  className={`${styles.session} ${styles[session.type]} ${isPast ? styles.pastSession : ''}`}
                  onClick={() => setSelectedSession({ ...session, localDate, localTime })}
                >
                  <span className={styles.sessionLabel}>{session.label}</span>
                  <span className={styles.sessionDate}>{localDate}</span>
                  <span className={styles.sessionTime}>{localTime}</span>
                  <span className={styles.sessionTz}>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ')}
                  </span>
                </div>
              )
            })}
          </motion.div>

          <motion.p
            className={styles.scrollHint}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            scroll to explore ↓
          </motion.p>
        </motion.div>
      </section>

      {/* SESSION MODAL */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSession(null)}
          >
            <motion.div
              ref={modalRef}
              className={`${styles.modalCard} ${styles[selectedSession.type]}`}
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              onMouseMove={handleModalMouseMove}
              onMouseLeave={handleModalMouseLeave}
            >
              <button
                className={styles.modalClose}
                onClick={() => setSelectedSession(null)}
              >✕</button>
              <p className={styles.modalEyebrow}>{nextRace?.raceName}</p>
              <h2 className={styles.modalTitle}>{selectedSession.label}</h2>
              <div className={styles.modalDetails}>
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Date</span>
                  <span className={styles.modalValue}>{selectedSession.localDate}</span>
                </div>
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Local time</span>
                  <span className={styles.modalValue}>{selectedSession.localTime}</span>
                </div>
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Timezone</span>
                  <span className={styles.modalValue}>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Circuit</span>
                  <span className={styles.modalValue}>{nextRace?.Circuit?.circuitName}</span>
                </div>
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Location</span>
                  <span className={styles.modalValue}>
                    {nextRace?.Circuit?.Location?.locality}, {nextRace?.Circuit?.Location?.country}
                  </span>
                </div>
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Round</span>
                  <span className={styles.modalValue}>{nextRace?.round} of 24</span>
                </div>
              </div>
              <p className={styles.modalHint}>Click outside to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1 — PODIUM */}
      <section className={styles.fullSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>01</span>
            <h2 className={styles.sectionTitle}>Last race <em>{lastRace?.raceName}</em></h2>
          </div>
          <div className={styles.podium}>
            {podium.map((result, i) => (
              <motion.div
                key={result.Driver.driverId}
                className={`${styles.podiumCard} ${styles[`p${i + 1}`]}`}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className={styles.podiumPos}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                <p className={styles.podiumDriver}>{result.Driver.givenName} {result.Driver.familyName}</p>
                <p className={styles.podiumTeam}>{result.Constructor.name}</p>
                <p className={styles.podiumTime}>{result.Time?.time || result.status}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — DRIVER STANDINGS */}
      <section className={styles.fullSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>02</span>
            <h2 className={styles.sectionTitle}>Driver <em>standings</em></h2>
          </div>
          <div className={styles.standingsTable}>
            {driverStandings.slice(0, 20).map((d, i) => (
              <motion.div
                key={d.Driver.driverId}
                className={styles.standingsRow}
                whileHover={{ x: 6 }}
              >
                <span className={styles.standingsPos}>{d.position}</span>
                <span className={styles.standingsName}>{d.Driver.givenName} {d.Driver.familyName}</span>
                <span className={styles.standingsTeam}>{d.Constructors[0].name}</span>
                <div className={styles.standingsBarWrap}>
                  <motion.div
                    className={styles.standingsBar}
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.points / driverStandings[0].points) * 100}%` }}
                    transition={{ delay: i * 0.04 + 0.3, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className={styles.standingsPts}>{d.points}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — CONSTRUCTOR STANDINGS */}
      <section className={styles.fullSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>03</span>
            <h2 className={styles.sectionTitle}>Constructor <em>standings</em></h2>
          </div>
          <div className={styles.standingsTable}>
            {constructorStandings.slice(0, 11).map((c, i) => (
              <motion.div
                key={c.Constructor.constructorId}
                className={styles.standingsRow}
                whileHover={{ x: 6 }}
              >
                <span className={styles.standingsPos}>{c.position}</span>
                <span className={styles.standingsName}>{c.Constructor.name}</span>
                <span className={styles.standingsTeam}>{c.Constructor.nationality}</span>
                <div className={styles.standingsBarWrap}>
                  <motion.div
                    className={styles.standingsBar}
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.points / constructorStandings[0].points) * 100}%` }}
                    transition={{ delay: i * 0.06 + 0.3, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className={styles.standingsPts}>{c.points}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
export default Home