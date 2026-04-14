import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './DriverProfile.module.css'

const BASE = 'https://api.jolpi.ca/ergast/f1'

const DRIVER_NATIONALITIES = {
  'max_verstappen': { flag: 'nl', nationality: 'Dutch' },
  'hadjar':         { flag: 'fr', nationality: 'French' },
  'leclerc':        { flag: 'mc', nationality: 'Monégasque' },
  'hamilton':       { flag: 'gb', nationality: 'British' },
  'russell':        { flag: 'gb', nationality: 'British' },
  'antonelli':      { flag: 'it', nationality: 'Italian' },
  'norris':         { flag: 'gb', nationality: 'British' },
  'piastri':        { flag: 'au', nationality: 'Australian' },
  'alonso':         { flag: 'es', nationality: 'Spanish' },
  'stroll':         { flag: 'ca', nationality: 'Canadian' },
  'gasly':          { flag: 'fr', nationality: 'French' },
  'colapinto':      { flag: 'ar', nationality: 'Argentine' },
  'ocon':           { flag: 'fr', nationality: 'French' },
  'bearman':        { flag: 'gb', nationality: 'British' },
  'lawson':         { flag: 'nz', nationality: 'New Zealander' },
  'lindblad':       { flag: 'gb', nationality: 'British' },
  'albon':          { flag: 'th', nationality: 'Thai' },
  'sainz':          { flag: 'es', nationality: 'Spanish' },
  'hulkenberg':     { flag: 'de', nationality: 'German' },
  'bortoleto':      { flag: 'br', nationality: 'Brazilian' },
  'bottas':         { flag: 'fi', nationality: 'Finnish' },
  'perez':          { flag: 'mx', nationality: 'Mexican' },
}

const DRIVER_IMAGES = {
  'norris':         'lando_norris',
  'piastri':        'oscar_piastri',
  'max_verstappen': 'max_verstappen',
  'hadjar':         'isack_hadjar',
  'leclerc':        'charles_leclerc',
  'hamilton':       'lewis_hamilton',
  'russell':        'george_russell',
  'antonelli':      'andrea_kimi_antonelli',
  'alonso':         'fernando_alonso',
  'stroll':         'lance_stroll',
  'gasly':          'pierre_gasly',
  'colapinto':      'franco_colapinto',
  'ocon':           'esteban_ocon',
  'bearman':        'oliver_bearman',
  'lawson':         'liam_lawson',
  'lindblad':       'arvid_lindblad',
  'albon':          'alexander_albon',
  'sainz':          'carlos_sainz',
  'hulkenberg':     'nico_hulkenberg',
  'bortoleto':      'gabriel_bortoleto',
  'bottas':         'valtteri_bottas',
  'perez':          'sergio_perez',
}

const TEAM_COLORS = {
  'McLaren':          '#FF8000',
  'Red Bull':         '#3671C6',
  'Red Bull Racing':  '#3671C6',
  'Ferrari':          '#E8002D',
  'Mercedes':         '#27F4D2',
  'Aston Martin':     '#229971',
  'Alpine':           '#FF87BC',
  'Alpine F1 Team':   '#FF87BC',
  'Haas F1 Team':     '#B6BABD',
  'Haas':             '#B6BABD',
  'Racing Bulls':     '#6692FF',
  'RB F1 Team':       '#6692FF',
  'Williams':         '#64C4FF',
  'Audi':             '#B20000',
  'Sauber':           '#52E252',
  'Cadillac':         '#C8AA6E',
}

const DEBUT_YEARS = {
  'max_verstappen': 2015, 'hamilton': 2007, 'leclerc': 2018,
  'norris': 2019, 'piastri': 2023, 'russell': 2019,
  'antonelli': 2025, 'alonso': 2001, 'stroll': 2017,
  'gasly': 2017, 'colapinto': 2024, 'ocon': 2016,
  'bearman': 2025, 'lawson': 2023, 'lindblad': 2026,
  'albon': 2019, 'sainz': 2015, 'hulkenberg': 2010,
  'bortoleto': 2025, 'bottas': 2013, 'perez': 2011,
  'hadjar': 2025, 'verstappen': 2015,
}

const HARDCODED_DRIVERS = {
  'lindblad': {
    driver: {
      driverId: 'lindblad',
      givenName: 'Arvid',
      familyName: 'Lindblad',
      dateOfBirth: '2006-06-25',
      nationality: 'British',
      permanentNumber: '41',
      code: 'LIN',
      url: 'https://en.wikipedia.org/wiki/Arvid_Lindblad'
    },
    seasons: [
      {
        season: '2026',
        DriverStandings: [{
          position: '11',
          wins: '0',
          points: '4',
          Constructors: [{ name: 'Racing Bulls' }]
        }]
      }
    ],
    bestRaceFinish: 8,
    poles: 0, podiums: 0, fastestLaps: 0, racesTotal: 4, dnfs: 0,
  }
}

async function fetchDriverData(driverId) {
  if (HARDCODED_DRIVERS[driverId]) {
    const { getDriverStandings } = await import('../services/ergast.js')
    const currentStandings = await getDriverStandings()
    return {
      driver: HARDCODED_DRIVERS[driverId].driver,
      seasons: HARDCODED_DRIVERS[driverId].seasons,
      bestRaceFinish: HARDCODED_DRIVERS[driverId].bestRaceFinish,
      currentStandings
    }
  }

  const [driverRes, standingsRes] = await Promise.all([
    fetch(`/api/driver/${driverId}`).then(r => r.json()).catch(() => null),
    fetch(`/api/standings`).then(r => r.json()).catch(() => null),
  ])

  if (!driverRes?.driver) return { driver: null, seasons: [], currentStandings: [] }

  return {
    driver: driverRes.driver,
    seasons: driverRes.seasons || [],
    podiums: driverRes.podiums || 0,
    poles: driverRes.poles || 0,
    fastestLaps: driverRes.fastestLaps || 0,
    racesTotal: driverRes.racesTotal || 0,
    dnfs: driverRes.dnfs || 0,
    currentStandings: standingsRes?.standings || [],
  }
}

function DriverProfile() {
  const { driverId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setLoading(true)
    setData(null)
    fetchDriverData(driverId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [driverId])

  if (loading) return (
    <div className={styles.loader}>
      <motion.div
        className={styles.loaderBar}
        initial={{ width: 0 }}
        animate={{ width: '60vw' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      <p className={styles.loaderText}>Loading driver data...</p>
    </div>
  )

  if (!data?.driver) return (
    <div className={styles.loader}>
      <p className={styles.loaderText}>Driver not found</p>
    </div>
  )

  const { driver, seasons, currentStandings } = data
  const currentDriver = currentStandings.find(d => d.Driver.driverId === driverId)
  const hardcoded = data.seasons?.[0]?.DriverStandings?.[0]
  const currentTeam = currentDriver?.Constructors?.[0]?.name || hardcoded?.Constructors?.[0]?.name || 'N/A'
  const currentPoints = currentDriver?.points || hardcoded?.points || '0'
  const currentPosition = currentDriver?.position || hardcoded?.position || 'N/A'
  const totalWins = seasons.reduce((sum, s) => sum + parseInt(s.DriverStandings?.[0]?.wins || 0), 0)
  const currentYear = new Date().getFullYear()
  const championships = seasons.filter(s =>
    s.DriverStandings?.[0]?.position === '1' && parseInt(s.season) < currentYear
  ).length
  const totalSeasons = seasons.length
  const bestFinish = data.bestRaceFinish || seasons.reduce((best, s) => {
    const pos = parseInt(s.DriverStandings?.[0]?.position || 99)
    return pos < best ? pos : best
  }, 99)
  const age = driver.dateOfBirth
    ? Math.floor((new Date() - new Date(driver.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null
  const teamColor = TEAM_COLORS[currentTeam] || 'var(--accent)'
  const driverInfo = DRIVER_NATIONALITIES[driverId]

  const stats = [
    { label: 'Championships', value: championships, highlight: championships > 0 },
    { label: 'Career Wins',   value: totalWins },
    { label: 'Podiums',       value: data.podiums ?? '—' },
    { label: 'Pole Positions',value: data.poles ?? '—' },
    { label: 'Fastest Laps',  value: data.fastestLaps ?? '—' },
    { label: 'Total Races',   value: data.racesTotal ?? '—' },
    { label: 'Seasons',       value: totalSeasons },
    { label: 'Best Finish',   value: `P${bestFinish}` },
    { label: '2026 Position', value: `P${currentPosition}` },
    { label: '2026 Points',   value: currentPoints },
  ]

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

      <div className={styles.hero} style={{ '--team-color': teamColor }}>
        <div className={styles.heroBg} style={{ background: `radial-gradient(ellipse 60% 80% at 100% 50%, ${teamColor}18, transparent)` }} />

        <motion.div
          className={styles.heroLeft}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.heroMeta}>
            {driverInfo && (
              <img
                src={`https://flagcdn.com/24x18/${driverInfo.flag}.png`}
                alt={driverInfo.nationality}
                className={styles.heroFlag}
              />
            )}
            <span className={styles.eyebrow}>{driverInfo?.nationality || driver.nationality} · {currentTeam}</span>
          </div>

          <h1 className={styles.driverName}>
            <span className={styles.firstName}>{driver.givenName}</span>
            <span className={styles.lastName} style={{ color: teamColor }}>{driver.familyName}</span>
          </h1>

          <div className={styles.driverMeta}>
            {driver.permanentNumber && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Number</span>
                <span className={styles.metaVal} style={{ color: teamColor }}>#{driver.permanentNumber}</span>
              </div>
            )}
            {driver.code && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Code</span>
                <span className={styles.metaVal}>{driver.code}</span>
              </div>
            )}
            {age && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Age</span>
                <span className={styles.metaVal}>{age}</span>
              </div>
            )}
            {driver.dateOfBirth && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Born</span>
                <span className={styles.metaVal}>
                  {new Date(driver.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className={styles.heroRight}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className={styles.driverPhoto}>
            <img
              src={`/drivers/${DRIVER_IMAGES[driverId] || driverId}.avif`}
              alt={`${driver.givenName} ${driver.familyName}`}
              className={styles.driverPhotoImg}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
          <div className={styles.bigNumber} style={{ color: teamColor }}>
            {driver.permanentNumber}
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.statsGrid}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className={`${styles.statCard} ${s.highlight ? styles.statHighlight : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            style={s.highlight ? { borderColor: `${teamColor}50`, background: `${teamColor}10` } : {}}
          >
            <span className={styles.statValue} style={s.highlight ? { color: teamColor } : {}}>
              {s.value}
            </span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className={styles.tabs}>
        {['overview', 'seasons'].map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                className={styles.tabLine}
                layoutId="tabLine"
                style={{ background: teamColor }}
              />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <motion.div
          className={styles.overviewGrid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Driver Info</h3>
            {[
              { label: 'Full name',        val: `${driver.givenName} ${driver.familyName}` },
              { label: 'Nationality',      val: driverInfo?.nationality || driver.nationality },
              { label: 'Date of birth',    val: driver.dateOfBirth ? new Date(driver.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A' },
              { label: 'Permanent number', val: `#${driver.permanentNumber}` },
              { label: 'Current team',     val: currentTeam },
              { label: '2026 position',    val: `P${currentPosition}` },
              { label: 'Total races',      val: data.racesTotal ?? '—' },
              { label: 'Pole positions',   val: data.poles ?? '—' },
              { label: 'Fastest laps',     val: data.fastestLaps ?? '—' },
              { label: 'Podiums',          val: data.podiums ?? '—' },
            ].map(r => (
              <div key={r.label} className={styles.infoRow}>
                <span className={styles.infoLabel}>{r.label}</span>
                <span className={styles.infoVal}>{r.val}</span>
              </div>
            ))}
            {driver.url && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Wikipedia</span>
                <a href={driver.url} target="_blank" rel="noreferrer" className={styles.infoLink} style={{ color: teamColor }}>
                  View profile →
                </a>
              </div>
            )}
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Career Highlights</h3>
            <div className={styles.highlights}>
              {championships > 0 && (
                <div className={styles.highlight} style={{ borderColor: `${teamColor}50` }}>
                  <span className={styles.highlightIcon}>🏆</span>
                  <div>
                    <p className={styles.highlightVal}>{championships}x World Champion</p>
                    <p className={styles.highlightSub}>
                      {seasons.filter(s => s.DriverStandings?.[0]?.position === '1').map(s => s.season).join(', ')}
                    </p>
                  </div>
                </div>
              )}
              <div className={styles.highlight}>
                <span className={styles.highlightIcon}>🏁</span>
                <div>
                  <p className={styles.highlightVal}>{totalWins} Career Wins</p>
                  <p className={styles.highlightSub}>Across {totalSeasons} seasons</p>
                </div>
              </div>
              {data.podiums > 0 && (
                <div className={styles.highlight}>
                  <span className={styles.highlightIcon}>🥇</span>
                  <div>
                    <p className={styles.highlightVal}>{data.podiums} Podiums</p>
                    <p className={styles.highlightSub}>{data.poles} pole positions</p>
                  </div>
                </div>
              )}
              <div className={styles.highlight}>
                <span className={styles.highlightIcon}>📅</span>
                <div>
                  <p className={styles.highlightVal}>{seasons[0]?.season} — {seasons[seasons.length - 1]?.season}</p>
                  <p className={styles.highlightSub}>F1 career span</p>
                </div>
              </div>
              <div className={styles.highlight}>
                <span className={styles.highlightIcon}>⭐</span>
                <div>
                  <p className={styles.highlightVal}>Best: P{bestFinish} in championship</p>
                  <p className={styles.highlightSub}>
                    {seasons.find(s => s.DriverStandings?.[0]?.position === String(bestFinish))?.season}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'seasons' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.seasonsTable}>
            <div className={styles.seasonsHeader}>
              <span>Season</span>
              <span>Team</span>
              <span>Pos</span>
              <span>Wins</span>
              <span>Points</span>
            </div>
            {[...seasons].reverse().map((s, i) => {
              const st = s.DriverStandings?.[0]
              const isChamp = st?.position === '1'
              const tColor = TEAM_COLORS[st?.Constructors?.[0]?.name] || 'var(--grey2)'
              return (
                <motion.div
                  key={s.season}
                  className={`${styles.seasonRow} ${isChamp ? styles.champRow : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025 }}
                  whileHover={{ x: 6 }}
                  style={isChamp ? { borderLeftColor: teamColor } : {}}
                >
                  <span className={styles.seasonYear}>
                    {s.season}
                    {isChamp && <span className={styles.champBadge}>🏆</span>}
                  </span>
                  <span className={styles.seasonTeam}>
                    <span className={styles.seasonTeamDot} style={{ background: tColor }} />
                    {st?.Constructors?.[0]?.name || 'N/A'}
                  </span>
                  <span className={styles.seasonPos} style={isChamp ? { color: teamColor } : {}}>
                    P{st?.position || '?'}
                  </span>
                  <span className={styles.seasonWins}>{st?.wins || 0}</span>
                  <span className={styles.seasonPts}>{st?.points || 0}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

    </main>
  )
}

export default DriverProfile