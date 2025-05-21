import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import styles from './CustomerHeader.module.css'

const CustomerHeader: React.FC = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className={`${styles.customerHeader} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to='/customer' className={styles.logo}>
          <h1>
            Finance<span>Hub</span>
          </h1>
        </Link>

        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu} aria-label='Toggle menu'>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link
            to='/customer/features'
            className={location.pathname.startsWith('/customer/features') ? styles.active : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            to='/customer/support'
            className={location.pathname === '/customer/support' ? styles.active : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Support
          </Link>
          <Link
            to='/customer/blog'
            className={location.pathname === '/customer/blog' ? styles.active : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link to='/signin' className={styles.signIn}>
            Sign In
          </Link>
          <Link to='/signup' className={styles.signUp}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}

export default CustomerHeader
