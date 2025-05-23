import { useState } from 'react'
import styles from './GoalPage.module.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

// Define types for goals
interface BaseGoal {
  id: string
  title: string
  description: string
  category: GoalCategory
  target_amount: number
  current_amount: number
  start_date: string
  target_date: string
  status: 'active' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  notes?: string
  last_updated: string
}

interface RecurringGoal extends BaseGoal {
  type: 'recurring'
  frequency: 'monthly' | 'yearly'
  monthly_target: number
  contribution_frequency: 'weekly' | 'bi-weekly' | 'monthly'
  last_contribution: string
  next_contribution: string
}

interface OneTimeGoal extends BaseGoal {
  type: 'one-time'
  milestone_dates?: {
    date: string
    target_amount: number
    description: string
  }[]
}

type Goal = RecurringGoal | OneTimeGoal

type GoalCategory =
  | 'Housing'
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Education'
  | 'Healthcare'
  | 'Travel'
  | 'Emergency Fund'
  | 'Investment'
  | 'Retirement'
  | 'Wedding'
  | 'Other'

// Mock data for development
const mockGoals: Goal[] = [
  {
    id: '1',
    type: 'recurring',
    title: 'Emergency Fund',
    description: 'Build a 6-month emergency fund',
    category: 'Emergency Fund',
    target_amount: 30000,
    current_amount: 15000,
    start_date: '2024-01-01',
    target_date: '2024-12-31',
    status: 'active',
    priority: 'high',
    frequency: 'monthly',
    monthly_target: 2500,
    contribution_frequency: 'monthly',
    last_contribution: '2024-03-15',
    next_contribution: '2024-04-15',
    last_updated: '2024-03-15'
  },
  {
    id: '2',
    type: 'one-time',
    title: 'New Car Purchase',
    description: 'Save for a new car down payment',
    category: 'Transportation',
    target_amount: 20000,
    current_amount: 8000,
    start_date: '2024-02-01',
    target_date: '2024-08-31',
    status: 'active',
    priority: 'medium',
    milestone_dates: [
      {
        date: '2024-05-31',
        target_amount: 10000,
        description: 'Halfway to goal'
      },
      {
        date: '2024-08-31',
        target_amount: 20000,
        description: 'Complete down payment'
      }
    ],
    last_updated: '2024-03-15'
  },
  {
    id: '3',
    type: 'recurring',
    title: 'Retirement Savings',
    description: 'Monthly retirement contribution',
    category: 'Retirement',
    target_amount: 1000000,
    current_amount: 250000,
    start_date: '2024-01-01',
    target_date: '2034-12-31',
    status: 'active',
    priority: 'high',
    frequency: 'yearly',
    monthly_target: 5000,
    contribution_frequency: 'monthly',
    last_contribution: '2024-03-01',
    next_contribution: '2024-04-01',
    last_updated: '2024-03-15'
  }
]

const categories: GoalCategory[] = [
  'Housing',
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Education',
  'Healthcare',
  'Travel',
  'Emergency Fund',
  'Investment',
  'Retirement',
  'Wedding',
  'Other'
]

const categoryIcons: Record<GoalCategory, string> = {
  Housing: '🏠',
  Food: '🍽️',
  Transportation: '🚌',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Education: '📚',
  Healthcare: '⚕️',
  Travel: '✈️',
  'Emergency Fund': '🆘',
  Investment: '📈',
  Retirement: '👴',
  Wedding: '💍',
  Other: '📦'
}

const GoalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<Partial<Goal> | null>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'all'>('all')

  const handleAdjustClick = (goal: Goal) => {
    setEditGoal(goal)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditGoal(null)
  }

  const handleSaveGoal = (updatedGoal: Partial<Goal> | null) => {
    if (!updatedGoal) return
    setIsModalOpen(false)
    // TODO: Implement save functionality
  }

  const calculateTimeLeft = (targetDate: string) => {
    const now = new Date()
    const target = new Date(targetDate)
    const diff = target.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days left` : 'Completed'
  }

  const calculateProgress = (goal: Goal) => {
    return Math.min((goal.current_amount / goal.target_amount) * 100, 100)
  }

  const filteredGoals = mockGoals.filter((goal) => {
    const matchesStatus = goal.status === (activeTab === 'active' ? 'active' : 'completed')
    const matchesCategory = selectedCategory === 'all' || goal.category === selectedCategory
    return matchesStatus && matchesCategory
  })

  return (
    <div className={styles.goalPage}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div>
            <h1>Financial Goals</h1>
            <p>Plan and track your financial journey</p>
          </div>
          <button className={styles.createGoalBtn} onClick={() => setIsModalOpen(true)}>
            <span>Create New Goal</span>
            <span className={styles.btnIcon}>✨</span>
          </button>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statInfo}>
              <h3>Active Goals</h3>
              <p>{mockGoals.filter(g => g.status === 'active').length}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statInfo}>
              <h3>Total Saved</h3>
              <p>${mockGoals.reduce((sum, goal) => sum + goal.current_amount, 0).toLocaleString()}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📈</div>
            <div className={styles.statInfo}>
              <h3>Monthly Target</h3>
              <p>${mockGoals
                .filter(g => g.type === 'recurring')
                .reduce((sum, goal) => sum + (goal as RecurringGoal).monthly_target, 0)
                .toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <div className={styles.categoryFilter}>
            <h3>Categories</h3>
            <div className={styles.categoryList}>
              <button
                className={`${styles.categoryBtn} ${selectedCategory === 'all' ? styles.activeCategory : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryBtn} ${selectedCategory === category ? styles.activeCategory : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className={styles.categoryIcon}>{categoryIcons[category]}</span>
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.goalsSection}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Goals
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'completed' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed Goals
            </button>
          </div>

          <div className={styles.goalsGrid}>
            {filteredGoals.map((goal) => {
              const progress = calculateProgress(goal)
              const timeLeft = calculateTimeLeft(goal.target_date)

              return (
                <div key={goal.id} className={styles.goalCard}>
                  <div className={styles.goalHeader}>
                    <div className={styles.goalTitle}>
                      <h3>{goal.title}</h3>
                      <div className={styles.goalMeta}>
                        <span className={styles.category}>
                          {categoryIcons[goal.category]} {goal.category}
                        </span>
                        <span className={styles.priority} data-priority={goal.priority}>
                          {goal.priority}
                        </span>
                      </div>
                    </div>
                    <div className={styles.goalProgress}>
                      <CircularProgressbar
                        value={progress}
                        text={`${Math.round(progress)}%`}
                        styles={buildStyles({
                          pathColor: '#4b9e8d',
                          textColor: '#0f172a',
                          trailColor: '#e2e8f0',
                          textSize: '24px',
                          pathTransitionDuration: 0.5
                        })}
                      />
                    </div>
                  </div>

                  <div className={styles.goalDetails}>
                    <div className={styles.goalInfo}>
                      <div className={styles.infoItem}>
                        <span>Current</span>
                        <strong>${goal.current_amount.toLocaleString()}</strong>
                      </div>
                      <div className={styles.infoItem}>
                        <span>Target</span>
                        <strong>${goal.target_amount.toLocaleString()}</strong>
                      </div>
                      <div className={styles.infoItem}>
                        <span>Due Date</span>
                        <strong>{new Date(goal.target_date).toLocaleDateString()}</strong>
                      </div>
                      <div className={styles.infoItem}>
                        <span>Time Left</span>
                        <strong>{timeLeft}</strong>
                      </div>
                    </div>

                    {goal.type === 'recurring' && (
                      <div className={styles.recurringInfo}>
                        <div className={styles.infoItem}>
                          <span>Monthly Target</span>
                          <strong>${goal.monthly_target.toLocaleString()}</strong>
                        </div>
                        <div className={styles.infoItem}>
                          <span>Next Contribution</span>
                          <strong>{new Date(goal.next_contribution).toLocaleDateString()}</strong>
                        </div>
                      </div>
                    )}

                    {goal.type === 'one-time' && goal.milestone_dates && (
                      <div className={styles.milestones}>
                        <h4>Milestones</h4>
                        {goal.milestone_dates.map((milestone, index) => (
                          <div key={index} className={styles.milestone}>
                            <div className={styles.milestoneHeader}>
                              <span>{milestone.description}</span>
                              <strong>${milestone.target_amount.toLocaleString()}</strong>
                            </div>
                            <div className={styles.milestoneDate}>{new Date(milestone.date).toLocaleDateString()}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {goal.status === 'active' && (
                      <div className={styles.goalActions}>
                        <button className={styles.adjustBtn} onClick={() => handleAdjustClick(goal)}>
                          Adjust Goal
                        </button>
                        <button className={styles.contributeBtn}>Make Contribution</button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editGoal ? 'Edit Goal' : 'Create New Goal'}</h3>
              <button className={styles.closeBtn} onClick={handleModalClose}>
                ×
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveGoal(editGoal)
              }}
            >
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Goal Type</label>
                  <select
                    value={editGoal?.type || ''}
                    onChange={(e) => setEditGoal({ ...editGoal, type: e.target.value as 'recurring' | 'one-time' })}
                  >
                    <option value=''>Select type</option>
                    <option value='recurring'>Recurring Goal</option>
                    <option value='one-time'>One-time Goal</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input
                    type='text'
                    value={editGoal?.title || ''}
                    onChange={(e) => setEditGoal({ ...editGoal, title: e.target.value })}
                    placeholder='Enter goal title'
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <input
                    type='text'
                    value={editGoal?.description || ''}
                    onChange={(e) => setEditGoal({ ...editGoal, description: e.target.value })}
                    placeholder='Enter goal description'
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select
                    value={editGoal?.category || ''}
                    onChange={(e) => setEditGoal({ ...editGoal, category: e.target.value as GoalCategory })}
                  >
                    <option value=''>Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Priority</label>
                  <select
                    value={editGoal?.priority || ''}
                    onChange={(e) =>
                      setEditGoal({ ...editGoal, priority: e.target.value as 'low' | 'medium' | 'high' })
                    }
                  >
                    <option value=''>Select priority</option>
                    <option value='low'>Low</option>
                    <option value='medium'>Medium</option>
                    <option value='high'>High</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Target Amount</label>
                  <input
                    type='number'
                    value={editGoal?.target_amount || ''}
                    onChange={(e) => setEditGoal({ ...editGoal, target_amount: Number(e.target.value) })}
                    placeholder='Enter target amount'
                  />
                </div>
                {editGoal?.type === 'recurring' && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Frequency</label>
                      <select
                        value={(editGoal as RecurringGoal)?.frequency || ''}
                        onChange={(e) =>
                          setEditGoal({ ...editGoal, frequency: e.target.value as 'monthly' | 'yearly' })
                        }
                      >
                        <option value=''>Select frequency</option>
                        <option value='monthly'>Monthly</option>
                        <option value='yearly'>Yearly</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Monthly Target</label>
                      <input
                        type='number'
                        value={(editGoal as RecurringGoal)?.monthly_target || ''}
                        onChange={(e) => setEditGoal({ ...editGoal, monthly_target: Number(e.target.value) })}
                        placeholder='Enter monthly target'
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Contribution Frequency</label>
                      <select
                        value={(editGoal as RecurringGoal)?.contribution_frequency || ''}
                        onChange={(e) =>
                          setEditGoal({
                            ...editGoal,
                            contribution_frequency: e.target.value as 'weekly' | 'bi-weekly' | 'monthly'
                          })
                        }
                      >
                        <option value=''>Select frequency</option>
                        <option value='weekly'>Weekly</option>
                        <option value='bi-weekly'>Bi-weekly</option>
                        <option value='monthly'>Monthly</option>
                      </select>
                    </div>
                  </>
                )}
                <div className={styles.formGroup}>
                  <label>Start Date</label>
                  <input
                    type='date'
                    value={editGoal?.start_date || ''}
                    onChange={(e) => setEditGoal({ ...editGoal, start_date: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Target Date</label>
                  <input
                    type='date'
                    value={editGoal?.target_date || ''}
                    onChange={(e) => setEditGoal({ ...editGoal, target_date: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type='button' onClick={handleModalClose}>
                  Cancel
                </button>
                <button type='submit'>Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalPage
