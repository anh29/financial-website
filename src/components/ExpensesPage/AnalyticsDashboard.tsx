import React from 'react'
import styles from './AnalyticsDashboard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faChartBar, faChartPie, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { Line, Bar, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  TooltipItem
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Define the prop types for all analytics/chart/table data
interface AnalyticsDashboardProps {
  radarLabels: string[]
  radarValues: number[]
  highest: {
    category: string
    amount: number
  }
  lowest: {
    category: string
    amount: number
  }
  weeklySpendingData: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
    }[]
  }
  weeklySpendingSummary: {
    total: number
    average: number
    highest: number
    lowest: number
  }
  trendsData: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
    }[]
  }
  periodComparison: {
    current: number
    previous: number
    change: number
  }
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  radarLabels,
  radarValues,
  highest,
  lowest,
  weeklySpendingData,
  weeklySpendingSummary,
  trendsData,
  periodComparison
}) => {
  // Helper function to calculate variance
  function calculateVariance(data: number[]): number {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length
    const squaredDiffs = data.map((val) => Math.pow(val - mean, 2))
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length
  }

  // Helper function to determine trend direction
  function calculateTrendDirection(data: number[], averageMonthly: number): 'up' | 'down' | 'stable' {
    const firstHalf = data.slice(0, 6).reduce((sum, val) => sum + val, 0) / 6
    const secondHalf = data.slice(6).reduce((sum, val) => sum + val, 0) / 6
    const difference = secondHalf - firstHalf
    if (Math.abs(difference) < averageMonthly * 0.05) return 'stable'
    return difference > 0 ? 'up' : 'down'
  }

  // Calculate yearly metrics
  const totalSpending = trendsData.datasets[0].data.reduce((sum, val) => sum + val, 0)
  const averageMonthly = totalSpending / 12
  const highestMonth = trendsData.labels[trendsData.datasets[0].data.indexOf(Math.max(...trendsData.datasets[0].data))]
  const lowestMonth = trendsData.labels[trendsData.datasets[0].data.indexOf(Math.min(...trendsData.datasets[0].data))]
  const monthlyVariance = calculateVariance(trendsData.datasets[0].data)
  const trendDirection = calculateTrendDirection(trendsData.datasets[0].data, averageMonthly)

  const yearlySummary = {
    totalSpending,
    averageMonthly,
    highestMonth,
    lowestMonth,
    monthlyVariance,
    trendDirection
  }

  // Common chart options with enhanced tooltips
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 'normal' as const
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2d3748',
        bodyColor: '#4a5568',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true
      }
    }
  }

  // Enhanced chart-specific options
  const radarOptions: ChartOptions<'radar'> = {
    ...commonOptions,
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          callback: function (value) {
            return value + '%'
          }
        }
      }
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: function (tooltipItem: TooltipItem<'radar'>) {
            const value = tooltipItem.raw as number
            return `${tooltipItem.dataset.label}: ${value.toFixed(1)}%`
          }
        }
      }
    }
  }

  const barOptions: ChartOptions<'bar'> = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString('vi-VN') + 'đ'
          }
        }
      }
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: function (tooltipItem: TooltipItem<'bar'>) {
            const value = tooltipItem.parsed.y
            return `${tooltipItem.dataset.label}: ${value.toLocaleString('vi-VN')}đ`
          }
        }
      }
    }
  }

  const lineOptions: ChartOptions<'line'> = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số tiền',
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          callback: function (value) {
            return value.toLocaleString('vi-VN') + 'đ'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tháng',
          font: {
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: function (tooltipItem: TooltipItem<'line'>) {
            const value = tooltipItem.parsed.y
            return `${tooltipItem.dataset.label}: ${value.toLocaleString('vi-VN')}đ`
          }
        }
      }
    }
  }

  // Spending Distribution Chart (Radar)
  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: 'Phân bổ chi tiêu',
        data: radarValues,
        backgroundColor: 'rgba(26, 188, 156, 0.2)',
        borderColor: '#1abc9c',
        borderWidth: 2,
        pointBackgroundColor: '#1abc9c',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#1abc9c'
      }
    ]
  }

  // Weekly Spending Chart (Bar)
  const barData = {
    ...weeklySpendingData,
    datasets: [
      {
        ...weeklySpendingData.datasets[0],
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        borderColor: '#3498db',
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 20
      }
    ]
  }

  // Trends Chart (Line)
  const lineData = {
    ...trendsData,
    datasets: [
      {
        ...trendsData.datasets[0],
        fill: true,
        backgroundColor: 'rgba(26, 188, 156, 0.1)',
        borderColor: '#1abc9c',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }

  return (
    <div className={styles.analyticsDashboard}>
      <div className={styles.analyticsGrid}>
        {/* Spending Distribution Section */}
        <div className={styles.analyticsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <FontAwesomeIcon icon={faChartPie} />
              <h3>Phân bổ chi tiêu</h3>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <Radar data={radarData} options={radarOptions} />
          </div>
          <div className={styles.cardInsights}>
            <div className={styles.insight}>
              <span className={styles.insightLabel}>Cao nhất:</span>
              <span className={styles.insightValue}>
                {highest.category} ({highest?.amount?.toLocaleString()} VND)
              </span>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightLabel}>Thấp nhất:</span>
              <span className={styles.insightValue}>
                {lowest.category} ({lowest.amount.toLocaleString()} VND)
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Spending Section */}
        <div className={styles.analyticsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <FontAwesomeIcon icon={faChartBar} />
              <h3>Chi tiêu hàng tuần</h3>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <Bar data={barData} options={barOptions} />
          </div>
          <div className={styles.cardInsights}>
            <div className={styles.insight}>
              <span className={styles.insightLabel}>Ngày chi tiêu cao nhất:</span>
              <span className={styles.insightValue}>{weeklySpendingSummary.highest.toLocaleString()} VND</span>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightLabel}>Trung bình hàng ngày:</span>
              <span className={styles.insightValue}>{weeklySpendingSummary.average.toLocaleString()} VND</span>
            </div>
          </div>
        </div>

        {/* Spending Trends Section - Full Width */}
        <div className={`${styles.analyticsCard} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <FontAwesomeIcon icon={faChartLine} />
              <h3>Xu hướng chi tiêu hàng năm</h3>
              <div className={styles.trendIndicator}>
                <FontAwesomeIcon
                  icon={yearlySummary.trendDirection === 'up' ? faArrowUp : faArrowDown}
                  className={yearlySummary.trendDirection === 'up' ? styles.negative : styles.positive}
                />
                <span className={yearlySummary.trendDirection === 'up' ? styles.negative : styles.positive}>
                  {yearlySummary.trendDirection === 'up' ? 'Xu hướng tăng' : 'Xu hướng giảm'}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <Line data={lineData} options={lineOptions} />
          </div>
          <div className={styles.cardInsights}>
            <div className={styles.insight}>
              <span className={styles.insightLabel}>Tổng chi tiêu hàng năm:</span>
              <span className={styles.insightValue}>{yearlySummary.totalSpending.toLocaleString()} VND</span>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightLabel}>Chi tiêu trung bình hàng tháng:</span>
              <span className={styles.insightValue}>{yearlySummary.averageMonthly.toLocaleString()} VND</span>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightLabel}>Tháng chi tiêu cao nhất:</span>
              <span className={styles.insightValue}>{yearlySummary.highestMonth}</span>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightLabel}>Tháng chi tiêu thấp nhất:</span>
              <span className={styles.insightValue}>{yearlySummary.lowestMonth}</span>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightLabel}>Độ biến động hàng tháng:</span>
              <span className={styles.insightValue}>
                {Math.sqrt(yearlySummary.monthlyVariance).toLocaleString()} VND
              </span>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightLabel}>Thay đổi so với năm trước:</span>
              <span
                className={`${styles.insightValue} ${periodComparison.change >= 0 ? styles.negative : styles.positive}`}
              >
                {periodComparison.change >= 0 ? '↑' : '↓'} {Math.abs(periodComparison.change).toLocaleString()} %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
