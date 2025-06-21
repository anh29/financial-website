import React, { useEffect, useState, useRef } from 'react'
import styles from './TransactionModal.module.css'
import { expenseCategories, incomeCategories } from '../../utils/categoryUtils'
import { Transaction } from '../../types/transaction'
import { classifyTransaction } from '../../services/features/transactionService'
import { useLanguage } from '../../context/LanguageContext'

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
  const { t } = useLanguage()

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
      updated[index].category = parsed === 'expense' ? expenseCategories[0].key : ''
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
    const invalidTransactions = transactions.filter((t) => {
      if (t.type === 'expense') {
        return !t.date || !t.description || !t.amount || !t.category
      } else {
        return !t.date || !t.amount
      }
    })

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
          <h2>{t('transaction', 'transaction_modal_title')}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label={t('common', 'close')}>
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
                <th>{t('transaction', 'date')}</th>
                <th>{t('transaction', 'description')}</th>
                <th>{t('transaction', 'type')}</th>
                <th>{t('transaction', 'category')}</th>
                <th>{t('transaction', 'amount')}</th>
                <th>{t('transaction', 'actions')}</th>
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
                      aria-label={t('transaction', 'transaction_date')}
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      value={transaction.description}
                      onChange={(e) => handleInputChange(index, 'description', e)}
                      placeholder={t('transaction', 'enter_description')}
                      required
                      aria-label={t('transaction', 'transaction_description')}
                    />
                  </td>
                  <td>
                    <select
                      value={transaction.type}
                      onChange={(e) => handleInputChange(index, 'type', e)}
                      aria-label={t('transaction', 'transaction_type')}
                    >
                      <option value='expense'>{t('transaction', 'expense')}</option>
                      <option value='income'>{t('transaction', 'income')}</option>
                    </select>
                  </td>
                  <td>
                    {transaction.type === 'expense' ? (
                      transaction.isClassifying ? (
                        <div className={styles.loadingSpinner}>
                          <span className={styles.spinner}></span>
                          {t('transaction', 'classifying')}...
                        </div>
                      ) : (
                        <select
                          value={transaction.category}
                          onChange={(e) => handleInputChange(index, 'category', e)}
                          aria-label={t('transaction', 'transaction_category')}
                        >
                          {(transaction.type === 'expense' ? expenseCategories : incomeCategories).map((category) => (
                            <option key={category.key} value={category.key}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      )
                    ) : (
                      <input
                        type='text'
                        value={transaction.category}
                        onChange={(e) => handleInputChange(index, 'category', e)}
                        placeholder={t('transaction', 'enter_category')}
                        aria-label={t('transaction', 'transaction_category')}
                      />
                    )}
                    {transaction.classificationError && transaction.type === 'expense' && (
                      <div className={styles.errorText} role='alert'>
                        ⚠ {t('transaction', 'classification_error')}
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
                      aria-label={t('transaction', 'transaction_amount')}
                      className={transaction.type === 'expense' ? styles.expenseInput : styles.incomeInput}
                    />
                  </td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteTransaction(index)}
                      aria-label={t('transaction', 'delete_transaction')}
                    >
                      {t('transaction', 'delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.addButton} onClick={handleAddTransaction} aria-label={t('transaction', 'add_new_transaction')}>
            +
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSaveAllTransactions}
            disabled={isSaving}
            aria-label={t('transaction', 'save_all_transactions')}
          >
            {isSaving ? t('transaction', 'saving') : t('transaction', 'save_all')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionModal
