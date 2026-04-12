import { useState, useEffect } from 'react'
import styles from './CountdownTimer.module.css'

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))

  function getTimeLeft(date) {
    const diff = new Date(date) - new Date()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const units = [
    { label: 'Days',    value: timeLeft.days },
    { label: 'Hours',   value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
  <div className={styles.timer}>
    {units.map((u, i) => (
      <div key={u.label} style={{ display: 'flex', alignItems: 'center' }}>
        <div className={styles.unit}>
          <span className={styles.value}>{String(u.value).padStart(2, '0')}</span>
          <span className={styles.label}>{u.label}</span>
        </div>
        {i < units.length - 1 && <span className={styles.sep}>:</span>}
      </div>
    ))}
  </div>
)
}
export default CountdownTimer