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
      {title && <h2 className='form-title'>{title}</h2>}
      {error && <div className='form-error'>{error}</div>}
      <div className='form-content'>{children}</div>
    </form>
  )
}
