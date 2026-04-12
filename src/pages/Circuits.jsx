import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Circuits.module.css'

const BASE = 'https://api.jolpi.ca/ergast/f1'

const CIRCUIT_DETAILS = {
  'albert_park':      { laps: 58, length: 5.278, corners: 16, drs: 4, lapRecord: { time: '1:20.235', driver: 'Charles Leclerc', year: 2022 }, firstGP: 1996 },
  'bahrain':          { laps: 57, length: 5.412, corners: 15, drs: 3, lapRecord: { time: '1:31.447', driver: 'Pedro de la Rosa', year: 2005 }, firstGP: 2004 },
  'jeddah':           { laps: 50, length: 6.174, corners: 27, drs: 3, lapRecord: { time: '1:30.734', driver: 'Lewis Hamilton', year: 2021 }, firstGP: 2021 },
  'shanghai':         { laps: 56, length: 5.451, corners: 16, drs: 2, lapRecord: { time: '1:32.238', driver: 'Michael Schumacher', year: 2004 }, firstGP: 2004 },
  'miami':            { laps: 57, length: 5.412, corners: 19, drs: 3, lapRecord: { time: '1:29.708', driver: 'Max Verstappen', year: 2023 }, firstGP: 2022 },
  'imola':            { laps: 63, length: 4.909, corners: 19, drs: 1, lapRecord: { time: '1:15.484', driver: 'Max Verstappen', year: 2022 }, firstGP: 1980 },
  'monaco':           { laps: 78, length: 3.337, corners: 19, drs: 1, lapRecord: { time: '1:12.909', driver: 'Rubens Barrichello', year: 2004 }, firstGP: 1950 },
  'villeneuve':       { laps: 70, length: 4.361, corners: 14, drs: 2, lapRecord: { time: '1:13.078', driver: 'Valtteri Bottas', year: 2019 }, firstGP: 1978 },
  'catalunya':        { laps: 66, length: 4.657, corners: 16, drs: 2, lapRecord: { time: '1:18.149', driver: 'Max Verstappen', year: 2021 }, firstGP: 1991 },
  'red_bull_ring':    { laps: 71, length: 4.318, corners: 10, drs: 3, lapRecord: { time: '1:05.619', driver: 'Carlos Sainz', year: 2020 }, firstGP: 1970 },
  'silverstone':      { laps: 52, length: 5.891, corners: 18, drs: 2, lapRecord: { time: '1:27.097', driver: 'Max Verstappen', year: 2020 }, firstGP: 1950 },
  'hungaroring':      { laps: 70, length: 4.381, corners: 14, drs: 2, lapRecord: { time: '1:16.627', driver: 'Lewis Hamilton', year: 2020 }, firstGP: 1986 },
  'spa':              { laps: 44, length: 7.004, corners: 19, drs: 2, lapRecord: { time: '1:46.286', driver: 'Valtteri Bottas', year: 2018 }, firstGP: 1950 },
  'zandvoort':        { laps: 72, length: 4.259, corners: 14, drs: 2, lapRecord: { time: '1:11.097', driver: 'Max Verstappen', year: 2021 }, firstGP: 1952 },
  'monza':            { laps: 53, length: 5.793, corners: 11, drs: 4, lapRecord: { time: '1:21.046', driver: 'Rubens Barrichello', year: 2004 }, firstGP: 1950 },
  'baku':             { laps: 51, length: 6.003, corners: 20, drs: 2, lapRecord: { time: '1:43.009', driver: 'Charles Leclerc', year: 2019 }, firstGP: 2016 },
  'marina_bay':       { laps: 62, length: 4.940, corners: 23, drs: 3, lapRecord: { time: '1:35.867', driver: 'Kevin Magnussen', year: 2018 }, firstGP: 2008 },
  'suzuka':           { laps: 53, length: 5.807, corners: 18, drs: 2, lapRecord: { time: '1:30.983', driver: 'Lewis Hamilton', year: 2019 }, firstGP: 1987 },
  'losail':           { laps: 57, length: 5.380, corners: 16, drs: 2, lapRecord: { time: '1:24.319', driver: 'Max Verstappen', year: 2021 }, firstGP: 2021 },
  'cota':             { laps: 56, length: 5.513, corners: 20, drs: 2, lapRecord: { time: '1:36.169', driver: 'Charles Leclerc', year: 2019 }, firstGP: 2012 },
  'rodriguez':        { laps: 71, length: 4.304, corners: 17, drs: 3, lapRecord: { time: '1:17.774', driver: 'Valtteri Bottas', year: 2021 }, firstGP: 1963 },
  'interlagos':       { laps: 71, length: 4.309, corners: 15, drs: 2, lapRecord: { time: '1:10.540', driver: 'Valtteri Bottas', year: 2018 }, firstGP: 1973 },
  'vegas':            { laps: 50, length: 6.201, corners: 17, drs: 2, lapRecord: { time: '1:35.490', driver: 'Oscar Piastri', year: 2024 }, firstGP: 2023 },
  'yas_marina':       { laps: 58, length: 5.281, corners: 16, drs: 2, lapRecord: { time: '1:26.103', driver: 'Max Verstappen', year: 2021 }, firstGP: 2009 },
  'portimao':         { laps: 66, length: 4.653, corners: 15, drs: 2, lapRecord: { time: '1:18.750', driver: 'Lewis Hamilton', year: 2020 }, firstGP: 2020 },
  'mugello':          { laps: 59, length: 5.245, corners: 15, drs: 2, lapRecord: { time: '1:15.144', driver: 'Lewis Hamilton', year: 2020 }, firstGP: 2020 },
  'istanbul':         { laps: 58, length: 5.338, corners: 14, drs: 2, lapRecord: { time: '1:24.506', driver: 'Max Verstappen', year: 2021 }, firstGP: 2005 },
  'sochi':            { laps: 53, length: 5.848, corners: 18, drs: 2, lapRecord: { time: '1:35.761', driver: 'Lewis Hamilton', year: 2019 }, firstGP: 2014 },
  'paul_ricard':      { laps: 53, length: 5.842, corners: 15, drs: 3, lapRecord: { time: '1:32.740', driver: 'Sebastian Vettel', year: 2019 }, firstGP: 1971 },
  'nurburgring':      { laps: 60, length: 5.148, corners: 15, drs: 2, lapRecord: { time: '1:27.275', driver: 'Michael Schumacher', year: 2004 }, firstGP: 1984 },
  'bahrain_outer':    { laps: 87, length: 3.543, corners: 11, drs: 2, lapRecord: { time: '0:55.404', driver: 'Lance Stroll', year: 2020 }, firstGP: 2020 },
  'nurburgring_nordschleife': { laps: 1, length: 25.378, corners: 154, drs: 0, lapRecord: { time: '5:19.546', driver: 'Porsche 919 Hybrid Evo', year: 2018 }, firstGP: null, isGT: true },
  'nurburgring_gp':   { laps: 35, length: 5.148, corners: 15, drs: 0, lapRecord: { time: '1:27.275', driver: 'Michael Schumacher', year: 2004 }, firstGP: null, isGT: true },
  'le_mans':          { laps: 385, length: 13.626, corners: 38, drs: 0, lapRecord: { time: '3:14.791', driver: 'Kamui Kobayashi', year: 2017 }, firstGP: null, isGT: true },
}

const GT_CIRCUITS = [
  {
    circuitId: 'nurburgring_nordschleife',
    circuitName: 'Nürburgring Nordschleife',
    url: 'https://en.wikipedia.org/wiki/Nürburgring',
    Location: { locality: 'Nürburg', country: 'Germany', lat: '50.3356', long: '6.9475' }
  },
  {
    circuitId: 'nurburgring_gp',
    circuitName: 'Nürburgring GP Circuit',
    url: 'https://en.wikipedia.org/wiki/Nürburgring',
    Location: { locality: 'Nürburg', country: 'Germany', lat: '50.3356', long: '6.9475' }
  },
  {
    circuitId: 'le_mans',
    circuitName: 'Circuit de la Sarthe',
    url: 'https://en.wikipedia.org/wiki/Circuit_de_la_Sarthe',
    Location: { locality: 'Le Mans', country: 'France', lat: '47.9497', long: '0.2311' }
  },
]

function getImgSrc(id) {
  return `/circuits/${id}.avif`
}

function handleImgError(e, id) {
  const jpg = `/circuits/${id}.jpg`
  if (!e.target.src.endsWith('.jpg')) {
    e.target.src = jpg
  } else {
    e.target.style.display = 'none'
    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
  }
}

function Circuits() {
  const [circuits, setCircuits] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [zoomed, setZoomed] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const years = Array.from({ length: 17 }, (_, i) => 2010 + i)
    Promise.all(
      years.map(year =>
        fetch(`${BASE}/${year}/circuits.json?limit=30`)
          .then(r => r.json())
          .then(d => d.MRData?.CircuitTable?.Circuits || [])
          .catch(() => [])
      )
    ).then(results => {
      const all = results.flat()
      const unique = Array.from(
        new Map(all.map(c => [c.circuitId, c])).values()
      ).sort((a, b) => a.circuitName.localeCompare(b.circuitName))
      setCircuits([...unique, ...GT_CIRCUITS])
      setLoading(false)
    })
  }, [])

  // hide navbar when modal open
  useEffect(() => {
    const nav = document.querySelector('nav')
    if (selected) {
      document.body.style.overflow = 'hidden'
      if (nav) nav.style.zIndex = '0'
    } else {
      document.body.style.overflow = ''
      if (nav) nav.style.zIndex = '200'
    }
    return () => {
      document.body.style.overflow = ''
      if (nav) nav.style.zIndex = '200'
    }
  }, [selected])

  const closeModal = () => {
    setSelected(null)
    setZoomed(false)
  }

  const filtered = circuits.filter(c => {
    const matchesSearch =
      c.circuitName.toLowerCase().includes(search.toLowerCase()) ||
      c.Location.country.toLowerCase().includes(search.toLowerCase()) ||
      c.Location.locality.toLowerCase().includes(search.toLowerCase())
    const details = CIRCUIT_DETAILS[c.circuitId]
    if (filter === 'gt') return matchesSearch && details?.isGT
    if (filter === 'f1') return matchesSearch && !details?.isGT
    return matchesSearch
  })

  if (loading) return (
    <div className={styles.loader}>
      <motion.div
        className={styles.loaderBar}
        initial={{ width: 0 }}
        animate={{ width: '60vw' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      <p className={styles.loaderText}>Loading circuits...</p>
    </div>
  )

  return (
    <main className={styles.main}>

      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className={styles.eyebrow}>Formula 1 · 2010 — 2026</p>
        <h1 className={styles.title}>Race <em>Circuits</em></h1>
        <p className={styles.subtitle}>{circuits.length} circuits across 17 seasons</p>
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.search}
              placeholder="Search circuits, countries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            {['all', 'f1', 'gt'].map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'f1' ? 'F1' : 'GT / Endurance'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className={styles.grid}>
        {filtered.map((circuit, i) => {
          const details = CIRCUIT_DETAILS[circuit.circuitId]
          const isGT = details?.isGT
          return (
            <motion.div
              key={circuit.circuitId}
              className={`${styles.card} ${isGT ? styles.cardGT : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.6), duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => setSelected(circuit)}
            >
              <div className={styles.trackMap}>
                <img
                  src={getImgSrc(circuit.circuitId)}
                  alt={circuit.circuitName}
                  className={styles.trackImg}
                  onError={e => handleImgError(e, circuit.circuitId)}
                />
                <div className={styles.trackFallback} style={{ display: 'none' }}>
                  <span className={styles.trackInitial}>{circuit.circuitName.charAt(0)}</span>
                </div>
                <div className={styles.trackOverlay}>
                  <span className={styles.trackCountry}>{circuit.Location.country}</span>
                  {isGT && <span className={styles.gtBadge}>GT</span>}
                </div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{circuit.circuitName}</h3>
                <p className={styles.cardLocation}>{circuit.Location.locality}, {circuit.Location.country}</p>
                {details && (
                  <div className={styles.cardStats}>
                    <div className={styles.cardStat}>
                      <span className={styles.cardStatVal}>{details.laps}</span>
                      <span className={styles.cardStatLabel}>Laps</span>
                    </div>
                    <div className={styles.cardStat}>
                      <span className={styles.cardStatVal}>{details.length}km</span>
                      <span className={styles.cardStatLabel}>Length</span>
                    </div>
                    <div className={styles.cardStat}>
                      <span className={styles.cardStatVal}>{details.corners}</span>
                      <span className={styles.cardStatLabel}>Corners</span>
                    </div>
                    <div className={styles.cardStat}>
                      <span className={styles.cardStatVal}>{details.drs}</span>
                      <span className={styles.cardStatLabel}>DRS</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={e => e.stopPropagation()}
            >
              <button className={styles.modalClose} onClick={closeModal}>✕</button>

              {/* clickable image with zoom */}
              <div
                className={`${styles.modalTrack} ${zoomed ? styles.modalTrackZoomed : ''}`}
                onClick={() => setZoomed(z => !z)}
                title={zoomed ? 'Click to zoom out' : 'Click to zoom in'}
              >
                <img
                  src={getImgSrc(selected.circuitId)}
                  alt={selected.circuitName}
                  className={`${styles.modalTrackImg} ${zoomed ? styles.modalTrackImgZoomed : ''}`}
                  onError={e => handleImgError(e, selected.circuitId)}
                />
                <div className={styles.modalTrackFallback} style={{ display: 'none' }}>
                  <span className={styles.modalTrackInitial}>{selected.circuitName.charAt(0)}</span>
                </div>
                <div className={styles.zoomHint}>
                  {zoomed ? '🔍 click to zoom out' : '🔍 click to zoom in'}
                </div>
              </div>

              <div className={styles.modalContent}>
                <p className={styles.modalEyebrow}>{selected.Location.locality}, {selected.Location.country}</p>
                <h2 className={styles.modalTitle}>{selected.circuitName}</h2>

                {CIRCUIT_DETAILS[selected.circuitId] ? (() => {
                  const d = CIRCUIT_DETAILS[selected.circuitId]
                  return (
                    <>
                      <div className={styles.modalStats}>
                        {[
                          { label: 'Race Laps', val: d.laps },
                          { label: 'Length', val: `${d.length}km` },
                          { label: 'Distance', val: `${(d.laps * d.length).toFixed(1)}km` },
                          { label: 'Corners', val: d.corners },
                          { label: 'DRS Zones', val: d.drs },
                          { label: 'First GP', val: d.firstGP || 'N/A' },
                        ].map(s => (
                          <div key={s.label} className={styles.modalStat}>
                            <span className={styles.modalStatVal}>{s.val}</span>
                            <span className={styles.modalStatLabel}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.lapRecord}>
                        <div className={styles.lapRecordLeft}>
                          <span className={styles.lapRecordLabel}>Lap Record</span>
                          <span className={styles.lapRecordTime}>{d.lapRecord.time}</span>
                        </div>
                        <div className={styles.lapRecordRight}>
                          <span className={styles.lapRecordDriver}>{d.lapRecord.driver}</span>
                          <span className={styles.lapRecordYear}>{d.lapRecord.year}</span>
                        </div>
                      </div>
                    </>
                  )
                })() : (
                  <p className={styles.noData}>Detailed data coming soon</p>
                )}

                {selected.url && (
                  <a href={selected.url} target="_blank" rel="noreferrer" className={styles.wikiLink}>
                    View on Wikipedia →
                  </a>
                )}
              </div>
              <p className={styles.modalHint}>Click outside to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}

export default Circuits