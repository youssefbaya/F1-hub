import { useNavigate } from 'react-router-dom'
import styles from './Quiz.module.css'

function Quiz() {
  const navigate = useNavigate()

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Extras · Quiz Mode</p>
        <h1 className={styles.title}>Quiz</h1>
        <p className={styles.subTitle}>
          Test your Formula 1 knowledge with quick interactive quiz modes.
        </p>
      </div>

      <div className={styles.modeGrid}>
        <button
          type="button"
          className={styles.modeCard}
          onClick={() => navigate('/quiz/driver')}
        >
          <span className={styles.modeLabel}>Quiz Mode</span>
          <span className={styles.modeTitle}>Guess the Driver</span>
          <span className={styles.modeMeta}>
            Clues, multiple choice, score and streak
          </span>
        </button>

        <button
          type="button"
          className={styles.modeCard}
          onClick={() => navigate('/quiz/circuit')}
        >
          <span className={styles.modeLabel}>Coming soon</span>
          <span className={styles.modeTitle}>Guess the Circuit</span>
          <span className={styles.modeMeta}>
            Track and circuit trivia mode
          </span>
        </button>
      </div>
    </main>
  )
}

export default Quiz 