import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import styles from './LanguageSwitcher.module.css'

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi')
  }

  return (
    <button
      className={styles.languageButton}
      onClick={toggleLanguage}
      aria-label="Switch language"
    >
      {language === 'vi' ? '🇻🇳' : '🇺🇸'}
    </button>
  )
} 