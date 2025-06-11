import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher'
import { translations } from '../../constants/translations'
import styles from './Header.module.css'
import { useAuth } from '../../context/AuthContext'
import { generateAvatar } from '../../utils/userUtils'
import { FaQuestionCircle } from 'react-icons/fa'
import { useTourControl } from '../../utils/tourContext'

type NavigationKey = keyof typeof translations.navigation

interface HeaderProps {
  title: NavigationKey
  onMenuClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { setTourState, isTourActive } = useTourControl()

  const handleTourToggle = () => {
    setTourState(!isTourActive)
  }

  // Example: show greeting and date
  const today = new Date()
  const dateString = today.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerLeft}>
        <div className={styles.headerGreeting}>
          {t('dashboard', 'welcome')}, {user?.username || t('common', 'user')}
        </div>
        <div className={styles.headerDate}>{dateString}</div>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.languageSwitcher}>
          <LanguageSwitcher />
        </div>
        <button
          className={styles.tourButton}
          onClick={handleTourToggle}
          title={isTourActive ? t('common', 'tourOff') : t('common', 'tourOn')}
          aria-label={isTourActive ? t('common', 'tourOff') : t('common', 'tourOn')}
        >
          <FaQuestionCircle />
          <span className={styles.tourButtonText}>{isTourActive ? t('common', 'tourOff') : t('common', 'tourOn')}</span>
        </button>
        <div className={styles.userProfile}>
          {user && (
            <>
              {user.avatar ? (
                <img src={user.avatar} alt={user.username || t('common', 'userAvatar')} />
              ) : (
                <div className={styles.avatarStyle}>{generateAvatar(user.username || '')}</div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
