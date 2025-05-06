import React from 'react'
import { Bar } from 'react-chartjs-2'
import styles from './TopCategories.module.css'

const TopCategories = () => {
  const data = {
    labels: ['Food', 'Transport', 'Shopping', 'Entertainment'],
    datasets: [
      {
        label: 'Spending',
        data: [300, 200, 400, 100],
        backgroundColor: ['#1abc9c', '#3498db', '#9b59b6', '#f39c12'],
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 100,
        },
      },
    },
  }

  return (
    <div className={styles.chartContainer}>
      <h2>📊 Top Spending Categories</h2>
      <Bar data={data} options={options} />
    </div>
  )
}

export default TopCategories
