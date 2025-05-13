import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import styles from './Customer.module.css'
import { FaRegClock, FaExclamationTriangle, FaRegSmile, FaRegCalendarAlt, FaStar } from 'react-icons/fa'

const Customer: React.FC = () => {
  const location = useLocation()
  const isFeaturePage = location.pathname !== '/customer'

  return (
    <div className={styles.customerPage}>
      {/* Header Bar */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to='/customer'>
            <span role='img' aria-label='wallet'>
              💳
            </span>{' '}
            FINEbank.IO
          </Link>
        </div>
        <nav className={styles.navLinks}>
          <Link to='/customer'>Tính năng</Link>
          <Link to='/customer/support'>Hỗ trợ</Link>
          <Link to='/customer/blog'>Blog</Link>
        </nav>
        <div className={styles.headerActions}>
          <button className={styles.headerBtnOutline}>Đăng nhập</button>
          <button className={styles.headerBtn}>Dùng thử miễn phí</button>
        </div>
      </header>

      {!isFeaturePage ? (
        <>
          {/* Hero Section */}
          <section className={styles.hero}>
            <h1>
              Hiểu rõ chi tiêu.
              <br />
              Quản lý tài chính thông minh mỗi ngày.
            </h1>
            <p className={styles.heroSub}>
              Công cụ AI giúp bạn theo dõi, lập kế hoạch và cải thiện cách tiêu tiền – dành riêng cho người Việt.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.heroBtnPrimary} onClick={() => (window.location.href = '/signin')}>
                Bắt đầu miễn phí
              </button>
            </div>
          </section>

          {/* Feature Cards Row 1 */}
          <section className={styles.featuresRow}>
            <Link to='/customer/features/daily-tracking' className={styles.featureCard}>
              <FaRegClock className={styles.featureIcon} />
              <h3>Theo dõi chi tiêu hằng ngày</h3>
              <p>Ghi lại chi tiêu và phân tích xu hướng</p>
            </Link>
            <Link to='/customer/features/value-analysis' className={styles.featureCard}>
              <FaExclamationTriangle className={styles.featureIcon} />
              <h3>Hiểu giá trị thật sự của món đồ</h3>
              <p>Tính toán chi phí theo thời gian sử dụng thực</p>
            </Link>
            <Link to='/customer/features/smart-decisions' className={styles.featureCard}>
              <FaRegSmile className={styles.featureIcon} />
              <h3>Cải thiện quyết định chi tiêu</h3>
              <p>Cân bằng thông minh và điểm số tiết kiệm</p>
            </Link>
          </section>

          {/* Feature Cards Row 2 */}
          <section className={styles.featuresRow}>
            <Link to='/customer/features/daily-cost' className={styles.featureCard}>
              <FaRegCalendarAlt className={styles.featureIcon} />
              <h3>Chi phí theo ngày sử dụng</h3>
              <p>Chia nhỏ chi phí để thấy giá trị thực</p>
            </Link>
            <Link to='/customer/features/ai-alerts' className={styles.featureCard}>
              <FaExclamationTriangle className={styles.featureIcon} />
              <h3>Cảnh báo AI</h3>
              <p>Nhắc nhở khi chi tiêu bất thường</p>
            </Link>
            <Link to='/customer/features/expense-score' className={styles.featureCard}>
              <FaStar className={styles.featureIcon} />
              <h3>Điểm hiệu quả chi tiêu</h3>
              <p>Đo lường thói quen hàng tháng để cải thiện</p>
            </Link>
            <Link to='/customer/features/emotion-tags' className={styles.featureCard}>
              <FaRegSmile className={styles.featureIcon} />
              <h3>Gắn thẻ cảm xúc</h3>
              <p>Hiểu rõ cảm xúc khi chi tiêu để điều chỉnh</p>
            </Link>
          </section>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default Customer
