import React, { useState } from 'react'
import styles from './GoalPage.module.css'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const categories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Others']
const icons = ['🏠', '🍽️', '🚌', '🎬', '🛍️', '📦']

const goalData = {
  achieved: 12500,
  target: 20000,
  range: '01 May ~ 31 May'
}

const savingSummary = {
  current: [5000, 1000, 2500, 1800, 2600, 2700, 3100],
  previous: [2000, 800, 1800, 1500, 2100, 2200, 2300],
  labels: ['May 01', 'May 05', 'May 10', 'May 15', 'May 20', 'May 25', 'May 30']
}

const categoryGoals = categories.map((c) => ({ name: c, amount: 250 }))

const lineChartData = {
  labels: savingSummary.labels,
  datasets: [
    {
      label: 'This month',
      data: savingSummary.current,
      borderColor: '#339989',
      backgroundColor: 'rgba(51, 153, 137, 0.2)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Same period last month',
      data: savingSummary.previous,
      borderColor: '#CBD5E1',
      backgroundColor: 'transparent',
      borderDash: [6, 6],
      tension: 0.4
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: '#6B7280' },
      grid: { color: '#E5E7EB' }
    },
    x: {
      ticks: { color: '#6B7280' },
      grid: { display: false }
    }
  }
}

const GoalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editGoal, setEditGoal] = useState(null)

  const handleAdjustClick = (goal) => {
    setEditGoal(goal)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditGoal(null)
  }

  const handleSaveGoal = (updatedGoal) => {
    console.log('Updated Goal:', updatedGoal)
    setIsModalOpen(false)
  }

  const percent = Math.min((goalData.achieved / goalData.target) * 100, 100)
  const displayValue = `${Math.round(goalData.achieved / 1000)}K`

  return (
    <div className={styles.goalPage}>
      <h2>Goals</h2>
      <div className={styles.gridTop}>
        <div className={styles.cardGoalBox}>
          <div className={styles.cardHeader}>
            <h3>Savings Goal</h3>
            <span className={styles.dateRange}>{goalData.range}</span>
          </div>
          <div className={styles.goalContent}>
            <div className={styles.goalStats}>
              <p>💰 Target Achieved <strong>${goalData.achieved.toLocaleString()}</strong></p>
              <p>🎯 This month Target <strong>${goalData.target.toLocaleString()}</strong></p>
            </div>
            <div className={styles.gaugeWrapper}>
              <div
                className={styles.gaugeChart}
                style={{
                  background: `conic-gradient(#4b9e8d 0% ${percent}%, #f3f4f6 ${percent}% 100%)`
                }}
              >
                {displayValue}
              </div>
              <div className={styles.gaugeLabelText}>Target vs Achievement</div>
            </div>
          </div>
          <button
            className={styles.adjustBtn}
            onClick={() => handleAdjustClick(goalData)}
          >
            Adjust Goal ✏️
          </button>
        </div>

        <div className={styles.cardGoalBox}>
          <div className={styles.cardHeader}>
            <h3>Saving Summary</h3>
            <span className={styles.dateRange}>Mar 2022</span>
          </div>
          <div className={styles.chartArea}>
            <Line data={lineChartData} options={chartOptions} height={250} />
          </div>
        </div>
      </div>

      <h3 className={styles.subHeading}>Expenses Goals by Category</h3>
      <div className={styles.categoryGrid}>
        {categoryGoals.map((cat, idx) => (
          <div key={cat.name} className={styles.categoryCard}>
            <div className={styles.categoryTop}>
              <span className={styles.categoryIcon}>{icons[idx]}</span>
              <h4>{cat.name}</h4>
            </div>
            <p className={styles.categoryAmount}>${cat.amount.toFixed(2)}</p>
            <button className={styles.adjustBtn}>Adjust ✏️</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Goal</h3>
            <label>
              Target Amount:
              <input
                type="number"
                value={editGoal?.target || ''}
                onChange={(e) =>
                  setEditGoal({ ...editGoal, target: Number(e.target.value) })
                }
              />
            </label>
            <div className={styles.modalActions}>
              <button onClick={handleModalClose}>Cancel</button>
              <button onClick={() => handleSaveGoal(editGoal)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalPage
