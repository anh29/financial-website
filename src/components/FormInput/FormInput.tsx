import React, { useState } from 'react'
import styles from './FormInput.module.css'

interface FormInputProps {
  id: string
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  autoComplete?: string
  ariaLabel?: string
  showPasswordToggle?: boolean
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
  ariaLabel,
  showPasswordToggle = false
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={showPasswordToggle && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
        />
        {showPasswordToggle && (
          <button
            type='button'
            className={styles.togglePassword}
            onClick={togglePasswordVisibility}
            aria-label='Toggle password visibility'
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        )}
      </div>
    </div>
  )
}

export default FormInput
