import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import ChartCard from '../Shared/ChartCard'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const CashFlowSankey = () => {
  const data = {
    labels: ['💰 Income', '🏠 Fixed Expenses', '🛍️ Variable Expenses', '💾 Savings'],
    datasets: [
      {
        label: 'Cash Flow ($)',
        data: [3800, 1800, 1000, 1000],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(231, 76, 60, 0.8)',
          'rgba(243, 156, 18, 0.8)',
          'rgba(52, 152, 219, 0.8)'
        ],
        borderRadius: 6,
        barThickness: 28
      }
    ]
  }

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2c3e50',
        titleColor: '#ecf0f1',
        bodyColor: '#ecf0f1',
        callbacks: {
          label: (context: any) => ` $${context.parsed.x}`
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          color: '#ecf0f1'
        },
        ticks: {
          color: '#34495e',
          callback: (value: number) => `$${value}`
        }
      },
      y: {
        ticks: {
          color: '#2c3e50',
          font: {
            size: 14
          }
        }
      }
    }
  }

  return (
    <ChartCard title='Cash Flow Summary'>
      <div style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </ChartCard>
  )
}

export default CashFlowSankey
