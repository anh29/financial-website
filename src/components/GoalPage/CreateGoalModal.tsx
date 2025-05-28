import React, { useState, useRef } from 'react'
import styles from './CreateGoalModal.module.css'
import { classifyTransaction } from '../../services/features/transactionService'
import { expenseCategories } from '../../utils/categoryUtils'
import { Goals } from '../../types/goals'

interface CreateGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (goalData: Goals) => void
}

const initialFormData: Goals = {
  description: '',
  amount: 0,
  start_date: new Date().toISOString().split('T')[0],
  target_date: '',
  repeat_type: 'none',
  status: 'active',
  category: '',
  id: '',
  created_at: ''
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Goals>(initialFormData)

  const [isClassifying, setIsClassifying] = useState(false)
  const [classificationError, setClassificationError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const descriptionDebounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    // If the title field is changed, trigger classification
    if (name === 'description') {
      if (descriptionDebounceRef.current) {
        clearTimeout(descriptionDebounceRef.current)
      }

      setIsClassifying(true)
      setClassificationError(null)

      descriptionDebounceRef.current = setTimeout(async () => {
        try {
          const { predictedCategory } = await classifyTransaction({
            description: value
          })

          setFormData((prev) => ({
            ...prev,
            category: predictedCategory.key
          }))
        } catch (error) {
          setClassificationError('⚠ Classification failed')
          console.error('Classification error:', error)
        } finally {
          setIsClassifying(false)
        }
      }, 500)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      await onSubmit(formData)
      setFormData(initialFormData)
      onClose()
    } catch (error) {
      console.error('Failed to save goal:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.createGoalModal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Tạo mục tiêu mới</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='description'>Tên mục tiêu</label>
            <input
              type='text'
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='VD: Mua MacBook'
              required
            />
            {isClassifying && (
              <div className={styles.classifyingIndicator}>
                <span className={styles.spinner}></span>
                Đang phân loại...
              </div>
            )}
            {classificationError && (
              <div className={styles.errorText} role='alert'>
                {classificationError}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='amount'>Số tiền cần tiết kiệm</label>
            <input
              type='number'
              id='amount'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              placeholder='VD: 36000000'
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor='start_date'>Ngày bắt đầu</label>
              <input
                type='date'
                id='start_date'
                name='start_date'
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='target_date'>Ngày hoàn thành</label>
              <input
                type='date'
                id='target_date'
                name='target_date'
                value={formData.target_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor='repeat_type'>Tần suất tiết kiệm</label>
              <select id='repeat_type' name='repeat_type' value={formData.repeat_type} onChange={handleChange} required>
                <option value='none'>Không lặp lại</option>
                <option value='daily'>Hàng ngày</option>
                <option value='weekly'>Hàng tuần</option>
                <option value='monthly'>Hàng tháng</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='category'>Danh mục</label>
              <select id='category' name='category' value={formData.category} onChange={handleChange} required>
                {expenseCategories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
                <option key={'other'} value={'other'}>
                  Khác
                </option>
              </select>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type='submit' className={styles.submitButton} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Tạo mục tiêu'}
            </button>
            <button type='button' className={styles.cancelButton} onClick={onClose} disabled={isSaving}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGoalModal
