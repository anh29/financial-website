import React from 'react'
import { useLanguage } from '../../../context/LanguageContext'
import { translations } from '../../../constants/translations'
import styles from './Button.module.css'

type ButtonText = keyof typeof translations.common

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ButtonText
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'small' | 'medium' | 'large'
  isLoading?: boolean
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const { t } = useLanguage()

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        fullWidth ? styles.fullWidth : ''
      } ${isLoading ? styles.loading : ''} ${className || ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className={styles.spinner} /> : t('common', children)}
    </button>
  )
}
