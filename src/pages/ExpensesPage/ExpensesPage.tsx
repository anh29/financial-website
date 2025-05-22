import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styles from './ExpensesPage.module.css'
import { faPlus, faChartLine, faList, faHome } from '@fortawesome/free-solid-svg-icons'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from 'chart.js'
import { Tabs } from '../../components/common/Tabs/Tabs'
import OverviewSummary from '../../components/ExpensesPage/OverviewSummary'
import ExpensesTable from '../../components/ExpensesPage/ExpensesTable'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import AnalyticsDashboard from '../../components/ExpensesPage/AnalyticsDashboard'
import { useExpenses } from '../../hooks/features/useExpenses'
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

const ExpensesPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'list'>('overview')
  const navigate = useNavigate()
  const currentDate = new Date()
  const [calendarMonth, setCalendarMonth] = useState(currentDate.getMonth()) // Current month (0-based)
  const [calendarYear, setCalendarYear] = useState(currentDate.getFullYear()) // Current year
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showDayModal, setShowDayModal] = useState(false)
  const { expenses: expensesData, error, fetchExpenses, isLoading } = useExpenses()

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const filteredData = useMemo(() => {
    return expensesData.filter(
      (e) =>
        (!search || e.description.toLowerCase().includes(search.toLowerCase())) &&
        (!filterCategory || e.category === filterCategory)
    )
  }, [search, filterCategory, expensesData])

  const topCategory = expensesData.length > 0 ? expensesData.reduce((a, b) => (a.amount > b.amount ? a : b)) : null
  const averageDaily = expensesData.reduce((sum, e) => sum + e.amount, 0) / 30 // Assuming 30 days in a month

  // Expenses for selected day
  const dayExpenses = useMemo(() => {
    if (selectedDay == null) return []
    return expensesData.filter((e) => {
      const date = new Date(e.date)
      return date.getDate() === selectedDay && date.getMonth() === calendarMonth && date.getFullYear() === calendarYear
    })
  }, [selectedDay, calendarMonth, calendarYear, expensesData])

  // Compute analytics data
  const analyticsData = useMemo(() => {
    if (expensesData.length === 0) {
      return {
        radarLabels: [],
        radarValues: [],
        highest: { category: '', amount: 0 },
        lowest: { category: '', amount: 0 },
        weeklySpendingData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ label: 'Daily Spending', data: [0, 0, 0, 0, 0, 0, 0] }]
        },
        weeklySpendingSummary: {
          total: 0,
          average: 0,
          highest: 0,
          lowest: 0
        },
        trendsData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{ label: 'Monthly Spending', data: Array(12).fill(0) }]
        },
        periodComparison: {
          current: 0,
          previous: 0,
          change: 0
        }
      }
    }

    // Radar chart data (spending distribution by category)
    const categoryTotals = expensesData.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>
    )

    const totalSpending = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
    const radarLabels = Object.keys(categoryTotals)
    const radarValues = Object.values(categoryTotals).map((amount) => (amount / totalSpending) * 100)

    // Find highest and lowest spending categories
    const categoryPercentages = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      percent: (amount / totalSpending) * 100
    }))
    const highest = categoryPercentages.reduce((a, b) => (a.percent > b.percent ? a : b))
    const lowest = categoryPercentages.reduce((a, b) => (a.percent < b.percent ? a : b))

    // Weekly spending data
    const weeklyData = expensesData.reduce(
      (acc, expense) => {
        const date = new Date(expense.date)
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' })
        acc[dayOfWeek] = (acc[dayOfWeek] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>
    )

    const weeklySpendingData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Daily Spending',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => weeklyData[day] || 0)
        }
      ]
    }

    // Weekly spending summary
    const weeklySpendingSummary = {
      total: Object.values(weeklyData).reduce((sum, amount) => sum + amount, 0),
      average: Object.values(weeklyData).reduce((sum, amount) => sum + amount, 0) / 7,
      highest: Math.max(...Object.values(weeklyData)),
      lowest: Math.min(...Object.values(weeklyData))
    }

    // Compute real monthly totals for the selected year
    const monthlyTotals = Array(12).fill(0)
    expensesData.forEach((e) => {
      const date = new Date(e.date)
      if (date.getFullYear() === calendarYear) {
        monthlyTotals[date.getMonth()] += e.amount
      }
    })
    const trendsData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Monthly Spending',
          data: monthlyTotals
        }
      ]
    }

    // Period comparison
    const periodComparison = {
      current: totalSpending,
      previous: totalSpending * 0.9, // This should be computed from real data
      change: ((totalSpending - totalSpending * 0.9) / (totalSpending * 0.9)) * 100
    }

    return {
      radarLabels,
      radarValues,
      highest: { category: highest.category, amount: categoryTotals[highest.category] },
      lowest: { category: lowest.category, amount: categoryTotals[lowest.category] },
      weeklySpendingData,
      weeklySpendingSummary,
      trendsData,
      periodComparison
    }
  }, [expensesData, calendarYear])

  // Compute calendar heatmap data for the selected month/year
  const calendarHeatmapData = useMemo(() => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
    const data: { day: number; amount: number }[] = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      amount: 0
    }))
    expensesData.forEach((e) => {
      const date = new Date(e.date)
      if (date.getMonth() === calendarMonth && date.getFullYear() === calendarYear) {
        const day = date.getDate()
        data[day - 1].amount += e.amount
      }
    })
    return data
  }, [expensesData, calendarMonth, calendarYear])

  // Group and sum expenses by category for the pie chart breakdown
  const categoryBreakdown = useMemo(() => {
    const grouped = expensesData.reduce(
      (acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount
        return acc
      },
      {} as Record<string, number>
    )
    return Object.entries(grouped).map(([category, amount]) => ({ category, amount }))
  }, [expensesData])

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId as 'overview' | 'analytics' | 'list')
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const handleFilterCategory = useCallback((category: string) => {
    setFilterCategory(category)
  }, [])

  const handleExport = useCallback(() => {
    const headers = ['Date,Category,Amount,Details']
    const rows = filteredData.map((e) => `${e.date},${e.category},${e.amount},"${e.description}"`)
    const csv = headers.concat(rows).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'expenses.csv'
    a.click()
  }, [filteredData])

  const handleCloseModal = useCallback(() => {
    setShowDayModal(false)
    setSelectedDay(null)
  }, [])

  if (error) {
    return <div>Error loading expenses: {error}</div>
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: faHome,
      content: (
        <OverviewSummary
          topCategory={topCategory?.category || ''}
          averageDaily={averageDaily}
          categoryBreakdown={categoryBreakdown}
          allExpenses={expensesData}
          calendarMonth={calendarMonth}
          calendarYear={calendarYear}
          setCalendarMonth={setCalendarMonth}
          setCalendarYear={setCalendarYear}
          analyticsData={{ ...analyticsData, calendarHeatmapData }}
          showDayModal={showDayModal}
          setShowDayModal={setShowDayModal}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          dayExpenses={dayExpenses}
          monthNames={monthNames}
          handleAddExpense={() => navigate('/expenses/add')}
          onShowListTab={() => handleTabChange('list')}
        />
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: faChartLine,
      content: <AnalyticsDashboard {...analyticsData} />
    },
    {
      id: 'list',
      label: 'List',
      icon: faList,
      content: (
        <ExpensesTable
          expenses={filteredData}
          onSearch={handleSearch}
          onFilterCategory={handleFilterCategory}
          search={search}
          filterCategory={filterCategory}
          onExport={handleExport}
        />
      )
    }
  ]
  console.log('expensesData', expensesData)
  return (
    <div className={styles.expensesPage}>
      <div className={styles.header}>
        <h1>Expenses</h1>
        <div className={styles.actions}>
          <button className={styles.addButton} onClick={() => navigate('/expenses/add')}>
            <FontAwesomeIcon icon={faPlus} /> Add Expense
          </button>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      )}
      {showDayModal && selectedDay !== null && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>
              Expenses for {monthNames[calendarMonth]} {selectedDay}
            </h2>
            <div className={styles.dayExpenses}>
              {dayExpenses.map((expense) => (
                <div key={expense.id} className={styles.expenseItem}>
                  <span className={styles.expenseDescription}>{expense.description}</span>
                  <span className={styles.expenseAmount}>{expense.amount.toLocaleString()} VND</span>
                </div>
              ))}
            </div>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpensesPage
