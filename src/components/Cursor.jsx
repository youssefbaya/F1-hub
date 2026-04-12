import { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const trailRefs = useRef([])
  const mouse = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const trail = useRef(Array(6).fill({ x: -100, y: -100 }))
  const rafRef = useRef(null)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    const onEnter = (e) => {
      if (e.target.closest('a, button, [role="button"], input, [onClick]')) {
        setHovering(true)
      }
    }
    const onLeave = (e) => {
      if (e.target.closest('a, button, [role="button"], input, [onClick]')) {
        setHovering(false)
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseover', onEnter)
    window.addEventListener('mouseout', onLeave)

    const animate = () => {
      const { x, y } = mouse.current

      // dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`
      }

      // ring follows with lerp delay
      ring.current.x += (x - ring.current.x) * 0.12
      ring.current.y += (y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`
      }

      // trail follows ring with staggered delay
      trail.current = [
        { x, y },
        ...trail.current.slice(0, 5)
      ]
      trailRefs.current.forEach((el, i) => {
        if (!el) return
        const t = trail.current[i] || { x: -100, y: -100 }
        el.style.transform = `translate(${t.x - 3}px, ${t.y - 3}px)`
        el.style.opacity = `${(0.18 - i * 0.03)}`
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseover', onEnter)
      window.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      {/* trail dots */}
      {Array(6).fill(0).map((_, i) => (
        <div
          key={i}
          ref={el => trailRefs.current[i] = el}
          className={styles.trail}
        />
      ))}

      {/* outer ring */}
      <div
        ref={ringRef}
        className={`${styles.ring} ${hovering ? styles.ringHover : ''} ${clicking ? styles.ringClick : ''}`}
      />

      {/* center dot */}
      <div
        ref={dotRef}
        className={`${styles.dot} ${hovering ? styles.dotHover : ''} ${clicking ? styles.dotClick : ''}`}
      />
    </>
  )
}