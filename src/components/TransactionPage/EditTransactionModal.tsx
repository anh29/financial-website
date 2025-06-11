import React, { useEffect, useState, useRef } from 'react'
import { useNotifications } from '../../hooks/useNotifications'
import { classifyTransaction, predictUsageDuration } from '../../services/features/transactionService'
import { expenseCategories, incomeCategories } from '../../utils/categoryUtils'
import { Modal, Button } from '../common'
import { Transaction } from '../../types/transaction'
import { useTransactions } from '../../hooks/features/useTransactions'
import styles from './EditTransactionModal.module.css'
import { useLanguage } from '../../context/LanguageContext'

interface EditTransactionModalProps {
  transaction: Transaction
  onClose: () => void
  onTransactionUpdated?: (updatedTransaction: Transaction) => void
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onClose, onTransactionUpdated }) => {
  const { t } = useLanguage()
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
      showNotification(t('common', 'transactionUpdated'), 'success')

      if (onTransactionUpdated) {
        onTransactionUpdated(transactionToUpdate)
      }

      onClose()
    } catch (error) {
      showNotification(t('common', 'failedToUpdate'), 'error')
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
        {t('common', 'cancel')}
      </Button>
      <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? t('common', 'savingChanges') : t('common', 'saveChanges')}
      </Button>
    </>
  )

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={t('common', 'editTransaction')}
      size='medium'
      footer={footer}
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
            <span>⚠</span> {t('common', 'classificationFailed')}
          </div>
        )}
        <label>
          {t('common', 'date')}:
          <input
            type='date'
            name='date'
            value={current.date ? new Date(current.date).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </label>
        <label>
          {t('common', 'amount')}:
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
          {t('common', 'type')}:
          <select name='type' value={current.type} onChange={handleChange} disabled={isSubmitting}>
            <option value='expense'>{t('common', 'expense')}</option>
            <option value='income'>{t('common', 'income')}</option>
          </select>
        </label>
        <label>
          {t('common', 'category')}:
          {isClassifying ? (
            <span className={styles.loadingSpinner}>{t('common', 'classifying')}</span>
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
          {t('common', 'description')}:
          <input
            type='text'
            name='description'
            value={current.description}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </label>
        <label>
          {t('common', 'source')}:
          <input type='text' name='source' value={current.source} onChange={handleChange} disabled={isSubmitting} />
        </label>
        <label className={styles.checkboxField}>
          {t('common', 'amortized')}:
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
            {t('common', 'amortizedDays')}:
            <input
              type='number'
              name='amortized_days'
              value={isPredicting ? '' : current.amortized_days}
              onChange={handleChange}
              min={1}
              disabled={isSubmitting || isPredicting}
              placeholder={isPredicting ? t('common', 'predict') : ''}
            />
          </label>
        )}
      </form>
    </Modal>
  )
}

export default EditTransactionModal
