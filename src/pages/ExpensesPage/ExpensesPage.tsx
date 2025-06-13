import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styles from './ExpensesPage.module.css'
import { faChartLine, faList, faHome } from '@fortawesome/free-solid-svg-icons'
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
import { useNavigate } from 'react-router-dom'
import AnalyticsDashboard from '../../components/ExpensesPage/AnalyticsDashboard'
import { useExpenses } from '../../hooks/features/useExpenses'
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner'
import { FloatingActionButton } from '../../components/common/FloatingActionButton/FloatingActionButton'
import { formatDate } from '../../utils/helpers'

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
  const { expenses: expensesData, fetchExpenses, isLoading } = useExpenses()

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
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
    return expensesData
      .filter((e) => {
        const date = new Date(e.date)
        const transactionDay = date.getDate()
        const transactionMonth = date.getMonth()
        const transactionYear = date.getFullYear()

        // For non-amortized transactions, check exact date match
        if (!e.is_amortized) {
          return (
            transactionDay === selectedDay && transactionMonth === calendarMonth && transactionYear === calendarYear
          )
        }

        // For amortized transactions, check if the selected day falls within the amortization period
        if (e.is_amortized && e.amortized_days) {
          const endDate = new Date(date.getTime() + (e.amortized_days - 1) * 24 * 60 * 60 * 1000)
          const selectedDate = new Date(calendarYear, calendarMonth, selectedDay)

          return selectedDate >= date && selectedDate <= endDate
        }

        return false
      })
      .map((e) => {
        // For amortized transactions, calculate the daily amount
        if (e.is_amortized && e.amortized_days) {
          return {
            ...e,
            amount: Math.round(e.amount / e.amortized_days),
            totalAmount: e.amount
          }
        }
        return e
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
          labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          datasets: [{ label: 'Chi tiêu hàng ngày', data: [0, 0, 0, 0, 0, 0, 0] }]
        },
        weeklySpendingSummary: {
          total: 0,
          average: 0,
          highest: 0,
          lowest: 0
        },
        trendsData: {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
          datasets: [{ label: 'Chi tiêu hàng tháng', data: Array(12).fill(0) }]
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
        const dayOfWeek = formatDate(date, 'vi-VN', { weekday: 'short' })
        acc[dayOfWeek] = (acc[dayOfWeek] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>
    )

    const weeklySpendingData = {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      datasets: [
        {
          label: 'Chi tiêu hàng ngày',
          data: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => weeklyData[day] || 0)
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
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [
        {
          label: 'Chi tiêu hàng tháng',
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
        data[day - 1].amount += e.amount / (e.amortized_days || 1)
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
    const headers = ['Ngày,Danh mục,Số tiền,Chi tiết']
    const rows = filteredData.map((e) => `${e.date},${e.category},${e.amount},"${e.description}"`)
    const csv = headers.concat(rows).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'expenses.csv'
    a.click()
  }, [filteredData])

  const tabs = [
    {
      id: 'overview',
      label: 'Tổng quan',
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
      label: 'Phân tích',
      icon: faChartLine,
      content: <AnalyticsDashboard {...analyticsData} />
    },
    {
      id: 'list',
      label: 'Danh sách',
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

  return (
    <div className={`${styles.expensesPage} expenses-page`}>
      <div className={styles.header}>
        <h1>Chi tiêu</h1>
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
      <FloatingActionButton onClick={() => navigate('/transactions')} />
    </div>
  )
}

export default ExpensesPage
