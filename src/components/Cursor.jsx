import { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef = useRef(null)
  const mouse = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)
  const typedRef = useRef('')
  const maxModeRef = useRef(false)

  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [maxMode, setMaxMode] = useState(false)

  const isMobile = window.matchMedia('(pointer: coarse)').matches
  if (isMobile) return null

  useEffect(() => {
    const handleKey = (e) => {
      typedRef.current += e.key.toLowerCase()

      if (typedRef.current.includes('max')) {
        setMaxMode(true)
        maxModeRef.current = true
        typedRef.current = ''

        setTimeout(() => {
          setMaxMode(false)
          maxModeRef.current = false
        }, 10000)
      }

      if (typedRef.current.length > 10) {
        typedRef.current = typedRef.current.slice(-10)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }

      const interactive = e.target.closest(
        'a, button, [role="button"], input, textarea, select'
      )
      setHovering(Boolean(interactive))
    }

    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const animate = () => {
      const { x, y } = mouse.current
      const isMax = maxModeRef.current

      if (dotRef.current) {
        const offset = isMax ? 20 : 4
        const dotScale = clicking ? 0.72 : hovering ? 1.35 : 1
        dotRef.current.style.transform = `translate(${x - offset}px, ${y - offset}px) scale(${dotScale})`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [hovering, clicking])

  return (
    <>
      {maxMode ? (
        <div ref={dotRef} className={styles.maxCursor}>
          <img src="/max.png" alt="Max" className={styles.maxImg} />
        </div>
      ) : (
        <div
          ref={dotRef}
          className={`${styles.dot} ${hovering ? styles.dotHover : ''} ${clicking ? styles.dotClick : ''}`}
        />
      )}
    </>
  )
}