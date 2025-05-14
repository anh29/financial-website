import { Card, Button, LoadingSpinner, Select, Badge } from '../../components/common'
import styles from './ReportsPage.module.css'
import IncomeVsExpenses from '../../components/Reports/IncomeVsExpenses'
import BudgetVsActual from '../../components/Shared/BudgetVsActual'
import CashFlowSankey from '../../components/Shared/CashFlowSankey'
import RecurringExpensesHeatmap from '../../components/Shared/RecurringExpensesHeatmap'
import SavingsRateTrend from '../../components/Shared/SavingsRateTrend'
import SpendingCategoryDonut from '../../components/Shared/SpendingCategoryDonut'
import SpendingTrendLine from '../../components/Shared/SpendingTrendLine'
import StackedCategoryTrends from '../../components/Shared/StackedCategoryTrends'
import TopMerchantsBar from '../../components/Shared/TopMerchantsBar'
import RadarChartSection from '../../components/Shared/RadarChartSection'
import { useState } from 'react'

export const ReportsPage = () => {
  const isLoading = false
  const [reportType, setReportType] = useState('monthly')

  return (
    <div className={styles.reportsPage}>
      <div className={styles.reportsHeader}>
        <h1>Financial Reports</h1>
        <div className={styles.reportControls}>
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' }
            ]}
          />
          <Button variant='outline'>Export</Button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      ) : (
        <div className={styles.reportsGrid}>
          <Card className={styles.reportCard}>
            <h2>Income Report</h2>
            <Badge variant='success'>Updated</Badge>
            <div className={styles.reportContent}>
              <IncomeVsExpenses />
            </div>
          </Card>

          <Card className={styles.reportCard}>
            <h2>Expense Report</h2>
            <Badge variant='warning'>Pending</Badge>
            <div className={styles.reportContent}>{/* Report content */}</div>
          </Card>

          <Card className={styles.reportCard}>
            <h2>Budget Analysis</h2>
            <Badge variant='primary'>New</Badge>
            <div className={styles.reportContent}>
              <div className={styles.grid2}>
                <BudgetVsActual />
              </div>
            </div>
          </Card>
        </div>
      )}

      <section className={styles.section}>
        <h2>🧾 Spending</h2>
        <div className={styles.grid3}>
          <SpendingCategoryDonut />
          <SpendingTrendLine />
          <StackedCategoryTrends />
        </div>
      </section>

      <section className={styles.section}>
        <h2>📅 Recurring Patterns</h2>
        <RecurringExpensesHeatmap />
        <TopMerchantsBar />
      </section>

      <section className={styles.section}>
        <h2>💰 Savings</h2>
        <div className={styles.grid2}>
          <SavingsRateTrend />
          <CashFlowSankey />
        </div>
      </section>

      <section className={styles.section}>
        <h2>💰 Savings</h2>
        <div className={styles.grid2}>
          <RadarChartSection />
        </div>
      </section>
    </div>
  )
}

export default ReportsPage
