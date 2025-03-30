import React from 'react'
import styles from './Button.module.css'

interface ButtonProps {
  type: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ type, onClick, disabled, className, children }) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${styles.button} ${className}`}>
      {children}
    </button>
  )
}

export default Button
