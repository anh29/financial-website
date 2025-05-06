// RecurringExpensesHeatmap.tsx
import React from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import ChartCard from '../Shared/ChartCard'

const RecurringExpensesHeatmap = () => {
  const today = new Date()
  const values = [
    { date: '2024-11-01', count: 1 },
    { date: '2024-11-03', count: 2 },
    { date: '2024-11-05', count: 3 },
    { date: '2024-11-10', count: 2 },
    { date: '2024-11-15', count: 1 },
    { date: '2024-11-22', count: 4 },
    { date: '2024-11-30', count: 2 }
  ]

  return (
    <ChartCard title='Recurring Expenses Heatmap'>
      <CalendarHeatmap
        startDate={new Date('2024-11-01')}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === 0) return 'color-empty'
          if (value.count === 1) return 'color-scale-1'
          if (value.count === 2) return 'color-scale-2'
          if (value.count === 3) return 'color-scale-3'
          return 'color-scale-4'
        }}
        showWeekdayLabels={true}
      />
    </ChartCard>
  )
}

export default RecurringExpensesHeatmap
