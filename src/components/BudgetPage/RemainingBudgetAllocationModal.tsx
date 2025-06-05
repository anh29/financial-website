import React from 'react'
import modalStyles from './RemainingBudgetAllocationModal.module.css'
import { AllocateSavingToGoals } from '../../types/goals'
import Log from '../common/Log/Log'

interface RemainingBudgetAllocationModalProps {
  showModal: boolean
  pendingAllocations: AllocateSavingToGoals[]
  totalAllocated: number
  finalRemainingBudget: number
  remainingBudget: number
  formatCurrency: (value: number) => string
  editingGoalId: string | null
  editValue: number | null
  editError: string | null
  onEditClick: (goalId: string, currentValue: number) => void
  onEditConfirm: (goalId: string, maxAllocatable: number) => void
  onEditCancel: () => void
  onEditValueChange: (value: number) => void
  onCancelModal: () => void
  onConfirmSave: () => void
  onEditErrorClose: () => void
  isSaving?: boolean
}

const RemainingBudgetAllocationModal: React.FC<RemainingBudgetAllocationModalProps> = ({
  showModal,
  pendingAllocations,
  totalAllocated,
  finalRemainingBudget,
  remainingBudget,
  formatCurrency,
  editingGoalId,
  editValue,
  editError,
  onEditClick,
  onEditConfirm,
  onEditCancel,
  onEditValueChange,
  onCancelModal,
  onConfirmSave,
  onEditErrorClose,
  isSaving = false
}) => {
  if (!showModal) return null

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modalContent}>
        {editError && <Log message={editError} status='error' onClose={onEditErrorClose} />}
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
            const maxAllocatable = Math.min(allocation.amount, remainingBudget - otherAllocated + allocation.allocated)
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
                        onChange={(e) => onEditValueChange(Number(e.target.value))}
                        min={0}
                        max={maxAllocatable}
                        className={isOverTarget ? modalStyles.inputWarning : ''}
                        autoFocus
                      />
                      <span className={modalStyles.currency}>đ</span>
                      <button
                        className={modalStyles.editConfirmBtn}
                        onClick={() => onEditConfirm(allocation.goal_id, maxAllocatable)}
                        title='Lưu'
                      >
                        ✔
                      </button>
                      <button className={modalStyles.editCancelBtn} onClick={onEditCancel} title='Huỷ'>
                        ✖
                      </button>
                    </>
                  ) : (
                    <>
                      <span className={modalStyles.allocatedValue}>{formatCurrency(allocation.allocated)}</span>
                      <span className={modalStyles.currency}>đ</span>
                      <button
                        className={modalStyles.editBtn}
                        onClick={() => onEditClick(allocation.goal_id, allocation.allocated)}
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
          <button className={modalStyles.cancelButton} onClick={onCancelModal} disabled={isSaving}>
            Huỷ
          </button>
          <button
            className={`${modalStyles.confirmButton} ${isSaving ? modalStyles.saving : ''}`}
            onClick={onConfirmSave}
            disabled={isSaving}
          >
            {isSaving ? (
              '⏳ Đang lưu...'
            ) : (
              <>
                <span>✔</span> Xác nhận
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RemainingBudgetAllocationModal
