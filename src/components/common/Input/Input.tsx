import React from 'react'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className, ...props }) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`} {...props} />
      {(error || helperText) && (
        <p className={`${styles.helperText} ${error ? styles.errorText : ''}`}>{error || helperText}</p>
      )}
    </div>
  )
}
