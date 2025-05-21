import React from 'react'
import styles from './OverviewSummary.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDollarSign,
  faTrophy,
  faCalendarDay,
  faChartLine,
  faLightbulb,
  faChartPie,
  faArrowUp,
  faArrowDown,
  faCalendarAlt,
  faWallet,
  faChartBar
} from '@fortawesome/free-solid-svg-icons'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'
import CalendarHeatmapCard from './CalendarHeatmapCard'
import DayDetailModal from './DayDetailModal'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  totalExpenses: number
  topCategory: string
  averageDaily: number
  previousMonthTotal?: number
  monthlyBudget?: number
  categoryBreakdown?: { category: string; amount: number; allocation?: { [date: string]: number } }[]
  allExpenses: Array<{
    id: string
    category: string
    amount: number
    date: string
    details: string
    tags: string[]
    note: string
    change: number
    direction: 'up' | 'down'
    allocation?: { [date: string]: number }
  }>
}

type OverviewSummaryProps = Props & {
  calendarMonth: number
  calendarYear: number
  setCalendarMonth: (m: number) => void
  setCalendarYear: (y: number) => void
  analyticsData: any
  showDayModal: boolean
  setShowDayModal: (open: boolean) => void
  selectedDay: number | null
  setSelectedDay: (day: number | null) => void
  dayExpenses: any[]
  monthNames: string[]
  handleAddExpense: () => void
}

const OverviewSummary: React.FC<OverviewSummaryProps> = ({
  totalExpenses,
  topCategory,
  averageDaily,
  previousMonthTotal,
  monthlyBudget,
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
  handleAddExpense
}) => {
  const pieData = {
    labels: categoryBreakdown.map((cat) => cat.category),
    datasets: [
      {
        data: categoryBreakdown.map((cat) => cat.amount),
        backgroundColor: ['#1abc9c', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f', '#95a5a6'],
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

    const highestSpendingDay = Object.entries(dailyAverages)
      .map(([day, data]) => ({
        day,
        average: data.total / data.count
      }))
      .reduce((a, b) => (a.average > b.average ? a : b))

    const categoryGrowth = categoryBreakdown.reduce(
      (acc, curr) => {
        const prevAmount = curr.amount * 0.9 // Mock data - replace with actual previous period data
        const growth = ((curr.amount - prevAmount) / prevAmount) * 100
        acc[curr.category] = growth
        return acc
      },
      {} as Record<string, number>
    )

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
            data={analyticsData.calendarHeatmapData}
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
      <div className={styles.insightsSection}>
        <div className={styles.insightsHeader}>
          <FontAwesomeIcon icon={faLightbulb} />
          <h3>Key Insights</h3>
        </div>
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
            <div className={styles.insightContent}>
              <h4>Monthly Comparison</h4>
              <p>
                {previousMonthTotal ? (
                  <>
                    You've spent{' '}
                    <span className={styles.insightHighlight}>
                      {totalExpenses > previousMonthTotal ? '↑' : '↓'}{' '}
                      {Math.abs(((totalExpenses - previousMonthTotal) / previousMonthTotal) * 100).toFixed(1)}%
                    </span>{' '}
                    {totalExpenses > previousMonthTotal ? 'more' : 'less'} than last month
                  </>
                ) : (
                  'No previous month data available'
                )}
              </p>
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>
              <FontAwesomeIcon icon={faCalendarDay} />
            </div>
            <div className={styles.insightContent}>
              <h4>Daily Average</h4>
              <p>
                You're spending an average of{' '}
                <span className={styles.insightHighlight}>${averageDaily.toFixed(2)}</span> per day
              </p>
            </div>
          </div>

          {categoryBreakdown.length > 0 && (
            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>
                <FontAwesomeIcon icon={faTrophy} />
              </div>
              <div className={styles.insightContent}>
                <h4>Top Category</h4>
                <p>
                  <span className={styles.insightHighlight}>{categoryBreakdown[0].category}</span> is your highest
                  spending category at {((categoryBreakdown[0].amount / totalExpenses) * 100).toFixed(1)}% of total
                  expenses
                </p>
              </div>
            </div>
          )}

          {monthlyBudget && (
            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div className={styles.insightContent}>
                <h4>Budget Progress</h4>
                <p>
                  You've used{' '}
                  <span className={styles.insightHighlight}>{((totalExpenses / monthlyBudget) * 100).toFixed(1)}%</span>{' '}
                  of your monthly budget
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
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
              <span className={analytics.monthOverMonthChange >= 0 ? styles.positiveChange : styles.negativeChange}>
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
              <span className={styles.positiveChange}>${analytics.highestSpendingDay.average.toFixed(2)} average</span>
            </div>
          </div>

          <div className={styles.analyticsCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Top Category Growth</span>
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <div className={styles.cardValue}>{topCategory}</div>
            <div className={styles.cardChange}>
              <span className={styles.positiveChange}>{analytics.categoryGrowth[topCategory].toFixed(1)}% growth</span>
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
              <div className={styles.insightValue}>${averageDaily.toFixed(2)}</div>
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
