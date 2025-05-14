import React from 'react'
import styles from './Features.module.css'
import { FaExclamationTriangle, FaBell, FaRobot } from 'react-icons/fa'

const AIAlerts: React.FC = () => {
  return (
    <div className={styles.featurePage}>
      <div className={styles.featureHero}>
        <h1>Cảnh báo AI</h1>
        <p className={styles.subtitle}>Nhận thông báo thông minh về chi tiêu bất thường</p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <FaRobot className={styles.featureIcon} />
            <h3>Phát hiện bất thường</h3>
            <p>AI phát hiện chi tiêu bất thường dựa trên thói quen</p>
          </div>

          <div className={styles.featureItem}>
            <FaBell className={styles.featureIcon} />
            <h3>Thông báo tức thì</h3>
            <p>Nhận thông báo ngay khi có chi tiêu bất thường</p>
          </div>

          <div className={styles.featureItem}>
            <FaExclamationTriangle className={styles.featureIcon} />
            <h3>Phân tích rủi ro</h3>
            <p>Đánh giá mức độ rủi ro của chi tiêu bất thường</p>
          </div>
        </div>

        <div className={styles.featureDemo}>
          <div className={styles.demoImage}>
            <div className={styles.demoPlaceholder}>Demo Screenshot</div>
          </div>
          <div className={styles.demoText}>
            <h2>Trải nghiệm thực tế</h2>
            <p>Xem cách FINEbank.IO giúp bạn phát hiện và cảnh báo chi tiêu bất thường</p>
            <button className={styles.demoButton}>Xem Demo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAlerts
