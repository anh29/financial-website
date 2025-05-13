import React from 'react'
import styles from './TransactionPage.module.css'
import TransactionTable from '../../components/TransactionPage/TransactionTable'
import ImportButton from '../../components/TransactionPage/ImportButton'
import OCRUpload from '../../components/TransactionPage/OCRUpload'
import SearchFilter from '../../components/TransactionPage/SearchFilter'
import Log from '../../components/Log/Log'
import { useTransactions } from '../../hooks/useTransactions'

const TransactionPage = () => {
  const { transactions, isLoading, error, handleImport } = useTransactions()
  const [logMessage, setLogMessage] = React.useState<string | null>(null)
  const [logStatus, setLogStatus] = React.useState<'success' | 'error' | 'warning' | 'info'>('info')

  const handleTransactionUpdate = () => {
    setLogMessage('✅ Transaction updated successfully.')
    setLogStatus('success')
  }

  if (isLoading) return <div>Loading...</div>
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

      <TransactionTable transactions={transactions} onTransactionUpdate={handleTransactionUpdate} />

      {logMessage && <Log message={logMessage} status={logStatus} onClose={() => setLogMessage(null)} />}
    </div>
  )
}

export default TransactionPage
