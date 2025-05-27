import { useEffect, useState } from 'react'
import styles from './GoalPage.module.css'
import { useGoal } from '../../hooks/features/useGoals'
import {
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiPlus,
  FiTrendingUp,
  FiSmile,
  FiTarget,
  FiHome,
  FiBook,
  FiGlobe
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Confetti from 'react-confetti'

const STATUS_TABS = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' }
]

const statusAccent: Record<string, string> = {
  active: styles.accentActive,
  completed: styles.accentCompleted,
  cancelled: styles.accentCancelled
}

const goalIcons = [<FiHome />, <FiBook />, <FiGlobe />, <FiTarget />, <FiTrendingUp />]

const formatCurrency = (amount: number) => {
  return '$' + amount.toLocaleString()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

interface HeroBannerProps {
  totalGoals: number
  totalTarget: number
  overallProgress: number
}
const HeroBanner = ({ totalGoals, totalTarget, overallProgress }: HeroBannerProps) => (
  <div className={styles.heroBannerNoImg}>
    <h1 className={styles.gradientText}>Achieve Your Dreams</h1>
    <p className={styles.heroQuote}>"The future depends on what you do today."</p>
    <div className={styles.heroStatsRow}>
      <div className={styles.heroStat}>
        <FiTarget /> <span>{totalGoals}</span> Goals
      </div>
      <div className={styles.heroStat}>
        <FiTrendingUp /> <span>{formatCurrency(totalTarget)}</span> Target
      </div>
      <div className={styles.heroStat}>
        <FiSmile /> <span>{overallProgress.toFixed(1)}%</span> Progress
      </div>
    </div>
  </div>
)

interface FloatingActionButtonProps {
  onClick: () => void
}
const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => (
  <button className={styles.fab} onClick={onClick} aria-label='Add New Goal'>
    <FiPlus />
  </button>
)

interface EmptyStateProps {
  onAdd: () => void
}
const EmptyState = ({ onAdd }: EmptyStateProps) => (
  <div className={styles.emptyStateNoImg}>
    <h2>No goals yet</h2>
    <p>Start by adding your first financial goal!</p>
    <button className={styles.addGoalBtn} onClick={onAdd}>
      <FiPlus /> Add New Goal
    </button>
  </div>
)

const GoalPage = () => {
  const { goals, getGoals } = useGoal()
  const [activeTab, setActiveTab] = useState('active')
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    getGoals()
  }, [getGoals])

  // Show confetti when switching to Completed tab with at least one goal
  useEffect(() => {
    if (activeTab === 'completed' && filteredGoals.length > 0) {
      setShowConfetti(true)
      const timeout = setTimeout(() => setShowConfetti(false), 3500)
      return () => clearTimeout(timeout)
    } else {
      setShowConfetti(false)
    }
  }, [activeTab, goals])

  // Convert API goals to the format expected by the UI
  const convertedGoals = goals.map((goal, idx) => ({
    id: goal.id,
    title: goal.description,
    subtitle: '',
    icon: goalIcons[idx % goalIcons.length],
    target: goal.amount,
    current: goal.amount - Number(goal.missing_amount || 0),
    remaining: Number(goal.missing_amount || 0),
    due: goal.target_date,
    status: goal.status,
    description: goal.description,
    category: goal.category || ''
  }))

  // Filter by status tab
  const filteredGoals = convertedGoals.filter((goal) => goal.status === activeTab)

  // Stats
  const totalGoals = filteredGoals.length
  const totalTarget = filteredGoals.reduce((sum, g) => sum + g.target, 0)
  const totalCurrent = filteredGoals.reduce((sum, g) => sum + g.current, 0)
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

  return (
    <div className={styles.goalPageV2}>
      {showConfetti && (
        <Confetti
          numberOfPieces={220}
          recycle={false}
          style={{ zIndex: 1000, position: 'fixed', top: 0, left: 200, width: '100vw', pointerEvents: 'none' }}
        />
      )}
      <HeroBanner totalGoals={totalGoals} totalTarget={totalTarget} overallProgress={overallProgress} />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => {}} />

      {/* Status Tabs */}
      <div className={styles.statusTabsRow}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? styles.statusTabActive : styles.statusTab}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCardV2}>
          <div className={styles.statCardHeader}>
            <span className={styles.statCardTitle}>Total Goals</span>
          </div>
          <div className={styles.statCardValue}>{totalGoals.toString()}</div>
          <div className={styles.statCardDesc}>
            Goals with status: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </div>
        </div>
        <div className={styles.statCardV2}>
          <div className={styles.statCardHeader}>
            <span className={styles.statCardTitle}>Total Target</span>
          </div>
          <div className={styles.statCardValue}>{formatCurrency(totalTarget)}</div>
          <div className={styles.statCardDesc}>Combined goal amount</div>
        </div>
        <div className={styles.statCardV2}>
          <div className={styles.statCardHeader}>
            <span className={styles.statCardTitle}>Overall Progress</span>
          </div>
          <div className={styles.statCardValue}>{overallProgress.toFixed(1) + '%'}</div>
          <div className={styles.statCardProgressBarBg}>
            <div className={styles.statCardProgressBar} style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {filteredGoals.length === 0 ? (
        activeTab === 'cancelled' ? (
          <div className={styles.cancelledHappyState}>
            <FiSmile size={36} />
            <h2>No cancelled goals!</h2>
            <p>Keep up the great work! 🎉</p>
          </div>
        ) : (
          <EmptyState onAdd={() => {}} />
        )
      ) : (
        <div className={styles.goalsGridV2}>
          {filteredGoals.map((goal) => (
            <div className={styles.goalCardV2 + ' ' + (statusAccent[goal.status] || '')} key={goal.id}>
              <div className={styles.goalCardHeader}>
                <div className={styles.goalIconCircle}>{goal.icon}</div>
                <div className={styles.goalCardTitleBlock}>
                  <div className={styles.goalCardTitleV2}>
                    {goal.title}
                    {goal.category && <span className={styles.categoryBadge}>{goal.category}</span>}
                  </div>
                  {goal.subtitle && <div className={styles.goalCardSubtitle}>{goal.subtitle}</div>}
                </div>
                <div className={styles.goalCardActions}>
                  <span className={styles.statusBadge + ' ' + (statusAccent[goal.status] || '')}>{goal.status}</span>
                  <button className={styles.iconBtn} aria-label='Edit goal'>
                    <FiEdit2 />
                  </button>
                  <button className={styles.iconBtn} aria-label='Delete goal'>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className={styles.goalCardMetaRow}>
                <span className={styles.goalCardMeta}>
                  <FiCalendar /> {formatDate(goal.due)}
                </span>
              </div>
              <div className={styles.goalCardProgressLabelRow}>
                <span className={styles.goalCardProgressLabel}>Progress</span>
                <span className={styles.goalCardProgressPercent}>
                  {((goal.current / goal.target) * 100).toFixed(1)}%
                </span>
              </div>
              <div className={styles.goalCardProgressBarBg}>
                <div
                  className={styles.goalCardProgressBar}
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                />
              </div>
              <div className={styles.goalCardValuesRow}>
                <div>
                  <div className={styles.goalCardValueLabel}>Current</div>
                  <div className={styles.goalCardValue}>{formatCurrency(goal.current)}</div>
                </div>
                <div>
                  <div className={styles.goalCardValueLabel}>Target</div>
                  <div className={styles.goalCardValue}>{formatCurrency(goal.target)}</div>
                </div>
                <div>
                  <div className={styles.goalCardValueLabel}>Remaining</div>
                  <div className={styles.goalCardValue}>{formatCurrency(goal.remaining)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Add Contribution button for active tab only */}
      {activeTab === 'active' && filteredGoals.length > 0 && (
        <div className={styles.addContributionCommonWrapper}>
          <button className={styles.addContributionBtnCommon} onClick={() => navigate('/budget')}>
            <FiPlus /> Add Contribution
          </button>
        </div>
      )}
    </div>
  )
}

export default GoalPage
