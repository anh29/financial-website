import styles from './HomePage.module.css'
import Goals from '../../components/HomePage/Goals'
import UpcomingBill from '../../components/HomePage/UpcomingBill'
import RecentTransaction from '../../components/HomePage/RecentTransaction'
import Statistics from '../../components/HomePage/Statistics'
import ExpensesBreakdown from '../../components/HomePage/ExpensesBreakdown'

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <RecentTransaction />
      <div className={styles.goalsUpcomingBill}>
        <Goals />
        <UpcomingBill />
      </div>
      <Statistics />
      <ExpensesBreakdown />
    </div>
  )
}

export default HomePage
