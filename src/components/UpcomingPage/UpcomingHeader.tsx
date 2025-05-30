import React from 'react'
import styles from './UpcomingHeader.module.css'
import { FaMagic } from 'react-icons/fa'

interface UpcomingHeaderProps {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
}

const UpcomingHeader: React.FC<UpcomingHeaderProps> = ({
  title = 'Quản lý hóa đơn',
  subtitle = 'Theo dõi và quản lý tất cả các khoản thanh toán định kỳ một cách thông minh và hiệu quả.',
  icon = <FaMagic />
}) => (
  <div className={styles.upcomingHeader}>
    <div className={styles.headerTitle}>
      <div className={styles.headerIcon}>{icon}</div>
      <h1 className={styles.gradientText}>{title}</h1>
    </div>
    <div className={styles.headerDesc}>{subtitle}</div>
  </div>
)

export default UpcomingHeader
