import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js'
import styles from './MultiDayAllocationCard.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type MultiDayAllocationCardProps = {
  weeklySpendingData: ChartData<'bar'>
  summary: { highestDay: string; highestAmount: number; average: number }
}

const MultiDayAllocationCard: React.FC<MultiDayAllocationCardProps> = ({ weeklySpendingData, summary }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <div className={styles.multiDayAllocationCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Weekly Spending</h3>
      </div>
      <div className={styles.chartContainer}>
        <Bar data={weeklySpendingData} options={options} />
      </div>
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Highest Day:</span>
          <span className={styles.summaryValue}>
            {summary.highestDay} (${summary.highestAmount.toLocaleString()})
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Average Daily:</span>
          <span className={styles.summaryValue}>${summary.average.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

export default MultiDayAllocationCard
