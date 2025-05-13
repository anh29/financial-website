import React from 'react'
import './Form.css'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
  error?: string
  isLoading?: boolean
}

const Form: React.FC<FormProps> = ({ title, onSubmit, children, error, isLoading, className = '', ...props }) => {
  return (
    <form className={`form ${className}`} onSubmit={onSubmit} {...props}>
      {title && <h2 className='form-title'>{title}</h2>}
      {error && <div className='form-error'>{error}</div>}
      <div className='form-content'>{children}</div>
      <div className='form-footer'>
        <button type='submit' className='form-submit' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </form>
  )
}

export default Form
