import React from 'react'
import styles from './Header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

const Header = ({ className }: { className?: string }) => {
  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.headerLeft}>
        <h1>Hello Tanzir</h1>
        <span>May 19, 2023</span>
      </div>
      <div className={styles.headerRight}>
        <input type="text" placeholder="Search here" />
        <button className={styles.notification}>
          <FontAwesomeIcon icon={faBell} />
        </button>
        <div className={styles.userProfile}>
          <img src="/path/to/profile-pic.jpg" alt="User Profile" />
        </div>
      </div>
    </header>
  )
}

export default Header
