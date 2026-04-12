import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Drivers.module.css'

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

const DRIVERS = [
  { id: 'max_verstappen', name: 'Max Verstappen',    code: 'VER', number: 3,  team: 'Red Bull',      color: '#3671C6' },
  { id: 'hadjar',       name: 'Isack Hadjar',        code: 'HAD', number: 6,  team: 'Red Bull',      color: '#3671C6' },
  { id: 'norris',       name: 'Lando Norris',       code: 'NOR', number: 1,  team: 'McLaren',       color: '#FF8000' },
  { id: 'piastri',      name: 'Oscar Piastri',       code: 'PIA', number: 81, team: 'McLaren',       color: '#FF8000' },
  { id: 'leclerc',      name: 'Charles Leclerc',     code: 'LEC', number: 16, team: 'Ferrari',       color: '#E8002D' },
  { id: 'hamilton',     name: 'Lewis Hamilton',      code: 'HAM', number: 44, team: 'Ferrari',       color: '#E8002D' },
  { id: 'russell',      name: 'George Russell',      code: 'RUS', number: 63, team: 'Mercedes',      color: '#27F4D2' },
  { id: 'antonelli',    name: 'Kimi Antonelli',      code: 'ANT', number: 12, team: 'Mercedes',      color: '#27F4D2' },
  { id: 'alonso',       name: 'Fernando Alonso',     code: 'ALO', number: 14, team: 'Aston Martin',  color: '#229971' },
  { id: 'stroll',       name: 'Lance Stroll',        code: 'STR', number: 18, team: 'Aston Martin',  color: '#229971' },
  { id: 'gasly',        name: 'Pierre Gasly',        code: 'GAS', number: 10, team: 'Alpine',        color: '#FF87BC' },
  { id: 'colapinto',    name: 'Franco Colapinto',    code: 'COL', number: 43, team: 'Alpine',        color: '#FF87BC' },
  { id: 'ocon',         name: 'Esteban Ocon',        code: 'OCO', number: 31, team: 'Haas F1 Team',  color: '#B6BABD' },
  { id: 'bearman',      name: 'Oliver Bearman',      code: 'BEA', number: 87, team: 'Haas F1 Team',  color: '#B6BABD' },
  { id: 'lawson',       name: 'Liam Lawson',         code: 'LAW', number: 30, team: 'Racing Bulls',  color: '#6692FF' },
  { id: 'lindblad',     name: 'Arvid Lindblad',      code: 'LIN', number: 41, team: 'Racing Bulls',  color: '#6692FF' },
  { id: 'albon',        name: 'Alexander Albon',     code: 'ALB', number: 23, team: 'Williams',      color: '#64C4FF' },
  { id: 'sainz',        name: 'Carlos Sainz',        code: 'SAI', number: 55, team: 'Williams',      color: '#64C4FF' },
  { id: 'hulkenberg',   name: 'Nico Hülkenberg',     code: 'HUL', number: 27, team: 'Audi',          color: '#B20000' },
  { id: 'bortoleto',    name: 'Gabriel Bortoleto',   code: 'BOR', number: 5,  team: 'Audi',          color: '#B20000' },
  { id: 'bottas',       name: 'Valtteri Bottas',     code: 'BOT', number: 77, team: 'Cadillac',      color: '#C8AA6E' },
  { id: 'perez',        name: 'Sergio Perez',        code: 'PER', number: 11, team: 'Cadillac',      color: '#C8AA6E' },
]

function Drivers() {
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
        <h1 className={styles.title}>Drivers</h1>
      </motion.div>

      <div className={styles.grid}>
        {DRIVERS.map((driver, i) => (
          <motion.div
  key={driver.id}
  className={styles.card}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: i * 0.04 }}
  onClick={() => navigate(`/drivers/${driver.id}`)}
  style={{ '--team-color': driver.color }}
  onMouseMove={e => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.lem,axft) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)'
  }}
>
            <div className={styles.cardTop} style={{ borderColor: driver.color }}>
              <img
                src={`/drivers/${DRIVER_IMAGES[driver.id] || driver.id}.avif`}
                alt={driver.name}
                className={styles.cardPhoto}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className={styles.cardFallback} style={{ display: 'none' }}>
                <span style={{ color: driver.color }}>{driver.code}</span>
              </div>
              <div className={styles.cardNumber} style={{ color: driver.color }}>
                {driver.number}
              </div>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardName}>{driver.name}</p>
              <p className={styles.cardTeam} style={{ color: driver.color }}>{driver.team}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}

export default Drivers