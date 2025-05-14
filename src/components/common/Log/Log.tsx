import React, { useEffect, useState } from 'react'
import styles from './Log.module.css'

interface LogProps {
  message: string
  status: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
}

const Log: React.FC<LogProps> = ({ message, status, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 1000) // Wait for animation to complete before closing
    }, 3000) // Show for 3 seconds

    return () => clearTimeout(timer)
  }, [onClose])

  return <div className={`${styles.log} ${styles[status]} ${visible ? styles.show : styles.hide}`}>{message}</div>
}

export default Log
