import React, { useState } from 'react'
import styles from './SectionTab.module.css'
import { Budget } from '../../types'

interface ExistingTabProps {
  income: Budget | null
  existingBudgets: Budget[]
  handleSaveExisting: (newBudget: Budget[]) => void
}

const ExistingTab: React.FC<ExistingTabProps> = ({ income, existingBudgets, handleSaveExisting }) => {
  const incomeAndBudgets = income ? [income, ...existingBudgets] : existingBudgets
  const [budget, setBudget] = useState<Budget[]>([])

  const handleAdd = () => {
    const newBudget: Budget = {
      id: '',
      description: '',
      amount: 0,
      allocations: []
    }
    setBudget((prev) => [...prev, newBudget])
  }

  const handleSave = () => {
    handleSaveExisting(budget)
    setBudget([])
  }

  const handleExistingChange = (index: number, field: keyof Budget, value: string | number) => {
    const updated = [...budget]
    updated[index] = {
      ...updated[index],
      [field]: field === 'amount' ? Number(value) : value
    }
    setBudget(updated)
  }

  const renderBudgets = (budget: Budget[]) => {
    return (
      <div className={styles.budgetList}>
        {budget.map((item, index) => (
          <div key={index} className={styles.budgetCard}>
            <input
              type='text'
              placeholder='Tên khoản (VD: Quỹ dự phòng)'
              value={item.description}
              onChange={(e) => handleExistingChange(index, 'description', e.target.value)}
              className={styles.inputField}
            />
            <input
              type='number'
              placeholder='Số tiền (đ)'
              value={item.amount}
              onChange={(e) => handleExistingChange(index, 'amount', e.target.value)}
              className={styles.inputField}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.sectionTab}>
      <h3 className={styles.sectionTitle}>💼 Ngân sách hiện có</h3>

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
      <div className={styles.section}>
        <h4 className={styles.subSectionTitle}>✨ Tạo mới ngân sách</h4>
        {budget.length > 0 && renderBudgets(budget)}
        <div className={styles.buttonGroup}>
          <button className={styles.addButton} onClick={handleAdd}>
            + Thêm khoản ngân sách
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            💾 Lưu ngân sách
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExistingTab
