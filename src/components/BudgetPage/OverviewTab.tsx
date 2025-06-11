import React from 'react'
import { Bar, Pie } from 'react-chartjs-2'
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
import { useLanguage } from '../../context/LanguageContext'
import { HistoryBudgets } from '../../types/budgets'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend)

interface OverviewTabProps {
  pastBudgets: HistoryBudgets[]
}

const OverviewTab: React.FC<OverviewTabProps> = ({ pastBudgets }) => {
  const { t } = useLanguage()
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

  if (pastBudgets.length === 0) {
    return (
      <div className={styles.overviewTab}>
        <h3 className={styles.title}>{t('budget', 'noData')}</h3>
      </div>
    )
  }

  return (
    <div className={styles.overviewTab}>
      <h3 className={styles.title}>{t('budget', 'budgetOverview')}</h3>

      <div className={styles.chartWrapper}>
        <div className={styles.chartBox}>
          <h4>{t('budget', 'monthlyExpenses')}</h4>
          <Bar data={barData} />
        </div>
        <div className={styles.chartBox}>
          <h4>{t('budget', 'expenseCategoryRatio')}</h4>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  )
}

export default OverviewTab
