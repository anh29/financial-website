import React from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'small' | 'medium' | 'large'
  shadow?: 'none' | 'small' | 'medium' | 'large'
}

export const Card: React.FC<CardProps> = ({ children, className, padding = 'medium', shadow = 'medium' }) => {
  return <div className={`${styles.card} ${styles[padding]} ${styles[shadow]} ${className || ''}`}>{children}</div>
}
