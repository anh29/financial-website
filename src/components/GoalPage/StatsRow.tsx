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
          <div className={styles.statCardTitle}>Total Goals</div>
          <FiTarget />
        </div>
        <div className={styles.statCardValue}>{totalGoals}</div>
        <div className={styles.statCardDesc}>Active financial goals</div>
        <div className={styles.statCardProgressBarBg}>
          <div className={styles.statCardProgressBar} style={{ width: '100%' }} />
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statCardHeader}>
          <div className={styles.statCardTitle}>Total Target</div>
          <FiDollarSign />
        </div>
        <div className={styles.statCardValue}>${totalTarget.toLocaleString()}</div>
        <div className={styles.statCardDesc}>Target amount to achieve</div>
        <div className={styles.statCardProgressBarBg}>
          <div className={styles.statCardProgressBar} style={{ width: '100%' }} />
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statCardHeader}>
          <div className={styles.statCardTitle}>Overall Progress</div>
          <FiTrendingUp />
        </div>
        <div className={styles.statCardValue}>{overallProgress.toFixed(1)}%</div>
        <div className={styles.statCardDesc}>Progress towards goals</div>
        <div className={styles.statCardProgressBarBg}>
          <div className={styles.statCardProgressBar} style={{ width: `${overallProgress}%` }} />
        </div>
      </div>
    </div>
  )
}
