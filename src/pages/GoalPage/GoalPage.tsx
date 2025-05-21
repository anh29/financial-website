import React, { useState } from 'react'
import styles from './GoalPage.module.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

// Define types for goals
interface ActiveGoal {
  id: string
  description: string
  amount: number
  target_amount: number
  target_date: string
  category: string
  start_date: string
  monthly_target: number
  last_contribution: string
  contribution_frequency: string
}

interface CompletedGoal {
  id: string
  description: string
  amount: number
  target_amount: number
  target_date: string
  category: string
  start_date: string
  completed_date: string
  achievement_time: string
}

interface EditGoal extends Partial<ActiveGoal>, Partial<CompletedGoal> {}

// Static data for UI development
const mockGoals = {
  active: [
    {
      id: '1',
      description: 'New Car Fund',
      amount: 15000,
      target_amount: 25000,
      target_date: '2024-12-31',
      category: 'Transportation',
      start_date: '2024-01-01',
      monthly_target: 2500,
      last_contribution: '2024-03-15',
      contribution_frequency: 'monthly'
    },
    {
      id: '2',
      description: 'Vacation Savings',
      amount: 5000,
      target_amount: 8000,
      target_date: '2024-08-15',
      category: 'Travel',
      start_date: '2024-02-01',
      monthly_target: 1000,
      last_contribution: '2024-03-10',
      contribution_frequency: 'weekly'
    },
    {
      id: '3',
      description: 'Emergency Fund',
      amount: 8000,
      target_amount: 10000,
      target_date: '2024-06-30',
      category: 'Savings',
      start_date: '2024-01-15',
      monthly_target: 2000,
      last_contribution: '2024-03-14',
      contribution_frequency: 'bi-weekly'
    }
  ],
  completed: [
    {
      id: '4',
      description: 'New Laptop',
      amount: 2000,
      target_amount: 2000,
      target_date: '2024-03-15',
      category: 'Electronics',
      start_date: '2024-01-01',
      completed_date: '2024-03-10',
      achievement_time: '2 months 10 days'
    },
    {
      id: '5',
      description: 'Gaming Console',
      amount: 500,
      target_amount: 500,
      target_date: '2024-02-28',
      category: 'Entertainment',
      start_date: '2024-01-15',
      completed_date: '2024-02-25',
      achievement_time: '1 month 10 days'
    }
  ]
}

const goalInsights = {
  total_saved: 28000,
  monthly_savings: 5500,
  completion_rate: 85,
  average_completion_time: '2.5 months',
  next_contribution: '2024-03-20',
  recommended_goals: [
    {
      title: 'Retirement Fund',
      description: 'Start saving for retirement',
      target: 1000000,
      monthly_target: 2000
    },
    {
      title: 'Home Down Payment',
      description: 'Save for your dream home',
      target: 50000,
      monthly_target: 1000
    }
  ]
}

const categories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Others']
const icons = ['🏠', '🍽️', '🚌', '🎬', '🛍️', '📦']

const GoalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<EditGoal | null>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

  const handleAdjustClick = (goal: ActiveGoal | CompletedGoal) => {
    setEditGoal(goal)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditGoal(null)
  }

  const handleSaveGoal = (updatedGoal: EditGoal) => {
    setIsModalOpen(false)
  }

  const calculateTimeLeft = (targetDate: string) => {
    const now = new Date()
    const target = new Date(targetDate)
    const diff = target.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days left` : 'Completed'
  }

  const calculateMonthlyProgress = (goal: ActiveGoal) => {
    const now = new Date()
    const start = new Date(goal.start_date)
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
    const expected = goal.monthly_target * months
    return Math.min((goal.amount / expected) * 100, 100)
  }

  return (
    <div className={styles.goalPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>Financial Goals</h2>
          <p className={styles.headerSubtitle}>Track and manage your financial goals</p>
        </div>
        <button className={styles.createGoalBtn} onClick={() => setIsModalOpen(true)}>
          Create New Goal
        </button>
      </div>

      <div className={styles.goalSummary}>
        <div className={styles.summaryCard}>
          <h3>Active Goals</h3>
          <p className={styles.summaryNumber}>{mockGoals.active.length}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Completed Goals</h3>
          <p className={styles.summaryNumber}>{mockGoals.completed.length}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Saved</h3>
          <p className={styles.summaryNumber}>
            ${mockGoals.active.reduce((sum, goal) => sum + goal.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Completion Rate</h3>
          <p className={styles.summaryNumber}>{goalInsights.completion_rate}%</p>
        </div>
      </div>

      <div className={styles.insightsSection}>
        <div className={styles.insightCard}>
          <h3>Goal Insights</h3>
          <div className={styles.insightContent}>
            <div className={styles.insightItem}>
              <span>Monthly Savings</span>
              <strong>${goalInsights.monthly_savings.toLocaleString()}</strong>
            </div>
            <div className={styles.insightItem}>
              <span>Avg. Completion Time</span>
              <strong>{goalInsights.average_completion_time}</strong>
            </div>
            <div className={styles.insightItem}>
              <span>Next Contribution</span>
              <strong>{new Date(goalInsights.next_contribution).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>
        <div className={styles.insightCard}>
          <h3>Recommended Goals</h3>
          <div className={styles.recommendations}>
            {goalInsights.recommended_goals.map((goal, index) => (
              <div key={index} className={styles.recommendationItem}>
                <h4>{goal.title}</h4>
                <p>{goal.description}</p>
                <div className={styles.recommendationDetails}>
                  <span>Target: ${goal.target.toLocaleString()}</span>
                  <span>Monthly: ${goal.monthly_target.toLocaleString()}</span>
                </div>
                <button className={styles.addGoalBtn}>Add Goal</button>
              </div>
            ))}
          </div>
        </div>
      </div>

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

      <div className={styles.gridTop}>
        {(activeTab === 'active' ? mockGoals.active : mockGoals.completed).map((goal) => {
          const percent = Math.min((goal.amount / goal.target_amount) * 100, 100)
          const displayValue = `${Math.round(goal.amount / 1000)}K`
          const timeLeft = calculateTimeLeft(goal.target_date)
          const monthlyProgress = calculateMonthlyProgress(goal as ActiveGoal)

          return (
            <div key={goal.id} className={styles.cardGoalBox}>
              <div className={styles.cardHeader}>
                <h3>{goal.description}</h3>
                <span className={styles.category}>{goal.category}</span>
              </div>
              <div className={styles.goalContent}>
                <div className={styles.goalStats}>
                  <p>
                    💰 Current Amount <strong>${goal.amount.toLocaleString()}</strong>
                  </p>
                  <p>
                    🎯 Target Amount <strong>${goal.target_amount.toLocaleString()}</strong>
                  </p>
                  <p>
                    📅 Target Date <strong>{new Date(goal.target_date).toLocaleDateString()}</strong>
                  </p>
                  <p>⏳ {timeLeft}</p>
                  {goal.monthly_target && (
                    <>
                      <p>
                        📈 Monthly Target <strong>${goal.monthly_target.toLocaleString()}</strong>
                      </p>
                      <p>
                        🔄 Contribution <strong>{goal.contribution_frequency}</strong>
                      </p>
                      <p>
                        📌 Last Contribution <strong>{new Date(goal.last_contribution).toLocaleDateString()}</strong>
                      </p>
                    </>
                  )}
                  {goal.achievement_time && (
                    <p>
                      🏆 Achieved in <strong>{goal.achievement_time}</strong>
                    </p>
                  )}
                </div>
                <div className={styles.gaugeWrapper}>
                  <div style={{ width: 120, height: 120 }}>
                    <CircularProgressbar
                      value={percent}
                      text={displayValue}
                      styles={buildStyles({
                        pathColor: '#4b9e8d',
                        textColor: '#111827',
                        trailColor: '#f3f4f6',
                        textSize: '20px'
                      })}
                    />
                  </div>
                  <div className={styles.gaugeLabelText}>Overall Progress</div>
                  {goal.monthly_target && (
                    <div className={styles.monthlyProgress}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${monthlyProgress}%` }} />
                      </div>
                      <span>Monthly Progress</span>
                    </div>
                  )}
                </div>
              </div>
              {activeTab === 'active' && (
                <div className={styles.cardActions}>
                  <button className={styles.adjustBtn} onClick={() => handleAdjustClick(goal)}>
                    Adjust Goal ✏️
                  </button>
                  <button className={styles.contributeBtn}>Make Contribution 💰</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <h3 className={styles.subHeading}>Category Overview</h3>
      <div className={styles.categoryGrid}>
        {categories.map((category, idx) => (
          <div key={category} className={styles.categoryCard}>
            <div className={styles.categoryTop}>
              <span className={styles.categoryIcon}>{icons[idx]}</span>
              <h4>{category}</h4>
            </div>
            <div className={styles.categoryProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${Math.random() * 100}%` }} />
              </div>
              <p className={styles.categoryAmount}>
                ${Math.floor(Math.random() * 1000)} / ${Math.floor(Math.random() * 2000)}
              </p>
            </div>
            <button className={styles.adjustBtn}>Adjust ✏️</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{editGoal ? 'Edit Goal' : 'Create New Goal'}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveGoal(editGoal)
              }}
            >
              <label>
                Description:
                <input
                  type='text'
                  value={editGoal?.description || ''}
                  onChange={(e) => setEditGoal({ ...editGoal, description: e.target.value })}
                  placeholder='Enter goal description'
                />
              </label>
              <label>
                Category:
                <select
                  value={editGoal?.category || ''}
                  onChange={(e) => setEditGoal({ ...editGoal, category: e.target.value })}
                >
                  <option value=''>Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Target Amount:
                <input
                  type='number'
                  value={editGoal?.target_amount || ''}
                  onChange={(e) => setEditGoal({ ...editGoal, target_amount: Number(e.target.value) })}
                  placeholder='Enter target amount'
                />
              </label>
              <label>
                Monthly Target:
                <input
                  type='number'
                  value={editGoal?.monthly_target || ''}
                  onChange={(e) => setEditGoal({ ...editGoal, monthly_target: Number(e.target.value) })}
                  placeholder='Enter monthly target'
                />
              </label>
              <label>
                Contribution Frequency:
                <select
                  value={editGoal?.contribution_frequency || ''}
                  onChange={(e) => setEditGoal({ ...editGoal, contribution_frequency: e.target.value })}
                >
                  <option value=''>Select frequency</option>
                  <option value='weekly'>Weekly</option>
                  <option value='bi-weekly'>Bi-weekly</option>
                  <option value='monthly'>Monthly</option>
                </select>
              </label>
              <label>
                Start Date:
                <input
                  type='date'
                  value={editGoal?.start_date || ''}
                  onChange={(e) => setEditGoal({ ...editGoal, start_date: e.target.value })}
                />
              </label>
              <label>
                Target Date:
                <input
                  type='date'
                  value={editGoal?.target_date || ''}
                  onChange={(e) => setEditGoal({ ...editGoal, target_date: e.target.value })}
                />
              </label>
              <div className={styles.modalActions}>
                <button type='button' onClick={handleModalClose}>
                  Cancel
                </button>
                <button type='submit'>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalPage
