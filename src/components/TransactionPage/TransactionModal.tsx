import React, { useEffect, useState, useRef } from 'react'
import styles from './TransactionModal.module.css'
import { expenseCategories, incomeCategories } from '../../utils/categoryUtils'
import { classifyTransaction } from '../../utils/transactionUtils'

export interface Transaction {
  date?: string
  amount?: number
  category?: string
  description?: string
  source?: string
  type?: 'expense' | 'income'
  isClassifying?: boolean
  classificationError?: string
  is_amortized?: boolean
  amortized_days?: number
}

const TransactionModal = ({
  onClose,
  onSave,
  initialTransactions = []
}: {
  onClose: () => void
  onSave: (transactions: Transaction[]) => void
  initialTransactions?: Transaction[]
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const descriptionDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const hasPredicted = useRef<Record<number, boolean>>({})

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  const handleAddTransaction = () => {
    setTransactions([
      ...transactions,
      {
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        category: expenseCategories[0].key,
        description: '',
        source: 'manual',
        type: 'expense',
        isClassifying: false,
        classificationError: ''
      }
    ])
  }

  const handleInputChange = async (
    index: number,
    field: keyof Transaction,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, type } = e.target
    let parsed: any = value
    if (type === 'number') parsed = value === '' ? '' : Number(value)

    const updated = [...transactions]
    updated[index] = { ...updated[index], [field]: parsed }

    if (field === 'type') {
      updated[index].category = parsed === 'expense' ? expenseCategories[0].key : incomeCategories[0].key
    }

    setTransactions(updated)

    if (field === 'description' && updated[index].type === 'expense') {
      if (descriptionDebounceRef.current) clearTimeout(descriptionDebounceRef.current)

      updated[index].isClassifying = true
      updated[index].classificationError = ''
      setTransactions([...updated])

      descriptionDebounceRef.current = setTimeout(async () => {
        try {
          const predictedCategory = await classifyTransaction({
            description: updated[index].description
          })
          updated[index].category = predictedCategory
          hasPredicted.current[index] = true
        } catch {
          updated[index].classificationError = '⚠ Classification failed'
        } finally {
          updated[index].isClassifying = false
          setTransactions([...updated])
        }
      }, 500)
    }
  }

  const handleDeleteTransaction = (index: number) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index)
    setTransactions(updatedTransactions)
  }

  const handleSaveAllTransactions = async () => {
    console.log('Saving transactions:', transactions)
    await onSave(transactions)
    onClose()
  }

  return (
    <div className={styles.transactionModal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Review Transactions</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <table className={styles.transactionTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>
                    <input type='date' value={transaction.date} onChange={(e) => handleInputChange(index, 'date', e)} />
                  </td>
                  <td>
                    <input
                      type='text'
                      value={transaction.description}
                      onChange={(e) => handleInputChange(index, 'description', e)}
                    />
                  </td>
                  <td>
                    <select value={transaction.type} onChange={(e) => handleInputChange(index, 'type', e)}>
                      <option value='expense'>Expense</option>
                      <option value='income'>Income</option>
                    </select>
                  </td>
                  <td>
                    {transaction.isClassifying ? (
                      <span className={styles.loadingSpinner}>Classifying...</span>
                    ) : (
                      <select value={transaction.category} onChange={(e) => handleInputChange(index, 'category', e)}>
                        {(transaction.type === 'expense' ? expenseCategories : incomeCategories).map((category) => (
                          <option key={category.key} value={category.key}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {transaction.classificationError && (
                      <div className={styles.errorText}>{transaction.classificationError}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type='number'
                      name='amount'
                      value={transaction.amount}
                      onChange={(e) => handleInputChange(index, 'amount', e)}
                    />
                  </td>
                  <td>
                    <button className={styles.deleteButton} onClick={() => handleDeleteTransaction(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.addButton} onClick={handleAddTransaction}>
            +
          </button>
          <button className={styles.saveButton} onClick={handleSaveAllTransactions}>
            Save All
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionModal
