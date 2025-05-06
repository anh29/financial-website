import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import ChartCard from '../Shared/ChartCard'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const RadarChartSection = () => {
  const data = {
    labels: [
      'FREQUENT FLYERS',
      'USERS WHO PURCHASED SEATS',
      'NEVER BOOKED IN APP',
      'USER WHO HAVE LOGGED IN ONCE',
      'PUSH OPTED IN',
      'IRISH USERS'
    ],
    datasets: [
      {
        label: 'User Segments',
        data: [120, 90, 40, 30, 50, 60],
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        borderColor: '#2ecc71',
        borderWidth: 2,
        pointBackgroundColor: '#2ecc71',
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: '#ecf0f1'
        },
        grid: {
          color: '#dfe6e9'
        },
        pointLabels: {
          color: '#7f8c8d',
          font: {
            size: 12
          }
        },
        ticks: {
          beginAtZero: true,
          color: '#95a5a6',
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return (
    <ChartCard title='User Segments Overview'>
      <div style={{ height: '400px' }}>
        <Radar data={data} options={options} />
      </div>
    </ChartCard>
  )
}

export default RadarChartSection
