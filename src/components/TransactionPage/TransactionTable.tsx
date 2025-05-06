import React, { useEffect, useState } from 'react'
import styles from './TransactionTable.module.css'
import EditTransactionModal, { Transaction } from './EditTransactionModal'
import { SERVER_URL } from '../../utils/constants'
import Log from '../Log/Log'

const TransactionTable = ({ newTransactions }: { newTransactions: Transaction[] }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    setTransactions(newTransactions)
  }, [newTransactions])

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [logMessage, setLogMessage] = useState<string | null>(null)
  const [logStatus, setLogStatus] = useState<'success' | 'error' | 'info' | 'warning'>('info')

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction({ ...transaction })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!selectedTransaction) return

    try {
      const response = await fetch(`${SERVER_URL}/crud/transactions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...selectedTransaction,
          amount: selectedTransaction.amount?.toString() || '',
          amortized_days:
            selectedTransaction.is_amortized && selectedTransaction.amortized_days
              ? selectedTransaction.amortized_days.toString()
              : undefined
        })
      })

      if (!response.ok) throw new Error('Failed to save transaction')

      setLogMessage('✅ Transaction saved successfully.')
      setLogStatus('success')
      setTransactions((prev) => prev.map((t) => (t.id === selectedTransaction.id ? selectedTransaction : t)))
      setModalOpen(false)
    } catch (err) {
      console.error(err)
      setLogMessage('❌ Failed to save transaction. Please try again.')
      setLogStatus('error')
    }
  }

  const displayDate = (transaction: Transaction) =>
    transaction.date
      ? new Date(transaction.date).toLocaleDateString('vi-VN')
      : new Date(transaction.created_at).toLocaleDateString('vi-VN')
  const getAmountClass = (transaction: Transaction) => {
    if (transaction.is_amortized) return styles.amountAmortized
    if (transaction.type === 'income') return styles.amountIncome
    if (transaction.type === 'expense') return styles.amountExpense
    return ''
  }

  return (
    <>
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
          {transactions &&
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{displayDate(transaction)}</td>
                <td className={getAmountClass(transaction)}>
                  {transaction.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>{transaction.source || 'manual'}</td>
                <td>
                  <button onClick={() => handleEditClick(transaction)}>✏️</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isModalOpen && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {logMessage && <Log message={logMessage} status={logStatus} onClose={() => setLogMessage(null)} />}
    </>
  )
}

export default TransactionTable
