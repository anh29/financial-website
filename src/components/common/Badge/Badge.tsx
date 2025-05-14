import React from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium'
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'medium' }) => {
  return <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>{children}</span>
}
