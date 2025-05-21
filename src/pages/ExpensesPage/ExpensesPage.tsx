import React, { useCallback, useMemo, useState } from 'react'
import styles from './ExpensesPage.module.css'
import { faPlus, faChartLine, faList, faFolderOpen, faHome } from '@fortawesome/free-solid-svg-icons'
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
import { Tab } from '../../components/common/Tabs/Tabs'
import OverviewSummary from '../../components/ExpensesPage/OverviewSummary'
import ExpensesTable from '../../components/ExpensesPage/ExpensesTable'
import CategoriesAccordion from '../../components/ExpensesPage/CategoriesAccordion'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import AnalyticsDashboard from '../../components/ExpensesPage/AnalyticsDashboard'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

type DailyAllocation = {
  date: string
  amount: number
}

type Expense = {
  id: string
  category: string
  amount: number
  date: string
  details: string
  tags: string[]
  note: string
  change: number
  direction: 'up' | 'down'
  dailyAllocation?: DailyAllocation[] // Optional: for multi-day/multi-use expenses
}

const expensesData: Expense[] = [
  {
    id: '1',
    category: 'Housing',
    amount: 250,
    date: '2024-05-01',
    details: 'House Rent: $230, Parking: $20',
    tags: ['monthly'],
    note: 'May rent',
    change: 15,
    direction: 'up'
  },
  {
    id: '2',
    category: 'Food',
    amount: 350,
    date: '2024-05-02',
    details: 'Grocery: $230, Restaurant bill: $120',
    tags: [],
    note: '',
    change: 8,
    direction: 'down'
  },
  {
    id: '3',
    category: 'Transportation',
    amount: 50,
    date: '2024-05-03',
    details: 'Taxi Fare: $30, Metro Card bill: $20',
    tags: [],
    note: '',
    change: 12,
    direction: 'down'
  },
  {
    id: '4',
    category: 'Entertainment',
    amount: 80,
    date: '2024-05-04',
    details: 'Movie ticket: $30, iTunes: $50',
    tags: [],
    note: '',
    change: 15,
    direction: 'up'
  },
  {
    id: '5',
    category: 'Shopping',
    amount: 420,
    date: '2024-05-05',
    details: 'Shirt: $230, Jeans: $190',
    tags: [],
    note: '',
    change: 25,
    direction: 'up'
  },
  {
    id: '6',
    category: 'Others',
    amount: 50,
    date: '2024-05-06',
    details: 'Donation: $30, Gift: $20',
    tags: ['charity'],
    note: '',
    change: 23,
    direction: 'up'
  },
  {
    id: '7',
    category: 'Shopping',
    amount: 300,
    date: '2024-05-10',
    details: '3-day conference pass',
    tags: ['multi-day', 'smart-allocated'],
    note: 'TechConf 2024 (May 10-12)',
    change: 0,
    direction: 'up',
    dailyAllocation: [
      { date: '2024-05-10', amount: 100 },
      { date: '2024-05-11', amount: 100 },
      { date: '2024-05-12', amount: 100 }
    ]
  }
]

const ExpensesPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [calendarMonth, setCalendarMonth] = useState(4) // May (0-based month index)
  const [calendarYear, setCalendarYear] = useState(2024) // Year of mock data
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showDayModal, setShowDayModal] = useState(false)

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
        (!search || e.details.toLowerCase().includes(search.toLowerCase())) &&
        (!filterCategory || e.category === filterCategory)
    )
  }, [search, filterCategory])

  const totalExpenses = expensesData.reduce((sum, e) => sum + e.amount, 0)
  const topCategory = expensesData.reduce((a, b) => (a.amount > b.amount ? a : b))
  const averageDaily = totalExpenses / 30 // Assuming 30 days in a month`

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

    // Trends data (last 6 months)
    const trendsData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Monthly Spending',
          data: [3000, 3500, 3200, 3800, 3600, 4000] // This should be computed from real data
        }
      ]
    }

    // Period comparison
    const periodComparison = {
      current: totalSpending,
      previous: totalSpending * 0.9, // This should be computed from real data
      change: 10 // This should be computed from real data
    }

    // Calendar Heatmap Data (for selected month/year)
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
    const calendarHeatmapData = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, amount: 0 }))
    expensesData.forEach((expense) => {
      const date = new Date(expense.date)
      if (date.getMonth() === calendarMonth && date.getFullYear() === calendarYear) {
        calendarHeatmapData[date.getDate() - 1].amount += expense.amount
      }
    })

    return {
      radarLabels,
      radarValues,
      highest: {
        category: highest.category,
        amount: categoryTotals[highest.category]
      },
      lowest: {
        category: lowest.category,
        amount: categoryTotals[lowest.category]
      },
      weeklySpendingData,
      weeklySpendingSummary,
      trendsData,
      periodComparison,
      calendarHeatmapData
    }
  }, [expensesData, calendarMonth, calendarYear])

  const handleTabChange = useCallback((tabId: string) => {
    setIsLoading(true)
    setActiveTab(tabId as 'overview' | 'analytics')
    setTimeout(() => setIsLoading(false), 300)
  }, [])

  const handleExport = useCallback(() => {
    const headers = ['Date,Category,Amount,Details']
    const rows = filteredData.map((e) => `${e.date},${e.category},${e.amount},"${e.details}"`)
    const csv = headers.concat(rows).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'expenses.csv'
    a.click()
  }, [filteredData])

  const handleAddExpense = useCallback(() => {
    navigate('/transactions')
  }, [navigate])

  const tabs: Tab[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: faHome,
      content: (
        <OverviewSummary
          totalExpenses={totalExpenses}
          topCategory={topCategory.category}
          averageDaily={averageDaily}
          categoryBreakdown={expensesData.map((e) => ({ category: e.category, amount: e.amount }))}
          allExpenses={expensesData}
          calendarMonth={calendarMonth}
          calendarYear={calendarYear}
          setCalendarMonth={setCalendarMonth}
          setCalendarYear={setCalendarYear}
          analyticsData={analyticsData}
          showDayModal={showDayModal}
          setShowDayModal={setShowDayModal}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          dayExpenses={dayExpenses}
          monthNames={monthNames}
          handleAddExpense={handleAddExpense}
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
      label: 'Detail',
      icon: faList,
      content: (
        <ExpensesTable
          expenses={filteredData}
          onSearch={setSearch}
          onFilterCategory={setFilterCategory}
          search={search}
          filterCategory={filterCategory}
          onExport={handleExport}
        />
      )
    },
    {
      id: 'categories',
      label: 'Monthly',
      icon: faFolderOpen,
      content: (
        <CategoriesAccordion
          groupedExpenses={filteredData.reduce<{ [date: string]: Expense[] }>((acc, curr) => {
            acc[curr.date] = acc[curr.date] || []
            acc[curr.date].push(curr)
            return acc
          }, {})}
        />
      )
    }
  ]

  return (
    <div className={styles.expensesPage}>
      <div className={styles.header}>
        <h1>Expenses</h1>
        <button className={styles.addButton} onClick={handleAddExpense}>
          <FontAwesomeIcon icon={faPlus} /> Add Expense
        </button>
      </div>

      <div className={styles.tabContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <FontAwesomeIcon icon={tab.icon} className={styles.tabIcon} />
            <p className={styles.tabLabel}>{tab.label}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode='wait'>
        {isLoading ? (
          <motion.div
            key='loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.loadingContainer}
          >
            <div className={styles.loadingSpinner} />
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.tabContent}
          >
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExpensesPage
