import React, { useEffect, useState, useRef } from 'react'
import { useNotifications } from '../../hooks/useNotifications'
import { classifyTransaction, predictUsageDuration } from '../../services/features/transactionService'
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
  const [current, setCurrent] = useState<Transaction>(() => {
    // Convert category label to key when initializing
    const allCategories = [...expenseCategories, ...incomeCategories]
    const categoryKey =
      allCategories.find((cat) => cat.label === transaction.category)?.key ||
      (transaction.type === 'expense' ? expenseCategories[0].key : incomeCategories[0].key)
    return { ...transaction, category: categoryKey }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const [isPredicting, setIsPredicting] = useState(false)
  const descriptionDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const { updateTransactionHandler } = useTransactions()
  const { showNotification } = useNotifications()

  // Reset state when transaction changes
  useEffect(() => {
    // Convert category label to key when transaction changes
    const allCategories = [...expenseCategories, ...incomeCategories]
    const categoryKey =
      allCategories.find((cat) => cat.label === transaction.category)?.key ||
      (transaction.type === 'expense' ? expenseCategories[0].key : incomeCategories[0].key)
    setCurrent({ ...transaction, category: categoryKey })
  }, [transaction])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    let parsed: string | number | boolean = value

    if (type === 'number') parsed = value === '' ? '' : Number(value)
    if (type === 'checkbox') parsed = (e.target as HTMLInputElement).checked

    const updated = { ...current, [name]: parsed }

    if (name === 'type') {
      updated.category = parsed === 'expense' ? expenseCategories[0].key : incomeCategories[0].key
    }

    setCurrent(updated)

    if (name === 'is_amortized' && parsed === true) {
      setIsPredicting(true)
      try {
        const predicted = await predictUsageDuration({
          amount: Number(updated.amount),
          category: String(updated.category)
        })
        setCurrent((prev) => ({ ...prev, amortized_days: predicted }))
      } catch {
        // Optionally show notification
        showNotification('Failed to predict usage duration', 'error')
      } finally {
        setIsPredicting(false)
      }
    }

    // Handle category classification for description changes
    if (name === 'description' && updated.type === 'expense') {
      if (descriptionDebounceRef.current) {
        clearTimeout(descriptionDebounceRef.current)
      }

      // Only classify if description is long enough
      if (!updated.description || updated.description.length < 3) return

      setIsClassifying(true)

      descriptionDebounceRef.current = setTimeout(async () => {
        try {
          const { predictedCategory } = await classifyTransaction({ description: updated.description })
          setCurrent((prev) => ({ ...prev, category: predictedCategory.key }))
        } catch (error) {
          console.error('Classification error:', error)
          setCurrent((prev) => ({ ...prev, classificationError: '⚠ Classification failed' }))
        } finally {
          setIsClassifying(false)
        }
      }, 500)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Convert category key back to label before submitting
      const allCategories = [...expenseCategories, ...incomeCategories]
      const categoryLabel = allCategories.find((cat) => cat.key === current.category)?.label || current.category
      const transactionToUpdate = { ...current, category: categoryLabel }

      await updateTransactionHandler(transactionToUpdate)
      showNotification('Transaction updated successfully', 'success')

      if (onTransactionUpdated) {
        onTransactionUpdated(transactionToUpdate)
      }

      onClose()
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Failed to update transaction', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (descriptionDebounceRef.current) {
        clearTimeout(descriptionDebounceRef.current)
      }
    }
  }, [])

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
          {isClassifying ? (
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
              value={isPredicting ? '' : current.amortized_days}
              onChange={handleChange}
              min={1}
              disabled={isSubmitting || isPredicting}
              placeholder={isPredicting ? 'Predicting...' : ''}
            />
          </label>
        )}
      </form>
    </Modal>
  )
}

export default EditTransactionModal
