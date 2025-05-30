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
  if (amount < 50000) return styles.low
  if (amount < 150000) return styles.medium
  if (amount < 300000) return styles.high
  return styles.veryHigh
}

const monthNames = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12'
]

const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

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
          <button className={styles.monthBtn} onClick={onPrevMonth} aria-label='Tháng trước'>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 className={styles.monthLabel}>
            {monthNames[month]} {year}
          </h2>
          <button className={styles.monthBtn} onClick={onNextMonth} aria-label='Tháng sau'>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendGradient}>
            <span className={styles.legendLabel}>0</span>
            <div className={styles.gradientBar} />
            <span className={styles.legendLabel}>300.000đ+</span>
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
                    <strong>{dayData.amount.toLocaleString('vi-VN')}đ</strong>
                    <span>
                      chi tiêu vào ngày {dayData.day} {monthNames[month]}
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
