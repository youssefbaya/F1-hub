import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Teams.module.css'

const TEAMS = [
  {
    id: 'mclaren', name: 'McLaren', color: '#FF8000', colorDark: '#c45f00',
    drivers: [
      { id: 'norris', name: 'Lando Norris', img: 'lando_norris' },
      { id: 'piastri', name: 'Oscar Piastri', img: 'oscar_piastri' },
    ]
  },
  {
    id: 'red_bull', name: 'Red Bull Racing', color: '#1a1f5e', colorDark: '#0d1030',
    drivers: [
      { id: 'max_verstappen', name: 'Max Verstappen', img: 'max_verstappen' },
      { id: 'hadjar', name: 'Isack Hadjar', img: 'isack_hadjar' },
    ]
  },
  {
    id: 'ferrari', name: 'Ferrari', color: '#E8002D', colorDark: '#a50020', invertLogo: false,
    drivers: [
      { id: 'leclerc', name: 'Charles Leclerc', img: 'charles_leclerc' },
      { id: 'hamilton', name: 'Lewis Hamilton', img: 'lewis_hamilton' },
    ]
  },
  {
    id: 'mercedes', name: 'Mercedes', color: '#00a19c', colorDark: '#006b67',
    drivers: [
      { id: 'russell', name: 'George Russell', img: 'george_russell' },
      { id: 'antonelli', name: 'Kimi Antonelli', img: 'andrea_kimi_antonelli' },
    ]
  },
  {
    id: 'aston_martin', name: 'Aston Martin', color: '#006b5e', colorDark: '#003d35',
    drivers: [
      { id: 'alonso', name: 'Fernando Alonso', img: 'fernando_alonso' },
      { id: 'stroll', name: 'Lance Stroll', img: 'lance_stroll' },
    ]
  },
  {
    id: 'alpine', name: 'Alpine', color: '#0078d4', colorDark: '#004f8f',
    drivers: [
      { id: 'gasly', name: 'Pierre Gasly', img: 'pierre_gasly' },
      { id: 'colapinto', name: 'Franco Colapinto', img: 'franco_colapinto' },
    ]
  },
  {
    id: 'haas', name: 'Haas F1 Team', color: '#2a2a2a', colorDark: '#111111',
    drivers: [
      { id: 'ocon', name: 'Esteban Ocon', img: 'esteban_ocon' },
      { id: 'bearman', name: 'Oliver Bearman', img: 'oliver_bearman' },
    ]
  },
  {
    id: 'rb', name: 'Racing Bulls', color: '#1e3a8a', colorDark: '#0f1f4d',
    drivers: [
      { id: 'lawson', name: 'Liam Lawson', img: 'liam_lawson' },
      { id: 'lindblad', name: 'Arvid Lindblad', img: 'arvid_lindblad' },
    ]
  },
  {
    id: 'williams', name: 'Williams', color: '#005aff', colorDark: '#0038a8',
    drivers: [
      { id: 'albon', name: 'Alexander Albon', img: 'alexander_albon' },
      { id: 'sainz', name: 'Carlos Sainz', img: 'carlos_sainz' },
    ]
  },
  {
    id: 'audi', name: 'Audi', color: '#bb0a14', colorDark: '#7a0009',
    drivers: [
      { id: 'hulkenberg', name: 'Nico Hülkenberg', img: 'nico_hulkenberg' },
      { id: 'bortoleto', name: 'Gabriel Bortoleto', img: 'gabriel_bortoleto' },
    ]
  },
  {
    id: 'cadillac', name: 'Cadillac', color: '#1a1a1a', colorDark: '#000000',
    drivers: [
      { id: 'bottas', name: 'Valtteri Bottas', img: 'valtteri_bottas' },
      { id: 'perez', name: 'Sergio Perez', img: 'sergio_perez' },
    ]
  },
]

function Teams() {
  const navigate = useNavigate()

  return (
    <main className={styles.main}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className={styles.eyebrow}>Formula 1 · 2026 Season</p>
        <h1 className={styles.title}>Teams</h1>
      </motion.div>

      <div className={styles.grid}>
        {TEAMS.map((team, i) => (
          <motion.div
            key={team.id}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              '--team': team.color,
              '--team-dark': team.colorDark || team.color
            }}
            onClick={() => navigate(`/teams/${team.id}`)}
            onMouseMove={e => {
              const card = e.currentTarget
              const rect = card.getBoundingClientRect()
              const x = (e.clientX - rect.left) / rect.width - 0.5
              const y = (e.clientY - rect.top) / rect.height - 0.5
              card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
            }}
          >
            <div className={styles.dots} />

            <div className={styles.top}>
              <div>
                <h2 className={styles.name}>{team.name}</h2>
                <div className={styles.drivers}>
                  {team.drivers.map(d => (
                    <button
                      key={d.id}
                      className={styles.driver}
                    >
                      <div className={styles.driverCircle}>
                        <img
                          src={`/drivers/${d.img}.avif`}
                          alt={d.name}
                          className={styles.driverPhoto}
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      </div>
                      <span className={styles.driverName}>
                        {d.name.split(' ').slice(0, -1).join(' ')}{' '}
                        <strong>{d.name.split(' ').pop()}</strong>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.logo}>
                <img
                  src={`/teams/${team.id}.avif`}
                  alt={team.name}
                  className={styles.logoImg}
                  style={{ filter: team.invertLogo === false ? 'none' : 'brightness(0) invert(1)' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            </div>

            <div className={styles.car}>
              <img
                src={`/cars/${team.id}.avif`}
                alt={`${team.name} car`}
                className={styles.carImg}
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}

export default Teams