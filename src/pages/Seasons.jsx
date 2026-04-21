import { useNavigate } from 'react-router-dom'
import styles from './Seasons.module.css'

const CURRENT_YEAR = new Date().getFullYear()
const START_YEAR = 1950

function Seasons() {
  const navigate = useNavigate()

  const years = Array.from(
    { length: CURRENT_YEAR - START_YEAR + 1 },
    (_, i) => CURRENT_YEAR - i
  )

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Formula 1 · Archive</p>
        <h1 className={styles.title}>Seasons</h1>
        <p className={styles.subTitle}>
          Explore Formula 1 season overviews from 1950 to today.
        </p>
      </div>

      <div className={styles.grid}>
        {years.map((year) => (
          <button
            key={year}
            type="button"
            className={styles.card}
            onClick={() => navigate(`/seasons/${year}`)}
          >
            <span className={styles.year}>{year}</span>
            <span className={styles.cardMeta}>
              {year === CURRENT_YEAR ? 'Current season' : 'Season overview'}
            </span>
          </button>
        ))}
      </div>
    </main>
  )
}

export default Seasons