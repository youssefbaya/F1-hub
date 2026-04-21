import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './SeasonOverview.module.css'

const BASE = 'https://api.jolpi.ca/ergast/f1'

function SeasonOverview() {
  const { year } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [driverStandings, setDriverStandings] = useState([])
  const [constructorStandings, setConstructorStandings] = useState([])
  const [races, setRaces] = useState([])

  useEffect(() => {
    async function loadSeason() {
      setLoading(true)
      try {
        const [driversRes, constructorsRes, racesRes] = await Promise.all([
          fetch(`${BASE}/${year}/driverStandings.json`).then((r) => r.json()),
          fetch(`${BASE}/${year}/constructorStandings.json`).then((r) => r.json()),
          fetch(`${BASE}/${year}/results.json?limit=1000`).then((r) => r.json()),
        ])

        setDriverStandings(
          driversRes?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || []
        )
        setConstructorStandings(
          constructorsRes?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || []
        )
        setRaces(racesRes?.MRData?.RaceTable?.Races || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadSeason()
  }, [year])

  const champion = driverStandings[0]
  const constructorChampion = constructorStandings[0]

  const winnerCounts = useMemo(() => {
    const map = {}
    for (const race of races) {
      const winner = race?.Results?.[0]?.Driver
      if (!winner) continue
      const key = winner.driverId
      if (!map[key]) {
        map[key] = {
          name: `${winner.givenName} ${winner.familyName}`,
          wins: 0,
        }
      }
      map[key].wins += 1
    }
    return Object.values(map).sort((a, b) => b.wins - a.wins)
  }, [races])

  const topWinner = winnerCounts[0]

  if (loading) {
    return (
      <div className={styles.loader}>
        <motion.div
          className={styles.loaderBar}
          initial={{ width: 0 }}
          animate={{ width: '60vw' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        <p className={styles.loaderText}>Loading season data...</p>
      </div>
    )
  }

  return (
    <main className={styles.main}>
      <button className={styles.backBtn} onClick={() => navigate('/seasons')}>
        ← Back to seasons
      </button>

      <div className={styles.header}>
        <p className={styles.eyebrow}>Formula 1 · Season archive</p>
        <h1 className={styles.title}>{year} Season</h1>
      </div>

      <div className={styles.heroGrid}>
        <div className={styles.heroCard}>
          <span className={styles.heroLabel}>World Champion</span>
          <span className={styles.heroValue}>
            {champion
              ? `${champion.Driver.givenName} ${champion.Driver.familyName}`
              : 'N/A'}
          </span>
          <span className={styles.heroMeta}>
            {champion?.Constructors?.[0]?.name || '—'}
          </span>
        </div>

        <div className={styles.heroCard}>
          <span className={styles.heroLabel}>Constructors Champion</span>
          <span className={styles.heroValue}>
            {constructorChampion?.Constructor?.name || 'N/A'}
          </span>
          <span className={styles.heroMeta}>
            {constructorChampion ? `${constructorChampion.points} pts` : '—'}
          </span>
        </div>

        <div className={styles.heroCard}>
          <span className={styles.heroLabel}>Grand Prix</span>
          <span className={styles.heroValue}>{races.length}</span>
          <span className={styles.heroMeta}>Races held</span>
        </div>

        <div className={styles.heroCard}>
          <span className={styles.heroLabel}>Most Wins</span>
          <span className={styles.heroValue}>{topWinner?.name || 'N/A'}</span>
          <span className={styles.heroMeta}>
            {topWinner ? `${topWinner.wins} wins` : '—'}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Final Driver Standings</h2>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Pos</span>
            <span>Driver</span>
            <span>Team</span>
            <span>Points</span>
            <span>Wins</span>
          </div>

          {driverStandings.map((d) => (
            <div key={d.Driver.driverId} className={styles.tableRow}>
              <span>{d.position}</span>
              <span>{d.Driver.givenName} {d.Driver.familyName}</span>
              <span>{d.Constructors?.[0]?.name || '—'}</span>
              <span>{d.points}</span>
              <span>{d.wins}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Race Winners</h2>
        <div className={styles.raceList}>
          {races.map((race) => {
            const winner = race?.Results?.[0]
            return (
              <div key={`${race.season}-${race.round}`} className={styles.raceCard}>
                <div>
                  <p className={styles.raceName}>{race.raceName}</p>
                  <p className={styles.raceMeta}>
                    {race.Circuit?.circuitName} · {race.Circuit?.Location?.country}
                  </p>
                </div>
                <div className={styles.raceWinner}>
                  {winner
                    ? `${winner.Driver.givenName} ${winner.Driver.familyName}`
                    : 'N/A'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default SeasonOverview