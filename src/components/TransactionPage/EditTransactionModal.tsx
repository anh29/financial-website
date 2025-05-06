import React, { useEffect, useState, useRef } from 'react'
import styles from './TransactionModal.module.css'

import { classifyTransaction } from '../../utils/transactionUtils'
import { expenseCategories, incomeCategories } from '../../utils/categoryUtils'
import { Transaction } from './TransactionModal'

interface EditTransactionModalProps {
  transaction: Transaction
  onClose: () => void
  onSave: (updated: Transaction) => void
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onClose, onSave }) => {
  const [current, setCurrent] = useState<Transaction>(transaction)
  const [isComposing, setIsComposing] = useState(false)
  const hasPredictedOnce = useRef(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isComposing || !current.description || current.description.length < 3 || current.type === 'income') return
    // Skip prediction only once if we have initial category
    if (!hasPredictedOnce.current && transaction.category === current.category) {
      hasPredictedOnce.current = true
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)

    setCurrent((prev) => ({ ...prev, isClassifying: true, classificationError: '' }))

    debounceRef.current = setTimeout(async () => {
      try {
        if (!hasPredictedOnce.current && current.category) {
          hasPredictedOnce.current = true
          return
        }

        const predicted = await classifyTransaction({ description: current.description })
        setCurrent((prev) => ({ ...prev, category: predicted }))
        hasPredictedOnce.current = true
      } catch {
        setCurrent((prev) => ({ ...prev, classificationError: '⚠ Classification failed' }))
      } finally {
        setCurrent((prev) => ({ ...prev, isClassifying: false }))
      }
    }, 500)
  }, [current.description, isComposing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    let parsed: string | number | boolean = value

    if (type === 'number') parsed = value === '' ? '' : Number(value)

    const updated = { ...current, [name]: parsed }

    if (name === 'type') {
      updated.category = parsed === 'expense' ? expenseCategories[0].key : incomeCategories[0].key
    }

    setCurrent(updated)
  }

  const isSaveDisabled =
    !current.date ||
    !current.description ||
    !current.category ||
    !current.source ||
    current.amount === undefined ||
    (current.is_amortized && (!current.amortized_days || current.amortized_days <= 0))

  return (
    <div className={styles.transactionModal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Edit Transaction</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <label>
          Date:
          <input
            type='date'
            name='date'
            value={current.date ? new Date(current.date).toISOString().split('T')[0] : ''}
            onChange={handleChange}
          />
        </label>
        <label>
          Amount:
          <input
            type='number'
            name='amount'
            value={current.amount}
            onChange={handleChange}
            className={current.type === 'expense' ? styles.expenseInput : styles.incomeInput}
          />
        </label>
        <label>
          Type:
          <select name='type' value={current.type} onChange={handleChange}>
            <option value='expense'>Expense</option>
            <option value='income'>Income</option>
          </select>
        </label>
        <label>
          Category:
          {current.isClassifying ? (
            <span className={styles.loadingSpinner}>Classifying...</span>
          ) : (
            <select name='category' value={current.category} onChange={handleChange}>
              {(current.type === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          )}
          {current.classificationError && <div className={styles.errorText}>{current.classificationError}</div>}
        </label>
        <label>
          Description:
          <input
            type='text'
            name='description'
            value={current.description}
            onChange={handleChange}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
        </label>
        <label>
          Source:
          <input type='text' name='source' value={current.source} onChange={handleChange} />
        </label>
        <label className={styles.checkboxField}>
          Amortized:
          <input type='checkbox' name='is_amortized' checked={!!current.is_amortized} onChange={handleChange} />
        </label>
        {current.is_amortized && (
          <label>
            Amortized Days:
            <input type='number' name='amortized_days' value={current.amortized_days} onChange={handleChange} min={1} />
          </label>
        )}
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.saveButton}
            disabled={isSaveDisabled}
            onClick={() => onSave(current)}
            style={{ opacity: isSaveDisabled ? 0.5 : 1, cursor: isSaveDisabled ? 'not-allowed' : 'pointer' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditTransactionModal
