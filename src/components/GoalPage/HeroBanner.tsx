import { FiTarget, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import styles from './HeroBanner.module.css'
import { useLanguage } from '../../context/LanguageContext'

interface HeroBannerProps {
  totalGoals: number
  totalTarget: number
  overallProgress: number
}

export const HeroBanner = ({ totalGoals, totalTarget, overallProgress }: HeroBannerProps) => {
  const { t } = useLanguage()
  return (
    <div className={styles.heroBannerContainer}>
      <h1 className={styles.gradientText}>{t('goal', 'title')}</h1>
      <p className={styles.heroQuote}>
        {t('goal', 'quote')} <span>- Lão Tử</span>
      </p>
      <div className={styles.heroStatsRow}>
        <div className={styles.heroStat}>
          <FiTarget /> {totalGoals} {t('goal', 'goals')}
        </div>
        <div className={styles.heroStat}>
          <FiDollarSign /> {totalTarget.toLocaleString('vi-VN')}{t('common', 'currency')}
        </div>
        <div className={styles.heroStat}>
          <FiTrendingUp /> {overallProgress.toFixed(1)}% {t('goal', 'progress')}
        </div>
      </div>
    </div>
  )
}
