import React, { useMemo, useState } from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import styles from './OverviewTab.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend)

interface OverviewTabProps {
  pastBudgets: {
    month: string
    total: number
    allocations: { category: string; amount: number }[]
    spent: Record<string, number>
  }[]
  formatCurrency: (value: number) => string
}

const OverviewTab: React.FC<OverviewTabProps> = ({ pastBudgets, formatCurrency }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  React.useEffect(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const months = pastBudgets.map((b) => b.month)
  const totals = pastBudgets.map((b) => b.total)
  const spentTotals = pastBudgets.map((b) => Object.values(b.spent).reduce((a, b) => a + b, 0))

  const categoryTotals: Record<string, number> = {}
  pastBudgets.forEach((b) => {
    for (const cat in b.spent) {
      categoryTotals[cat] = (categoryTotals[cat] || 0) + b.spent[cat]
    }
  })

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#22D3EE'],
        hoverBackgroundColor: ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777', '#06B6D4']
      }
    ]
  }

  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Tổng thu',
        data: totals,
        backgroundColor: '#10B981'
      },
      {
        label: 'Tổng chi',
        data: spentTotals,
        backgroundColor: '#EF4444'
      }
    ]
  }

  const availableCategories = useMemo(() => {
    const set = new Set<string>()
    pastBudgets.forEach((entry) => entry.allocations.forEach((alloc) => set.add(alloc.category)))
    return Array.from(set)
  }, [pastBudgets])

  const lineChartData = useMemo(() => {
    if (!selectedCategory) return null
    const labels = pastBudgets.map((entry) => entry.month)
    const data = pastBudgets.map((entry) => {
      const found = entry.allocations.find((a) => a.category === selectedCategory)
      return found ? found.amount : 0
    })

    return {
      labels,
      datasets: [
        {
          label: `Ngân sách cho ${selectedCategory}`,
          data,
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.4)',
          tension: 0.3,
          fill: true
        }
      ]
    }
  }, [pastBudgets, selectedCategory])

  const barChartData = useMemo(() => {
    const labels = pastBudgets.map((entry) => entry.month)
    const datasets = availableCategories.map((cat) => ({
      label: cat,
      data: pastBudgets.map((entry) => {
        const item = entry.allocations.find((a) => a.category === cat)
        return item ? item.amount : 0
      }),
      backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 60%, 60%)`
    }))

    return { labels, datasets }
  }, [pastBudgets, availableCategories])

  if (pastBudgets.length === 0) {
    return (
      <div className={styles.overviewTab}>
        <h3 className={styles.title}>Không có dữ liệu để hiển thị</h3>
      </div>
    )
  }

  return (
    <div className={styles.overviewTab}>
      <h3 className={styles.title}>📈 Tổng quan ngân sách</h3>

      <div className={styles.chartWrapper}>
        <div className={styles.chartBox}>
          <h4>📊 Chi tiêu theo tháng</h4>
          <Bar data={barData} />
        </div>
        <div className={styles.chartBox}>
          <h4>🍕 Tỷ lệ chi tiêu theo danh mục</h4>
          <Pie data={pieData} />
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.filterSection}>
          <h4>📉 Biểu đồ xu hướng ngân sách theo tháng {selectedCategory ? `(${selectedCategory})` : ''}</h4>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value=''>-- Chọn danh mục --</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory && lineChartData ? <Line data={lineChartData} /> : <Bar data={barChartData} />}
      </div>
    </div>
  )
}

export default OverviewTab
