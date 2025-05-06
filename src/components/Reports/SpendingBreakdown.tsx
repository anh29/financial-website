import React from 'react'
import { Pie } from 'react-chartjs-2'
import styles from './SpendingBreakdown.module.css'

const SpendingBreakdown = () => {
  const data = {
    labels: ['Food', 'Transportation', 'Shopping', 'Entertainment'],
    datasets: [
      {
        data: [300, 200, 400, 100],
        backgroundColor: ['#1abc9c', '#3498db', '#9b59b6', '#f39c12'],
        hoverBackgroundColor: ['#16a085', '#2980b9', '#8e44ad', '#e67e22'],
      },
    ],
  }

  return (
    <div className={styles.spendingBreakdown}>
      <h2>Spending Breakdown</h2>
      <Pie data={data} />
    </div>
  )
}

export default SpendingBreakdown
