// SpendingTrendLine.tsx
import React from 'react'
import { Line } from 'react-chartjs-2'
import ChartCard from './ChartCard'

const SpendingTrendLine = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Spending',
        data: [2200, 2500, 2100, 2600, 2300],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
  return (
    <ChartCard title='Spending Over Time'>
      <Line data={data} />
    </ChartCard>
  )
}
export default SpendingTrendLine
