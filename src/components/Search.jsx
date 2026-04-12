import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Search.module.css'

const SEARCH_DATA = [
  // Drivers
  { type: 'driver', id: 'norris',         name: 'Lando Norris',      sub: 'McLaren',       img: '/drivers/lando_norris.avif',          url: '/drivers/norris' },
  { type: 'driver', id: 'piastri',        name: 'Oscar Piastri',     sub: 'McLaren',       img: '/drivers/oscar_piastri.avif',         url: '/drivers/piastri' },
  { type: 'driver', id: 'max_verstappen', name: 'Max Verstappen',    sub: 'Red Bull',      img: '/drivers/max_verstappen.avif',        url: '/drivers/max_verstappen' },
  { type: 'driver', id: 'hadjar',         name: 'Isack Hadjar',      sub: 'Red Bull',      img: '/drivers/isack_hadjar.avif',          url: '/drivers/hadjar' },
  { type: 'driver', id: 'leclerc',        name: 'Charles Leclerc',   sub: 'Ferrari',       img: '/drivers/charles_leclerc.avif',       url: '/drivers/leclerc' },
  { type: 'driver', id: 'hamilton',       name: 'Lewis Hamilton',    sub: 'Ferrari',       img: '/drivers/lewis_hamilton.avif',        url: '/drivers/hamilton' },
  { type: 'driver', id: 'russell',        name: 'George Russell',    sub: 'Mercedes',      img: '/drivers/george_russell.avif',        url: '/drivers/russell' },
  { type: 'driver', id: 'antonelli',      name: 'Kimi Antonelli',    sub: 'Mercedes',      img: '/drivers/andrea_kimi_antonelli.avif', url: '/drivers/antonelli' },
  { type: 'driver', id: 'alonso',         name: 'Fernando Alonso',   sub: 'Aston Martin',  img: '/drivers/fernando_alonso.avif',       url: '/drivers/alonso' },
  { type: 'driver', id: 'stroll',         name: 'Lance Stroll',      sub: 'Aston Martin',  img: '/drivers/lance_stroll.avif',          url: '/drivers/stroll' },
  { type: 'driver', id: 'gasly',          name: 'Pierre Gasly',      sub: 'Alpine',        img: '/drivers/pierre_gasly.avif',          url: '/drivers/gasly' },
  { type: 'driver', id: 'colapinto',      name: 'Franco Colapinto',  sub: 'Alpine',        img: '/drivers/franco_colapinto.avif',      url: '/drivers/colapinto' },
  { type: 'driver', id: 'ocon',           name: 'Esteban Ocon',      sub: 'Haas F1 Team',  img: '/drivers/esteban_ocon.avif',          url: '/drivers/ocon' },
  { type: 'driver', id: 'bearman',        name: 'Oliver Bearman',    sub: 'Haas F1 Team',  img: '/drivers/oliver_bearman.avif',        url: '/drivers/bearman' },
  { type: 'driver', id: 'lawson',         name: 'Liam Lawson',       sub: 'Racing Bulls',  img: '/drivers/liam_lawson.avif',           url: '/drivers/lawson' },
  { type: 'driver', id: 'lindblad',       name: 'Arvid Lindblad',    sub: 'Racing Bulls',  img: '/drivers/arvid_lindblad.avif',        url: '/drivers/lindblad' },
  { type: 'driver', id: 'albon',          name: 'Alexander Albon',   sub: 'Williams',      img: '/drivers/alexander_albon.avif',       url: '/drivers/albon' },
  { type: 'driver', id: 'sainz',          name: 'Carlos Sainz',      sub: 'Williams',      img: '/drivers/carlos_sainz.avif',          url: '/drivers/sainz' },
  { type: 'driver', id: 'hulkenberg',     name: 'Nico Hülkenberg',   sub: 'Audi',          img: '/drivers/nico_hulkenberg.avif',       url: '/drivers/hulkenberg' },
  { type: 'driver', id: 'bortoleto',      name: 'Gabriel Bortoleto', sub: 'Audi',          img: '/drivers/gabriel_bortoleto.avif',     url: '/drivers/bortoleto' },
  { type: 'driver', id: 'bottas',         name: 'Valtteri Bottas',   sub: 'Cadillac',      img: '/drivers/valtteri_bottas.avif',       url: '/drivers/bottas' },
  { type: 'driver', id: 'perez',          name: 'Sergio Perez',      sub: 'Cadillac',      img: '/drivers/sergio_perez.avif',          url: '/drivers/perez' },
  // Teams
  { type: 'team', id: 'mclaren',      name: 'McLaren',         sub: 'Constructor', img: '/teams/mclaren.avif',      url: '/teams/mclaren' },
  { type: 'team', id: 'red_bull',     name: 'Red Bull Racing', sub: 'Constructor', img: '/teams/red_bull.avif',     url: '/teams/red_bull' },
  { type: 'team', id: 'ferrari',      name: 'Ferrari',         sub: 'Constructor', img: '/teams/ferrari.avif',      url: '/teams/ferrari' },
  { type: 'team', id: 'mercedes',     name: 'Mercedes',        sub: 'Constructor', img: '/teams/mercedes.avif',     url: '/teams/mercedes' },
  { type: 'team', id: 'aston_martin', name: 'Aston Martin',    sub: 'Constructor', img: '/teams/aston_martin.avif', url: '/teams/aston_martin' },
  { type: 'team', id: 'alpine',       name: 'Alpine',          sub: 'Constructor', img: '/teams/alpine.avif',       url: '/teams/alpine' },
  { type: 'team', id: 'haas',         name: 'Haas F1 Team',    sub: 'Constructor', img: '/teams/haas.avif',         url: '/teams/haas' },
  { type: 'team', id: 'rb',           name: 'Racing Bulls',    sub: 'Constructor', img: '/teams/rb.avif',           url: '/teams/rb' },
  { type: 'team', id: 'williams',     name: 'Williams',        sub: 'Constructor', img: '/teams/williams.avif',     url: '/teams/williams' },
  { type: 'team', id: 'audi',         name: 'Audi',            sub: 'Constructor', img: '/teams/audi.avif',         url: '/teams/audi' },
  { type: 'team', id: 'cadillac',     name: 'Cadillac',        sub: 'Constructor', img: '/teams/cadillac.avif',     url: '/teams/cadillac' },
  // Circuits
  { type: 'circuit', id: 'monaco',       name: 'Circuit de Monaco',              sub: 'Monaco',        url: '/circuits' },
  { type: 'circuit', id: 'silverstone',  name: 'Silverstone Circuit',            sub: 'UK',            url: '/circuits' },
  { type: 'circuit', id: 'monza',        name: 'Autodromo Nazionale di Monza',   sub: 'Italy',         url: '/circuits' },
  { type: 'circuit', id: 'spa',          name: 'Circuit de Spa-Francorchamps',   sub: 'Belgium',       url: '/circuits' },
  { type: 'circuit', id: 'suzuka',       name: 'Suzuka International Racing',    sub: 'Japan',         url: '/circuits' },
  { type: 'circuit', id: 'albert_park',  name: 'Albert Park Circuit',            sub: 'Australia',     url: '/circuits' },
  { type: 'circuit', id: 'miami',        name: 'Miami International Autodrome',  sub: 'USA',           url: '/circuits' },
  { type: 'circuit', id: 'baku',         name: 'Baku City Circuit',              sub: 'Azerbaijan',    url: '/circuits' },
  { type: 'circuit', id: 'singapore',    name: 'Marina Bay Street Circuit',      sub: 'Singapore',     url: '/circuits' },
  // Pages
  { type: 'page', name: 'Home',             sub: 'Page', url: '/' },
  { type: 'page', name: 'Drivers',          sub: 'Page', url: '/drivers' },
  { type: 'page', name: 'Teams',            sub: 'Page', url: '/teams' },
  { type: 'page', name: 'Calendar',         sub: 'Page', url: '/calendar' },
  { type: 'page', name: 'Circuits',         sub: 'Page', url: '/circuits' },
  { type: 'page', name: 'Compare Drivers',  sub: 'Page', url: '/compare' },
]

const TYPE_COLORS = {
  driver:  '#6692FF',
  team:    '#FF8000',
  circuit: '#27F4D2',
  page:    '#888',
}

const TYPE_ICONS = {
  driver:  '👤',
  team:    '🏎',
  circuit: '🏁',
  page:    '📄',
}

export default function Search({ onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)

  const results = query.length < 1 ? [] : SEARCH_DATA.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.sub?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setSelected(0)
  }, [query])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && results[selected]) {
        navigate(results[selected].url)
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [results, selected, navigate, onClose])

  const handleSelect = (item) => {
    navigate(item.url)
    onClose()
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.inputWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search drivers, teams, circuits..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className={styles.escKey}>ESC</kbd>
        </div>

        {results.length > 0 && (
          <div className={styles.results}>
            {results.map((item, i) => (
              <motion.button
                key={`${item.type}-${item.id || item.name}`}
                className={`${styles.result} ${i === selected ? styles.resultSelected : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelected(i)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className={styles.resultLeft}>
                  {item.img ? (
                    <div className={styles.resultImg}>
                      <img src={item.img} alt={item.name} className={styles.resultPhoto} onError={e => e.target.style.display = 'none'} />
                    </div>
                  ) : (
                    <div className={styles.resultIcon}>{TYPE_ICONS[item.type]}</div>
                  )}
                  <div className={styles.resultInfo}>
                    <span className={styles.resultName}>{item.name}</span>
                    <span className={styles.resultSub}>{item.sub}</span>
                  </div>
                </div>
                <span className={styles.resultType} style={{ color: TYPE_COLORS[item.type] }}>
                  {item.type}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {query.length > 0 && results.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No results for "{query}"</p>
          </div>
        )}

        {query.length === 0 && (
          <div className={styles.hints}>
            <span className={styles.hint}><kbd>↑↓</kbd> navigate</span>
            <span className={styles.hint}><kbd>↵</kbd> select</span>
            <span className={styles.hint}><kbd>ESC</kbd> close</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}