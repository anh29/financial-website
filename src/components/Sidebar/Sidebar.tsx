import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styles from './Sidebar.module.css'
import { 
  FaHome, 
  FaCog, 
  FaExchangeAlt, 
  FaFileInvoiceDollar, 
  FaWallet, 
  FaChartPie, 
  FaChartBar, 
  FaBullseye 
} from 'react-icons/fa'

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
    { path: '/budget-planning', label: 'Planning', icon: <FaChartPie /> },
    { path: '/reports', label: 'Reports', icon: <FaChartBar /> },
    { path: '/goal', label: 'Goal', icon: <FaBullseye /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> }
  ]

  return (
    <div className={`${styles.sidebar} ${className}`}>
      <h2>FINEbank.IO</h2>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path}>
                {item.icon} <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default Sidebar
