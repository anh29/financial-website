import React from 'react'
import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  type?: 'button' | 'page' | 'inline'
  size?: number // px
  color?: string
  thickness?: number // px
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  type = 'page',
  size,
  color,
  thickness,
  className = ''
}) => {
  // Defaults
  const spinnerSize = size || (type === 'button' ? 16 : type === 'inline' ? 16 : 48)
  const spinnerColor = color || (type === 'button' ? '#fff' : '#00a374')
  const spinnerThickness = thickness || (type === 'button' ? 2 : 5)

  // Inline style for dynamic values
  const style: React.CSSProperties = {
    '--spinner-size': `${spinnerSize}px`,
    '--spinner-color': spinnerColor,
    '--spinner-thickness': `${spinnerThickness}px`
  } as React.CSSProperties

  if (type === 'button') {
    return (
      <div
        className={`${styles.loadingSpinner} ${styles.button} ${className}`}
        style={style}
        aria-label='Loading'
        role='status'
      >
        <span className={`${styles.symmetryDot} ${styles.left}`} />
        <span className={`${styles.symmetryDot} ${styles.center}`} />
        <span className={`${styles.symmetryDot} ${styles.right}`} />
      </div>
    )
  }

  return (
    <div
      className={`${styles.loadingSpinner} ${styles[type]} ${className}`}
      style={style}
      aria-label='Loading'
      role='status'
    >
      <span />
    </div>
  )
}
