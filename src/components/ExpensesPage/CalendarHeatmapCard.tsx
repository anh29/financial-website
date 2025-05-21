import React, { useMemo } from 'react'
import styles from './CalendarHeatmapCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

interface CalendarHeatmapCardProps {
  data: { day: number; amount: number }[]
  month: number
  year: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onDayClick: (day: number) => void
}

const getIntensityClass = (amount: number) => {
  if (amount === 0) return styles.empty
  if (amount < 50) return styles.low
  if (amount < 150) return styles.medium
  if (amount < 300) return styles.high
  return styles.veryHigh
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const CalendarHeatmapCard: React.FC<CalendarHeatmapCardProps> = ({
  data = [],
  month,
  year,
  onPrevMonth,
  onNextMonth,
  onDayClick
}) => {
  const today = new Date()
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year
  const currentDay = today.getDate()

  // Calculate first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Create calendar grid with empty cells for proper alignment
  const calendarGrid = useMemo(() => {
    const grid = Array(42).fill(null) // 6 rows * 7 days

    // Fill in the actual days
    for (let i = 0; i < daysInMonth; i++) {
      const dayData = data.find((d) => d.day === i + 1) || { day: i + 1, amount: 0 }
      grid[i + firstDayOfMonth] = dayData
    }

    return grid
  }, [data, firstDayOfMonth, daysInMonth])

  return (
    <div className={styles.heatmapCard}>
      <div className={styles.cardHeader}>
        <div className={styles.monthNav}>
          <button className={styles.monthBtn} onClick={onPrevMonth} aria-label='Previous month'>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 className={styles.monthLabel}>
            {monthNames[month]} {year}
          </h2>
          <button className={styles.monthBtn} onClick={onNextMonth} aria-label='Next month'>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendGradient}>
            <span className={styles.legendLabel}>$0</span>
            <div className={styles.gradientBar} />
            <span className={styles.legendLabel}>$300+</span>
          </div>
        </div>
      </div>

      <div className={styles.calendarContainer}>
        <div className={styles.weekDays}>
          {weekDays.map((day) => (
            <div key={day} className={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.heatmapGrid}>
          {calendarGrid.map((dayData, index) => {
            if (!dayData) return <div key={index} className={styles.emptyCell} />

            const isToday = isCurrentMonth && dayData.day === currentDay

            return (
              <div
                key={index}
                className={`${styles.heatmapCell} ${getIntensityClass(dayData.amount)} ${isToday ? styles.today : ''}`}
                onClick={() => onDayClick(dayData.day)}
              >
                <span className={styles.dayNumber}>{dayData.day}</span>
                {dayData.amount > 0 && (
                  <div className={styles.tooltip}>
                    <strong>${dayData.amount.toLocaleString()}</strong>
                    <span>
                      spent on {monthNames[month]} {dayData.day}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CalendarHeatmapCard
