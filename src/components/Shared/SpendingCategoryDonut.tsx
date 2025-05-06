// SpendingCategoryDonut.tsx
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import ChartCard from './ChartCard'

const SpendingCategoryDonut = () => {
  const data = {
    labels: ['Food', 'Transport', 'Shopping', 'Entertainment'],
    datasets: [
      {
        data: [300, 150, 400, 100],
        backgroundColor: ['#1abc9c', '#3498db', '#9b59b6', '#f39c12']
      }
    ]
  }
  return (
    <ChartCard title='Spending by Category'>
      <Doughnut data={data} />
    </ChartCard>
  )
}
export default SpendingCategoryDonut
