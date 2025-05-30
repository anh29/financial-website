import React, { useEffect, useState, useRef } from 'react'
import styles from './TransactionModal.module.css'
import { expenseCategories, incomeCategories } from '../../utils/categoryUtils'
import { Transaction } from '../../types/transaction'
import { classifyTransaction } from '../../services/features/transactionService'

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
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const descriptionDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const hasPredicted = useRef<Record<number, boolean>>({})
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleAddTransaction = () => {
    setTransactions([
      ...transactions,
      {
        id: '', // Assign a unique ID
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        category: expenseCategories[0].key,
        description: '',
        source: 'manual',
        type: 'expense',
        isClassifying: false,
        classificationError: '',
        is_amortized: false
      }
    ])
  }

  const handleInputChange = async (
    index: number,
    field: keyof Transaction,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, type } = e.target
    let parsed: string | number = value
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
          const { predictedCategory } = await classifyTransaction({
            description: updated[index].description
          })
          updated[index].category = predictedCategory.key
          hasPredicted.current[index] = true
        } catch (error) {
          updated[index].classificationError = '⚠ Phân loại thất bại'
          console.error('Classification error:', error)
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

  const validateTransactions = (): boolean => {
    const invalidTransactions = transactions.filter((t) => !t.date || !t.description || !t.amount || !t.category)

    if (invalidTransactions.length > 0) {
      setError('Vui lòng điền đầy đủ thông tin cho mỗi giao dịch')
      return false
    }

    return true
  }

  const handleSaveAllTransactions = async () => {
    setError(null)

    if (!validateTransactions()) {
      return
    }

    try {
      setIsSaving(true)
      await onSave(transactions)
      onClose()
    } catch (error) {
      setError('Không thể lưu giao dịch. Vui lòng thử lại.')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.transactionModal}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2>Xem Lại Giao Dịch</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label='Close'>
            &times;
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage} role='alert'>
            {error}
          </div>
        )}

        <div className={styles.modalBody}>
          <table className={styles.transactionTable}>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Mô Tả</th>
                <th>Loại</th>
                <th>Danh Mục</th>
                <th>Số Tiền</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type='date'
                      value={transaction.date}
                      onChange={(e) => handleInputChange(index, 'date', e)}
                      required
                      aria-label='Transaction date'
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      value={transaction.description}
                      onChange={(e) => handleInputChange(index, 'description', e)}
                      placeholder='Nhập mô tả'
                      required
                      aria-label='Transaction description'
                    />
                  </td>
                  <td>
                    <select
                      value={transaction.type}
                      onChange={(e) => handleInputChange(index, 'type', e)}
                      aria-label='Transaction type'
                    >
                      <option value='expense'>Chi Tiêu</option>
                      <option value='income'>Thu Nhập</option>
                    </select>
                  </td>
                  <td>
                    {transaction.isClassifying ? (
                      <div className={styles.loadingSpinner}>
                        <span className={styles.spinner}></span>
                        Đang phân loại...
                      </div>
                    ) : (
                      <select
                        value={transaction.category}
                        onChange={(e) => handleInputChange(index, 'category', e)}
                        aria-label='Transaction category'
                      >
                        {(transaction.type === 'expense' ? expenseCategories : incomeCategories).map((category) => (
                          <option key={category.key} value={category.key}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {transaction.classificationError && (
                      <div className={styles.errorText} role='alert'>
                        ⚠ Phân loại thất bại
                      </div>
                    )}
                  </td>
                  <td>
                    <input
                      type='number'
                      value={transaction.amount}
                      onChange={(e) => handleInputChange(index, 'amount', e)}
                      min='0'
                      step='0.01'
                      required
                      aria-label='Transaction amount'
                      className={transaction.type === 'expense' ? styles.expenseInput : styles.incomeInput}
                    />
                  </td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteTransaction(index)}
                      aria-label='Delete transaction'
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.addButton} onClick={handleAddTransaction} aria-label='Add new transaction'>
            +
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSaveAllTransactions}
            disabled={isSaving}
            aria-label='Save all transactions'
          >
            {isSaving ? 'Đang Lưu...' : 'Lưu Tất Cả'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionModal
