import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Max.module.css'

const N24_DATE = new Date('2026-05-14T06:00:00Z')

const GT3_RACES = [
  {
    id: 1,
    event: 'NLS9 2025',
    date: 'September 27, 2025',
    car: 'Ferrari 296 GT3',
    number: '#31',
    team: 'Emil Frey Racing',
    coDrivers: ['Chris Lulham'],
    grid: 'P3',
    result: 'P1 ✓',
    gap: '+24.5s ahead',
    notes: 'GT3 debut. Won from P3, built a 1-minute lead in opening stints.',
    color: '#E8002D',
    won: true,
  },
  {
    id: 2,
    event: 'NLS2 2026',
    date: 'March 21, 2026',
    car: 'Mercedes-AMG GT3',
    number: '#3',
    team: 'Winward Racing / Verstappen Racing',
    coDrivers: ['Dani Juncadella', 'Jules Gounon'],
    grid: 'P1',
    result: 'DSQ',
    gap: 'Won by 59s on track',
    notes: 'Pole with 7:51.751. Dominated race but disqualified for tyre rule breach post-race.',
    color: '#00d2be',
    won: false,
    dsq: true,
  },
  {
    id: 3,
    event: 'Nürburgring 24 Hours 2026',
    date: 'May 14–17, 2026',
    car: 'Mercedes-AMG GT3',
    number: '#3',
    team: 'Winward Racing / Verstappen Racing',
    coDrivers: ['Dani Juncadella', 'Jules Gounon', 'Lucas Auer'],
    grid: '?',
    result: '?',
    gap: 'Upcoming',
    notes: 'Bucket list race. First 24-hour endurance race for Verstappen.',
    color: '#3671C6',
    won: false,
    upcoming: true,
  },
]

const RECORDS = [
  { icon: '🏆', label: 'World Championships', value: '4', sub: '2021 · 2022 · 2023 · 2024' },
  { icon: '🏁', label: 'Career Wins', value: '63+', sub: 'As of 2026' },
  { icon: '⚡', label: 'Pole Positions', value: '40+', sub: 'Career total' },
  { icon: '🥇', label: 'Podiums', value: '114+', sub: 'Career total' },
  { icon: '📅', label: 'F1 Debut', value: '2015', sub: 'Youngest ever points scorer at 17' },
  { icon: '🎯', label: 'Fastest Laps', value: '33+', sub: 'Career total' },
  { icon: '💨', label: 'Dominant Season', value: '2023', sub: '19 wins in a single season' },
  { icon: '🔴', label: 'Current Team', value: 'Red Bull', sub: 'Since 2016' },
]

const FUN_FACTS = [
  'Max won his first F1 race on his Red Bull debut at the 2016 Spanish Grand Prix aged 18.',
  'He is the youngest F1 World Champion ever, winning his first title at 24.',
  'In 2023, he won 19 out of 22 races — the most wins in a single season in F1 history.',
  'Max runs his own sim racing team, Team Redline, which competes in online championships.',
  'He earned his GT3 racing licence by driving a Porsche GT4 just two weeks before his NLS debut.',
  'His father Jos Verstappen also raced in F1, competing from 1994 to 2003.',
  'Max won on his NLS GT3 debut in September 2025 — same as his F1 debut in 2016.',
  'The Nürburgring 24 Hours has been on his bucket list since childhood.',
]

function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    function calc() {
      const diff = targetDate - new Date()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className={styles.countdown}>
      {[
        { label: 'Days',    value: timeLeft.days },
        { label: 'Hours',   value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
      ].map((unit, i) => (
        <div key={unit.label} className={styles.countdownUnit}>
          <span className={styles.countdownNum}>
            {String(unit.value ?? 0).padStart(2, '0')}
          </span>
          <span className={styles.countdownLabel}>{unit.label}</span>
        </div>
      ))}
    </div>
  )
}

function Max() {
  const navigate = useNavigate()
  const [factIndex, setFactIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex(i => (i + 1) % FUN_FACTS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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

      {/* hero */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.heroGlow} />
        <div className={styles.heroLeft}>
          <p className={styles.eyebrow}>🇳🇱 Dutch · Red Bull Racing</p>
          <h1 className={styles.heroName}>
            <span className={styles.heroFirst}>Max</span>
            <span className={styles.heroLast}>Verstappen</span>
          </h1>
          <p className={styles.heroSub}>4× World Champion · Nürburgring racer · The GOAT debate</p>
          <motion.button
            className={styles.heroBtn}
            onClick={() => navigate('/drivers/max_verstappen')}
            whileHover={{ x: 4 }}
          >
            View F1 Profile →
          </motion.button>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroPhoto}>
            <img
              src="/drivers/max_verstappen.avif"
              alt="Max Verstappen"
              className={styles.heroPhotoImg}
              onError={e => e.target.style.display = 'none'}
            />
          </div>
          <div className={styles.heroBigNum}>3</div>
        </div>
      </motion.div>

      {/* N24 countdown */}
      <motion.div
        className={styles.n24Section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className={styles.n24Header}>
          <div>
            <p className={styles.n24Label}>Countdown to</p>
            <h2 className={styles.n24Title}>Nürburgring 24 Hours</h2>
            <p className={styles.n24Sub}>May 14–17, 2026 · Nürburgring Nordschleife · Debut race</p>
          </div>
          <div className={styles.n24Car}>
            <p className={styles.n24CarLabel}>Car</p>
            <p className={styles.n24CarVal}>#3 Mercedes-AMG GT3</p>
            <p className={styles.n24CarTeam}>Winward Racing / Verstappen Racing</p>
            <p className={styles.n24CarDrivers}>Juncadella · Gounon · Auer</p>
          </div>
        </div>
        <Countdown targetDate={N24_DATE} />
      </motion.div>

      {/* GT3 campaign */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className={styles.sectionTitle}>GT3 Campaign</h2>
        <div className={styles.gt3Timeline}>
          {GT3_RACES.map((race, i) => (
            <motion.div
              key={race.id}
              className={`${styles.gt3Card} ${race.upcoming ? styles.gt3Upcoming : ''} ${race.dsq ? styles.gt3Dsq : ''}`}
              style={{ '--rc': race.color }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className={styles.gt3Left}>
                <div className={styles.gt3Dot} style={{ background: race.won ? '#22c55e' : race.dsq ? '#f59e0b' : race.upcoming ? '#6692FF' : 'var(--grey)' }} />
                <div className={styles.gt3Line} />
              </div>
              <div className={styles.gt3Content}>
                <div className={styles.gt3Top}>
                  <div>
                    <h3 className={styles.gt3Event}>{race.event}</h3>
                    <p className={styles.gt3Date}>{race.date}</p>
                  </div>
                  <div className={styles.gt3ResultWrap}>
                    <span
                      className={styles.gt3Result}
                      style={{
                        color: race.won ? '#22c55e' : race.dsq ? '#f59e0b' : race.upcoming ? '#6692FF' : 'var(--grey)',
                        borderColor: race.won ? '#22c55e' : race.dsq ? '#f59e0b' : race.upcoming ? '#6692FF' : 'var(--grey)',
                      }}
                    >
                      {race.result}
                    </span>
                  </div>
                </div>
                <div className={styles.gt3Details}>
                  <div className={styles.gt3Detail}>
                    <span className={styles.gt3DetailLabel}>Car</span>
                    <span className={styles.gt3DetailVal} style={{ color: race.color }}>{race.car} {race.number}</span>
                  </div>
                  <div className={styles.gt3Detail}>
                    <span className={styles.gt3DetailLabel}>Team</span>
                    <span className={styles.gt3DetailVal}>{race.team}</span>
                  </div>
                  <div className={styles.gt3Detail}>
                    <span className={styles.gt3DetailLabel}>Co-drivers</span>
                    <span className={styles.gt3DetailVal}>{race.coDrivers.join(' · ')}</span>
                  </div>
                  <div className={styles.gt3Detail}>
                    <span className={styles.gt3DetailLabel}>Grid</span>
                    <span className={styles.gt3DetailVal}>{race.grid}</span>
                  </div>
                  <div className={styles.gt3Detail}>
                    <span className={styles.gt3DetailLabel}>Gap</span>
                    <span className={styles.gt3DetailVal}>{race.gap}</span>
                  </div>
                </div>
                <p className={styles.gt3Notes}>{race.notes}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* career records */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className={styles.sectionTitle}>Career Records</h2>
        <div className={styles.recordsGrid}>
          {RECORDS.map((r, i) => (
            <motion.div
              key={r.label}
              className={styles.recordCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <span className={styles.recordIcon}>{r.icon}</span>
              <span className={styles.recordValue}>{r.value}</span>
              <span className={styles.recordLabel}>{r.label}</span>
              <span className={styles.recordSub}>{r.sub}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* fun facts */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className={styles.sectionTitle}>Did You Know?</h2>
        <div className={styles.factCard}>
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              className={styles.factText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {FUN_FACTS[factIndex]}
            </motion.p>
          </AnimatePresence>
          <div className={styles.factDots}>
            {FUN_FACTS.map((_, i) => (
              <button
                key={i}
                className={`${styles.factDot} ${i === factIndex ? styles.factDotActive : ''}`}
                onClick={() => setFactIndex(i)}
              />
            ))}
          </div>
        </div>
      </motion.div>

    </main>
  )
}

export default Max