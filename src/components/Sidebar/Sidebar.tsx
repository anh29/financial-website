import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../constants/translations'
import styles from './Sidebar.module.css'
import { FaHome, FaCog, FaExchangeAlt, FaWallet, FaChartPie, FaFileAlt, FaFileInvoiceDollar } from 'react-icons/fa'

type NavigationKey = keyof typeof translations.navigation

interface MenuItem {
  path: string
  label: NavigationKey
  icon: React.ReactNode
}

interface SidebarProps {
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/signin')
  }

  const menuItems: MenuItem[] = [
    { path: '/', label: 'dashboard', icon: <FaHome /> },
    { path: '/transactions', label: 'transactions', icon: <FaExchangeAlt /> },
    { path: '/expenses', label: 'expenses', icon: <FaWallet /> },
    { path: '/bills', label: 'bills', icon: <FaFileInvoiceDollar /> },
    { path: '/budget', label: 'budget', icon: <FaChartPie /> },
    { path: '/goals', label: 'goals', icon: <FaFileAlt /> },
    { path: '/settings', label: 'settings', icon: <FaCog /> }
  ]

  return (
    <aside className={`${styles.sidebar} ${className || ''}`} data-tour='sidebar'>
      <div className={styles.brand}>
        <p>
          Finance<span>Hub</span>
        </p>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? styles.active : ''}>
              <button className={styles.menuItem} onClick={() => navigate(item.path)}>
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{t('navigation', item.label)}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.logoutContainer}>
        <button className={styles.logout} onClick={handleLogout}>
          {t('navigation', 'logout')}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
