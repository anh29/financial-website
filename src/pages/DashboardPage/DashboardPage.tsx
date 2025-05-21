import { useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useApi } from '../../hooks/useApi'
import { dashboardService, DashboardData } from '../../services/features/dashboardService'
import { withApiHandler } from '../../components/common/withApiHandler'
import './DashboardPage.module.css'

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const DashboardPage = () => {
  const { data, execute } = useApi<DashboardData>()

  useEffect(() => {
    const fetchDashboardData = async () => {
      await execute(() => dashboardService.getDashboardData(), {
        onSuccess: () => {
          console.log('Dashboard data fetched successfully')
        },
        onError: (error) => {
          console.error('Error fetching dashboard data:', error)
        }
      })
    }

    fetchDashboardData()
  }, [execute])

  if (!data) {
    return null
  }

  const weeklyComparisonData = {
    labels: data.statistics.weeklyComparison.map((item) => item.day),
    datasets: [
      {
        label: 'This week',
        data: data.statistics.weeklyComparison.map((item) => item.thisWeek),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Last week',
        data: data.statistics.weeklyComparison.map((item) => item.lastWeek),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  }

  return (
    <div className='dashboard'>
      <div className='dashboard-section total-balance'>
        <h3>Total Balance</h3>
        <div className='balance-card'>
          <div className='balance-amount'>${data.totalBalance.toLocaleString()}</div>
          <div className='balance-details'>
            <span>All Accounts</span>
            {data.accounts.map((account, index) => (
              <div key={index}>
                <span>Account Type: {account.type}</span>
                <span>{account.number}</span>
                <span>${account.balance.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='dashboard-section goals'>
        <h3>Goals</h3>
        <div className='goal-card'>
          <div className='goal-amount'>${data.goals.target.toLocaleString()}</div>
          <div className='goal-details'>
            <span>Target Achieved: ${data.goals.achieved.toLocaleString()}</span>
            <span>This month Target: ${data.goals.thisMonth.toLocaleString()}</span>
            <div className='goal-progress'>
              <div
                className='goal-progress-bar'
                style={{ width: `${(data.goals.achieved / data.goals.target) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className='dashboard-section upcoming-bill'>
        <h3>Upcoming Bill</h3>
        <div className='bill-card'>
          {data.upcomingBills.map((bill, index) => (
            <div className='bill-item' key={index}>
              <span>{bill.date}</span>
              <span>{bill.name}</span>
              <span>${bill.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='dashboard-section recent-transaction'>
        <h3>Recent Transaction</h3>
        <div className='transaction-card'>
          {data.recentTransactions.map((transaction, index) => (
            <div className='transaction-item' key={index}>
              <span>{transaction.name}</span>
              <span>{transaction.category}</span>
              <span>${transaction.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='dashboard-section statistics'>
        <h3>Statistics</h3>
        <div className='statistics-card'>
          <div className='chart-container'>
            <Bar data={weeklyComparisonData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      <div className='dashboard-section expenses-breakdown'>
        <h3>Expenses Breakdown</h3>
        <div className='expenses-card'>
          {data.statistics.expensesBreakdown.map((expense, index) => (
            <div className='expense-item' key={index}>
              <span>{expense.category}</span>
              <span>${expense.amount.toLocaleString()}</span>
              <span>{expense.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default withApiHandler(DashboardPage)
