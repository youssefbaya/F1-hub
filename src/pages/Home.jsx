import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CountdownTimer from '../components/CountdownTimer'
import { getNextRace, getDriverStandings, getConstructorStandings, getLastRaceResults } from '../services/ergast'
import styles from './Home.module.css'

function Home() {
  const [nextRace, setNextRace] = useState(null)
  const [driverStandings, setDriverStandings] = useState([])
  const [constructorStandings, setConstructorStandings] = useState([])
  const [lastRace, setLastRace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(0)
  const containerRef = useRef(null)
  const sectionsRef = useRef([])
  const isScrolling = useRef(false)

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

  // full page scroll snapping
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (isScrolling.current) return
      isScrolling.current = true
      const direction = e.deltaY > 0 ? 1 : -1
      const next = Math.max(0, Math.min(sectionsRef.current.length - 1, activeSection + direction))
      setActiveSection(next)
      setTimeout(() => { isScrolling.current = false }, 900)
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [activeSection])

  if (loading) return (
    <div className={styles.loader}>
      <motion.div
        className={styles.loaderBar}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
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

  const sections = [
    // SECTION 0 — COUNTDOWN HERO
    <motion.section
      key="hero"
      className={styles.fullSection}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: activeSection === 0 ? 1 : 0, y: activeSection === 0 ? 0 : -60 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.heroGlow} />
      <div className={styles.heroContent}>
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
          {nextRace?.FirstPractice && <div className={styles.session}><span>FP1</span><span>{new Date(nextRace.FirstPractice.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
          {nextRace?.SecondPractice && <div className={styles.session}><span>FP2</span><span>{new Date(nextRace.SecondPractice.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
          {nextRace?.ThirdPractice && <div className={styles.session}><span>FP3</span><span>{new Date(nextRace.ThirdPractice.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
          {nextRace?.Qualifying && <div className={styles.session}><span>Quali</span><span>{new Date(nextRace.Qualifying.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
          {nextRace?.date && <div className={`${styles.session} ${styles.raceSession}`}><span>Race</span><span>{new Date(nextRace.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
        </motion.div>
        <motion.p
          className={styles.scrollHint}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          scroll to explore ↓
        </motion.p>
      </div>
    </motion.section>,

    // SECTION 1 — LAST RACE PODIUM
    <motion.section
      key="podium"
      className={styles.fullSection}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: activeSection === 1 ? 1 : 0, y: activeSection === 1 ? 0 : activeSection < 1 ? 60 : -60 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.sectionInner}>
        <motion.div className={styles.sectionHeader}>
          <span className={styles.sectionNum}>01</span>
          <h2 className={styles.sectionTitle}>Last race <em>{lastRace?.raceName}</em></h2>
        </motion.div>
        <div className={styles.podium}>
          {podium.map((result, i) => (
            <motion.div
              key={result.Driver.driverId}
              className={`${styles.podiumCard} ${styles[`p${i + 1}`]}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: activeSection === 1 ? 1 : 0, y: activeSection === 1 ? 0 : 40 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -4 }}
            >
              <span className={styles.podiumPos}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
              <p className={styles.podiumDriver}>{result.Driver.givenName} {result.Driver.familyName}</p>
              <p className={styles.podiumTeam}>{result.Constructor.name}</p>
              <p className={styles.podiumTime}>{result.Time?.time || result.status}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>,

    // SECTION 2 — DRIVER STANDINGS
    <motion.section
      key="drivers"
      className={styles.fullSection}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: activeSection === 2 ? 1 : 0, y: activeSection === 2 ? 0 : activeSection < 2 ? 60 : -60 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNum}>02</span>
          <h2 className={styles.sectionTitle}>Driver <em>standings</em></h2>
        </div>
        <div className={styles.standingsTable}>
          {driverStandings.slice(0, 10).map((d, i) => (
            <motion.div
              key={d.Driver.driverId}
              className={styles.standingsRow}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: activeSection === 2 ? 1 : 0, x: activeSection === 2 ? 0 : -30 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ x: 6, backgroundColor: 'var(--surface2)' }}
            >
              <span className={styles.standingsPos}>{d.position}</span>
              <span className={styles.standingsName}>{d.Driver.givenName} {d.Driver.familyName}</span>
              <span className={styles.standingsTeam}>{d.Constructors[0].name}</span>
              <div className={styles.standingsBarWrap}>
                <motion.div
                  className={styles.standingsBar}
                  initial={{ width: 0 }}
                  animate={{ width: activeSection === 2 ? `${(d.points / driverStandings[0].points) * 100}%` : 0 }}
                  transition={{ delay: i * 0.06 + 0.3, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className={styles.standingsPts}>{d.points}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>,

    // SECTION 3 — CONSTRUCTOR STANDINGS
    <motion.section
      key="constructors"
      className={styles.fullSection}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: activeSection === 3 ? 1 : 0, y: activeSection === 3 ? 0 : activeSection < 3 ? 60 : -60 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNum}>03</span>
          <h2 className={styles.sectionTitle}>Constructor <em>standings</em></h2>
        </div>
        <div className={styles.standingsTable}>
          {constructorStandings.slice(0, 10).map((c, i) => (
            <motion.div
              key={c.Constructor.constructorId}
              className={styles.standingsRow}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: activeSection === 3 ? 1 : 0, x: activeSection === 3 ? 0 : -30 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ x: 6, backgroundColor: 'var(--surface2)' }}
            >
              <span className={styles.standingsPos}>{c.position}</span>
              <span className={styles.standingsName}>{c.Constructor.name}</span>
              <span className={styles.standingsTeam}>{c.Constructor.nationality}</span>
              <div className={styles.standingsBarWrap}>
                <motion.div
                  className={styles.standingsBar}
                  initial={{ width: 0 }}
                  animate={{ width: activeSection === 3 ? `${(c.points / constructorStandings[0].points) * 100}%` : 0 }}
                  transition={{ delay: i * 0.06 + 0.3, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className={styles.standingsPts}>{c.points}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>,
  ]

  return (
    <div className={styles.container} ref={containerRef}>
      {/* dot nav on the right */}
      <div className={styles.dotNav}>
        {sections.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${activeSection === i ? styles.dotActive : ''}`}
            onClick={() => setActiveSection(i)}
          />
        ))}
      </div>
      {/* render all sections stacked, show/hide via animation */}
      <div className={styles.sectionsWrap}>
        {sections}
      </div>
    </div>
  )
}
export default Home