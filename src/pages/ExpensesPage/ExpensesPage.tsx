import React, { useState } from 'react'
import styles from './ExpensesPage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse,
  faUtensils,
  faBus,
  faFilm,
  faShoppingBag,
  faEllipsisH,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons'
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import ExpensesBreakdown from './ExpensesBreakdown/ExpensesBreakdown'

ChartJS.register(ArcElement, Tooltip, Legend)

const expensesData = [
  {
    category: 'Housing',
    amount: 250.0,
    details: [
      'House Rent: $230',
      'Parking: $20',
      'House Rent: $230',
      'Parking: $20',
      'House Rent: $230',
      'Parking: $20'
    ],
    change: 15,
    direction: 'up'
  },
  {
    category: 'Food',
    amount: 350.0,
    details: ['Grocery: $230', 'Restaurant bill: $120'],
    change: 8,
    direction: 'down'
  },
  {
    category: 'Transportation',
    amount: 50.0,
    details: ['Taxi Fare: $30', 'Metro Card bill: $20'],
    change: 12,
    direction: 'down'
  },
  {
    category: 'Entertainment',
    amount: 80.0,
    details: ['Movie ticket: $30', 'iTunes: $50'],
    change: 15,
    direction: 'up'
  },
  { category: 'Shopping', amount: 420.0, details: ['Shirt: $230', 'Jeans: $190'], change: 25, direction: 'up' },
  { category: 'Others', amount: 50.0, details: ['Donation: $30', 'Gift: $20'], change: 23, direction: 'up' }
]

const categoryColors = {
  Housing: '#1abc9c',
  Food: '#3498db',
  Transportation: '#9b59b6',
  Entertainment: '#e74c3c',
  Shopping: '#f1c40f',
  Others: '#95a5a6'
}

const weeklyData = {
  Housing: [60, 70, 50, 70],
  Food: [80, 90, 100, 80],
  Transportation: [10, 15, 12, 13],
  Entertainment: [20, 25, 15, 20],
  Shopping: [100, 120, 110, 90],
  Others: [10, 15, 12, 13]
}

const getComparisonData = (comparisonPeriod, viewMode) => {
  let comparisonData
  switch (comparisonPeriod) {
    case 'Last Quarter':
      comparisonData = lastQuarterData
      break
    case 'Last Year':
      comparisonData = lastYearData
      break
    default:
      comparisonData = lastMonthData
  }

  const currentColors = expensesData.map((expense) => categoryColors[expense.category])
  const comparisonColors = currentColors.map((color) => `${color}80`)

  if (viewMode === 'Weekly') {
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: Object.keys(weeklyData).map((category) => ({
        label: category,
        data: weeklyData[category],
        borderColor: categoryColors[category],
        backgroundColor: `${categoryColors[category]}80`,
        borderWidth: 2
      }))
    }
  }

  if (viewMode === 'Category') {
    return {
      labels: expensesData.map((expense) => expense.category),
      datasets: [
        {
          label: 'Current',
          data: expensesData.map((expense) => expense.amount),
          backgroundColor: currentColors,
          borderColor: '#ffffff',
          borderWidth: 2
        },
        {
          label: comparisonPeriod,
          data: comparisonData.map((expense) => expense.amount),
          backgroundColor: comparisonColors,
          borderColor: '#ffffff',
          borderWidth: 2
        }
      ]
    }
  } else {
    const currentTotal = expensesData.reduce((sum, expense) => sum + expense.amount, 0)
    const comparisonTotal = comparisonData.reduce((sum, expense) => sum + expense.amount, 0)
    return {
      labels: ['Total Expenses'],
      datasets: [
        {
          label: 'Current',
          data: [currentTotal],
          backgroundColor: '#3498db',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        {
          label: comparisonPeriod,
          data: [comparisonTotal],
          backgroundColor: '#95a5a6',
          borderColor: '#ffffff',
          borderWidth: 2
        }
      ]
    }
  }
}

const chartOptions = (comparisonPeriod, viewMode) => ({
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const datasetIndex = tooltipItem.datasetIndex // Get the dataset index (0 for current, 1 for comparison)
          const dataIndex = tooltipItem.dataIndex // Get the data index
          const datasetLabel = tooltipItem.dataset.label // Get the dataset label (e.g., "Current" or "Last Month")
          const amount =
            datasetIndex === 0
              ? expensesData[dataIndex].amount // Current dataset
              : getComparisonData(comparisonPeriod, viewMode).datasets[1].data[dataIndex] // Pass viewMode
          return `${datasetLabel}: $${amount.toFixed(2)}`
        }
      },
      backgroundColor: '#ffffff',
      titleColor: '#34495e',
      bodyColor: '#34495e',
      borderColor: '#ecf0f1',
      borderWidth: 1
    },
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        font: {
          size: 12
        },
        color: '#34495e'
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#7f8c8d'
      }
    },
    y: {
      grid: {
        color: '#ecf0f1'
      },
      ticks: {
        color: '#7f8c8d'
      }
    }
  },
  elements: {
    line: {
      tension: 0.2
    },
    point: {
      radius: 4,
      backgroundColor: '#ffffff',
      borderWidth: 2,
      borderColor: '#3498db'
    }
  }
})

const iconMap = {
  Housing: faHouse,
  Food: faUtensils,
  Transportation: faBus,
  Entertainment: faFilm,
  Shopping: faShoppingBag,
  Others: faEllipsisH
}

const comparisonOptions = ['Last Month', 'Last Quarter', 'Last Year']

const lastMonthData = [
  { category: 'Housing', amount: 230.0 },
  { category: 'Food', amount: 300.0 },
  { category: 'Transportation', amount: 60.0 },
  { category: 'Entertainment', amount: 70.0 },
  { category: 'Shopping', amount: 400.0 },
  { category: 'Others', amount: 40.0 }
]

const lastQuarterData = [
  { category: 'Housing', amount: 240.0 },
  { category: 'Food', amount: 320.0 },
  { category: 'Transportation', amount: 55.0 },
  { category: 'Entertainment', amount: 75.0 },
  { category: 'Shopping', amount: 390.0 },
  { category: 'Others', amount: 45.0 }
]

const lastYearData = [
  { category: 'Housing', amount: 220.0 },
  { category: 'Food', amount: 280.0 },
  { category: 'Transportation', amount: 50.0 },
  { category: 'Entertainment', amount: 60.0 },
  { category: 'Shopping', amount: 350.0 },
  { category: 'Others', amount: 30.0 }
]

const ExpensesPage = () => {
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [chartType, setChartType] = useState('Pie')
  const [comparisonPeriod, setComparisonPeriod] = useState('Last Month')
  const [viewMode, setViewMode] = useState('Category')
  const [isChartLoading, setIsChartLoading] = useState(false)

  const handleComparisonChange = (event) => {
    setComparisonPeriod(event.target.value)
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  const handleCardClick = (expense) => {
    setSelectedExpense(expense)
  }

  const closeModal = () => {
    setSelectedExpense(null)
  }

  const handleChartTypeChange = (type) => {
    setIsChartLoading(true)
    setChartType(type)
    setTimeout(() => setIsChartLoading(false), 500)
  }

  const renderChart = () => {
    const data = getComparisonData(comparisonPeriod, viewMode)

    if (chartType === 'Line' && viewMode === 'Weekly') {
      data.datasets.forEach((dataset) => {
        dataset.fill = false // Disable area fill for weekly line chart
      })
    }

    if (chartType === 'Line') {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Create gradient for the current dataset
      const currentGradientColors = expensesData.map((expense, index) => {
        const nextIndex = (index + 1) % expensesData.length
        const gradient = ctx.createLinearGradient(0, 0, 400, 0)
        gradient.addColorStop(0, categoryColors[expense.category])
        gradient.addColorStop(1, categoryColors[expensesData[nextIndex].category])
        return gradient
      })

      // Create gradient for the comparison dataset (lighter colors)
      const comparisonGradientColors = expensesData.map((expense, index) => {
        const nextIndex = (index + 1) % expensesData.length
        const gradient = ctx.createLinearGradient(0, 0, 400, 0)
        gradient.addColorStop(0, `${categoryColors[expense.category]}80`) // Add transparency
        gradient.addColorStop(1, `${categoryColors[expensesData[nextIndex].category]}80`) // Add transparency
        return gradient
      })

      // Apply gradients to the datasets
      data.datasets[0].borderColor = currentGradientColors
      data.datasets[0].backgroundColor = 'rgba(52, 152, 219, 0.2)' // Light blue fill under the line
      data.datasets[1].borderColor = comparisonGradientColors
      data.datasets[1].backgroundColor = 'rgba(149, 165, 166, 0.2)' // Light gray fill under the line
    }

    switch (chartType) {
      case 'Bar':
        return <Bar data={data} options={chartOptions(comparisonPeriod, viewMode)} />
      case 'Line':
        return <Line data={data} options={chartOptions(comparisonPeriod, viewMode)} />
      case 'Doughnut':
        return <Doughnut data={data} options={chartOptions(comparisonPeriod, viewMode)} />
      default:
        return <Pie data={data} options={chartOptions(comparisonPeriod, viewMode)} />
    }
  }

  return (
    <div className={styles.expensesPage}>
      <header className={styles.header}>
        <h1>Expenses</h1>
        <p>Track and manage your expenses effectively.</p>
      </header>
      <section className={styles.expensesComparison}>
        <h2>Expenses Comparison</h2>
        <div className={styles.comparisonControls}>
          <select className={styles.comparisonDropdown} value={comparisonPeriod} onChange={handleComparisonChange}>
            {comparisonOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.viewModeControls}>
          <button
            className={`${styles.viewModeButton} ${viewMode === 'Category' ? styles.active : ''}`}
            onClick={() => handleViewModeChange('Category')}
          >
            By Category
          </button>
          <button
            className={`${styles.viewModeButton} ${viewMode === 'Total' ? styles.active : ''}`}
            onClick={() => handleViewModeChange('Total')}
          >
            Total Expenses
          </button>
          <button
            className={`${styles.viewModeButton} ${viewMode === 'Weekly' ? styles.active : ''}`}
            onClick={() => handleViewModeChange('Weekly')}
          >
            Weekly
          </button>
        </div>
        <div className={styles.chartControls}>
          <button
            className={`${styles.chartButton} ${chartType === 'Pie' ? styles.active : ''}`}
            onClick={() => handleChartTypeChange('Pie')}
          >
            Pie Chart
          </button>
          <button
            className={`${styles.chartButton} ${chartType === 'Bar' ? styles.active : ''}`}
            onClick={() => handleChartTypeChange('Bar')}
          >
            Bar Chart
          </button>
          <button
            className={`${styles.chartButton} ${chartType === 'Line' ? styles.active : ''}`}
            onClick={() => handleChartTypeChange('Line')}
          >
            Line Chart
          </button>
          <button
            className={`${styles.chartButton} ${chartType === 'Doughnut' ? styles.active : ''}`}
            onClick={() => handleChartTypeChange('Doughnut')}
          >
            Doughnut Chart
          </button>
        </div>
        <div className={styles.chartContainer}>
          {isChartLoading && (
            <div className={styles.chartLoading}>
              <div className={styles.spinner}></div>
            </div>
          )}
          {!isChartLoading && renderChart()}
        </div>
      </section>
      <ExpensesBreakdown
        expensesData={expensesData}
        selectedExpense={selectedExpense}
        setSelectedExpense={setSelectedExpense}
      />
    </div>
  )
}

export default ExpensesPage
