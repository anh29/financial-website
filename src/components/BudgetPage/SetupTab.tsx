import React, { useState, useEffect } from 'react'
import { BudgetAllocation, RemainingBudget, SuggestedBudget } from '../../types/budgets'
import styles from './SetupTab.module.css'
import RemainingBudgetAllocation from './RemainingBudgetAllocation'
import Confetti from 'react-confetti'
import Log from '../common/Log/Log'
import { Modal } from '../common/Modal/Modal'
import { createMonthlyBudget } from '../../services/features/budgetService'
import { formatCurrency } from '../../utils/helpers'

interface SetupTabProps {
  totalBudget: number
  totalAllocated: number
  remaining: number
  budgetAllocations: BudgetAllocation[]
  suggestedCategories: string[]
  handleMonthlyBudgetChange: (value: number) => void
  monthlyBudget: number
  handleSaveBudget: (newAllocation: BudgetAllocation[]) => void
  isBudgetSaved: boolean
  savings: number
  handleSavingsChange: (value: number) => void
  remainingMonthlyBudget: number
  remainingBudget: RemainingBudget | null
  suggestedBudget: SuggestedBudget | null
  handleSuggestSmartBudget: () => void
}

const SetupTab: React.FC<SetupTabProps> = ({
  totalBudget,
  totalAllocated,
  remaining,
  budgetAllocations,
  suggestedCategories,
  monthlyBudget,
  handleSaveBudget,
  isBudgetSaved,
  remainingMonthlyBudget,
  remainingBudget,
  suggestedBudget,
  handleSuggestSmartBudget
}) => {
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null)
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([])
  const [showCategoryManagement, setShowCategoryManagement] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [log, setLog] = useState<{ message: string; status: 'success' | 'error' } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [suggestionApplied, setSuggestionApplied] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingSave, setPendingSave] = useState<BudgetAllocation[] | null>(null)

  useEffect(() => {
    if (remainingBudget && remainingBudget.remainingBudget <= 0) {
      setShowConfetti(true)
      setLog({ message: 'Không có ngân sách còn lại từ tháng trước!', status: 'success' })
      const timer = setTimeout(() => setShowConfetti(false), 3500)
      return () => clearTimeout(timer)
    }
  }, [remainingBudget])

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

  const handleApplySuggestion = () => {
    if (suggestedBudget) {
      const newAllocations = suggestedBudget.categories.map((cat) => ({
        monthly_budget_id: '',
        description: cat.category,
        amount: cat.amount
      }))
      setAllocations(newAllocations)
      setPendingSave([...newAllocations])
      setShowConfirmModal(true)
      setShowCategoryManagement(false)
      setLog({ message: 'Đã áp dụng gợi ý phân bổ!', status: 'success' })
    }
  }

  const handleSuggestClick = async () => {
    setIsSuggesting(true)
    try {
      await handleSuggestSmartBudget()
    } finally {
      setIsSuggesting(false)
    }
  }

  const computedMonthlyBudget = allocations.reduce((sum, a) => sum + (a.amount || 0), 0)

  const handleSaveClick = () => {
    setPendingSave([...allocations])
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    setIsSaving(true)
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)
      await createMonthlyBudget([
        {
          month: currentMonth,
          amount: computedMonthlyBudget
        }
      ])
      await handleSaveBudget(allocations)
      setAllocations([])
      setLog({ message: 'Đã lưu ngân sách và phân bổ thành công!', status: 'success' })
      setShowConfirmModal(false)
      setSuggestionApplied(false)
    } catch (error) {
      setLog({ message: 'Lỗi khi lưu ngân sách!', status: 'error' })
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
          <select
            className={styles.inputField}
            value={item.description}
            onChange={(e) => isEditable && handleAllocationChange(index, 'description', e.target.value)}
          >
            <option value=''>Chọn danh mục</option>
            {suggestedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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
            : `🟢 Còn lại: ${formatCurrency(totalBudget - totalAllocated)}`}
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
            <label className={styles.label}>Ngân sách tháng (tự động):</label>
            <div className={styles.inputWithIcon}>
              <input
                type='number'
                className={styles.totalInput}
                value={computedMonthlyBudget}
                readOnly
                style={{ background: '#f3f4f6', color: '#374151', fontWeight: 600 }}
              />
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

      {/* Gợi ý phân bổ thông minh */}
      {!suggestedBudget && (
        <div className={styles.cardSection} style={{ textAlign: 'center' }}>
          <button className={styles.saveButton} onClick={handleSuggestClick} disabled={isSuggesting}>
            {isSuggesting ? '⏳ Đang gợi ý...' : '✨ Gợi ý phân bổ thông minh'}
          </button>
        </div>
      )}

      {/* Nếu có suggestedBudget, hiển thị card gợi ý */}
      {suggestedBudget && !suggestionApplied && (
        <div className={styles.cardSection} style={{ background: '#f8fafc', border: '1px solid #e0e7ef' }}>
          <h3 className={styles.sectionTitle}>✨ Gợi ý phân bổ ngân sách</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {suggestedBudget.categories.map((cat) => (
              <li key={cat.category} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>{cat.category}</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(cat.amount)}</span>
              </li>
            ))}
          </ul>
          {suggestedBudget.reasoning && (
            <div style={{ fontStyle: 'italic', color: '#6b7280', margin: '12px 0' }}>{suggestedBudget.reasoning}</div>
          )}
          <button className={styles.saveButton} onClick={handleApplySuggestion}>
            Áp dụng gợi ý
          </button>
        </div>
      )}

      {/* Nếu đã áp dụng gợi ý, hiển thị allocations chỉ đọc, cho phép chỉnh sửa lại nếu muốn */}
      {suggestionApplied && (
        <div className={styles.cardSection}>
          <h3 className={styles.sectionTitle}>📊 Phân bổ theo gợi ý</h3>
          <div className={styles.allocationList}>
            {allocations.map((item, index) => renderAllocationCard(item, index, true))}
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.saveButton} ${isSaving ? styles.saving : ''}`}
              onClick={handleSaveClick}
              disabled={isSaving}
            >
              {isSaving ? '⏳ Đang lưu...' : '💾 Lưu ngân sách'}
            </button>
          </div>
          {isBudgetSaved && <p className={styles.saveConfirmation}>✅ Ngân sách đã được lưu thành công!</p>}
        </div>
      )}

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
          <RemainingBudgetAllocation remainingBudget={remainingBudget.remainingBudget} month={remainingBudget.month} />
        </div>
      )}

      {/* Collapsible Category Management Section - chỉ hiển thị nếu chưa áp dụng gợi ý */}
      {!suggestionApplied && (
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
                  onClick={handleSaveClick}
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
      )}

      {/* Modal xác nhận lưu ngân sách và phân bổ */}
      {showConfirmModal && pendingSave && (
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title='📋 Xác nhận ngân sách tháng'
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{
                  padding: '8px 20px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  fontWeight: 500,
                  color: '#334155',
                  cursor: 'pointer'
                }}
                onClick={() => setShowConfirmModal(false)}
              >
                Huỷ
              </button>
              <button
                style={{
                  padding: '8px 20px',
                  background: 'var(--primary-color)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={handleConfirmSave}
              >
                ✅ Xác nhận & Lưu
              </button>
            </div>
          }
        >
          <div style={{ padding: '8px 4px', fontSize: '0.95rem' }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Tổng ngân sách tháng</p>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#10b981' }}>
                {formatCurrency(computedMonthlyBudget)}
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Chi tiết phân bổ</p>
            </div>

            <div
              style={{
                background: '#f9fafb',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '12px 16px',
                maxHeight: 300,
                overflowY: 'auto'
              }}
            >
              {pendingSave.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: index !== pendingSave.length - 1 ? '1px dashed #e5e7eb' : 'none',
                    fontSize: '0.95rem',
                    color: '#1e293b'
                  }}
                >
                  <span>{item.description}</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SetupTab
