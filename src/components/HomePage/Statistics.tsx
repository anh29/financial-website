import React, { useState } from 'react'
import styles from './Statistics.module.css'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Statistics = () => {
  const [timeframe, setTimeframe] = useState('weekly')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const data = {
    weekly: {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'This week',
          data: [120, 190, 300, 500, 200, 300, 400],
          backgroundColor: '#1abc9c'
        },
        {
          label: 'Last week',
          data: [100, 150, 250, 400, 150, 250, 350],
          backgroundColor: '#bdc3c7'
        }
      ]
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'This month',
          data: [1200, 1900, 3000, 5000],
          backgroundColor: '#1abc9c'
        },
        {
          label: 'Last month',
          data: [1000, 1500, 2500, 4000],
          backgroundColor: '#bdc3c7'
        }
      ]
    },
    yearly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'This year',
          data: [12000, 19000, 30000, 50000, 20000, 30000, 40000, 45000, 35000, 30000, 25000, 20000],
          backgroundColor: '#1abc9c'
        },
        {
          label: 'Last year',
          data: [10000, 15000, 25000, 40000, 15000, 25000, 35000, 40000, 30000, 25000, 20000, 15000],
          backgroundColor: '#bdc3c7'
        }
      ]
    }
  }

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
        ticks: {
          callback: function (value) {
            return `$${value}k`
          }
        }
      }
    }
  }

  const handleDropdownClick = (value) => {
    setTimeframe(value)
    setDropdownOpen(false)
  }

  return (
    <div className={styles.statistics}>
      <div className={styles.header}>
        <h2>Statistics</h2>
      </div>
      <div className={styles.chartOptions}>
        <div className={styles.dropdown} onClick={() => setDropdownOpen(!dropdownOpen)}>
          {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          <span className={styles.arrow}>{dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
          <ul className={`${styles.dropdownMenu} ${dropdownOpen ? styles.show : ''}`}>
            <li onClick={() => handleDropdownClick('weekly')}>Weekly</li>
            <li onClick={() => handleDropdownClick('monthly')}>Monthly</li>
            <li onClick={() => handleDropdownClick('yearly')}>Yearly</li>
          </ul>
        </div>
        <div className={styles.legend}>
          <div style={{ color: '#000' }}>
            <span style={{ backgroundColor: '#1abc9c' }}></span> This {timeframe}
          </div>
          <div style={{ color: '#000' }}>
            <span style={{ backgroundColor: '#bdc3c7' }}></span> Last {timeframe}
          </div>
        </div>
      </div>
      <Bar data={data[timeframe]} options={options} />
    </div>
  )
}

export default Statistics
