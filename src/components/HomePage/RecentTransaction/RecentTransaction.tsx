import React, { useState, useEffect } from 'react'
import styles from './RecentTransaction.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getCategoryInfo } from '../../../utils/categoryUtils'
import { SERVER_URL } from '../../../utils/constants'

const RecentTransaction = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const localStorageData = localStorage.getItem('user')
        if (!localStorageData) {
          setLoading(false)
          setError('You need to log in to see your transactions')
          return
        }
        const userData = JSON.parse(localStorageData || '')

        const userId = userData.id
        const response = await fetch(`${SERVER_URL}/marketplace/getLatestTransaction/user/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch transactions')
        }
        const data = await response.json()
        setTransactions(data.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter(
    (transaction) => activeTab === 'all' || transaction.type === activeTab
  )

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className={styles.recentTransaction}>
      <h2>Recent Transaction</h2>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'revenue' ? styles.active : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'expense' ? styles.active : ''}`}
          onClick={() => setActiveTab('expense')}
        >
          Expenses
        </div>
      </div>
      <ul>
        {filteredTransactions.map((transaction) => {
          const categoryInfo = getCategoryInfo(transaction.category)

          return (
            <li key={transaction.id}>
              <div className={styles.icon}>
                <FontAwesomeIcon icon={categoryInfo?.icon} />
              </div>
              <div className={styles.information}>
                <p>{transaction.description}</p>
                <p>{transaction.category}</p>
              </div>
              <div className={styles.details}>
                <p>{transaction.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                <p>{new Date(transaction._parsedDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default RecentTransaction
