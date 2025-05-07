import React, { useState } from 'react'
import styles from './SetupTab.module.css'

interface SetupTabProps {
  totalBudget: number
  totalAllocated: number
  remaining: number
  budgetAllocations: any[]
  handleAllocationChange: (index: number, field: string, value: string | number, source?: string) => void
  handleAddAllocation: (category?: string) => void
  suggestedCategories: string[]
  formatCurrency: (value: number) => string
  handleMonthlyBudgetChange: (value: number) => void
  monthlyBudget: number
}

const SetupTab: React.FC<SetupTabProps> = ({
  totalBudget,
  totalAllocated,
  remaining,
  budgetAllocations,
  handleAllocationChange,
  handleAddAllocation,
  suggestedCategories,
  formatCurrency,
  handleMonthlyBudgetChange,
  monthlyBudget
}) => {
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null)

  return (
    <div className={styles.setupTab}>
      {/* Tổng ngân sách */}
      <div className={styles.section}>
        <div className={styles.budgetHeader}>
          <label className={styles.label}>Tổng ngân sách:</label>
          <input type='number' className={styles.totalInput} value={totalBudget} readOnly />
        </div>
        <div className={styles.summaryBox}>
          <span>
            📦 Đã phân bổ: <strong>{formatCurrency(totalAllocated)}</strong>
          </span>
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
      </div>

      {/* Phân bổ danh mục */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📊 Phân bổ danh mục theo tháng</h3>
        <div className={styles.allocationList}>
          {budgetAllocations.map((item, index) => {
            const percent = monthlyBudget > 0 ? Math.round((item.amount / monthlyBudget) * 100) : 0
            const warning = item.amount > monthlyBudget * 0.3
            return (
              <div key={index} className={styles.allocationCard}>
                <div className={styles.inputGroup}>
                  <label>🏷 Danh mục:</label>
                  <input
                    type='text'
                    value={item.category}
                    onChange={(e) => handleAllocationChange(index, 'category', e.target.value)}
                    placeholder='Ví dụ: Ăn uống'
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>💵 Số tiền:</label>
                  <input
                    type='number'
                    value={item.amount ? item.amount : ''}
                    onChange={(e) => {
                      const newAmount = Number(e.target.value)
                      handleAllocationChange(index, 'amount', newAmount, 'amount')

                      if (newAmount > monthlyBudget * 0.3) {
                        setAnimatedIndex(index)
                        setTimeout(() => setAnimatedIndex(null), 500)
                      }
                    }}
                    placeholder='0'
                    className={`${styles.input} ${warning ? styles.inputWarning : ''} ${
                      animatedIndex === index ? styles.animatePulse : ''
                    }`}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>📊 Tỷ lệ ngân sách (%):</label>
                  <input
                    type='number'
                    value={percent ? percent : ''}
                    onChange={(e) => handleAllocationChange(index, 'percent', e.target.value, 'percent')}
                    placeholder='0'
                  />
                </div>
              </div>
            )
          })}
        </div>
        <button className={styles.addButton} onClick={() => handleAddAllocation()}>
          + Thêm danh mục
        </button>
      </div>

      {/* Gợi ý danh mục */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>✨ Gợi ý danh mục</h3>
        <div className={styles.suggestionList}>
          {suggestedCategories.map((cat) => (
            <button
              key={cat}
              className={styles.suggestionButton}
              onClick={() => handleAddAllocation(cat)}
              title='Nhấn để thêm nhanh'
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SetupTab
