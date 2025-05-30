import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './CustomerPage.module.css'
import CustomerHeader from '../../components/CustomerComponents/CustomerHeader/CustomerHeader'
import { FaPiggyBank, FaChartLine, FaBullseye, FaArrowRight } from 'react-icons/fa'

const illustrationUrl =
  'https://www.wealthmorning.com/wp-content/uploads/2020/02/Money-Cash-Growth-Savings-Wealth-scaled.jpg'

const features = [
  {
    icon: <FaPiggyBank size={36} color='#1abc9c' />,
    title: 'Quản Lý Ngân Sách Thông Minh',
    description:
      'Đề xuất ngân sách được hỗ trợ bởi AI và theo dõi chi tiêu theo thời gian thực để giúp bạn đưa ra quyết định tài chính thông minh hơn.',
    gradient: 'linear-gradient(135deg,var(--primary-color) 0%, #16a085 100%)'
  },
  {
    icon: <FaChartLine size={36} color='#3498db' />,
    title: 'Phân Tích Tài Chính',
    description: 'Nhận phân tích chi tiết và thông tin chi tiết về mẫu chi tiêu và sức khỏe tài chính của bạn.',
    gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
  },
  {
    icon: <FaBullseye size={36} color='#f39c12' />,
    title: 'Theo Dõi Mục Tiêu',
    description:
      'Thiết lập và theo dõi mục tiêu tài chính của bạn với các đề xuất được cá nhân hóa và cập nhật tiến độ.',
    gradient: 'linear-gradient(135deg, #f39c12 0%, #d35400 100%)'
  }
]

const CustomerPage: React.FC = () => {
  const location = useLocation()
  const isFeaturePage = location.pathname !== '/customer'
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`${styles.customerPage} ${isVisible ? styles.visible : ''}`}>
      <CustomerHeader />

      {!isFeaturePage ? (
        <>
          {/* Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                Kiểm Soát <span className={styles.highlight}>Tương Lai Tài Chính</span> Của Bạn
              </h1>
              <p className={styles.heroSubtitle}>
                Tham gia cùng hàng nghìn người dùng đưa ra quyết định tài chính thông minh hơn với nền tảng tài chính cá
                nhân được hỗ trợ bởi AI của chúng tôi.
              </p>
              <div className={styles.ctaGroup}>
                <button className={styles.ctaButton} onClick={() => navigate('/signup')}>
                  Bắt Đầu Miễn Phí
                  <FaArrowRight className={styles.ctaIcon} />
                </button>
                <button className={styles.secondaryButton} onClick={() => navigate('/signup')}>
                  Tìm Hiểu Thêm
                </button>
              </div>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.illustrationWrapper}>
                <img src={illustrationUrl} alt='Hình Minh Họa Tài Chính' className={styles.illustration} />
                <div className={styles.floatingCard}>
                  <FaChartLine className={styles.floatingIcon} />
                  <span>Theo dõi tiến độ của bạn</span>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className={styles.featuresSection}>
            {features.map((feature, idx) => (
              <div className={styles.featureCard} key={idx} style={{ background: feature.gradient }}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </section>

          {/* Animated CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <h2>Sẵn Sàng Thay Đổi Cuộc Sống Tài Chính Của Bạn?</h2>
              <p>
                Tham gia cộng đồng những người lập kế hoạch tài chính thông minh và bắt đầu hành trình hướng tới tự do
                tài chính ngay hôm nay.
              </p>
              <button className={styles.ctaButtonLarge} onClick={() => navigate('/signup')}>
                Bắt Đầu Miễn Phí
                <FaArrowRight className={styles.ctaIcon} />
              </button>
            </div>
          </section>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default CustomerPage
