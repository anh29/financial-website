import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'

const Sidebar = ({ className }) => {
  return (
    <div className={`${styles.sidebar} ${className}`}>
      <h2>FINEbank.IO</h2>
      <nav>
        <ul>
          <li>
            <Link to='/'>Overview</Link>
          </li>
          <li>
            <Link to='/balances'>Balances</Link>
          </li>
          <li>
            <Link to='/transactions'>Transactions</Link>
          </li>
          <li>
            <Link to='/bills'>Bills</Link>
          </li>
          <li>
            <Link to='/expenses'>Expenses</Link>
          </li>
          <li>
            <Link to='/goals'>Goals</Link>
          </li>
          <li>
            <Link to='/settings'>Settings</Link>
          </li>
        </ul>
      </nav>
      <button className={styles.logout}>Logout</button>
      <div className={styles.userProfile}>
        <img src='/path/to/profile-pic.jpg' alt='User Profile' />
        <span>Tanzir Rahman</span>
        <Link to='/profile'>View profile</Link>
      </div>
    </div>
  )
}

export default Sidebar
