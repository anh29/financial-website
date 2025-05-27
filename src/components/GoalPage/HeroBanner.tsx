import { FiTarget, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import styles from './HeroBanner.module.css'

interface HeroBannerProps {
  totalGoals: number
  totalTarget: number
  overallProgress: number
}

export const HeroBanner = ({ totalGoals, totalTarget, overallProgress }: HeroBannerProps) => {
  return (
    <div className={styles.heroBannerContainer}>
      <h1 className={styles.gradientText}>Financial Goals</h1>
      <p className={styles.heroQuote}>
        "The journey of a thousand miles begins with a single step" <span>- Lao Tzu</span>
      </p>
      <div className={styles.heroStatsRow}>
        <div className={styles.heroStat}>
          <FiTarget /> {totalGoals} Goals
        </div>
        <div className={styles.heroStat}>
          <FiDollarSign /> ${totalTarget.toLocaleString()}
        </div>
        <div className={styles.heroStat}>
          <FiTrendingUp /> {overallProgress.toFixed(1)}% Progress
        </div>
      </div>
    </div>
  )
}
