import React from 'react'
import { Line } from 'react-chartjs-2'
import styles from './SpendingOverTime.module.css'

const SpendingOverTime = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Spending',
        data: [500, 700, 600, 800, 750, 900],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.15)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  }

  return (
    <div className={styles.chartContainer}>
      <h2>💸 Spending Over Time</h2>
      <Line data={data} options={options} />
    </div>
  )
}

export default SpendingOverTime
