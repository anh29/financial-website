import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiBook, FiGlobe, FiTarget, FiTrendingUp, FiPlus } from 'react-icons/fi'
import { useGoal } from '../../hooks/features/useGoals'
import Confetti from 'react-confetti'
import styles from './GoalPage.module.css'
import { HeroBanner } from '../../components/GoalPage/HeroBanner'
import { StatusTabs } from '../../components/GoalPage/StatusTabs'
import { StatsRow } from '../../components/GoalPage/StatsRow'
import { GoalCard } from '../../components/GoalPage/GoalCard'
import { EmptyState } from '../../components/GoalPage/EmptyState'
import { FloatingActionButton } from '../../components/common/FloatingActionButton/FloatingActionButton'
import CreateGoalModal from '../../components/GoalPage/CreateGoalModal'
import { Goals } from '../../types/goals'
import Log from '../../components/common/Log/Log'
import { formatCurrency, formatDate } from '../../utils/helpers'

const goalIcons = [<FiHome />, <FiBook />, <FiGlobe />, <FiTarget />, <FiTrendingUp />]

const GoalPage = () => {
  const { goals, getGoals, addGoal, cancelGoal } = useGoal()
  const [activeTab, setActiveTab] = useState('active')
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    getGoals()
  }, [getGoals])

  useEffect(() => {
    if (activeTab === 'completed' && filteredGoals.length > 0) {
      setShowConfetti(true)
      const timeout = setTimeout(() => setShowConfetti(false), 3500)
      return () => clearTimeout(timeout)
    } else {
      setShowConfetti(false)
    }
  }, [activeTab, goals])

  const convertedGoals = goals.map((goal, idx) => ({
    id: goal.id,
    title: goal.description,
    subtitle: '',
    icon: goalIcons[idx % goalIcons.length],
    target: goal.amount,
    current: goal.amount - Number(goal.missing_amount || 0),
    remaining: Number(goal.missing_amount || 0),
    due: goal.target_date,
    status: String(goal.status),
    description: goal.description,
    category: goal.category ? String(goal.category) : undefined
  }))

  const filteredGoals = convertedGoals.filter((goal) => goal.status === activeTab)

  const totalGoals = filteredGoals.length
  const totalTarget = filteredGoals.reduce((sum, g) => sum + g.target, 0)
  const totalCurrent = filteredGoals.reduce((sum, g) => sum + g.current, 0)
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

  const handleEditGoal = (goalId: string) => {
    // Implement edit functionality
    console.log('Edit goal:', goalId)
  }

  const handleDeleteGoal = (goalId: string) => {
    setGoalToDelete(goalId)
    setShowDeleteModal(true)
  }

  const confirmDeleteGoal = async () => {
    if (goalToDelete) {
      try {
        await cancelGoal(goalToDelete)
        setNotification({ message: 'Xoá mục tiêu thành công', type: 'success' })
        getGoals()
      } catch {
        setNotification({ message: 'Xoá mục tiêu thất bại', type: 'error' })
      } finally {
        setShowDeleteModal(false)
        setGoalToDelete(null)
      }
    }
  }

  const handleCreateGoal = async (goalData: Goals) => {
    try {
      await addGoal(goalData)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Không thể tạo mục tiêu:', error)
    }
  }

  return (
    <div className={styles.goalPageContainer}>
      {notification && (
        <Log message={notification.message} status={notification.type} onClose={() => setNotification(null)} />
      )}
      {showConfetti && (
        <Confetti
          numberOfPieces={220}
          recycle={false}
          style={{ zIndex: 1000, position: 'fixed', top: 0, left: 200, width: '100vw', pointerEvents: 'none' }}
        />
      )}

      <div className='goals-section'>
        <HeroBanner totalGoals={totalGoals} totalTarget={totalTarget} overallProgress={overallProgress} />
        <StatusTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <StatsRow totalGoals={totalGoals} totalTarget={totalTarget} overallProgress={overallProgress} />

        {filteredGoals.length === 0 ? (
          <EmptyState onAdd={() => {}} type={activeTab === 'cancelled' ? 'cancelled' : 'default'} />
        ) : (
          <div className={`${styles.goalsGrid} goal-progress`}>
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={() => handleEditGoal(goal.id)}
                onDelete={() => handleDeleteGoal(goal.id)}
              />
            ))}
          </div>
        )}

        {activeTab === 'active' && filteredGoals.length > 0 && (
          <div className={styles.addContributionCommonWrapper}>
            <button className={styles.addContributionBtnCommon} onClick={() => navigate('/budget')}>
              <FiPlus /> Thêm đóng góp
            </button>
          </div>
        )}
      </div>

      <div className='goal-actions'>
        <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />
      </div>

      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGoal}
      />

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <div className={styles.confirmTitle}>Xác nhận xoá mục tiêu</div>
            <div className={styles.confirmContent}>
              <p className={styles.confirmContentTitle}>
                Mục tiêu: {filteredGoals.find((goal) => goal.id === goalToDelete)?.title}
              </p>
              <p className={styles.confirmContentValue}>
                Số tiền cần đóng: {formatCurrency(filteredGoals.find((goal) => goal.id === goalToDelete)?.target || 0)}
              </p>
              <p className={styles.confirmContentValue}>
                Số tiền đã đóng: {formatCurrency(filteredGoals.find((goal) => goal.id === goalToDelete)?.current || 0)}
              </p>
              <p className={styles.confirmContentValue}>
                Số tiền còn lại:{' '}
                {formatCurrency(filteredGoals.find((goal) => goal.id === goalToDelete)?.remaining || 0)}
              </p>
              <p className={styles.confirmContentValue}>
                Ngày đến hạn: {formatDate(filteredGoals.find((goal) => goal.id === goalToDelete)?.due || '')}
              </p>
            </div>
            <div className={styles.confirmDesc}>Bạn có chắc chắn muốn xoá mục tiêu này không?</div>
            <div className={styles.confirmActions}>
              <button onClick={confirmDeleteGoal} className={styles.confirmBtn}>
                Xoá
              </button>
              <button onClick={() => setShowDeleteModal(false)} className={styles.cancelBtn}>
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalPage
