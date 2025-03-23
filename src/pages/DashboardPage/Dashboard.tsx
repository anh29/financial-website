import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import './Dashboard.css'

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  const fakeData = {
    totalBalance: 240399,
    accounts: [
      {
        type: 'Credit Card',
        number: '**** **** **** 2598',
        balance: 25000
      }
    ],
    goals: {
      target: 20000,
      achieved: 12500,
      thisMonth: 20000
    },
    upcomingBills: [
      { date: 'May 15', name: 'Figma - Monthly', amount: 150 },
      { date: 'Jun 16', name: 'Adobe - Yearly', amount: 559 }
    ],
    recentTransactions: [
      { name: 'GTR 5', category: 'Gadget & Gear', amount: 160 },
      { name: 'Polo Shirt', category: 'XL fashions', amount: 20 },
      { name: 'Biriyani', category: 'Hajir Biriyani', amount: 10 },
      { name: 'Taxi Fare', category: 'Uber', amount: 12 },
      { name: 'Keyboard', category: 'Gadget & Gear', amount: 22 }
    ],
    statistics: {
      weeklyComparison: [
        { day: 'Sun', thisWeek: 250000, lastWeek: 200000 },
        { day: 'Mon', thisWeek: 50000, lastWeek: 40000 },
        { day: 'Tue', thisWeek: 10000, lastWeek: 8000 },
        { day: 'Wed', thisWeek: 20000, lastWeek: 16000 },
        { day: 'Thu', thisWeek: 30000, lastWeek: 24000 },
        { day: 'Fri', thisWeek: 40000, lastWeek: 32000 },
        { day: 'Sat', thisWeek: 50000, lastWeek: 40000 }
      ],
      expensesBreakdown: [
        { category: 'Housing', amount: 250, percentage: 15 },
        { category: 'Food', amount: 350, percentage: 8 },
        { category: 'Transportation', amount: 50, percentage: 12 },
        { category: 'Entertainment', amount: 80, percentage: 15 },
        { category: 'Shopping', amount: 420, percentage: 25 },
        { category: 'Others', amount: 650, percentage: 23 }
      ]
    }
  }

  const weeklyComparisonData = {
    labels: fakeData.statistics.weeklyComparison.map((item) => item.day),
    datasets: [
      {
        label: 'This week',
        data: fakeData.statistics.weeklyComparison.map((item) => item.thisWeek),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Last week',
        data: fakeData.statistics.weeklyComparison.map((item) => item.lastWeek),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  }

  return (
    <div className="dashboard">
      <div className="dashboard-section total-balance">
        <h3>Total Balance</h3>
        <div className="balance-card">
          <div className="balance-amount">${fakeData.totalBalance.toLocaleString()}</div>
          <div className="balance-details">
            <span>All Accounts</span>
            {fakeData.accounts.map((account, index) => (
              <div key={index}>
                <span>Account Type: {account.type}</span>
                <span>{account.number}</span>
                <span>${account.balance.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="dashboard-section goals">
        <h3>Goals</h3>
        <div className="goal-card">
          <div className="goal-amount">${fakeData.goals.target.toLocaleString()}</div>
          <div className="goal-details">
            <span>Target Achieved: ${fakeData.goals.achieved.toLocaleString()}</span>
            <span>This month Target: ${fakeData.goals.thisMonth.toLocaleString()}</span>
            <div className="goal-progress">
              <div className="goal-progress-bar" style={{ width: `${(fakeData.goals.achieved / fakeData.goals.target) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-section upcoming-bill">
        <h3>Upcoming Bill</h3>
        <div className="bill-card">
          {fakeData.upcomingBills.map((bill, index) => (
            <div className="bill-item" key={index}>
              <span>{bill.date}</span>
              <span>{bill.name}</span>
              <span>${bill.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-section recent-transaction">
        <h3>Recent Transaction</h3>
        <div className="transaction-card">
          {fakeData.recentTransactions.map((transaction, index) => (
            <div className="transaction-item" key={index}>
              <span>{transaction.name}</span>
              <span>{transaction.category}</span>
              <span>${transaction.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-section statistics">
        <h3>Statistics</h3>
        <div className="statistics-card">
          <div className="chart-container">
            <Bar data={weeklyComparisonData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      <div className="dashboard-section expenses-breakdown">
        <h3>Expenses Breakdown</h3>
        <div className="expenses-card">
          {fakeData.statistics.expensesBreakdown.map((expense, index) => (
            <div className="expense-item" key={index}>
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

export default Dashboard
