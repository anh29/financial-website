// SavingsRateTrend.tsx
import React from 'react'
import { Line } from 'react-chartjs-2'
import ChartCard from './ChartCard'

const SavingsRateTrend = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Savings Rate (%)',
        data: [20, 25, 22, 28, 30],
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  }
  return (
    <ChartCard title='Savings Rate Over Time'>
      <Line data={data} />
    </ChartCard>
  )
}
export default SavingsRateTrend
