import React, { useState, useRef, useEffect } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const CustomTooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', delay = 200 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  let timeout: NodeJS.Timeout

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const trigger = triggerRef.current.getBoundingClientRect()
    const tooltip = tooltipRef.current.getBoundingClientRect()

    let x = 0
    let y = 0

    switch (position) {
      case 'top':
        x = trigger.left + (trigger.width - tooltip.width) / 2
        y = trigger.top - tooltip.height - 8
        break
      case 'bottom':
        x = trigger.left + (trigger.width - tooltip.width) / 2
        y = trigger.bottom + 8
        break
      case 'left':
        x = trigger.left - tooltip.width - 8
        y = trigger.top + (trigger.height - tooltip.height) / 2
        break
      case 'right':
        x = trigger.right + 8
        y = trigger.top + (trigger.height - tooltip.height) / 2
        break
    }

    setCoords({ x, y })
  }

  const handleMouseEnter = () => {
    timeout = setTimeout(() => {
      updatePosition()
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeout)
    setIsVisible(false)
  }

  useEffect(() => {
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      ref={triggerRef}
      className={styles.tooltipTrigger}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`${styles.tooltip} ${styles[position]}`}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default CustomTooltip
