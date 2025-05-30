import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styles from './Sidebar.module.css'
import { FaHome, FaCog, FaExchangeAlt, FaFileInvoiceDollar, FaWallet, FaChartPie, FaBullseye } from 'react-icons/fa'

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/signin')
  }

  const menuItems = [
    { path: '/', label: 'Homepage', icon: <FaHome /> },
    { path: '/transactions', label: 'Transactions', icon: <FaExchangeAlt /> },
    { path: '/upcoming', label: 'Bills', icon: <FaFileInvoiceDollar /> },
    { path: '/expenses', label: 'Expenses', icon: <FaWallet /> },
    { path: '/budget', label: 'Budget', icon: <FaChartPie /> },
    { path: '/goal', label: 'Goal', icon: <FaBullseye /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> }
  ]

  return (
    <aside className={`${styles.sidebar} ${className}`}>
      <div className={styles.brand}>
        <p>
          Finance<span>Hub</span>
        </p>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? styles.active : ''}>
              <Link to={item.path} className={styles.menuLink}>
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>
    </aside>
  )
}

export default Sidebar
