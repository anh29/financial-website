import styles from './TransactionPage.module.css'
import TransactionTable from '../../components/TransactionPage/TransactionTable'
import ImportButton from '../../components/TransactionPage/ImportButton'
import OCRUpload from '../../components/TransactionPage/OCRUpload'
import SearchFilter from '../../components/TransactionPage/SearchFilter'
import { LoadingSpinner } from '../../components/common'
import { useTransactions } from '../../hooks/features/useTransactions'
import { useEffect, useState } from 'react'
import { Transaction } from '../../types/transaction'

const TransactionPage = () => {
  const { transactions, isLoading, error, handleImport, fetchTransactions } = useTransactions()
  const [updatedTransactions, setUpdatedTransactions] = useState<Transaction[]>(transactions)

  useEffect(() => {
    fetchTransactions() // Fetch transactions when the component mounts
  }, [fetchTransactions])

  const handleTransactionUpdate = (updatedTransactions: Transaction[]) => {
    setUpdatedTransactions(updatedTransactions)
  }

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

      {isLoading && <LoadingSpinner />}
      {!isLoading && transactions.length === 0 && <p>No transactions found.</p>}
      {!isLoading && transactions.length > 0 && (
        <TransactionTable transactions={updatedTransactions} onTransactionUpdate={handleTransactionUpdate} />
      )}
    </div>
  )
}

export default TransactionPage
