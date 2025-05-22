import React from 'react'
import styles from './OverviewSummary.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
  faLightbulb,
  faChartPie,
  faArrowUp,
  faArrowDown,
  faCalendarAlt,
  faWallet,
  faChartBar,
  faList
} from '@fortawesome/free-solid-svg-icons'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'
import CalendarHeatmapCard from './CalendarHeatmapCard'
import DayDetailModal from './DayDetailModal'
import { Transaction } from '../../types/transaction'
import { categoryColors } from '../../utils/categoryUtils'
ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  topCategory: string
  averageDaily: number
  categoryBreakdown?: { category: string; amount: number; allocation?: { [date: string]: number } }[]
  allExpenses: Transaction[]
}

type OverviewSummaryProps = Props & {
  calendarMonth: number
  calendarYear: number
  setCalendarMonth: (m: number) => void
  setCalendarYear: (y: number) => void
  analyticsData: {
    radarLabels: string[]
    radarValues: number[]
    highest: { category: string; amount: number }
    lowest: { category: string; amount: number }
    weeklySpendingData: {
      labels: string[]
      datasets: { label: string; data: number[] }[]
    }
    weeklySpendingSummary: {
      total: number
      average: number
      highest: number
      lowest: number
    }
    trendsData: {
      labels: string[]
      datasets: { label: string; data: number[] }[]
    }
    periodComparison: {
      current: number
      previous: number
      change: number
    }
    calendarHeatmapData?: { day: number; amount: number }[]
  }
  showDayModal: boolean
  setShowDayModal: (open: boolean) => void
  selectedDay: number | null
  setSelectedDay: (day: number | null) => void
  dayExpenses: Transaction[]
  monthNames: string[]
  handleAddExpense: () => void
  onShowListTab: () => void
}

const OverviewSummary: React.FC<OverviewSummaryProps> = ({
  topCategory,
  averageDaily,
  categoryBreakdown = [],
  allExpenses,
  calendarMonth,
  calendarYear,
  setCalendarMonth,
  setCalendarYear,
  analyticsData,
  showDayModal,
  setShowDayModal,
  selectedDay,
  setSelectedDay,
  dayExpenses,
  monthNames,
  handleAddExpense,
  onShowListTab
}) => {
  const pieData = {
    labels: categoryBreakdown.map((cat) => cat.category),
    datasets: [
      {
        data: categoryBreakdown.map((cat) => cat.amount),
        backgroundColor: categoryBreakdown.map((cat) => categoryColors[cat.category] || '#ccc'),
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  }

  const pieOptions: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        maxWidth: 400,
        maxHeight: 200,
        align: 'center',
        labels: {
          boxWidth: 18,
          padding: 30,
          font: {
            size: 15,
            weight: 'normal'
          }
        }
      }
    },
    maintainAspectRatio: false
  }

  // Calculate additional analytics
  const calculateAnalytics = () => {
    if (allExpenses.length === 0) {
      return {
        monthOverMonthChange: 0,
        highestSpendingDay: { day: 'No data', average: 0 },
        categoryGrowth: {}
      }
    }

    const total = allExpenses.reduce((sum, e) => sum + e.amount, 0)
    const previousMonthTotal = total * 0.85 // Mock data - replace with actual previous month data
    const monthOverMonthChange = ((total - previousMonthTotal) / previousMonthTotal) * 100

    const dailyAverages = allExpenses.reduce(
      (acc, expense) => {
        const date = new Date(expense.date)
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
        if (!acc[dayOfWeek]) {
          acc[dayOfWeek] = { total: 0, count: 0 }
        }
        acc[dayOfWeek].total += expense.amount
        acc[dayOfWeek].count++
        return acc
      },
      {} as Record<string, { total: number; count: number }>
    )

    const dailyAveragesArray = Object.entries(dailyAverages).map(([day, data]) => ({
      day,
      average: data.total / data.count
    }))

    const highestSpendingDay = dailyAveragesArray.length > 0
      ? dailyAveragesArray.reduce((a, b) => (a.average > b.average ? a : b))
      : { day: 'No data', average: 0 }

    const categoryGrowth = categoryBreakdown.length > 0
      ? categoryBreakdown.reduce(
          (acc, curr) => {
            const prevAmount = curr.amount * 0.9 // Mock data - replace with actual previous period data
            const growth = ((curr.amount - prevAmount) / prevAmount) * 100
            acc[curr.category] = growth
            return acc
          },
          {} as Record<string, number>
        )
      : {}

    return {
      monthOverMonthChange,
      highestSpendingDay,
      categoryGrowth
    }
  }

  const analytics = calculateAnalytics()

  return (
    <div className={styles.overviewExpensesSection}>
      <div className={styles.topRow}>
        <div className={styles.calendarSection}>
          <CalendarHeatmapCard
            data={analyticsData.calendarHeatmapData || []}
            month={calendarMonth}
            year={calendarYear}
            onPrevMonth={() => {
              if (calendarMonth === 0) {
                setCalendarMonth(11)
                setCalendarYear(calendarYear - 1)
              } else {
                setCalendarMonth(calendarMonth - 1)
              }
            }}
            onNextMonth={() => {
              if (calendarMonth === 11) {
                setCalendarMonth(0)
                setCalendarYear(calendarYear + 1)
              } else {
                setCalendarMonth(calendarMonth + 1)
              }
            }}
            onDayClick={(day) => {
              setSelectedDay(day)
              setShowDayModal(true)
            }}
          />
        </div>
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <FontAwesomeIcon icon={faChartPie} />
            <h3>Category Breakdown</h3>
            <button
              className={styles.showDetailsIconBtn}
              onClick={onShowListTab}
              title="Xem chi tiết"
            >
              <FontAwesomeIcon icon={faList} />
            </button>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.chartContent}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
      <DayDetailModal
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
        selectedDay={selectedDay}
        calendarMonth={calendarMonth}
        calendarYear={calendarYear}
        dayExpenses={dayExpenses}
        monthNames={monthNames}
        handleAddExpense={handleAddExpense}
      />
      <div className={styles.detailedAnalytics}>
        <div className={styles.analyticsHeader}>
          <div className={styles.analyticsTitle}>
            <FontAwesomeIcon icon={faChartLine} />
            <h2>Detailed Analytics</h2>
          </div>
        </div>

        <div className={styles.analyticsGrid}>
          <div className={styles.analyticsCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Monthly Change</span>
              <FontAwesomeIcon
                icon={analytics.monthOverMonthChange >= 0 ? faArrowUp : faArrowDown}
                className={analytics.monthOverMonthChange >= 0 ? styles.positiveChange : styles.negativeChange}
              />
            </div>
            <div className={styles.cardValue}>{Math.abs(analytics.monthOverMonthChange).toFixed(1)}%</div>
            <div className={styles.cardChange}>
              <span className={analytics.monthOverMonthChange >= 0 ? styles.negativeChange : styles.positiveChange}>
                {analytics.monthOverMonthChange >= 0 ? 'Increase' : 'Decrease'} from last month
              </span>
            </div>
          </div>

          <div className={styles.analyticsCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Highest Spending Day</span>
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
            <div className={styles.cardValue}>{analytics.highestSpendingDay.day}</div>
            <div className={styles.cardChange}>
              <span className={styles.negativeChange}>{analytics.highestSpendingDay.average.toLocaleString()} VND</span>
            </div>
          </div>

          <div className={styles.analyticsCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Top Category Growth</span>
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <div className={styles.cardValue}>{topCategory}</div>
            <div className={styles.cardChange}>
              <span className={styles.negativeChange}>
                {analytics.categoryGrowth && topCategory && analytics.categoryGrowth[topCategory]
                  ? `${analytics.categoryGrowth[topCategory].toFixed(1)}% growth`
                  : 'No growth data available'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.insightsList}>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon} style={{ background: 'rgba(56, 161, 105, 0.1)', color: '#38a169' }}>
              <FontAwesomeIcon icon={faWallet} />
            </div>
            <div className={styles.insightContent}>
              <div className={styles.insightTitle}>Daily Average</div>
              <div className={styles.insightValue}>{averageDaily.toLocaleString()} VND</div>
            </div>
          </div>

          <div className={styles.insightItem}>
            <div className={styles.insightIcon} style={{ background: 'rgba(237, 100, 166, 0.1)', color: '#ed64a6' }}>
              <FontAwesomeIcon icon={faLightbulb} />
            </div>
            <div className={styles.insightContent}>
              <div className={styles.insightTitle}>Spending Pattern</div>
              <div className={styles.insightValue}>
                {analytics.monthOverMonthChange > 0 ? 'Increasing' : 'Decreasing'} trend
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewSummary
