import styles from './HomePage.module.css'
import Goals from '../../components/HomePage/Goals'
import UpcomingBill from '../../components/HomePage/UpcomingBill'
import RecentTransaction from '../../components/HomePage/RecentTransaction'
import Statistics from '../../components/HomePage/Statistics'
import ExpensesBreakdown from '../../components/HomePage/ExpensesBreakdown'

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <Goals />
      <UpcomingBill />
      <RecentTransaction />
      <div className={styles.statisticsAndExpenses}>
        <Statistics />
        <ExpensesBreakdown />
      </div>
    </div>
  )
}

export default HomePage
