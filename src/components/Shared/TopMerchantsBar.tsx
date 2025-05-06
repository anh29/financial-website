import React from 'react'
import { Bar } from 'react-chartjs-2'
import ChartCard from './ChartCard'

const TopMerchantsBar = () => {
  const data = {
    labels: ['Amazon', 'Uber', 'Woolworths', 'Netflix'],
    datasets: [
      {
        label: 'Amount Spent',
        data: [400, 120, 230, 90],
        backgroundColor: ['#34495e', '#1abc9c', '#f39c12', '#9b59b6']
      }
    ]
  }
  return (
    <ChartCard title='Top Merchants'>
      <Bar data={data} options={{ indexAxis: 'y' }} />
    </ChartCard>
  )
}
export default TopMerchantsBar
