import React from 'react'
import { useLanguage } from '../../../context/LanguageContext'
import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: 'loading' | 'processing' | 'saving'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', text }) => {
  const { t } = useLanguage()

  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {text && <p className={styles.text}>{t('common', `loadingSpinner.${text}`)}</p>}
    </div>
  )
}
