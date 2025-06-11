import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import styles from './Notification.module.css'

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  onClose: () => void
}

export const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  const { t } = useLanguage()

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
        <button className={styles.closeButton} onClick={onClose}>
          {t('common', 'close')}
        </button>
      </div>
    </div>
  )
}
