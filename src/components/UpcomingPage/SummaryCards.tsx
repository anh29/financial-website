import React from 'react'
import styles from './SummaryCards.module.css'
import { FaExclamationTriangle, FaClock, FaCheckCircle, FaHome } from 'react-icons/fa'

interface SummaryCardsProps {
  overdueCount: number
  dueSoonCount: number
  paidCount: number
  totalDue: number | string
  formatCurrency?: (amount: number) => string
}

interface SummaryCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  sublabel: string
  color: string
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, label, value, sublabel, color }) => (
  <div className={`${styles.summaryCard} ${color}`}>
    <div className={styles.cardContent}>
      <div className={styles.cardIcon}>{icon}</div>
      <div className={styles.cardInfo}>
        <div className={styles.cardSublabel}>{sublabel}</div>
        <div className={styles.cardValue}>{value}</div>
      </div>
    </div>
    <div className={styles.cardLabel}>{label}</div>
  </div>
)

const SummaryCards: React.FC<SummaryCardsProps> = ({
  overdueCount,
  dueSoonCount,
  paidCount,
  totalDue,
  formatCurrency
}) => (
  <div className={styles.upcomingSummaryCards}>
    <SummaryCard
      icon={<FaExclamationTriangle />}
      label='Cần thanh toán ngay'
      value={overdueCount}
      sublabel='Quá hạn'
      color={styles.red}
    />
    <SummaryCard
      icon={<FaClock />}
      label='Trong 7 ngày tới'
      value={dueSoonCount}
      sublabel='Sắp đến hạn'
      color={styles.orange}
    />
    <SummaryCard
      icon={<FaCheckCircle />}
      label='Hoàn thành'
      value={paidCount}
      sublabel='Đã thanh toán'
      color={styles.green}
    />
    <SummaryCard
      icon={<FaHome />}
      label='Chưa thanh toán'
      value={typeof totalDue === 'number' && formatCurrency ? formatCurrency(totalDue) : totalDue}
      sublabel='Tổng cần trả'
      color={styles.blue}
    />
  </div>
)

export default SummaryCards
