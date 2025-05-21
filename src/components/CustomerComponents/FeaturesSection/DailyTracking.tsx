import React from 'react'
import styles from './Features.module.css'
import { FaRegClock, FaChartLine, FaMobileAlt } from 'react-icons/fa'

const DailyTracking: React.FC = () => {
  return (
    <div className={styles.feature}>
      <div className={styles.featureHero}>
        <h1>Theo dõi chi tiêu hằng ngày</h1>
        <p className={styles.subtitle}>Quản lý tài chính thông minh với công cụ theo dõi chi tiêu tự động</p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <FaRegClock className={styles.featureIcon} />
            <h3>Ghi nhận tự động</h3>
            <p>Tự động ghi nhận chi tiêu từ các giao dịch ngân hàng và ví điện tử</p>
          </div>

          <div className={styles.featureItem}>
            <FaChartLine className={styles.featureIcon} />
            <h3>Phân tích xu hướng</h3>
            <p>Biểu đồ trực quan giúp bạn theo dõi chi tiêu theo thời gian thực</p>
          </div>

          <div className={styles.featureItem}>
            <FaMobileAlt className={styles.featureIcon} />
            <h3>Ứng dụng di động</h3>
            <p>Quản lý chi tiêu mọi lúc mọi nơi với ứng dụng di động tiện lợi</p>
          </div>
        </div>

        <div className={styles.featureDemo}>
          <div className={styles.demoImage}>
            {/* Placeholder for demo screenshot */}
            <div className={styles.demoPlaceholder}>Demo Screenshot</div>
          </div>
          <div className={styles.demoText}>
            <h2>Trải nghiệm thực tế</h2>
            <p>
              Xem cách Finance<span>Hub</span> giúp bạn theo dõi chi tiêu một cách hiệu quả
            </p>
            <button className={styles.demoButton}>Xem Demo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyTracking
