import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../constants/translations'
import styles from './Button.module.css'

type ButtonText = keyof typeof translations.common

interface ButtonProps {
  children: ButtonText
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const { t } = useLanguage()

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]} ${className}`}
    >
      {t('common', children)}
    </button>
  )
}
