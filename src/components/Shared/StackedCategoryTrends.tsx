// StackedCategoryTrends.tsx
import React from 'react'
import { Line } from 'react-chartjs-2'
import ChartCard from './ChartCard'

const StackedCategoryTrends = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Food', data: [500, 400, 450, 420, 480], borderColor: '#1abc9c', fill: true },
      { label: 'Transport', data: [200, 250, 220, 210, 230], borderColor: '#3498db', fill: true },
      { label: 'Shopping', data: [600, 550, 580, 570, 600], borderColor: '#9b59b6', fill: true }
    ]
  }
  return (
    <ChartCard title='Top Categories Over Time'>
      <Line data={data} />
    </ChartCard>
  )
}
export default StackedCategoryTrends
