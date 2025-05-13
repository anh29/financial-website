import React from 'react'
import styles from './Features.module.css'
import { FaRegCalendarAlt, FaDivide, FaChartBar } from 'react-icons/fa'

const DailyCost: React.FC = () => {
  return (
    <div className={styles.featurePage}>
      <div className={styles.featureHero}>
        <h1>Chi phí theo ngày sử dụng</h1>
        <p className={styles.subtitle}>Phân tích chi phí theo thời gian sử dụng thực tế</p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <FaDivide className={styles.featureIcon} />
            <h3>Chia nhỏ chi phí</h3>
            <p>Tính toán chi phí theo ngày sử dụng thực tế</p>
          </div>

          <div className={styles.featureItem}>
            <FaChartBar className={styles.featureIcon} />
            <h3>Biểu đồ chi tiết</h3>
            <p>Hiển thị chi phí theo thời gian sử dụng</p>
          </div>

          <div className={styles.featureItem}>
            <FaRegCalendarAlt className={styles.featureIcon} />
            <h3>Lịch sử sử dụng</h3>
            <p>Theo dõi thời gian sử dụng thực tế</p>
          </div>
        </div>

        <div className={styles.featureDemo}>
          <div className={styles.demoImage}>
            <div className={styles.demoPlaceholder}>Demo Screenshot</div>
          </div>
          <div className={styles.demoText}>
            <h2>Trải nghiệm thực tế</h2>
            <p>Xem cách FINEbank.IO giúp bạn hiểu chi phí thực tế theo ngày sử dụng</p>
            <button className={styles.demoButton}>Xem Demo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyCost
