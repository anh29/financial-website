import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import ChartCard from './ChartCard'

const BudgetVsActual = () => {
  const data = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [700, 300],
        backgroundColor: ['#f1c40f', '#bdc3c7']
      }
    ]
  }
  return (
    <ChartCard title='Budget vs Actual'>
      <Doughnut data={data} />
    </ChartCard>
  )
}
export default BudgetVsActual
