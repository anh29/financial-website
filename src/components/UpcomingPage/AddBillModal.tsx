import React, { useState } from 'react'
import styles from './AddBillModal.module.css'
import { expenseCategories } from '../../utils/categoryUtils'
import { AddBillForm } from '../../types/upcoming'
import { FaTimes, FaCalendarAlt, FaMoneyBillWave, FaListUl, FaHashtag } from 'react-icons/fa'
import { classifyTransaction } from '../../services/features/transactionService'
import { useUpcoming } from '../../hooks/features/useUpcoming'

interface AddBillModalProps {
  isOpen: boolean
  onClose: () => void
}

const repeatTypes = [
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'quarterly', label: 'Hàng quý' },
  { value: 'yearly', label: 'Hàng năm' }
]

const AddBillModal: React.FC<AddBillModalProps> = ({ isOpen, onClose }) => {
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
          setClassificationError('⚠ Classification failed')
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
      setIsSubmitting(false)
      onClose()
    } catch {
      setIsSubmitting(false)
      setSubmitError('Không thể thêm hóa đơn. Vui lòng thử lại.')
    }
  }

  return (
    <div className={styles.addBillModalContainer}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} type='button' aria-label='Đóng'>
          <FaTimes />
        </button>
        <h2 className={styles.modalTitle}>Thêm hóa đơn mới</h2>
        <form onSubmit={handleSubmit} className={styles.form} autoComplete='off'>
          <div className={styles.sectionHeader}>Thông tin hóa đơn</div>
          <div className={styles.formGrid}>
            <label className={styles.formLabel}>
              Tiêu đề
              <div className={styles.inputWrapper}>
                <FaListUl className={styles.inputIcon} aria-label='Tiêu đề' />
                <input
                  name='title'
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder='Nhập tiêu đề'
                  autoComplete='off'
                />
              </div>
            </label>
            <label className={styles.formLabel}>
              Số tiền
              <div className={styles.inputWrapper}>
                <FaMoneyBillWave className={styles.inputIcon} aria-label='Số tiền' />
                <input
                  name='amount'
                  type='number'
                  value={form.amount}
                  onChange={handleChange}
                  required
                  placeholder='0'
                  autoComplete='off'
                />
              </div>
            </label>
            <label className={styles.formLabel}>
              Danh mục
              {isClassifying ? <span className={styles.spinner} aria-label='Đang phân loại' /> : null}
              <select name='category' value={form.category} onChange={handleChange} required disabled={isClassifying}>
                <option value=''>Chọn danh mục</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {classificationError && <div className={styles.classificationError}>{classificationError}</div>}
            </label>
            <label className={styles.formLabel}>
              Tần suất
              <select name='frequency' value={form.frequency} onChange={handleChange} required>
                <option value=''>Chọn tần suất</option>
                {repeatTypes.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.sectionHeader}>Lịch thanh toán</div>
          <div className={styles.formGrid}>
            <label className={styles.formLabel}>
              Ngày bắt đầu
              <div className={styles.inputWrapper}>
                <FaCalendarAlt className={styles.inputIcon} aria-label='Ngày bắt đầu' />
                <input
                  name='start_date'
                  type='date'
                  value={form.start_date}
                  onChange={handleChange}
                  required
                  placeholder='dd/mm/yyyy'
                  autoComplete='off'
                />
              </div>
            </label>
            <label className={styles.formLabel}>
              Ngày kết thúc
              <div className={styles.inputWrapper}>
                <FaCalendarAlt className={styles.inputIcon} aria-label='Ngày kết thúc' />
                <input
                  name='end_date'
                  type='date'
                  value={form.end_date || ''}
                  onChange={handleChange}
                  placeholder='dd/mm/yyyy'
                  autoComplete='off'
                />
              </div>
            </label>
            <label className={styles.formLabel}>
              Ngày thanh toán
              <div className={styles.inputWrapper}>
                <FaHashtag className={styles.inputIcon} aria-label='Ngày thanh toán' />
                <input
                  name='day_of_month'
                  type='number'
                  min={1}
                  max={31}
                  value={form.day_of_month}
                  onChange={handleChange}
                  required
                  placeholder='# 1'
                  autoComplete='off'
                />
              </div>
            </label>
          </div>
          <div className={styles.actionsRow}>
            <button type='submit' className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Thêm'}
            </button>
            <button type='button' onClick={onClose} className={styles.cancelButton}>
              Hủy
            </button>
          </div>
        </form>
        {submitError && <div className={styles.classificationError}>{submitError}</div>}
      </div>
    </div>
  )
}

export default AddBillModal
