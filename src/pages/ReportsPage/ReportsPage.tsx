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

const ReportsPage = () => {
  return (
    <div className={styles.reportsPage}>
      <header className={styles.header}>
        <h1>📊 Financial Reports Dashboard</h1>
        <p className={styles.subheader}>Understand your spending, savings, and cash flow like never before.</p>
      </header>

      <section className={styles.section}>
        <h2>💼 Overview</h2>
        <div className={styles.grid2}>
          <IncomeVsExpenses />
          <BudgetVsActual />
        </div>
      </section>

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
