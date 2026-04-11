import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  const location = useLocation()
  const links = [
    { path: '/', label: 'Home' },
    { path: '/drivers', label: 'Drivers' },
    { path: '/calendar', label: 'Calendar' },
    { path: '/teams', label: 'Teams' },
  ]
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>F1 Hub</Link>
      <div className={styles.links}>
        {links.map(l => (
          <Link
            key={l.path}
            to={l.path}
            className={`${styles.link} ${location.pathname === l.path ? styles.active : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
export default Navbar