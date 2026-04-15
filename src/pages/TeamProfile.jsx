import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './TeamProfile.module.css'

const BASE = 'https://api.jolpi.ca/ergast/f1'

const TEAM_DATA = {
  'mclaren': {
    fullName: 'McLaren Formula 1 Team',
    base: 'Woking, United Kingdom',
    founded: 1963,
    championships: 8,
    color: '#FF8000', colorDark: '#c45f00',
    constructorId: 'mclaren',
    bestFinish: 'P1 — 2024 Constructors',
    firstWin: '1968 Belgian Grand Prix',
    totalWins: 183,
    notable: 'Ayrton Senna, Alain Prost, Lewis Hamilton',
    drivers: [
      { id: 'norris', name: 'Lando Norris', number: 1, img: 'lando_norris' },
      { id: 'piastri', name: 'Oscar Piastri', number: 81, img: 'oscar_piastri' },
    ]
  },
  'red_bull': {
    fullName: 'Oracle Red Bull Racing',
    base: 'Milton Keynes, United Kingdom',
    founded: 2005,
    championships: 6,
    color: '#303691ff', colorDark: '#181c47ff',
    constructorId: 'red_bull',
    bestFinish: 'P1 — 2023 Constructors',
    firstWin: '2009 Chinese Grand Prix',
    totalWins: 122,
    notable: 'Sebastian Vettel, Max Verstappen',
    drivers: [
      { id: 'max_verstappen', name: 'Max Verstappen', number: 3, img: 'max_verstappen' },
      { id: 'hadjar', name: 'Isack Hadjar', number: 6, img: 'isack_hadjar' },
    ]
  },
  'ferrari': {
    fullName: 'Scuderia Ferrari HP',
    base: 'Maranello, Italy',
    founded: 1929,
    championships: 16,
    color: '#E8002D', colorDark: '#ff0a3bff',
    constructorId: 'ferrari',
    invertLogo: false,
    bestFinish: 'P1 — 2008 Constructors',
    firstWin: '1951 British Grand Prix',
    totalWins: 243,
    notable: 'Michael Schumacher, Niki Lauda, Kimi Räikkönen',
    drivers: [
      { id: 'leclerc', name: 'Charles Leclerc', number: 16, img: 'charles_leclerc' },
      { id: 'hamilton', name: 'Lewis Hamilton', number: 44, img: 'lewis_hamilton' },
    ]
  },
  'mercedes': {
    fullName: 'Mercedes-AMG Petronas F1 Team',
    base: 'Brackley, United Kingdom',
    founded: 2010,
    championships: 8,
    color: '#00a19c', colorDark: '#006b67',
    constructorId: 'mercedes',
    bestFinish: 'P1 — 7 consecutive titles 2014-2021',
    firstWin: '2012 Chinese Grand Prix',
    totalWins: 125,
    notable: 'Lewis Hamilton, Nico Rosberg',
    drivers: [
      { id: 'russell', name: 'George Russell', number: 63, img: 'george_russell' },
      { id: 'antonelli', name: 'Kimi Antonelli', number: 12, img: 'andrea_kimi_antonelli' },
    ]
  },
  'aston_martin': {
    fullName: 'Aston Martin Aramco F1 Team',
    base: 'Silverstone, United Kingdom',
    founded: 2018,
    championships: 0,
    color: '#006b5e', colorDark: '#003d35',
    constructorId: 'aston_martin',
    bestFinish: 'P4 — 2023 Constructors',
    firstWin: 'No wins yet',
    totalWins: 0,
    notable: 'Fernando Alonso, Sebastian Vettel',
    drivers: [
      { id: 'alonso', name: 'Fernando Alonso', number: 14, img: 'fernando_alonso' },
      { id: 'stroll', name: 'Lance Stroll', number: 18, img: 'lance_stroll' },
    ]
  },
  'alpine': {
    fullName: 'BWT Alpine F1 Team',
    base: 'Enstone, United Kingdom',
    founded: 1981,
    championships: 2,
    color: '#0078d4', colorDark: '#004f8f',
    constructorId: 'alpine',
    bestFinish: 'P4 — 2021 Constructors',
    firstWin: '1983 French Grand Prix (as Renault)',
    totalWins: 35,
    notable: 'Alain Prost, Fernando Alonso, Esteban Ocon',
    drivers: [
      { id: 'gasly', name: 'Pierre Gasly', number: 10, img: 'pierre_gasly' },
      { id: 'colapinto', name: 'Franco Colapinto', number: 43, img: 'franco_colapinto' },
    ]
  },
  'haas': {
    fullName: 'MoneyGram Haas F1 Team',
    base: 'Kannapolis, United States',
    founded: 2016,
    championships: 0,
    color: '#ffffffff', colorDark: '#757575ff',
    constructorId: 'haas',
    bestFinish: 'P5 — 2018 Constructors',
    firstWin: 'No wins yet',
    totalWins: 0,
    notable: 'Romain Grosjean, Kevin Magnussen',
    drivers: [
      { id: 'ocon', name: 'Esteban Ocon', number: 31, img: 'esteban_ocon' },
      { id: 'bearman', name: 'Oliver Bearman', number: 87, img: 'oliver_bearman' },
    ]
  },
  'rb': {
    fullName: 'Visa CashApp Racing Bulls',
    base: 'Faenza, Italy',
    founded: 2006,
    championships: 0,
    color: '#6c88d4ff', colorDark: '#121a33ff',
    constructorId: 'rb',
    bestFinish: 'P7 — 2023 Constructors',
    firstWin: '2020 Italian Grand Prix',
    totalWins: 2,
    notable: 'Max Verstappen, Pierre Gasly',
    drivers: [
      { id: 'lawson', name: 'Liam Lawson', number: 30, img: 'liam_lawson' },
      { id: 'lindblad', name: 'Arvid Lindblad', number: 41, img: 'arvid_lindblad' },
    ]
  },
  'williams': {
    fullName: 'Williams Racing',
    base: 'Grove, United Kingdom',
    founded: 1977,
    championships: 7,
    color: '#005aff', colorDark: '#0038a8',
    constructorId: 'williams',
    bestFinish: 'P1 — 1992, 1993, 1994, 1996, 1997',
    firstWin: '1979 British Grand Prix',
    totalWins: 114,
    notable: 'Nigel Mansell, Damon Hill, Alain Prost',
    drivers: [
      { id: 'albon', name: 'Alexander Albon', number: 23, img: 'alexander_albon' },
      { id: 'sainz', name: 'Carlos Sainz', number: 55, img: 'carlos_sainz' },
    ]
  },
  'audi': {
    fullName: 'Audi F1 Team',
    base: 'Hinwil, Switzerland',
    founded: 2024,
    championships: 0,
    color: '#bb0a14', colorDark: '#7a0009',
    constructorId: 'sauber',
    bestFinish: 'P5 — 2012 Constructors (as Sauber)',
    firstWin: 'No wins yet',
    totalWins: 0,
    notable: 'Kimi Räikkönen, Robert Kubica',
    drivers: [
      { id: 'hulkenberg', name: 'Nico Hülkenberg', number: 27, img: 'nico_hulkenberg' },
      { id: 'bortoleto', name: 'Gabriel Bortoleto', number: 5, img: 'gabriel_bortoleto' },
    ]
  },
  'cadillac': {
    fullName: 'Cadillac F1 Team',
    base: 'Concord, United States',
    founded: 2026,
    championships: 0,
    color: '#7e7e7eff', colorDark: '#1b1b1bff',
    constructorId: 'cadillac',
    bestFinish: 'Debut season 2026',
    firstWin: 'No wins yet',
    totalWins: 0,
    notable: 'First US-based F1 constructor since 1986',
    drivers: [
      { id: 'bottas', name: 'Valtteri Bottas', number: 77, img: 'valtteri_bottas' },
      { id: 'perez', name: 'Sergio Perez', number: 11, img: 'sergio_perez' },
    ]
  },
}

function TeamProfile() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const [standings, setStandings] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  const team = TEAM_DATA[teamId]

  useEffect(() => {
    if (!team) { setLoading(false); return }
    async function fetchData() {
      try {
        const [standingsRes, resultsRes] = await Promise.all([
          fetch(`${BASE}/current/constructorStandings.json`).then(r => r.json()),
          fetch(`${BASE}/current/constructors/${team.constructorId}/results.json?limit=10`).then(r => r.json()),
        ])
        const allStandings = standingsRes.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || []
        const teamStanding = allStandings.find(s => s.Constructor.constructorId === team.constructorId)
        setStandings(teamStanding)
        const races = resultsRes.MRData?.RaceTable?.Races || []
        setResults(races.slice(-5).reverse())
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [teamId])

  if (!team) return (
    <div className={styles.loader}>
      <p className={styles.loaderText}>Team not found</p>
    </div>
  )

  if (loading) return (
    <div className={styles.loader}>
      <motion.div
        className={styles.loaderBar}
        initial={{ width: 0 }}
        animate={{ width: '60vw' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ background: team.color }}
      />
      <p className={styles.loaderText}>Loading team data...</p>
    </div>
  )

  return (
    <main className={styles.main} style={{ '--team': team.color, '--team-dark': team.colorDark }}>

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
        <div className={styles.heroGlow} />
        <div className={styles.heroLeft}>
          <p className={styles.eyebrow}>{team.base}</p>
          <h1 className={styles.teamName}>{team.fullName}</h1>
          <div className={styles.heroStats}>
            {[
              { val: standings?.position ? `P${standings.position}` : 'N/A', label: '2026 Position' },
              { val: standings?.points || '0', label: '2026 Points' },
              { val: standings?.wins || '0', label: '2026 Wins' },
              { val: team.championships, label: 'Championships' },
              { val: team.totalWins, label: 'Total Wins' },
              { val: team.founded, label: 'Founded' },
            ].map(s => (
              <div key={s.label} className={styles.heroStat}>
                <span className={styles.heroStatVal} style={{ color: team.color }}>{s.val}</span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.logoCircle} style={{ background: team.colorDark }}>
            <img
              src={`/teams/${teamId}.avif`}
              alt={team.fullName}
              className={styles.logoImg}
              style={{ filter: team.invertLogo === false ? 'none' : 'brightness(0) invert(1)' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        </div>
      </motion.div>

      {/* car */}
      <motion.div
        className={styles.carSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <img
          src={`/cars/${teamId}.avif`}
          alt={`${team.fullName} car`}
          className={styles.carImg}
          onError={e => { e.target.style.display = 'none' }}
        />
      </motion.div>

      {/* drivers */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className={styles.sectionTitle}>Drivers</h2>
        <div className={styles.driversGrid}>
          {team.drivers.map(driver => (
            <motion.div
              key={driver.id}
              className={styles.driverCard}
              onClick={() => navigate(`/drivers/${driver.id}`)}
              onMouseMove={e => {
                const card = e.currentTarget
                const rect = card.getBoundingClientRect()
                const x = (e.clientX - rect.left) / rect.width - 0.5
                const y = (e.clientY - rect.top) / rect.height - 0.5
                card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)'
              }}
            >
              <div className={styles.driverCardTop} style={{ borderColor: team.color }}>
                <img
                  src={`/drivers/hq/${driver.img}.png`}
                  onError={e => { e.target.src = `/drivers/${driver.img}.avif` }}
                  alt={driver.name}
                  className={styles.driverPhoto}
                />
                <div className={styles.driverNumber} style={{ color: team.color }}>
                  {driver.number}
                </div>
              </div>
              <div className={styles.driverCardBody}>
                <p className={styles.driverName}>{driver.name}</p>
                <p className={styles.driverTeam} style={{ color: team.color }}>{team.fullName}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* team info + history in two columns */}
      <motion.div
        className={styles.twoCol}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className={styles.section} style={{ marginBottom: 0 }}>
          <h2 className={styles.sectionTitle}>Team Info</h2>
          <div className={styles.infoGrid}>
            {[
              { label: 'Full name', val: team.fullName },
              { label: 'Base', val: team.base },
              { label: 'Founded', val: team.founded },
              { label: 'Championships', val: team.championships },
              { label: '2026 Position', val: standings?.position ? `P${standings.position}` : 'N/A' },
              { label: '2026 Points', val: standings?.points || '0' },
            ].map(r => (
              <div key={r.label} className={styles.infoRow}>
                <span className={styles.infoLabel}>{r.label}</span>
                <span className={styles.infoVal}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section} style={{ marginBottom: 0 }}>
          <h2 className={styles.sectionTitle}>History</h2>
          <div className={styles.historyGrid}>
            {[
              { label: 'Best result', val: team.bestFinish, highlight: true },
              { label: 'First win', val: team.firstWin },
              { label: 'Total wins', val: team.totalWins, highlight: true },
              { label: 'Notable drivers', val: team.notable },
            ].map(r => (
              <div key={r.label} className={styles.historyRow}>
                <span className={styles.historyLabel}>{r.label}</span>
                <span className={`${styles.historyVal} ${r.highlight ? styles.historyHighlight : ''}`}
                  style={r.highlight ? { color: team.color } : {}}>
                  {r.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* recent results */}
      {results.length > 0 && (
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className={styles.sectionTitle}>Recent Results</h2>
          <div className={styles.resultsTable}>
            <div className={styles.resultsHeader}>
              <span>Race</span>
              <span>Driver</span>
              <span>Pos</span>
              <span>Points</span>
            </div>
            {results.map(race =>
              race.Results?.map(result => (
                <motion.div
                  key={`${race.round}-${result.Driver.driverId}`}
                  className={styles.resultRow}
                  whileHover={{ x: 4 }}
                >
                  <span className={styles.resultRace}>{race.raceName}</span>
                  <span className={styles.resultDriver}>
                    {result.Driver.givenName} {result.Driver.familyName}
                  </span>
                  <span className={styles.resultPos}
                    style={{ color: result.position === '1' ? team.color : 'var(--white)' }}>
                    P{result.position}
                  </span>
                  <span className={styles.resultPts}>{result.points}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

    </main>
  )
}

export default TeamProfile