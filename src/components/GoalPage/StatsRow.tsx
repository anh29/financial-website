import { FiTarget, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import styles from './StatsRow.module.css'

interface StatsRowProps {
  totalGoals: number
  totalTarget: number
  overallProgress: number
}

export const StatsRow = ({ totalGoals, totalTarget, overallProgress }: StatsRowProps) => {
  return (
    <div className={styles.statsRowContainer}>
      <div className={styles.statCard}>
        <div className={styles.statCardHeader}>
          <div className={styles.statCardTitle}>Tổng số mục tiêu</div>
          <FiTarget />
        </div>
        <div className={styles.statCardValue}>{totalGoals}</div>
        <div className={styles.statCardDesc}>Mục tiêu tài chính đang thực hiện</div>
        <div className={styles.statCardProgressBarBg}>
          <div className={styles.statCardProgressBar} style={{ width: '100%' }} />
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statCardHeader}>
          <div className={styles.statCardTitle}>Tổng mục tiêu</div>
          <FiDollarSign />
        </div>
        <div className={styles.statCardValue}>{totalTarget.toLocaleString('vi-VN')}đ</div>
        <div className={styles.statCardDesc}>Số tiền cần đạt được</div>
        <div className={styles.statCardProgressBarBg}>
          <div className={styles.statCardProgressBar} style={{ width: '100%' }} />
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statCardHeader}>
          <div className={styles.statCardTitle}>Tiến độ tổng thể</div>
          <FiTrendingUp />
        </div>
        <div className={styles.statCardValue}>{overallProgress.toFixed(1)}%</div>
        <div className={styles.statCardDesc}>Tiến độ hướng tới mục tiêu</div>
        <div className={styles.statCardProgressBarBg}>
          <div className={styles.statCardProgressBar} style={{ width: `${overallProgress}%` }} />
        </div>
      </div>
    </div>
  )
}
