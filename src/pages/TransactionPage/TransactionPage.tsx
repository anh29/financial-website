import styles from './TransactionPage.module.css'
import TransactionTable from '../../components/TransactionPage/TransactionTable'
import ImportButton from '../../components/TransactionPage/ImportButton'
import OCRUpload from '../../components/TransactionPage/OCRUpload'
import SearchFilter, { SearchFilterState } from '../../components/TransactionPage/SearchFilter'
import { LoadingSpinner } from '../../components/common'
import { useTransactions } from '../../hooks/features/useTransactions'
import { useEffect, useState } from 'react'
import { Transaction } from '../../types/transaction'
import { FloatingActionButton } from '../../components/common/FloatingActionButton/FloatingActionButton'

const TransactionPage = () => {
  const { transactions, isLoading, error, handleImport, fetchTransactions } = useTransactions()
  const [updatedTransactions, setUpdatedTransactions] = useState<Transaction[]>([])
  const [showFabModal, setShowFabModal] = useState(false)
  const [filter, setFilter] = useState<SearchFilterState>({
    searchTerm: '',
    viewMode: 'compact',
    typeFilter: 'all'
  })

  useEffect(() => {
    fetchTransactions() // Fetch transactions when the component mounts
  }, [fetchTransactions])

  const handleTransactionUpdate = (transactions: Transaction[]) => {
    setUpdatedTransactions(transactions)
  }

  const handleAddTransaction = () => {
    setShowFabModal(true)
  }

  const handleFabClose = () => setShowFabModal(false)

  // Filtering/search logic
  const getFilteredTransactions = () => {
    let txs = transactions
    if (filter.typeFilter !== 'all') {
      txs = txs.filter((t) => t.type === filter.typeFilter)
    }
    if (filter.searchTerm.trim()) {
      const term = filter.searchTerm.toLowerCase()
      txs = txs.filter(
        (t) =>
          t.description.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term) ||
          t.source.toLowerCase().includes(term)
      )
    }
    return txs
  }

  if (error) return <div>Lỗi: {error}</div>

  return (
    <div className={styles.transactionPage}>
      <header className={styles.header}>
        <h1>📊 Bảng Điều Khiển Giao Dịch</h1>
        <p>Nhập, xem và quản lý các giao dịch tài chính của bạn một cách dễ dàng.</p>
      </header>

      <div className={styles.controls}>
        <SearchFilter onFilterChange={setFilter} />
      </div>

      {isLoading && <LoadingSpinner />}
      {!isLoading && transactions.length === 0 && <p>Không tìm thấy giao dịch nào.</p>}
      {!isLoading && transactions.length > 0 && (
        <TransactionTable
          transactions={getFilteredTransactions()}
          updatedTransactions={updatedTransactions}
          onTransactionUpdate={handleTransactionUpdate}
          viewMode={filter.viewMode}
        />
      )}
      <FloatingActionButton onClick={handleAddTransaction} />
      {showFabModal && (
        <div className={styles.floatingActionModalWrapper} onClick={handleFabClose}>
          <div className={styles.floatingActionModalContent} onClick={(e) => e.stopPropagation()}>
            <ImportButton onImport={handleImport} />
            <OCRUpload onUpload={handleImport} />
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionPage
