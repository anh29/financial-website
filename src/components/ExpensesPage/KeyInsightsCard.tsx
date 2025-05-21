import React from 'react'
import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import styles from './KeyInsightsCard.module.css'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

type KeyInsightsCardProps = {
  radarLabels: string[]
  radarValues: number[]
  highest: { label: string; value: number }
  lowest: { label: string; value: number }
}

const KeyInsightsCard: React.FC<KeyInsightsCardProps> = ({ radarLabels, radarValues, highest, lowest }) => {
  const data = {
    labels: radarLabels,
    datasets: [
      {
        label: 'Current Month',
        data: radarValues,
        fill: true,
        backgroundColor: 'rgba(26, 188, 156, 0.2)',
        borderColor: 'rgba(26, 188, 156, 1)',
        pointBackgroundColor: 'rgba(26, 188, 156, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(26, 188, 156, 1)'
      }
    ]
  }

  const options = {
    scales: {
      r: {
        angleLines: { display: true },
        pointLabels: {
          color: '#7f8c8d',
          font: { size: 13 }
        },
        ticks: {
          display: false // Hide numbers on radar
        },
        grid: {
          color: '#e3eaf2'
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  return (
    <div className={styles.keyInsightsCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Spending Distribution</h3>
      </div>
      <div className={styles.chartContainer}>
        <Radar data={data} options={options} />
      </div>
      <div className={styles.insights}>
        {highest?.label && (
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>Highest Spending:</span>
            <span className={styles.insightValue}>
              {highest.label} ({highest.value}%)
            </span>
          </div>
        )}
        {lowest?.label && (
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>Lowest Spending:</span>
            <span className={styles.insightValue}>
              {lowest.label} ({lowest.value}%)
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default KeyInsightsCard
