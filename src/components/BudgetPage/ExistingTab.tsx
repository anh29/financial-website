import React, { useState, useEffect } from 'react'
import styles from './ExistingTab.module.css'
import { Budget } from '../../types/budgets'
import { createBudget } from '../../services/features/budgetService'

interface ExistingTabProps {
  income: Budget | null
  existingBudgets: Budget[]
}

// Simple category mapping for demo
const getCategoryClassAndIcon = (desc: string) => {
  const d = desc.toLowerCase()
  if (d.includes('tích lũy') || d.includes('tiết kiệm') || d.includes('quỹ'))
    return { cls: styles['budgetCard--savings'], icon: '💰' }
  if (d.includes('ăn') || d.includes('uống') || d.includes('food'))
    return { cls: styles['budgetCard--food'], icon: '🍔' }
  if (d.includes('đầu tư') || d.includes('investment')) return { cls: styles['budgetCard--investment'], icon: '📈' }
  if (d.includes('nợ') || d.includes('cọc')) return { cls: styles['budgetCard--debt'], icon: '💸' }
  return { cls: styles['budgetCard--other'], icon: '🗂️' }
}

const ExistingTab: React.FC<ExistingTabProps> = ({ income, existingBudgets }) => {
  const incomeAndBudgets = income ? [income, ...existingBudgets] : existingBudgets
  const [budget, setBudget] = useState<Budget[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newBudgets, setNewBudgets] = useState<Budget[]>([{ id: '', description: '', amount: 0, allocations: [] }])
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastAddedCount, setLastAddedCount] = useState(0)
  const [animateCards, setAnimateCards] = useState(false)

  useEffect(() => {
    // Trigger animation after component mount
    setAnimateCards(true)
  }, [])

  const handleAdd = () => {
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setNewBudgets([{ id: '', description: '', amount: 0, allocations: [] }])
  }

  const handleModalSave = async () => {
    setIsSaving(true)
    try {
      await createBudget(newBudgets)
      setBudget((prev) => [...prev, ...newBudgets])
      setLastAddedCount(newBudgets.length)
      setShowSuccess(true)
      setShowModal(false)
      setNewBudgets([{ id: '', description: '', amount: 0, allocations: [] }])
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

  // --- UI rendering ---
  // Total budget calculation
  const totalBudget = incomeAndBudgets.reduce((sum, b) => sum + (b.amount || 0), 0)

  const renderBudgets = (budget: Budget[], highlightLastN = 0) => {
    return (
      <div className={styles.budgetList}>
        {budget.map((item, index) => {
          if (index === 0 && income) return null // skip income, shown in total card
          const { cls, icon } = getCategoryClassAndIcon(item.description)
          return (
            <div
              key={index}
              className={`${styles.budgetCard} ${cls} ${
                highlightLastN > 0 && index >= budget.length - highlightLastN ? styles.new : ''
              } ${animateCards ? styles.animate : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.budgetIcon}>{icon}</div>
              <div className={styles.budgetInfo}>
                <div className={styles.budgetName}>{item.description}</div>
                <div className={styles.budgetAmount}>{item.amount.toLocaleString()} đ</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={styles.existingTab}>
      {/* Header */}
      <h3 className={styles.sectionTitle}>Ngân sách hiện có</h3>

      {/* Total budget card */}
      <div className={styles.totalBudgetCard}>
        <span className={styles.totalBudgetIcon}>💰</span>
        <div className={styles.totalBudgetInfo}>
          <span className={styles.totalBudgetLabel}>Tổng ngân sách</span>
          <span className={styles['budgetAmount--large']}>{totalBudget.toLocaleString()} đ</span>
        </div>
      </div>

      {/* Existing Budgets Section */}
      <div className={styles.section}>
        <h4 className={styles.subSectionTitle}>📂 Danh sách ngân sách hiện có</h4>
        {incomeAndBudgets.length > 0 ? (
          renderBudgets(incomeAndBudgets)
        ) : (
          <p className={styles.emptyMessage}>Chưa có ngân sách nào được tạo.</p>
        )}
      </div>

      {/* New Budgets Section */}
      {budget.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.subSectionTitle}>✨ Ngân sách vừa thêm</h4>
          {renderBudgets(budget, lastAddedCount)}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        className={styles.fab}
        onClick={handleAdd}
        aria-label='Thêm khoản ngân sách mới'
        title='Thêm khoản ngân sách mới'
      >
        +
      </button>

      {/* Modal for adding new budget */}
      {showModal && (
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
      )}
    </div>
  )
}

export default ExistingTab
