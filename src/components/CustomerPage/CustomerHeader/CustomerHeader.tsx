import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './CustomerHeader.module.css'
import { FaRegSmile } from 'react-icons/fa'

const CustomerHeader: React.FC = () => {
  const location = useLocation()

  return (
    <header className={`${styles.customerHeader} ${styles.header}`}>
      <div className={styles.logo}>
        <Link to='/customer'>
          <FaRegSmile className={styles.logoIcon} />
          <span>FINEbank.IO</span>
        </Link>
      </div>

      <nav className={styles.navLinks}>
        <Link to='/customer' className={location.pathname === '/customer' ? styles.active : ''}>
          Tính năng
        </Link>
        <Link to='/customer/support' className={location.pathname.startsWith('/customer/support') ? styles.active : ''}>
          Hỗ trợ
        </Link>
        <Link to='/customer/blog' className={location.pathname.startsWith('/customer/blog') ? styles.active : ''}>
          Blog
        </Link>
      </nav>

      <div className={styles.headerActions}>
        <Link to='/signin' className={styles.signInButton}>
          Đăng nhập
        </Link>
        <Link to='/signup' className={styles.signUpButton}>
          Dùng thử miễn phí
        </Link>
      </div>
    </header>
  )
}

export default CustomerHeader
