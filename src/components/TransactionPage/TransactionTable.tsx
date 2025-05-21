import React, { useState } from 'react'
import { Card } from '../common'
import EditTransactionModal from './EditTransactionModal'
import styles from './TransactionTable.module.css'
import { Transaction } from '../../types/transaction'

interface TransactionTableProps {
  transactions: Transaction[]
  updatedTransactions: Transaction[]
  onTransactionUpdate?: (updatedTransactions: Transaction[]) => void
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  updatedTransactions,
  onTransactionUpdate
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const transactionMap = new Map<string, Transaction>()
  transactions.forEach((tx) => transactionMap.set(tx.id, tx))
  updatedTransactions.forEach((tx) => transactionMap.set(tx.id, tx)) // updated takes precedence
  const totalTransactions = Array.from(transactionMap.values())

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedTransaction(null)
  }

  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    // Update the transactions array with the updated transaction
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === updatedTransaction.id ? updatedTransaction : transaction
    )

    if (onTransactionUpdate) {
      onTransactionUpdate(updatedTransactions)
    }

    handleCloseModal()
  }

  const displayDate = (transaction: Transaction) =>
    transaction.date
      ? new Date(transaction.date).toLocaleDateString('vi-VN')
      : new Date(transaction.created_at || '').toLocaleDateString('vi-VN')

  const getAmountClass = (transaction: Transaction) => {
    if (transaction.is_amortized) return styles.amountAmortized
    if (transaction.type === 'income') return styles.amountIncome
    if (transaction.type === 'expense') return styles.amountExpense
    return ''
  }

  return (
    <Card className={styles.tableWrapper}>
      <div className={styles.tableContainer}>
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Source</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody className={styles.transactionTableBody}>
            {totalTransactions &&
              totalTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{displayDate(transaction)}</td>
                  <td className={getAmountClass(transaction)}>
                    {transaction.amount.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })}
                  </td>
                  <td>{transaction.category}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.source || 'manual'}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(transaction)}
                      aria-label='Edit transaction'
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          onClose={handleCloseModal}
          onTransactionUpdated={handleTransactionUpdate}
        />
      )}
    </Card>
  )
}

export default TransactionTable
