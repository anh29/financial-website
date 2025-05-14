import React from 'react'
import styles from './Features.module.css'
import { FaStar, FaChartLine, FaTrophy } from 'react-icons/fa'

const ExpenseScore: React.FC = () => {
  return (
    <div className={styles.featurePage}>
      <div className={styles.featureHero}>
        <h1>Điểm hiệu quả chi tiêu</h1>
        <p className={styles.subtitle}>Đo lường và cải thiện thói quen chi tiêu của bạn</p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <FaStar className={styles.featureIcon} />
            <h3>Đánh giá tổng quan</h3>
            <p>Điểm số tổng thể về hiệu quả chi tiêu</p>
          </div>

          <div className={styles.featureItem}>
            <FaChartLine className={styles.featureIcon} />
            <h3>Theo dõi tiến độ</h3>
            <p>Biểu đồ tiến độ cải thiện theo thời gian</p>
          </div>

          <div className={styles.featureItem}>
            <FaTrophy className={styles.featureIcon} />
            <h3>Thành tích</h3>
            <p>Nhận huy hiệu và phần thưởng khi cải thiện</p>
          </div>
        </div>

        <div className={styles.featureDemo}>
          <div className={styles.demoImage}>
            <div className={styles.demoPlaceholder}>Demo Screenshot</div>
          </div>
          <div className={styles.demoText}>
            <h2>Trải nghiệm thực tế</h2>
            <p>Xem cách FINEbank.IO giúp bạn đo lường và cải thiện hiệu quả chi tiêu</p>
            <button className={styles.demoButton}>Xem Demo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseScore
