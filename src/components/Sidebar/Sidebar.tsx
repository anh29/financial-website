import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'
import { FaHome, FaCog } from 'react-icons/fa'

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const menuItems = [
    { path: '/', label: 'Homepage', icon: <FaHome /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> },
    { path: '/transactions', label: 'Transactions', icon: <FaCog /> },
    { path: '/upcoming', label: 'Bills', icon: <FaCog /> },
    { path: '/expenses', label: 'Expenses', icon: <FaCog /> },
    { path: '/goal', label: 'Goal', icon: <FaCog /> }
  ]
  return (
    <div className={`${styles.sidebar} ${className}`}>
      <h2>FINEbank.IO</h2>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? styles.active : ''}>
              <Link to={item.path}>
                {item.icon} <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button className={styles.logout}>Logout</button>
    </div>
  )
}

export default Sidebar
