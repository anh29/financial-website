import React from 'react'
import CustomerHeader from '../CustomerHeader/CustomerHeader'
import styles from './CustomerLayout.module.css'

interface CustomerLayoutProps {
  children: React.ReactNode
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <CustomerHeader />
      <main className={styles.main}>{children}</main>
    </div>
  )
}

export default CustomerLayout
