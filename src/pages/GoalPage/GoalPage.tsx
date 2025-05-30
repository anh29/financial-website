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

const goalIcons = [<FiHome />, <FiBook />, <FiGlobe />, <FiTarget />, <FiTrendingUp />]

const GoalPage = () => {
  const { goals, getGoals, addGoal } = useGoal()
  const [activeTab, setActiveTab] = useState('active')
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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
    // Implement delete functionality
    console.log('Delete goal:', goalId)
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
      {showConfetti && (
        <Confetti
          numberOfPieces={220}
          recycle={false}
          style={{ zIndex: 1000, position: 'fixed', top: 0, left: 200, width: '100vw', pointerEvents: 'none' }}
        />
      )}

      <HeroBanner totalGoals={totalGoals} totalTarget={totalTarget} overallProgress={overallProgress} />
      <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />
      <StatusTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <StatsRow totalGoals={totalGoals} totalTarget={totalTarget} overallProgress={overallProgress} />

      {filteredGoals.length === 0 ? (
        <EmptyState onAdd={() => {}} type={activeTab === 'cancelled' ? 'cancelled' : 'default'} />
      ) : (
        <div className={styles.goalsGrid}>
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

      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGoal}
      />
    </div>
  )
}

export default GoalPage
