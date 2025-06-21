import { useLanguage } from '../../context/LanguageContext'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher'
import styles from './Header.module.css'
import { useAuth } from '../../context/AuthContext'
import { generateAvatar } from '../../utils/userUtils'
import { FaQuestionCircle } from 'react-icons/fa'
import { useTourControl } from '../../utils/tourContext'
import { formatDate, useIsMobile } from '../../utils/helpers'

export const Header = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { setTourState, isTourActive } = useTourControl()
  const isMobile = useIsMobile()

  const handleTourToggle = () => {
    if (!isMobile) {
      setTourState(!isTourActive)
    }
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerLeft}>
        <div className={styles.headerGreeting}>
          {t('dashboard', 'welcome')}, {user?.username || t('common', 'user')}
        </div>
        <div className={styles.headerDate}>{formatDate(new Date())}</div>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.languageSwitcher}>
          <LanguageSwitcher />
        </div>
        {!isMobile && (
          <button
            className={styles.tourButton}
            onClick={handleTourToggle}
            title={isTourActive ? t('common', 'tourOff') : t('common', 'tourOn')}
            aria-label={isTourActive ? t('common', 'tourOff') : t('common', 'tourOn')}
          >
            <FaQuestionCircle />
            <span className={styles.tourButtonText}>{isTourActive ? t('common', 'tourOff') : t('common', 'tourOn')}</span>
          </button>
        )}
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
