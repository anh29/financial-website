import React from 'react'
import styles from './Features.module.css'
import { FaExclamationTriangle, FaCalculator, FaChartPie } from 'react-icons/fa'

const ValueAnalysis: React.FC = () => {
  return (
    <div className={styles.featurePage}>
      <div className={styles.featureHero}>
        <h1>Hiểu giá trị thật sự của món đồ</h1>
        <p className={styles.subtitle}>Phân tích chi phí thực tế dựa trên thời gian sử dụng</p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <FaCalculator className={styles.featureIcon} />
            <h3>Tính toán chi phí</h3>
            <p>Phân tích chi phí theo ngày sử dụng để hiểu giá trị thực</p>
          </div>

          <div className={styles.featureItem}>
            <FaChartPie className={styles.featureIcon} />
            <h3>So sánh hiệu quả</h3>
            <p>So sánh các lựa chọn mua sắm dựa trên chi phí sử dụng</p>
          </div>

          <div className={styles.featureItem}>
            <FaExclamationTriangle className={styles.featureIcon} />
            <h3>Đánh giá đầu tư</h3>
            <p>Đánh giá hiệu quả đầu tư dựa trên thời gian sử dụng</p>
          </div>
        </div>

        <div className={styles.featureDemo}>
          <div className={styles.demoImage}>
            <div className={styles.demoPlaceholder}>Demo Screenshot</div>
          </div>
          <div className={styles.demoText}>
            <h2>Trải nghiệm thực tế</h2>
            <p>Xem cách FINEbank.IO giúp bạn đánh giá giá trị thực của các khoản chi tiêu</p>
            <button className={styles.demoButton}>Xem Demo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValueAnalysis
