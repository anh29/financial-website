import React from 'react'
import styles from './Features.module.css'
import { FaRegSmile, FaBrain, FaBalanceScale } from 'react-icons/fa'

const SmartDecisions: React.FC = () => {
  return (
    <div className={styles.featurePage}>
      <div className={styles.featureHero}>
        <h1>Cải thiện quyết định chi tiêu</h1>
        <p className={styles.subtitle}>Đưa ra quyết định chi tiêu thông minh với AI</p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <FaBrain className={styles.featureIcon} />
            <h3>Phân tích AI</h3>
            <p>AI phân tích thói quen chi tiêu và đưa ra gợi ý</p>
          </div>

          <div className={styles.featureItem}>
            <FaBalanceScale className={styles.featureIcon} />
            <h3>Cân bằng chi tiêu</h3>
            <p>Giúp cân bằng giữa chi tiêu và tiết kiệm</p>
          </div>

          <div className={styles.featureItem}>
            <FaRegSmile className={styles.featureIcon} />
            <h3>Mục tiêu cá nhân</h3>
            <p>Đề xuất chi tiêu phù hợp với mục tiêu tài chính</p>
          </div>
        </div>

        <div className={styles.featureDemo}>
          <div className={styles.demoImage}>
            <div className={styles.demoPlaceholder}>Demo Screenshot</div>
          </div>
          <div className={styles.demoText}>
            <h2>Trải nghiệm thực tế</h2>
            <p>Xem cách FINEbank.IO giúp bạn đưa ra quyết định chi tiêu thông minh</p>
            <button className={styles.demoButton}>Xem Demo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartDecisions
