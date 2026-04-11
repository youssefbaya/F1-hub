import { useState, useEffect } from 'react'
import CountdownTimer from '../components/CountdownTimer'
import { getNextRace, getDriverStandings, getConstructorStandings, getLastRaceResults } from '../services/ergast'
import styles from './Home.module.css'

function Home() {
  const [nextRace, setNextRace]           = useState(null)
  const [driverStandings, setDriverStandings]         = useState([])
  const [constructorStandings, setConstructorStandings] = useState([])
  const [lastRace, setLastRace]           = useState(null)
  const [loading, setLoading]             = useState(true)

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

  if (loading) return (
    <div className={styles.loading}>
      <span className={styles.loadingText}>Loading race data...</span>
    </div>
  )

  const raceDate = nextRace ? new Date(`${nextRace.date}T${nextRace.time || '00:00:00'}`) : null
  const podium = lastRace?.Results?.slice(0, 3) || []

  return (
    <main className={styles.main}>

      {/* HERO — countdown */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>
            Round {nextRace?.round} · {nextRace?.Circuit?.Location?.country}
          </p>
          <h1 className={styles.raceName}>{nextRace?.raceName}</h1>
          <p className={styles.circuit}>{nextRace?.Circuit?.circuitName}</p>
          {raceDate && <CountdownTimer targetDate={raceDate} />}
          <div className={styles.sessions}>
            {nextRace?.FirstPractice && <div className={styles.session}><span>FP1</span><span>{new Date(nextRace.FirstPractice.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
            {nextRace?.SecondPractice && <div className={styles.session}><span>FP2</span><span>{new Date(nextRace.SecondPractice.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
            {nextRace?.ThirdPractice && <div className={styles.session}><span>FP3</span><span>{new Date(nextRace.ThirdPractice.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
            {nextRace?.Qualifying && <div className={styles.session}><span>Quali</span><span>{new Date(nextRace.Qualifying.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
            {nextRace?.date && <div className={`${styles.session} ${styles.raceSession}`}><span>Race</span><span>{new Date(nextRace.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
          </div>
        </div>
      </section>

      {/* LAST RACE PODIUM */}
      {lastRace && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>01</span>
            <h2 className={styles.sectionTitle}>Last race — <em>{lastRace.raceName}</em></h2>
          </div>
          <div className={styles.podium}>
            {podium.map((result, i) => (
              <div key={result.Driver.driverId} className={`${styles.podiumCard} ${styles[`p${i + 1}`]}`}>
                <span className={styles.podiumPos}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                <p className={styles.podiumDriver}>{result.Driver.givenName} {result.Driver.familyName}</p>
                <p className={styles.podiumTeam}>{result.Constructor.name}</p>
                <p className={styles.podiumTime}>{result.Time?.time || result.status}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DRIVER STANDINGS */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNum}>02</span>
          <h2 className={styles.sectionTitle}>Driver <em>standings</em></h2>
        </div>
        <div className={styles.standingsTable}>
          {driverStandings.slice(0, 10).map(d => (
            <div key={d.Driver.driverId} className={styles.standingsRow}>
              <span className={styles.standingsPos}>{d.position}</span>
              <span className={styles.standingsName}>{d.Driver.givenName} {d.Driver.familyName}</span>
              <span className={styles.standingsTeam}>{d.Constructors[0].name}</span>
              <span className={styles.standingsPts}>{d.points} pts</span>
            </div>
          ))}
        </div>
      </section>

      {/* CONSTRUCTOR STANDINGS */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNum}>03</span>
          <h2 className={styles.sectionTitle}>Constructor <em>standings</em></h2>
        </div>
        <div className={styles.standingsTable}>
          {constructorStandings.slice(0, 10).map(c => (
            <div key={c.Constructor.constructorId} className={styles.standingsRow}>
              <span className={styles.standingsPos}>{c.position}</span>
              <span className={styles.standingsName}>{c.Constructor.name}</span>
              <span className={styles.standingsTeam}>{c.Constructor.nationality}</span>
              <span className={styles.standingsPts}>{c.points} pts</span>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
export default Home