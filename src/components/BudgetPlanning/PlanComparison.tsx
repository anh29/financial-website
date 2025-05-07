import React from 'react'
import { Bar } from 'react-chartjs-2'
import styles from './PlanComparison.module.css'

const PlanComparison = () => {
  const data = {
    labels: ['Food', 'Transportation', 'Shopping', 'Entertainment'],
    datasets: [
      {
        label: 'Planned',
        data: [300, 200, 400, 100],
        backgroundColor: '#3498db'
      },
      {
        label: 'Actual',
        data: [350, 250, 450, 150],
        backgroundColor: '#e74c3c'
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  }

  return (
    <div className={styles.planComparison}>
      <h2>Plan vs Actual</h2>
      <Bar data={data} options={options} />
    </div>
  )
}

export default PlanComparison
