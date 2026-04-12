

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

  // cursor animation
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
      const isMax = maxModeRef.current

      if (dotRef.current) {
        const offset = isMax ? 20 : 4
        dotRef.current.style.transform = `translate(${x - offset}px, ${y - offset}px)`
        dotRef.current.style.opacity = isMax ? '1' : '1'
      }

      ring.current.x += (x - ring.current.x) * 0.12
      ring.current.y += (y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`
      }

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
      {!maxMode && (
        <div
          ref={ringRef}
          className={`${styles.ring} ${hovering ? styles.ringHover : ''} ${clicking ? styles.ringClick : ''}`}
        />
      )}

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