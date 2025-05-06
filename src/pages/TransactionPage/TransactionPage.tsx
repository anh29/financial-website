import React, { useState, useEffect } from 'react'
import styles from './TransactionPage.module.css'
import TransactionTable from '../../components/TransactionPage/TransactionTable'
import ImportButton from '../../components/TransactionPage/ImportButton'
import OCRUpload from '../../components/TransactionPage/OCRUpload'
import SearchFilter from '../../components/TransactionPage/SearchFilter'
import { SERVER_URL } from '../../utils/constants'
import { expenseCategories, incomeCategories } from '../../utils/categoryUtils'
import Log from '../../components/Log/Log'

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [logMessage, setLogMessage] = useState(null)
  const [logStatus, setLogStatus] = useState<{
    status: 'success' | 'error' | 'warning' | 'info'
  }>({ status: 'info' })

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const localStorageData = localStorage.getItem('user')
        const userId = localStorageData ? JSON.parse(localStorageData).id : null
        const response = await fetch(`${SERVER_URL}/crud/transactions/user/${userId}`)
        if (!response.ok) throw new Error('Failed to fetch transactions')

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

  const handleImport = async (newTransactions) => {
    try {
      const localStorageData = localStorage.getItem('user')
      const userId = localStorageData ? JSON.parse(localStorageData).id : null

      if (!userId) throw new Error('User not found in localStorage')

      // Combine expense and income categories
      const allCategories = [...expenseCategories, ...incomeCategories]

      const transactionsWithUser = newTransactions.map((tx) => ({
        ...tx,
        category: allCategories.find((cat) => cat.key === tx.category)?.label,
        userId
      }))

      const response = await fetch(`${SERVER_URL}/crud/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionsWithUser)
      })

      if (!response.ok) throw new Error('Failed to save transactions to the database.')

      const result = await response.json()
      setTransactions((prev) => [...result.data, ...prev])

      setLogMessage('✅ Transactions imported successfully.')
      setLogStatus('success')
    } catch (error) {
      setLogMessage('❌ Failed to import transactions.')
      setLogStatus('error')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className={styles.transactionPage}>
      <header className={styles.header}>
        <h1>📊 Transaction Dashboard</h1>
        <p>Import, view, and manage your financial transactions with ease.</p>
      </header>

      <div className={styles.controls}>
        <SearchFilter />
        <div className={styles.buttonGroup}>
          <ImportButton onImport={handleImport} />
          <OCRUpload onUpload={handleImport} />
        </div>
      </div>

      <TransactionTable newTransactions={transactions} />

      {logMessage && <Log message={logMessage} status={logStatus} onClose={() => setLogMessage(null)} />}
    </div>
  )
}

export default TransactionPage
