import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Max.module.css'

const N24_DATE = new Date('2026-05-14T06:00:00Z')

const HELMETS = [
  { id: '2021', label: '2021 · Abu Dhabi', sub: 'Championship winning helmet' },
  { id: '2023', label: '2023 · Dominant', sub: '19 wins season' },
  { id: '2024', label: '2024 · Champion', sub: 'Fourth title' },
  { id: 'zandvoort', label: 'Zandvoort Special', sub: 'Dutch GP home race' },
  { id: 'gt3_2025', label: 'GT3 2025', sub: 'Nürburgring debut' },
]

const GT3_RACES = [
  {
    id: 1, event: 'NLS9 2025', date: 'Sep 27, 2025',
    car: 'Ferrari 296 GT3', number: '#31', team: 'Emil Frey Racing',
    coDrivers: 'Chris Lulham', grid: 'P3', result: 'P1 ✓',
    notes: 'GT3 debut. Won by 24.5s from 110 cars.',
    color: '#E8002D', won: true,
  },
  {
    id: 2, event: 'NLS2 2026', date: 'Mar 21, 2026',
    car: 'Mercedes-AMG GT3', number: '#3', team: 'Winward / Verstappen Racing',
    coDrivers: 'Juncadella · Gounon', grid: 'P1 (7:51.751)', result: 'DSQ',
    notes: 'Won by 59s on track. Disqualified for tyre rule breach.',
    color: '#00d2be', won: false, dsq: true,
  },
  {
    id: 3, event: 'Nürburgring 24H 2026', date: 'May 14–17, 2026',
    car: 'Mercedes-AMG GT3', number: '#3', team: 'Winward / Verstappen Racing',
    coDrivers: 'Juncadella · Gounon · Auer', grid: '?', result: 'TBD',
    notes: 'Bucket list race. First ever 24-hour endurance race.',
    color: '#3671C6', won: false, upcoming: true,
  },
]

const RECORDS = [
  { icon: '🏆', label: 'Championships', value: '4', sub: '2021 · 2022 · 2023 · 2024' },
  { icon: '🏁', label: 'Career Wins', value: '69+2', sub: 'As of 2026' },
  { icon: '⚡', label: 'Pole Positions', value: '48', sub: 'Career total' },
  { icon: '🥇', label: 'Podiums', value: '127', sub: 'Career total' },
  { icon: '📅', label: 'F1 Debut', value: '2015', sub: 'Youngest points scorer at 17' },
  { icon: '🔥', label: 'Best Season', value: '2023', sub: '19 wins from 22 races' },
  { icon: '🏎️', label: 'Fastest Laps', value: '33+', sub: 'Career total' },
  { icon: '🎯', label: 'Current Number', value: '#3', sub: 'Previously #33 → #1' },
]

const FUN_FACTS = [
  'Max won his first F1 race on his Red Bull debut at the 2016 Spanish GP, aged 18.',
  'He is the youngest F1 World Champion ever, winning his first title at 24.',
  'In 2023, he won 19 out of 22 races — the most wins in a single season ever.',
  'Max earned his GT3 licence by driving a Porsche GT4 just two weeks before his NLS debut.',
  'He runs his own sim racing team, Verstappen Sim Racing, competing in online championships and they also stream on Twitch!',
  'His father Jos Verstappen also raced in F1, from 1994 to 2003.',
  'The Nürburgring 24 Hours has been on his bucket list since childhood.',
  'Max won on his NLS GT3 debut in 2025 — just like he won on his F1 debut in 2016.',
  'He is the best driver in the world, according to me, and I’m not just saying that because I’m a Max fan obviously',
]

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})
  useEffect(() => {
    function calc() {
      const diff = targetDate - new Date()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [targetDate])
  return timeLeft
}

export default function Max() {
  const navigate = useNavigate()
  const timeLeft = useCountdown(N24_DATE)
  const [factIndex, setFactIndex] = useState(0)
  const [selectedHelmet, setSelectedHelmet] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => setFactIndex(i => (i + 1) % FUN_FACTS.length), 5000)
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

      <div className={styles.bento}>

        {/* HERO CARD — large */}
        <motion.div
          className={`${styles.card} ${styles.cardHero}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className={styles.heroGlow} />
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>Dutch · Red Bull Racing · #3</p>
            <h1 className={styles.heroName}>
              <span className={styles.heroFirst}>Max</span>
              <span className={styles.heroLast}>Verstappen</span>
            </h1>
            <p className={styles.heroSub}>4× World Champion · Nürburgring racer · The GOAT</p>
            <motion.button
              className={styles.heroBtn}
              onClick={() => navigate('/drivers/max_verstappen')}
              whileHover={{ x: 4 }}
            >
              View F1 Profile →
            </motion.button>
          </div>
          <div className={styles.heroPhotoWrap}>
            <img src="/drivers/max_verstappen.avif" alt="Max Verstappen" className={styles.heroPhoto} onError={e => e.target.style.display = 'none'} />
            <div className={styles.heroBigNum}>3</div>
          </div>
        </motion.div>

        {/* N24 COUNTDOWN — medium */}
        <motion.div
          className={`${styles.card} ${styles.cardCountdown}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className={styles.cardLabel}>Countdown to</p>
          <h2 className={styles.cardTitle}>Nürburgring 24H</h2>
          <p className={styles.cardSub}>May 14–17, 2026</p>
          <div className={styles.countdown}>
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Mins', val: timeLeft.minutes },
              { label: 'Secs', val: timeLeft.seconds },
            ].map(u => (
              <div key={u.label} className={styles.countdownUnit}>
                <span className={styles.countdownNum}>{String(u.val ?? 0).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>{u.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.n24Car}>
            <span style={{ color: '#3671C6', fontFamily: 'var(--head)', fontWeight: 900 }}>#3 Mercedes-AMG GT3</span>
            <span style={{ color: 'var(--grey)', fontFamily: 'var(--mono)', fontSize: 9 }}>Juncadella · Gounon · Auer</span>
          </div>
        </motion.div>

        {/* QUICK STATS — 4 small cards */}
        {RECORDS.slice(0, 4).map((r, i) => (
          <motion.div
            key={r.label}
            className={`${styles.card} ${styles.cardStat}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            whileHover={{ y: -4, scale: 1.03 }}
          >
            <span className={styles.statIcon}>{r.icon}</span>
            <span className={styles.statValue}>{r.value}</span>
            <span className={styles.statLabel}>{r.label}</span>
            <span className={styles.statSub}>{r.sub}</span>
          </motion.div>
        ))}

        {/* GT3 TIMELINE — wide */}
        <motion.div
          className={`${styles.card} ${styles.cardGT3}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className={styles.cardLabel}>GT3 Campaign</p>
          <h2 className={styles.cardTitle}>Nürburgring Journey</h2>
          <div className={styles.gt3List}>
            {GT3_RACES.map(race => (
              <div key={race.id} className={styles.gt3Item} style={{ '--rc': race.color }}>
                <div className={styles.gt3Dot} style={{
                  background: race.won ? '#22c55e' : race.dsq ? '#f59e0b' : race.upcoming ? '#6692FF' : 'var(--grey)'
                }} />
                <div className={styles.gt3Info}>
                  <div className={styles.gt3Top}>
                    <span className={styles.gt3Event}>{race.event}</span>
                    <span className={styles.gt3Date}>{race.date}</span>
                    <span className={styles.gt3Result} style={{
                      color: race.won ? '#22c55e' : race.dsq ? '#f59e0b' : race.upcoming ? '#6692FF' : 'var(--grey)'
                    }}>{race.result}</span>
                  </div>
                  <div className={styles.gt3Details}>
                    <span style={{ color: race.color }}>{race.car} {race.number}</span>
                    <span>{race.coDrivers}</span>
                    <span style={{ color: 'var(--grey)', fontStyle: 'italic' }}>{race.notes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FUN FACTS */}
        <motion.div
          className={`${styles.card} ${styles.cardFacts}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className={styles.cardLabel}>Did You Know?</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              className={styles.factText}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
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
        </motion.div>

        {/* MORE STATS — 4 cards */}
        {RECORDS.slice(4).map((r, i) => (
          <motion.div
            key={r.label}
            className={`${styles.card} ${styles.cardStat}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            whileHover={{ y: -4, scale: 1.03 }}
          >
            <span className={styles.statIcon}>{r.icon}</span>
            <span className={styles.statValue}>{r.value}</span>
            <span className={styles.statLabel}>{r.label}</span>
            <span className={styles.statSub}>{r.sub}</span>
          </motion.div>
        ))}

        {/* HELMETS */}
        <motion.div
          className={`${styles.card} ${styles.cardHelmets}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <p className={styles.cardLabel}>Iconic Helmets</p>
          <h2 className={styles.cardTitle}>Design Collection</h2>
          <div className={styles.helmetGrid}>
            {HELMETS.map(h => (
              <motion.div
                key={h.id}
                className={`${styles.helmetCard} ${selectedHelmet === h.id ? styles.helmetCardActive : ''}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedHelmet(selectedHelmet === h.id ? null : h.id)}
              >
                <div className={styles.helmetImg}>
                  <img
                    src={`/helmets/${h.id}.png`}
                    alt={h.label}
                    className={styles.helmetPhoto}
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className={styles.helmetFallback} style={{ display: 'none' }}>🪖</div>
                </div>
                <p className={styles.helmetLabel}>{h.label}</p>
                <p className={styles.helmetSub}>{h.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CHAMPIONSHIPS TIMELINE */}
        <motion.div
          className={`${styles.card} ${styles.cardChamps}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className={styles.cardLabel}>World Championships</p>
          <div className={styles.champsList}>
            {[
              { year: '2021', team: 'Red Bull', note: 'Abu Dhabi · Last lap drama' },
              { year: '2022', team: 'Red Bull', note: '15 wins · Dominant' },
              { year: '2023', team: 'Red Bull', note: '19 wins · Historic season' },
              { year: '2024', team: 'Red Bull', note: '4th title · McLaren battle' },
            ].map((c, i) => (
              <motion.div
                key={c.year}
                className={styles.champItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <span className={styles.champYear}>{c.year}</span>
                <span className={styles.champTeam} style={{ color: '#3671C6' }}>{c.team}</span>
                <span className={styles.champNote}>{c.note}</span>
                <span className={styles.champTrophy}>🏆</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  )
}