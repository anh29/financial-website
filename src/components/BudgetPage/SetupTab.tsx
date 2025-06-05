import React, { useState, useEffect } from 'react'
import { BudgetAllocation, RemainingBudget } from '../../types/budgets'
import styles from './SetupTab.module.css'
import RemainingBudgetAllocation from './RemainingBudgetAllocation'
import Confetti from 'react-confetti'
import Log from '../common/Log/Log'
import { createMonthlyBudget } from '../../services/features/budgetService'

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
  remainingBudget: RemainingBudget | null
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
  remainingMonthlyBudget,
  remainingBudget
}) => {
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null)
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([])
  const [showCategoryManagement, setShowCategoryManagement] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [log, setLog] = useState<{ message: string; status: 'success' | 'error' } | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (remainingBudget && remainingBudget.remainingBudget <= 0) {
      setShowConfetti(true)
      setLog({ message: 'Không có ngân sách còn lại từ tháng trước!', status: 'success' })
      const timer = setTimeout(() => setShowConfetti(false), 3500)
      return () => clearTimeout(timer)
    }
  }, [remainingBudget])

  const handleSaveMonthlyBudget = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)
      await createMonthlyBudget([
        {
          month: currentMonth,
          amount: monthlyBudget
        }
      ])
      setLog({ message: 'Đã lưu ngân sách tháng thành công!', status: 'success' })
    } catch {
      setLog({ message: 'Không thể lưu ngân sách tháng!', status: 'error' })
    }
  }

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

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await handleSaveBudget(allocations)
      setAllocations([])
    } catch (error) {
      console.error('Error saving budget:', error)
    } finally {
      setIsSaving(false)
    }
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
            value={item.description || ''}
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
            value={item.amount !== undefined ? item.amount : ''}
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
            value={percent !== undefined ? percent : ''}
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
    <div className={styles.setupTab}>
      {showConfetti && (
        <Confetti
          numberOfPieces={220}
          recycle={false}
          style={{ zIndex: 1000, position: 'fixed', top: 0, left: 200, width: '100vw', pointerEvents: 'none' }}
        />
      )}
      {log && <Log message={log.message} status={log.status} onClose={() => setLog(null)} />}

      {/* Tổng ngân sách */}
      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>💰</div>
        <div className={styles.infoContent}>
          <span className={styles.infoLabel}>Tổng ngân sách:</span>
          <span className={styles.infoValue}>{formatCurrency(totalBudget)}</span>
        </div>
        <div className={styles.infoStatus} style={{ color: remaining < 0 ? '#e74c3c' : '#2ecc71' }}>
          {remaining < 0
            ? `⚠ Thiếu: ${formatCurrency(Math.abs(remaining))}`
            : `🟢 Còn lại: ${formatCurrency(remaining)}`}
        </div>
      </div>
      <div className={styles.divider} />

      {/* Section 1: Monthly Budget Allocation */}
      <div className={styles.cardSection}>
        <div className={styles.cardHeaderRow}>
          <div className={styles.headerLeft}>
            <span className={styles.cardIcon}>📅</span>
            <h2 className={styles.cardTitle}>Phân bổ ngân sách tháng này</h2>
          </div>
          <div className={styles.inlineInputGroup}>
            <label className={styles.label} htmlFor='monthlyBudgetInput'>
              Ngân sách tháng:
            </label>
            <div className={styles.inputWithIcon}>
              <input
                id='monthlyBudgetInput'
                type='number'
                className={styles.totalInput}
                value={monthlyBudget}
                onChange={(e) => handleMonthlyBudgetChange(Number(e.target.value))}
              />
              <button className={styles.saveIconButton} onClick={handleSaveMonthlyBudget} title='Lưu ngân sách tháng'>
                💾
              </button>
            </div>
          </div>
        </div>
        <div className={styles.progressGroup}>
          <div className={styles.progressBarLarge}>
            <div
              className={styles.progressFillLarge}
              style={{
                width: `${Math.min(100, (totalAllocated / monthlyBudget) * 100)}%`,
                backgroundColor: totalAllocated > monthlyBudget ? '#e74c3c' : '#2ecc71'
              }}
            />
            <span className={styles.progressAllocatedLabel}>
              <span className={styles.progressBadgeIcon}>📦</span>
              {formatCurrency(totalAllocated)}
              {` (${Math.round((totalAllocated / monthlyBudget) * 100)}%)`}
            </span>
            <span className={styles.progressRemainingLabel}>
              <span className={styles.progressBadgeIcon} style={{ color: '#00c48c' }}>
                🟢
              </span>
              {formatCurrency(Math.abs(remainingMonthlyBudget))}
              {` (${Math.round((Math.abs(remainingMonthlyBudget) / monthlyBudget) * 100)}%)`}
            </span>
          </div>
          <div className={styles.progressLabelsLarge}>
            <span>0đ</span>
            <span>{formatCurrency(monthlyBudget)}</span>
          </div>
        </div>
        {remainingMonthlyBudget < 0 && (
          <div className={styles.warningMessage}>
            ⚠️ Cảnh báo: Ngân sách đã vượt quá {formatCurrency(Math.abs(remainingMonthlyBudget))} so với dự kiến
          </div>
        )}
      </div>

      {/* Section 2: Previous Month's Remaining Budget Allocation */}
      {remainingBudget && remainingBudget.remainingBudget > 0 && (
        <div className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleRow}>
              <span className={styles.cardIcon}>🎯</span>
              <h2 className={styles.cardTitle}>Phân bổ ngân sách còn lại từ tháng trước vào mục tiêu</h2>
            </div>
            <div className={styles.remainingBox}>
              <span className={styles.remainingLabel}>Còn lại:</span>
              <span className={styles.remainingValue}>{formatCurrency(remainingBudget.remainingBudget)}</span>
            </div>
          </div>
          <div className={styles.remainingDesc}>
            Bạn có thể phân bổ số tiền còn lại từ tháng trước vào các mục tiêu tiết kiệm của mình. Hệ thống sẽ tự động
            tính toán và đề xuất cách phân bổ tối ưu.
          </div>
          <RemainingBudgetAllocation
            remainingBudget={remainingBudget.remainingBudget}
            formatCurrency={formatCurrency}
            month={remainingBudget.month}
          />
        </div>
      )}

      {/* Collapsible Category Management Section */}
      <div className={styles.cardSection}>
        <button className={styles.collapseToggle} onClick={() => setShowCategoryManagement((prev) => !prev)}>
          {showCategoryManagement ? 'Ẩn quản lý danh mục ▲' : 'Quản lý danh mục ▼'}
        </button>
        {showCategoryManagement && (
          <div className={styles.categoryManagement}>
            {/* Tạo mới danh mục */}
            <h3 className={styles.sectionTitle}>➕ Tạo mới danh mục</h3>
            <div className={styles.list}>
              {allocations.map((item, index) => renderAllocationCard(item, index, true))}
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.addButton} onClick={() => handleAdd()}>
                + Thêm danh mục
              </button>
              <button 
                className={`${styles.saveButton} ${isSaving ? styles.saving : ''}`} 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? '⏳ Đang lưu...' : '💾 Lưu ngân sách'}
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

            {/* Phân bổ danh mục theo tháng */}
            <h3 className={styles.sectionTitle}>📊 Phân bổ danh mục theo tháng</h3>
            <div className={styles.allocationList}>
              {budgetAllocations && budgetAllocations.map((item, index) => renderAllocationCard(item, index, false))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SetupTab
