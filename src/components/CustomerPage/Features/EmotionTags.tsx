import React from 'react'
import styles from './Features.module.css'
import { FaRegSmile, FaTags, FaChartPie } from 'react-icons/fa'

const EmotionTags: React.FC = () => {
  return (
    <div className={styles.featurePage}>
      <div className={styles.featureHero}>
        <h1>Gắn thẻ cảm xúc</h1>
        <p className={styles.subtitle}>Theo dõi cảm xúc khi chi tiêu để hiểu rõ bản thân</p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <FaRegSmile className={styles.featureIcon} />
            <h3>Ghi nhận cảm xúc</h3>
            <p>Gắn thẻ cảm xúc cho mỗi khoản chi tiêu</p>
          </div>

          <div className={styles.featureItem}>
            <FaTags className={styles.featureIcon} />
            <h3>Phân loại cảm xúc</h3>
            <p>Phân tích xu hướng cảm xúc khi chi tiêu</p>
          </div>

          <div className={styles.featureItem}>
            <FaChartPie className={styles.featureIcon} />
            <h3>Báo cáo chi tiết</h3>
            <p>Báo cáo phân tích mối liên hệ giữa cảm xúc và chi tiêu</p>
          </div>
        </div>

        <div className={styles.featureDemo}>
          <div className={styles.demoImage}>
            <div className={styles.demoPlaceholder}>Demo Screenshot</div>
          </div>
          <div className={styles.demoText}>
            <h2>Trải nghiệm thực tế</h2>
            <p>Xem cách FINEbank.IO giúp bạn hiểu mối liên hệ giữa cảm xúc và chi tiêu</p>
            <button className={styles.demoButton}>Xem Demo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmotionTags
