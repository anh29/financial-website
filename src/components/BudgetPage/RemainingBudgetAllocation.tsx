import React, { useState, useEffect } from 'react'
import styles from './RemainingBudgetAllocation.module.css'
import modalStyles from './RemainingBudgetAllocationModal.module.css'
import { useGoal } from '../../hooks/features/useGoals'
import { AllocateSavingToGoals } from '../../types/goals'
import { LoadingSpinner } from '../common/LoadingSpinner/LoadingSpinner'
import Log from '../common/Log/Log'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'

interface RemainingBudgetAllocationProps {
  remainingBudget: number
  formatCurrency: (value: number) => string
  month: string
}

const RemainingBudgetAllocation: React.FC<RemainingBudgetAllocationProps> = ({
  remainingBudget,
  formatCurrency,
  month
}) => {
  const { allocateSavingToGoalsHandler, allocateSavingToGoals, addGoalContributionsAsync } = useGoal()
  const dispatch = useDispatch<AppDispatch>()
  const [isAllocating, setIsAllocating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [pendingAllocations, setPendingAllocations] = useState<AllocateSavingToGoals[]>([])
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [log, setLog] = useState<{ message: string; status: 'success' | 'error' } | null>(null)
  const [savedAllocations, setSavedAllocations] = useState<AllocateSavingToGoals[]>([])

  const handleAllocate = async () => {
    try {
      setIsAllocating(true)
      await allocateSavingToGoalsHandler(remainingBudget)
    } catch (error) {
      console.error('Failed to allocate remaining budget:', error)
    } finally {
      setIsAllocating(false)
    }
  }

  useEffect(() => {
    if (isAllocating) return // Wait until loading is done
    if (allocateSavingToGoals && allocateSavingToGoals.length > 0) {
      setPendingAllocations(allocateSavingToGoals)
      setShowModal(true)
    }
  }, [allocateSavingToGoals, isAllocating])

  const handleConfirmSave = async () => {
    try {
      const contributions = pendingAllocations.map((item) => ({
        ...item,
        month
      }))

      await dispatch(addGoalContributionsAsync(contributions)).unwrap()
      setLog({ message: 'Phân bổ thành công!', status: 'success' })
      setShowModal(false)
      setSavedAllocations([...pendingAllocations])
    } catch (error) {
      console.error('Failed to save goal contributions:', error)
      setLog({ message: 'Có lỗi khi lưu phân bổ mục tiêu!', status: 'error' })
    }
  }

  const handleCancelModal = () => {
    setShowModal(false)
  }

  const handleAllocationChange = (goalId: string, newAmount: number) => {
    setPendingAllocations((prev) =>
      prev.map((allocation) => (allocation.goal_id === goalId ? { ...allocation, allocated: newAmount } : allocation))
    )
  }

  const handleEditClick = (goalId: string, currentValue: number) => {
    setEditingGoalId(goalId)
    setEditValue(currentValue)
  }

  const handleEditConfirm = (goalId: string, maxAllocatable: number) => {
    if (editValue !== null && editValue > maxAllocatable) {
      setEditError('Số tiền phân bổ vượt quá số dư còn lại cho phép!')
      return
    }
    if (editValue !== null) {
      handleAllocationChange(goalId, editValue)
    }
    setEditingGoalId(null)
    setEditValue(null)
  }

  const handleEditCancel = () => {
    setEditingGoalId(null)
    setEditValue(null)
  }

  const totalAllocated = savedAllocations.reduce((sum, item) => sum + item.allocated, 0)
  const finalRemainingBudget = remainingBudget - totalAllocated

  return (
    <div className={styles.section}>
      {log && <Log message={log.message} status={log.status} onClose={() => setLog(null)} />}
      <div className={styles.sectionTitle}>
        <span>🎯 Phân bổ ngân sách còn lại vào mục tiêu</span>
        <div className={styles.remainingAmount}>
          <span>Còn lại:</span>
          <span className={styles.amount}>{formatCurrency(finalRemainingBudget)}</span>
        </div>
      </div>

      {/* Show just-saved allocations */}
      {savedAllocations.length > 0 && (
        <div className={styles.allocationsContainer} style={{ marginBottom: 24 }}>
          <div className={styles.allocationsList}>
            <h3 style={{ margin: '0 0 8px 0', color: '#00a374' }}>Phân bổ vừa lưu:</h3>
            {savedAllocations.map((allocation) => {
              const progress = (allocation.allocated / allocation.amount) * 100
              return (
                <div key={allocation.goal_id} className={styles.allocationItem}>
                  <div className={styles.goalInfo}>
                    <div className={styles.goalHeader}>
                      <span className={styles.goalName}>{allocation.description}</span>
                      <span className={styles.goalTarget}>Mục tiêu: {formatCurrency(allocation.amount)}</span>
                    </div>
                    <div className={styles.progressBarRow}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                      <span className={styles.progressBadge}>{progress.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className={styles.allocationInput}>
                    <span className={styles.allocatedValue}>{formatCurrency(allocation.allocated)}</span>
                    <span className={styles.currency}>đ</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {finalRemainingBudget > 0 && (
        <div className={styles.allocateSection}>
          <p className={styles.allocateDescription}>
            Bạn có thể phân bổ số tiền còn lại từ tháng trước vào các mục tiêu tiết kiệm của mình. Hệ thống sẽ tự động
            tính toán và đề xuất cách phân bổ tối ưu.
          </p>
          <button className={styles.allocateButton} onClick={handleAllocate} disabled={isAllocating}>
            {isAllocating ? <LoadingSpinner type='button' size={20} color='#fff' thickness={2} /> : 'Phân bổ ngân sách'}
          </button>
        </div>
      )}

      {/* Modal for allocation review and confirmation */}
      {showModal && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            {editError && <Log message={editError} status='error' onClose={() => setEditError(null)} />}
            <div className={modalStyles.modalHeader}>
              <span className={modalStyles.modalHeaderIcon}>🎯</span>
              <span>Xác nhận phân bổ ngân sách</span>
            </div>
            <div className={modalStyles.modalSummary}>
              <span>
                Tổng đã phân bổ: <span className={modalStyles.modalSummaryValue}>{formatCurrency(totalAllocated)}</span>
              </span>
              <span>
                Còn lại: <span className={modalStyles.modalSummaryValue}>{formatCurrency(finalRemainingBudget)}</span>
              </span>
            </div>
            <div className={modalStyles.modalList}>
              {pendingAllocations.map((allocation) => {
                const progress = (allocation.allocated / allocation.amount) * 100
                const isOverTarget = allocation.allocated > allocation.amount
                const otherAllocated = pendingAllocations
                  .filter((a) => a.goal_id !== allocation.goal_id)
                  .reduce((sum, a) => sum + a.allocated, 0)
                const maxAllocatable = Math.min(
                  allocation.amount,
                  remainingBudget - otherAllocated + allocation.allocated
                )
                return (
                  <div key={allocation.goal_id} className={modalStyles.modalItem}>
                    <div className={modalStyles.goalInfo}>
                      <div className={modalStyles.goalHeader}>
                        <span className={modalStyles.goalName}>{allocation.description}</span>
                        <span className={modalStyles.goalTarget}>Mục tiêu: {formatCurrency(allocation.amount)}</span>
                      </div>
                      <div className={modalStyles.progressBarRow}>
                        <div className={modalStyles.progressBar}>
                          <div
                            className={`${modalStyles.progressFill} ${isOverTarget ? modalStyles.overTarget : ''}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <span className={modalStyles.progressBadge}>{progress.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className={modalStyles.allocationInput}>
                      {editingGoalId === allocation.goal_id ? (
                        <>
                          <input
                            type='number'
                            value={editValue ?? allocation.allocated}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            min={0}
                            max={maxAllocatable}
                            className={isOverTarget ? modalStyles.inputWarning : ''}
                            autoFocus
                          />
                          <span className={modalStyles.currency}>đ</span>
                          <button
                            className={modalStyles.editConfirmBtn}
                            onClick={() => handleEditConfirm(allocation.goal_id, maxAllocatable)}
                            title='Lưu'
                          >
                            ✔
                          </button>
                          <button className={modalStyles.editCancelBtn} onClick={handleEditCancel} title='Huỷ'>
                            ✖
                          </button>
                        </>
                      ) : (
                        <>
                          <span className={modalStyles.allocatedValue}>{formatCurrency(allocation.allocated)}</span>
                          <span className={modalStyles.currency}>đ</span>
                          <button
                            className={modalStyles.editBtn}
                            onClick={() => handleEditClick(allocation.goal_id, allocation.allocated)}
                            title='Chỉnh sửa'
                          >
                            ✏️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={modalStyles.modalActions}>
              <button className={modalStyles.cancelButton} onClick={handleCancelModal}>
                Huỷ
              </button>
              <button className={modalStyles.confirmButton} onClick={handleConfirmSave}>
                <span>✔</span> Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RemainingBudgetAllocation
