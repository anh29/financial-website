import React from 'react'
import { Line } from 'react-chartjs-2'
import styles from './SavingsTrends.module.css'

const SavingsTrends = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Savings',
        data: [200, 300, 400, 500, 600, 700],
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.15)',
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
      <h2>💾 Savings Trends</h2>
      <Line data={data} options={options} />
    </div>
  )
}

export default SavingsTrends
