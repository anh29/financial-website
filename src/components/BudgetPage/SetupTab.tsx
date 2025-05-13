import React, { useState } from 'react'
import { BudgetAllocation } from '../../types'
import styles from './SectionTab.module.css'

interface SetupTabProps {
  totalBudget: number
  totalAllocated: number
  remaining: number
  budgetAllocations: BudgetAllocation[]
  suggestedCategories: string[]
  formatCurrency: (value: number) => string
  handleMonthlyBudgetChange: (value: number) => void
  monthlyBudget: number
  handleSaveBudget: (newAllocation: BudgetAllocation[]) => void
  isBudgetSaved: boolean
  savings: number
  handleSavingsChange: (value: number) => void
  remainingMonthlyBudget: number
}

const SetupTab: React.FC<SetupTabProps> = ({
  totalBudget,
  totalAllocated,
  remaining,
  budgetAllocations,
  suggestedCategories,
  formatCurrency,
  handleMonthlyBudgetChange,
  monthlyBudget,
  handleSaveBudget,
  isBudgetSaved,
  remainingMonthlyBudget
}) => {
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null)
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([])

  const handleAdd = (description?: string) => {
    const newAllocation: BudgetAllocation = {
      monthly_budget_id: '',
      description: description || '',
      amount: 0
    }
    setAllocations((prev) => [...prev, newAllocation])
  }

  const handleAllocationChange = (index: number, field: keyof BudgetAllocation, value: string | number) => {
    const updated = [...allocations]
    if (field === 'amount') {
      updated[index].amount = Number(value)
    } else if (field === 'percent') {
      const percent = Number(value)
      updated[index].percent = percent
      updated[index].amount = Math.round((monthlyBudget * percent) / 100)
    } else {
      updated[index][field] = value
    }
    setAllocations(updated)
  }

  const handleSave = () => {
    handleSaveBudget(allocations)
    setAllocations([])
  }

  const renderAllocationCard = (item: BudgetAllocation, index: number, isEditable: boolean) => {
    const percent = monthlyBudget > 0 ? Math.round((item.amount / monthlyBudget) * 100) : 0
    const warning = item.amount > monthlyBudget * 0.3

    return (
      <div key={index} className={`${styles.allocationCard} ${warning ? styles.warningCard : ''}`}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>🏷 Mô tả:</label>
          <input
            type='text'
            value={item.description}
            onChange={(e) => isEditable && handleAllocationChange(index, 'description', e.target.value)}
            placeholder='Ví dụ: Ăn uống'
            className={styles.inputField}
            readOnly={!isEditable}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>💵 Số tiền:</label>
          <input
            type='number'
            value={item.amount || ''}
            onChange={(e) => {
              if (isEditable) {
                const newAmount = Number(e.target.value)
                handleAllocationChange(index, 'amount', newAmount)

                if (newAmount > monthlyBudget * 0.3) {
                  setAnimatedIndex(index)
                  setTimeout(() => setAnimatedIndex(null), 500)
                }
              }
            }}
            placeholder='0'
            className={`${styles.inputField} ${warning ? styles.inputWarning : ''} ${
              animatedIndex === index ? styles.animatePulse : ''
            }`}
            readOnly={!isEditable}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>📊 Tỷ lệ ngân sách (%):</label>
          <input
            type='number'
            value={percent || ''}
            onChange={(e) => isEditable && handleAllocationChange(index, 'percent', e.target.value)}
            placeholder='0'
            className={styles.inputField}
            readOnly={!isEditable}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.sectionTab}>
      {/* Tổng ngân sách */}
      <div className={styles.section}>
        <div className={styles.budgetHeader}>
          <label className={styles.label}>Tổng ngân sách:</label>
          <input type='number' className={styles.totalInput} value={totalBudget} readOnly />
        </div>
        <div className={styles.summaryBox}>
          <span style={{ color: remaining < 0 ? '#e74c3c' : '#2ecc71' }}>
            {remaining < 0
              ? `⚠ Thiếu: ${formatCurrency(Math.abs(remaining))}`
              : `🟢 Còn lại: ${formatCurrency(remaining)}`}
          </span>
        </div>
      </div>

      {/* Ngân sách tháng hiện tại */}
      <div className={styles.section}>
        <label className={styles.label}>Ngân sách dự định chi tiêu trong tháng:</label>
        <input
          type='number'
          className={styles.monthlyInput}
          value={monthlyBudget}
          onChange={(e) => handleMonthlyBudgetChange(Number(e.target.value))}
        />
        <div className={styles.summaryBox}>
          <span>
            📦 Đã phân bổ: <strong>{formatCurrency(totalAllocated)}</strong>
          </span>
          <span style={{ color: remainingMonthlyBudget < 0 ? '#e74c3c' : '#2ecc71' }}>
            {remainingMonthlyBudget < 0
              ? `⚠ Thiếu: ${formatCurrency(Math.abs(remainingMonthlyBudget))}`
              : `🟢 Còn lại: ${formatCurrency(remainingMonthlyBudget)}`}
          </span>
        </div>
      </div>

      {/* Tạo mới */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>➕ Tạo mới danh mục</h3>
        <div className={styles.list}>{allocations.map((item, index) => renderAllocationCard(item, index, true))}</div>
        <div className={styles.buttonGroup}>
          <button className={styles.addButton} onClick={() => handleAdd()}>
            + Thêm danh mục
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            💾 Lưu ngân sách
          </button>
        </div>
        {isBudgetSaved && <p className={styles.saveConfirmation}>✅ Ngân sách đã được lưu thành công!</p>}

        {/* Gợi ý danh mục */}
        <div className={styles.subSection}>
          <h3 className={styles.subSectionTitle}>✨ Gợi ý danh mục</h3>
          <div className={styles.suggestionList}>
            {suggestedCategories.map((cat) => (
              <button
                key={cat}
                className={styles.suggestionButton}
                onClick={() => handleAdd(cat)}
                title='Nhấn để thêm nhanh'
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phân bổ danh mục */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📊 Phân bổ danh mục theo tháng</h3>
        <div className={styles.allocationList}>
          {budgetAllocations.map((item, index) => renderAllocationCard(item, index, false))}
        </div>
      </div>
    </div>
  )
}

export default SetupTab
