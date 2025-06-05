import React, { useState, useEffect } from 'react'
import styles from './RemainingBudgetAllocation.module.css'
import { useGoal } from '../../hooks/features/useGoals'
import { AllocateSavingToGoals } from '../../types/goals'
import { LoadingSpinner } from '../common/LoadingSpinner/LoadingSpinner'
import Log from '../common/Log/Log'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import RemainingBudgetAllocationModal from './RemainingBudgetAllocationModal'
import Confetti from 'react-confetti'

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
  const [isSaving, setIsSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [pendingAllocations, setPendingAllocations] = useState<AllocateSavingToGoals[]>([])
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [log, setLog] = useState<{ message: string; status: 'success' | 'error' } | null>(null)
  const [savedAllocations, setSavedAllocations] = useState<AllocateSavingToGoals[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

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
      setIsSaving(true)
      const contributions = pendingAllocations.map((item) => ({
        ...item,
        month
      }))

      await dispatch(addGoalContributionsAsync(contributions)).unwrap()
      setLog({ message: 'Phân bổ thành công!', status: 'success' })
      setShowModal(false)
      setSavedAllocations([...pendingAllocations])
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3500)
    } catch (error) {
      console.error('Failed to save goal contributions:', error)
      setLog({ message: 'Có lỗi khi lưu phân bổ mục tiêu!', status: 'error' })
    } finally {
      setIsSaving(false)
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
    <div className={styles.remainingBudgetAllocation}>
      {showConfetti && (
        <Confetti
          numberOfPieces={220}
          recycle={false}
          style={{ zIndex: 1000, position: 'fixed', top: 0, left: 200, width: '100vw', pointerEvents: 'none' }}
        />
      )}
      {log && <Log message={log.message} status={log.status} onClose={() => setLog(null)} />}

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
        <button className={styles.allocateButton} onClick={handleAllocate} disabled={isAllocating}>
          {isAllocating ? <LoadingSpinner type='button' size={20} color='#fff' thickness={2} /> : 'Phân bổ ngân sách'}
        </button>
      )}

      <RemainingBudgetAllocationModal
        showModal={showModal}
        pendingAllocations={pendingAllocations}
        totalAllocated={totalAllocated}
        finalRemainingBudget={finalRemainingBudget}
        remainingBudget={remainingBudget}
        formatCurrency={formatCurrency}
        editingGoalId={editingGoalId}
        editValue={editValue}
        editError={editError}
        onEditClick={handleEditClick}
        onEditConfirm={handleEditConfirm}
        onEditCancel={handleEditCancel}
        onEditValueChange={setEditValue}
        onCancelModal={handleCancelModal}
        onConfirmSave={handleConfirmSave}
        onEditErrorClose={() => setEditError(null)}
        isSaving={isSaving}
      />
    </div>
  )
}

export default RemainingBudgetAllocation
