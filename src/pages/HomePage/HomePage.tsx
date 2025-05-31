import styles from './HomePage.module.css'
import RecentTransaction from '../../components/HomePage/RecentTransaction/RecentTransaction'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faWallet, faPiggyBank, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'

const HomePage = () => {
  const navigationCards = [
    { title: 'Giao dịch', icon: faChartLine, path: '/transactions', color: '#4CAF50' },
    { title: 'Ngân sách', icon: faWallet, path: '/budget', color: '#2196F3' },
    { title: 'Mục tiêu', icon: faPiggyBank, path: '/goals', color: '#FF9800' },
    { title: 'Hóa đơn sắp tới', icon: faFileInvoiceDollar, path: '/upcoming', color: '#F44336' }
  ]

  return (
    <div className={`${styles.homePage} quick-actions`}>
      <section className={`${styles.welcomeSection} home-features`}>
        <h1>Chào mừng đến với Bảng Điều Khiển Tài Chính</h1>
        <p>Quản lý tài chính của bạn với các công cụ và thông tin chi tiết toàn diện</p>
      </section>

      <section className={styles.navigationGrid}>
        {navigationCards.map((card) => (
          <Link to={card.path} key={card.path} className={styles.navCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: card.color }}>
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <h3>{card.title}</h3>
          </Link>
        ))}
      </section>

      <section className={`${styles.recentTransactionsSection} recent-transactions`}>
        <RecentTransaction />
      </section>
    </div>
  )
}

export default HomePage
