import React from 'react'
import { LoadingSpinner, Card } from '../../common'
import styles from './CustomerLayout.module.css'

interface CustomerLayoutProps {
  children: React.ReactNode
  isLoading?: boolean
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, isLoading = false }) => {
  return (
    <div className={styles.customerLayout}>
      <main className={styles.main}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : (
          <Card className={styles.content}>{children}</Card>
        )}
      </main>
    </div>
  )
}
