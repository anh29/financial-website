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
      <h1 className={styles.gradientText}>Mục Tiêu Tài Chính</h1>
      <p className={styles.heroQuote}>
        "Hành trình ngàn dặm bắt đầu từ một bước chân" <span>- Lão Tử</span>
      </p>
      <div className={styles.heroStatsRow}>
        <div className={styles.heroStat}>
          <FiTarget /> {totalGoals} Mục tiêu
        </div>
        <div className={styles.heroStat}>
          <FiDollarSign /> {totalTarget.toLocaleString('vi-VN')}đ
        </div>
        <div className={styles.heroStat}>
          <FiTrendingUp /> {overallProgress.toFixed(1)}% Tiến độ
        </div>
      </div>
    </div>
  )
}
