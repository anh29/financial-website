import React, { useState } from 'react'
import styles from './AddBudgetModal.module.css'
import { Budget } from '../../types/budgets'

interface AddBudgetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (budgets: Budget[]) => Promise<void>
}

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ isOpen, onClose, onSave }) => {
  const [newBudgets, setNewBudgets] = useState<Budget[]>([{ id: '', description: '', amount: 0, allocations: [] }])
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleModalClose = () => {
    onClose()
    setNewBudgets([{ id: '', description: '', amount: 0, allocations: [] }])
  }

  const handleModalSave = async () => {
    setIsSaving(true)
    try {
      await onSave(newBudgets)
      setShowSuccess(true)
      handleModalClose()
      setTimeout(() => setShowSuccess(false), 1000)
    } catch (error) {
      console.error('Lỗi khi lưu ngân sách mới:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleNewBudgetChange = (index: number, field: keyof Budget, value: string | number) => {
    setNewBudgets((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [field]: field === 'amount' ? Number(value) : value
      }
      return updated
    })
  }

  const handleAddNewBudgetField = () => {
    setNewBudgets((prev) => [...prev, { id: '', description: '', amount: 0, allocations: [] }])
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={handleModalClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Thêm khoản ngân sách mới</h3>
        <div className={styles.budgetList}>
          {newBudgets.map((item, idx) => (
            <div key={idx} className={styles.budgetCard}>
              <input
                type='text'
                placeholder='Tên khoản (VD: Quỹ dự phòng)'
                value={item.description}
                onChange={(e) => handleNewBudgetChange(idx, 'description', e.target.value)}
                className={styles.inputField}
                autoFocus={idx === 0}
              />
              <input
                type='number'
                placeholder='Số tiền (đ)'
                value={item.amount}
                onChange={(e) => handleNewBudgetChange(idx, 'amount', e.target.value)}
                className={styles.inputField}
              />
            </div>
          ))}
        </div>
        <button
          className={styles.addMoreBtn}
          onClick={handleAddNewBudgetField}
          type='button'
          aria-label='Thêm dòng ngân sách'
        >
          ➕ Thêm dòng
        </button>
        <div className={styles.modalActions}>
          <button
            className={`${styles.saveButton} ${showSuccess ? styles.success : ''}`}
            onClick={handleModalSave}
            disabled={isSaving}
          >
            {isSaving ? 'Đang lưu...' : '💾 Lưu'}
          </button>
          <button className={styles.cancelButton} onClick={handleModalClose} disabled={isSaving}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddBudgetModal
