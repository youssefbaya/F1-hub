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
        <p className={styles.subTitle}>
          Champions, icons, and historic names from across Formula 1 history.
        </p>
      </div>
      <div className={styles.devNotice}>
        <span className={styles.devNoticeDot} />
        <div>
          <p className={styles.devNoticeTitle}>Still in development</p>
          <p className={styles.devNoticeText}>
            This archive is being cleaned up and expanded. Some drivers, images, and stats may change.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {OLD_DRIVERS.map((driver) => (
          <button
            key={driver.id}
            type="button"
            className={styles.card}
            onClick={() => navigate(`/drivers/${driver.id}`)}
          >
            <div className={styles.cardGlow} />
            <div className={styles.photoWrap}>
              <div className={styles.photo}>
                <img
                  src={`/drivers/${driver.id}.avif`}
                  alt={driver.name}
                  className={styles.photoImg}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className={styles.photoFallback} style={{ display: 'none' }}>
                  {driver.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              </div>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.name}>{driver.name}</p>
              <p className={styles.meta}>Legend profile</p>
            </div>
          </button>
        ))}
      </div>
    </main>
  )
}

export default OldDrivers