import React, { useState } from 'react'
import styles from './AddBillModal.module.css'
import { expenseCategories } from '../../utils/categoryUtils'
import { AddBillForm } from '../../types/upcoming'
import { FaTimes, FaCalendarAlt, FaMoneyBillWave, FaListUl, FaHashtag } from 'react-icons/fa'
import { classifyTransaction } from '../../services/features/transactionService'
import { useUpcoming } from '../../hooks/features/useUpcoming'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../hooks/useNotifications'

interface AddBillModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const AddBillModal: React.FC<AddBillModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage()
  const { showNotification } = useNotifications()
  const [form, setForm] = useState<AddBillForm>({
    title: '',
    amount: 0,
    category: '',
    frequency: '',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: null,
    day_of_month: 1
  })
  const [isClassifying, setIsClassifying] = useState(false)
  const [classificationError, setClassificationError] = useState<string | null>(null)
  const titleDebounceRef = React.useRef<NodeJS.Timeout | null>(null)
  const { addUpcomingBill } = useUpcoming()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))

    // Predict category when title changes
    if (name === 'title') {
      if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current)
      setIsClassifying(true)
      setClassificationError(null)
      titleDebounceRef.current = setTimeout(async () => {
        try {
          const { predictedCategory } = await classifyTransaction({ description: value })
          setForm((prev) => ({ ...prev, category: predictedCategory.label }))
        } catch {
          setClassificationError(t('common', 'classificationFailed'))
        } finally {
          setIsClassifying(false)
        }
      }, 500)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      await addUpcomingBill(form)
      showNotification('Thêm hóa đơn thành công', 'success')
      onSuccess?.() // Call the success callback to refresh data
      onClose()
    } catch (error) {
      showNotification('Không thể thêm hóa đơn. Vui lòng thử lại.', 'error')
      setSubmitError(t('common', 'cannotAddBill'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const repeatTypes = [
    { value: 'monthly', label: t('common', 'monthly') },
    { value: 'quarterly', label: t('common', 'quarterly') },
    { value: 'yearly', label: t('common', 'yearly') }
  ]

  return (
    <div className={styles.addBillModalContainer}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} type='button' aria-label={t('common', 'close')}>
          <FaTimes />
        </button>
        <h2 className={styles.modalTitle}>{t('common', 'addBill')}</h2>
        <form onSubmit={handleSubmit} className={styles.form} autoComplete='off'>
          <div className={styles.sectionHeader}>{t('common', 'billInfo')}</div>
          <div className={styles.formGrid}>
            <label className={styles.formLabel}>
              {t('common', 'title')}
              <div className={styles.inputWrapper}>
                <FaListUl className={styles.inputIcon} aria-label={t('common', 'title')} />
                <input
                  name='title'
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder={t('common', 'enterTitle')}
                  autoComplete='off'
                  disabled={isSubmitting}
                />
              </div>
            </label>
            <label className={styles.formLabel}>
              {t('common', 'amount')}
              <div className={styles.inputWrapper}>
                <FaMoneyBillWave className={styles.inputIcon} aria-label={t('common', 'amount')} />
                <input
                  name='amount'
                  type='number'
                  value={form.amount}
                  onChange={handleChange}
                  required
                  placeholder={t('common', 'enterAmount')}
                  autoComplete='off'
                  disabled={isSubmitting}
                />
              </div>
            </label>
            <label className={styles.formLabel}>
              {t('common', 'category')}
              {isClassifying ? <span className={styles.spinner} aria-label={t('common', 'classifying')} /> : null}
              <select name='category' value={form.category} onChange={handleChange} required disabled={isClassifying || isSubmitting}>
                <option value=''>{t('common', 'selectCategory')}</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {classificationError && (
                <div className={styles.classificationError}>{t('common', 'classificationFailed')}</div>
              )}
            </label>
            <label className={styles.formLabel}>
              {t('common', 'frequency')}
              <select name='frequency' value={form.frequency} onChange={handleChange} required disabled={isSubmitting}>
                <option value=''>{t('common', 'selectFrequency')}</option>
                {repeatTypes.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.sectionHeader}>{t('common', 'paymentSchedule')}</div>
          <div className={styles.formGrid}>
            <label className={styles.formLabel}>
              {t('common', 'startDate')}
              <div className={styles.inputWrapper}>
                <FaCalendarAlt className={styles.inputIcon} aria-label={t('common', 'startDate')} />
                <input
                  name='start_date'
                  type='date'
                  value={form.start_date}
                  onChange={handleChange}
                  required
                  placeholder={t('common', 'enterStartDate')}
                  autoComplete='off'
                  disabled={isSubmitting}
                />
              </div>
            </label>
            <label className={styles.formLabel}>
              {t('common', 'endDate')}
              <div className={styles.inputWrapper}>
                <FaCalendarAlt className={styles.inputIcon} aria-label={t('common', 'endDate')} />
                <input
                  name='end_date'
                  type='date'
                  value={form.end_date || ''}
                  onChange={handleChange}
                  placeholder={t('common', 'enterEndDate')}
                  autoComplete='off'
                  disabled={isSubmitting}
                />
              </div>
            </label>
            <label className={styles.formLabel}>
              {t('common', 'dayOfMonth')}
              <div className={styles.inputWrapper}>
                <FaHashtag className={styles.inputIcon} aria-label={t('common', 'dayOfMonth')} />
                <input
                  name='day_of_month'
                  type='number'
                  min={1}
                  max={31}
                  value={form.day_of_month}
                  onChange={handleChange}
                  required
                  placeholder={t('common', 'enterDayOfMonth')}
                  autoComplete='off'
                  disabled={isSubmitting}
                />
              </div>
            </label>
          </div>
          <div className={styles.actionsRow}>
            <button type='submit' className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? t('common', 'saving') : t('common', 'add')}
            </button>
            <button type='button' onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>
              {t('common', 'cancel')}
            </button>
          </div>
        </form>
        {submitError && <div className={styles.classificationError}>{submitError}</div>}
      </div>
    </div>
  )
}

export default AddBillModal
