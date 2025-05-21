import React from 'react'
import styles from './Form.module.css'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
  error?: string
}

export const Form: React.FC<FormProps> = ({ title, onSubmit, children, error, className = '', ...props }) => {
  return (
    <form className={`${styles.form} ${className}`} onSubmit={onSubmit} {...props}>
      {title && <h2 className={styles.formTitle}>{title}</h2>}
      {error && <div className={styles.formError}>{error}</div>}
      <div className={styles.formContent}>{children}</div>
    </form>
  )
}
