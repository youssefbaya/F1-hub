import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './RaceResult.module.css'

const BASE = 'https://api.jolpi.ca/ergast/f1'

const TEAM_COLORS = {
  'McLaren': '#FF8000',
  'Red Bull': '#3671C6',
  'Red Bull Racing': '#3671C6',
  'Ferrari': '#E8002D',
  'Mercedes': '#27F4D2',
  'Aston Martin': '#229971',
  'Alpine': '#FF87BC',
  'Alpine F1 Team': '#FF87BC',
  'Haas F1 Team': '#B6BABD',
  'Haas': '#B6BABD',
  'Racing Bulls': '#6692FF',
  'Williams': '#64C4FF',
  'Audi': '#B20000',
  'Sauber': '#52E252',
  'Cadillac': '#C8AA6E',
}

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

function RaceResult() {
  const { season, round } = useParams()
  const navigate = useNavigate()
  const [race, setRace] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`${BASE}/${season}/${round}/results.json`)
        const data = await res.json()
        setRace(data.MRData?.RaceTable?.Races?.[0])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [season, round])

  if (loading) return (
    <div className={styles.loader}>
      <motion.div
        className={styles.loaderBar}
        initial={{ width: 0 }}
        animate={{ width: '60vw' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      <p className={styles.loaderText}>Loading race results...</p>
    </div>
  )

  if (!race) return (
    <div className={styles.loader}>
      <p className={styles.loaderText}>Results not found</p>
    </div>
  )

  const results = race.Results || []
  const winner = results[0]
  const fastestLap = results.find(r => r.FastestLap?.rank === '1')
  const podium = results.slice(0, 3)

  return (
    <main className={styles.main}>
      <motion.button
        className={styles.backBtn}
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
      >
        ← Back
      </motion.button>

      {/* hero */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.heroGlow} style={{ background: `radial-gradient(ellipse 60% 80% at 50% 0%, ${TEAM_COLORS[winner?.Constructor?.name] || 'var(--accent)'}18, transparent)` }} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            Round {race.round} · {race.Circuit?.Location?.country} · {new Date(race.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className={styles.raceName}>{race.raceName}</h1>
          <p className={styles.circuitName}>{race.Circuit?.circuitName}</p>
        </div>
      </motion.div>

      {/* podium */}
      <motion.div
        className={styles.podium}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[podium[1], podium[0], podium[2]].filter(Boolean).map((r, i) => {
          const pos = i === 0 ? 2 : i === 1 ? 1 : 3
          const color = TEAM_COLORS[r.Constructor?.name] || 'var(--accent)'
          const heights = { 1: '140px', 2: '110px', 3: '90px' }
          return (
            <motion.div
              key={r.position}
              className={`${styles.podiumCard} ${styles[`pos${pos}`]}`}
              style={{ '--pc': color }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => navigate(`/drivers/${r.Driver.driverId}`)}
            >
              <div className={styles.podiumPhoto}>
                <img
                  src={`/drivers/${DRIVER_IMAGES[r.Driver.driverId] || r.Driver.driverId}.avif`}
                  alt={r.Driver.familyName}
                  className={styles.podiumPhotoImg}
                  onError={e => e.target.style.display = 'none'}
                />
              </div>
              <div className={styles.podiumBlock} style={{ height: heights[pos], background: `${color}20`, borderColor: color }}>
                <span className={styles.podiumPos} style={{ color }}>{pos}</span>
              </div>
              <p className={styles.podiumName}>{r.Driver.familyName}</p>
              <p className={styles.podiumTeam} style={{ color }}>{r.Constructor?.name}</p>
              <p className={styles.podiumTime}>{pos === 1 ? r.Time?.time || r.status : `+${r.Time?.time || r.status}`}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* fastest lap */}
      {fastestLap && (
        <motion.div
          className={styles.fastestLap}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className={styles.fastestLapIcon}>⚡</span>
          <span className={styles.fastestLapLabel}>Fastest Lap</span>
          <span className={styles.fastestLapDriver}>{fastestLap.Driver.givenName} {fastestLap.Driver.familyName}</span>
          <span className={styles.fastestLapTime} style={{ color: TEAM_COLORS[fastestLap.Constructor?.name] || 'var(--accent)' }}>
            {fastestLap.FastestLap?.Time?.time}
          </span>
          <span className={styles.fastestLapLap}>Lap {fastestLap.FastestLap?.lap}</span>
        </motion.div>
      )}

      {/* full results table */}
      <motion.div
        className={styles.resultsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className={styles.sectionTitle}>Full Results</h2>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Pos</span>
            <span>Driver</span>
            <span>Team</span>
            <span>Time / Gap</span>
            <span>Pts</span>
            <span>Grid</span>
            <span>Status</span>
          </div>
          {results.map((r, i) => {
            const color = TEAM_COLORS[r.Constructor?.name] || 'var(--grey2)'
            const isFastest = r.FastestLap?.rank === '1'
            const isPodium = parseInt(r.position) <= 3
            const isWinner = r.position === '1'
            return (
              <motion.div
                key={r.position}
                className={`${styles.tableRow} ${isPodium ? styles.podiumRow : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.02 }}
                whileHover={{ x: 4, background: 'var(--surface2)' }}
                onClick={() => navigate(`/drivers/${r.Driver.driverId}`)}
                style={{ borderLeftColor: isPodium ? color : 'transparent' }}
              >
                <span className={styles.rowPos} style={{ color: isWinner ? color : isPodium ? 'var(--white)' : 'var(--grey)' }}>
                  P{r.position}
                </span>
                <div className={styles.rowDriver}>
                  <div className={styles.rowDriverImg}>
                    <img
                      src={`/drivers/${DRIVER_IMAGES[r.Driver.driverId] || r.Driver.driverId}.avif`}
                      alt={r.Driver.familyName}
                      className={styles.rowDriverPhoto}
                      onError={e => e.target.style.display = 'none'}
                    />
                  </div>
                  <div>
                    <span className={styles.rowDriverName}>{r.Driver.givenName} {r.Driver.familyName}</span>
                    <span className={styles.rowDriverCode}>{r.Driver.code}</span>
                  </div>
                  {isFastest && <span className={styles.fastestBadge}>⚡</span>}
                </div>
                <span className={styles.rowTeam} style={{ color }}>{r.Constructor?.name}</span>
                <span className={styles.rowTime}>
                  {r.position === '1' ? r.Time?.time || '—' : r.Time?.time ? `+${r.Time.time}` : r.status}
                </span>
                <span className={styles.rowPts} style={{ color: parseInt(r.points) > 0 ? color : 'var(--grey)' }}>
                  {r.points}
                </span>
                <span className={styles.rowGrid}>{r.grid === '0' ? 'PL' : `P${r.grid}`}</span>
                <span className={styles.rowStatus} style={{ color: r.status === 'Finished' || r.status?.includes('+') ? 'var(--grey)' : 'var(--accent)' }}>
                  {r.status === 'Finished' ? '✓' : r.status?.includes('+') ? '✓' : r.status}
                </span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </main>
  )
}

export default RaceResult