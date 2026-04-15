import { OLD_DRIVERS } from '../data/oldDrivers'
import styles from './OldDrivers.module.css'
import { useNavigate } from 'react-router-dom'

function OldDrivers() {
  const navigate = useNavigate()

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Formula 1 · Legends</p>
        <h1 className={styles.title}>Old Drivers</h1>
      </div>

      <div className={styles.grid}>
        {OLD_DRIVERS.map(driver => (
          <div
            key={driver.id}
            className={styles.card}
            onClick={() => navigate(`/drivers/${driver.id}`)}
          >
            <div className={styles.photo}>
              <img
                src={`/drivers/${driver.id}.avif`}
                alt={driver.name}
                onError={e => e.target.style.display = 'none'}
              />
            </div>
            <p className={styles.name}>{driver.name}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default OldDrivers
