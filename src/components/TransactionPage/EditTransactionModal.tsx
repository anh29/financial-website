import React, { useEffect, useState, useRef } from 'react'
import { useNotifications } from '../../hooks/useNotifications'
import { classifyTransaction } from '../../utils/transactionUtils'
import { expenseCategories, incomeCategories } from '../../utils/categoryUtils'
import { Modal, Button } from '../common'
import { Transaction } from '../../types/transaction'
import { useTransactions } from '../../hooks/features/useTransactions'
import styles from './EditTransactionModal.module.css'

interface EditTransactionModalProps {
  transaction: Transaction
  onClose: () => void
  onTransactionUpdated?: (updatedTransaction: Transaction) => void
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onClose, onTransactionUpdated }) => {
  const [current, setCurrent] = useState<Transaction>(transaction)
  const [isComposing, setIsComposing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasPredictedOnce = useRef(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const { updateTransactionHandler } = useTransactions()
  const { showNotification } = useNotifications()

  useEffect(() => {
    if (isComposing || !current.description || current.description.length < 3 || current.type === 'income') return
    // Skip prediction only once if we have initial category
    if (!hasPredictedOnce.current && transaction.category === current.category) {
      hasPredictedOnce.current = true
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)

    setCurrent((prev: Transaction) => ({ ...prev, isClassifying: true, classificationError: '' }))

    debounceRef.current = setTimeout(async () => {
      try {
        if (!hasPredictedOnce.current && current.category) {
          hasPredictedOnce.current = true
          return
        }

        const predicted = await classifyTransaction({ description: current.description })
        setCurrent((prev: Transaction) => ({ ...prev, category: predicted }))
        hasPredictedOnce.current = true
      } catch {
        setCurrent((prev: Transaction) => ({ ...prev, classificationError: '⚠ Classification failed' }))
      } finally {
        setCurrent((prev: Transaction) => ({ ...prev, isClassifying: false }))
      }
    }, 500)
  }, [current.description, isComposing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    let parsed: string | number | boolean = value

    if (type === 'number') parsed = value === '' ? '' : Number(value)
    if (type === 'checkbox') parsed = (e.target as HTMLInputElement).checked

    const updated = { ...current, [name]: parsed }

    if (name === 'type') {
      updated.category = parsed === 'expense' ? expenseCategories[0].key : incomeCategories[0].key
    }

    setCurrent(updated)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      await updateTransactionHandler(current)
      showNotification('Transaction updated successfully', 'success')

      // Call the callback with the updated transaction
      if (onTransactionUpdated) {
        onTransactionUpdated(current)
      }

      onClose()
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Failed to update transaction', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const footer = (
    <>
      <Button variant='outline' onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </>
  )

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title='Edit Transaction'
      size='medium'
      loading={current.isClassifying}
      footer={footer}
      closeOnEsc={!isSubmitting}
      closeOnOverlayClick={!isSubmitting}
    >
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        {current.classificationError && (
          <div className={styles.errorMessage}>
            <span>⚠</span> {current.classificationError}
          </div>
        )}
        <label>
          Date:
          <input
            type='date'
            name='date'
            value={current.date ? new Date(current.date).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </label>
        <label>
          Type:
          <select name='type' value={current.type} onChange={handleChange} disabled={isSubmitting}>
            <option value='expense'>Expense</option>
            <option value='income'>Income</option>
          </select>
        </label>
        <label>
          Category:
          {current.isClassifying ? (
            <span className={styles.loadingSpinner}>Classifying...</span>
          ) : (
            <select name='category' value={current.category} onChange={handleChange} disabled={isSubmitting}>
              {(current.type === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          )}
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
            disabled={isSubmitting}
          />
        </label>
        <label>
          Source:
          <input type='text' name='source' value={current.source} onChange={handleChange} disabled={isSubmitting} />
        </label>
        <label className={styles.checkboxField}>
          Amortized:
          <input
            type='checkbox'
            name='is_amortized'
            checked={!!current.is_amortized}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </label>
        {current.is_amortized && (
          <label>
            Amortized Days:
            <input
              type='number'
              name='amortized_days'
              value={current.amortized_days}
              onChange={handleChange}
              min={1}
              disabled={isSubmitting}
            />
          </label>
        )}
      </form>
    </Modal>
  )
}

export default EditTransactionModal
