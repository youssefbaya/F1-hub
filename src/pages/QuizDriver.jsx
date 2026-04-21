import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Quiz.module.css'
import { QUIZ_DRIVERS, shuffleArray } from '../data/quizDrivers'

function buildQuestion(previousId = null) {
  const pool =
    QUIZ_DRIVERS.length > 1
      ? QUIZ_DRIVERS.filter((driver) => driver.id !== previousId)
      : QUIZ_DRIVERS

  const answer = pool[Math.floor(Math.random() * pool.length)]

  const wrongChoices = shuffleArray(
    QUIZ_DRIVERS.filter((driver) => driver.id !== answer.id)
  ).slice(0, 3)

  const options = shuffleArray([answer, ...wrongChoices])

  return {
    answer,
    options,
  }
}

function QuizDriver() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState(() => buildQuestion())
  const [selectedId, setSelectedId] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [round, setRound] = useState(1)

  const answer = question.answer

  const clues = useMemo(
    () => [
      { label: 'Nationality', value: answer.nationality },
      { label: 'Championships', value: String(answer.championships) },
      { label: 'Wins', value: String(answer.wins) },
      { label: 'Debut', value: String(answer.debutYear) },
      { label: 'Teams', value: answer.teams.join(' · ') },
    ],
    [answer]
  )

  function handleSelect(optionId) {
    if (revealed) return

    setSelectedId(optionId)
    setRevealed(true)

    if (optionId === answer.id) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }
  }

  function handleNext() {
    setQuestion(buildQuestion(answer.id))
    setSelectedId(null)
    setRevealed(false)
    setRound((r) => r + 1)
  }

  function getOptionClass(option) {
    if (!revealed) return styles.answerBtn

    if (option.id === answer.id) {
      return `${styles.answerBtn} ${styles.answerCorrect}`
    }

    if (option.id === selectedId) {
      return `${styles.answerBtn} ${styles.answerWrong}`
    }

    return `${styles.answerBtn} ${styles.answerMuted}`
  }

  return (
    <main className={styles.main}>
      <button className={styles.backBtn} onClick={() => navigate('/quiz')}>
        ← Back to quiz
      </button>

      <div className={styles.header}>
        <p className={styles.eyebrow}>Extras · Quiz Mode</p>
        <h1 className={styles.title}>Guess the Driver</h1>
        <p className={styles.subTitle}>
          Use the clues and choose the correct Formula 1 driver.
        </p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Score</span>
          <span className={styles.statValue}>{score}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Streak</span>
          <span className={styles.statValue}>{streak}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Round</span>
          <span className={styles.statValue}>{round}</span>
        </div>
      </div>

      <div className={styles.quizCard}>
        <div className={styles.cluesCard}>
          <h2 className={styles.sectionTitle}>Clues</h2>
          <div className={styles.clueList}>
            {clues.map((clue) => (
              <div key={clue.label} className={styles.clueRow}>
                <span className={styles.clueLabel}>{clue.label}</span>
                <span className={styles.clueValue}>{clue.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.answersCard}>
          <h2 className={styles.sectionTitle}>Who is it?</h2>
          <div className={styles.answersGrid}>
            {question.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={getOptionClass(option)}
                onClick={() => handleSelect(option.id)}
              >
                {option.name}
              </button>
            ))}
          </div>

          {revealed && (
            <div className={styles.resultBox}>
              <p className={styles.resultText}>
                {selectedId === answer.id ? 'Correct' : 'Wrong'} — the answer was{' '}
                <span className={styles.resultName}>{answer.name}</span>.
              </p>
              <button type="button" className={styles.nextBtn} onClick={handleNext}>
                Next Driver
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default QuizDriver