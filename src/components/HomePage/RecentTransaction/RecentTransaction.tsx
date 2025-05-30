import { useState, useEffect } from 'react'
import styles from './RecentTransaction.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getCategoryInfo } from '../../../utils/categoryUtils'
import { LoadingSpinner } from '../../common'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useTransactions } from '../../../hooks/features/useTransactions'

const RecentTransaction = () => {
  const [activeTab, setActiveTab] = useState('all')
  const { transactions, isLoading, error, fetchLatestTransactions } = useTransactions()

  useEffect(() => {
    fetchLatestTransactions()
  }, [fetchLatestTransactions])

  const filteredTransactions = transactions.filter(
    (transaction) => activeTab === 'all' || transaction.type === activeTab
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className={styles.recentTransaction}>
      <h2>Giao Dịch Gần Đây</h2>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tất cả
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'income' ? styles.active : ''}`}
          onClick={() => setActiveTab('income')}
        >
          Thu nhập
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'expense' ? styles.active : ''}`}
          onClick={() => setActiveTab('expense')}
        >
          Chi tiêu
        </div>
      </div>
      <ul>
        {filteredTransactions.map((transaction) => {
          const categoryInfo = getCategoryInfo(transaction.category)

          return (
            <li key={transaction.id}>
              <div className={styles.icon}>
                {categoryInfo?.icon && <FontAwesomeIcon icon={categoryInfo.icon as IconDefinition} />}
              </div>
              <div className={styles.information}>
                <p>{transaction.description}</p>
                <p>{transaction.category}</p>
              </div>
              <div className={styles.details}>
                <p>{transaction.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                <p>{new Date(transaction.date).toLocaleDateString('vi-VN')}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default RecentTransaction
