import React, { useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js'
import styles from './HistoryTab.module.css'
import { HistoryBudgets } from '../../types/budgets'

ChartJS.register(ArcElement, Tooltip, Legend)

interface HistoryTabProps {
  pastBudgets: HistoryBudgets[]
  selectedMonth: string | null
  setSelectedMonth: (month: string | null) => void
  formatCurrency: (value: number) => string
}

const HistoryTab: React.FC<HistoryTabProps> = ({ pastBudgets, selectedMonth, setSelectedMonth, formatCurrency }) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const filteredBudgets = selectedMonth ? pastBudgets.filter((b) => b.month === selectedMonth) : pastBudgets

  const chartColors = [
    '#1abc9c', // Primary
    '#3498db', // Blue
    '#9b59b6', // Purple
    '#e67e22', // Orange
    '#2ecc71', // Green
    '#e74c3c', // Red
    '#f1c40f', // Yellow
    '#34495e', // Dark Blue
    '#16a085', // Teal
    '#d35400' // Dark Orange
  ]

  return (
    <div className={styles.historyTab}>
      <h3 className={styles.sectionTitle}>
        <span role='img' aria-label='chart'>
          📊
        </span>
        Lịch sử ngân sách
      </h3>

      <div className={styles.monthSelector}>
        <label>Chọn tháng:</label>
        <select value={selectedMonth || ''} onChange={(e) => setSelectedMonth(e.target.value || null)}>
          <option value=''>Tất cả</option>
          {pastBudgets.map((b) => (
            <option key={b.month} value={b.month}>
              {b.month}
            </option>
          ))}
        </select>
      </div>

      {filteredBudgets.map((entry, index) => {
        const spentTotal = Object.values(entry.spent).reduce((a, b) => a + b, 0)
        const isOverBudget = spentTotal > entry.total

        const chartData = {
          labels: entry.allocations.map((a) => a.description),
          datasets: [
            {
              label: 'Phân bổ',
              data: entry.allocations.map((a) => a.amount),
              backgroundColor: chartColors,
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverOffset: 4
            }
          ]
        }

        const chartOptions = {
          plugins: {
            legend: {
              position: 'bottom' as const,
              labels: {
                padding: 20,
                font: {
                  size: 12,
                  family: "'Segoe UI', sans-serif"
                },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#34495e',
              bodyColor: '#34495e',
              borderColor: '#1abc9c',
              borderWidth: 1,
              padding: 12,
              boxPadding: 6,
              usePointStyle: true,
              callbacks: {
                label: function (context: TooltipItem<'doughnut'>) {
                  const label = context.label || ''
                  const value = context.raw as number
                  return `${label}: ${formatCurrency(value)}`
                }
              }
            }
          },
          cutout: '60%',
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }

        return (
          <div
            key={entry.month}
            className={styles.pastMonth}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className={styles.headerRow}>
              <h4>
                <span role='img' aria-label='calendar'>
                  📅
                </span>{' '}
                {entry.month}
              </h4>
              <div className={styles.summaryBox}>
                <span className={styles.summaryTotal}>
                  <span role='img' aria-label='money'>
                    💰
                  </span>{' '}
                  Tổng chi tiêu: {formatCurrency(spentTotal)}
                </span>
                <span
                  className={
                    isOverBudget ? `${styles.summaryStatus} ${styles.over}` : `${styles.summaryStatus} ${styles.ok}`
                  }
                >
                  {isOverBudget ? (
                    <>
                      <span role='img' aria-label='warning'>
                        ⚠️
                      </span>{' '}
                      Vượt ngân sách
                    </>
                  ) : (
                    <>
                      <span role='img' aria-label='check'>
                        ✅
                      </span>{' '}
                      Trong giới hạn
                    </>
                  )}
                </span>
              </div>
            </div>

            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Danh mục</th>
                  <th>Phân bổ</th>
                  <th>Thực chi</th>
                  <th>Chênh lệch</th>
                </tr>
              </thead>
              <tbody>
                {entry.allocations.map((a, rowIndex) => {
                  const actual = entry.spent[a.description] ?? 0
                  const diff = a.amount - actual
                  const isHovered = hoveredRow === rowIndex

                  return (
                    <tr
                      key={`allocation-${rowIndex}`}
                      onMouseEnter={() => setHoveredRow(rowIndex)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <td>{a.description}</td>
                      <td>{formatCurrency(a.amount)}</td>
                      <td>{formatCurrency(actual)}</td>
                      <td
                        style={{
                          color: diff < 0 ? 'var(--error-color)' : 'var(--primary-color)',
                          fontWeight: 600,
                          backgroundColor: isHovered ? 'rgba(26, 188, 156, 0.1)' : 'transparent'
                        }}
                      >
                        {diff > 0 ? '+' : ''}
                        {formatCurrency(diff)}
                      </td>
                    </tr>
                  )
                })}
                {Object.entries(entry.spent)
                  .filter(([description]) => !entry.allocations.some((a) => a.description === description))
                  .map(([description, actual], index) => (
                    <tr
                      key={`spent-${index}`}
                      onMouseEnter={() => setHoveredRow(index + entry.allocations.length)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        transform: hoveredRow === index + entry.allocations.length ? 'scale(1.01)' : 'scale(1)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <td>{description}</td>
                      <td>{formatCurrency(0)}</td>
                      <td>{formatCurrency(actual)}</td>
                      <td
                        style={{
                          color: 'var(--error-color)',
                          fontWeight: 600,
                          backgroundColor:
                            hoveredRow === index + entry.allocations.length ? 'rgba(231, 76, 60, 0.1)' : 'transparent'
                        }}
                      >
                        -{formatCurrency(actual)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {selectedMonth === entry.month && (
              <div className={styles.chartContainer}>
                <h5>
                  <span role='img' aria-label='target'>
                    🎯
                  </span>
                  Phân bổ ngân sách theo danh mục
                </h5>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default HistoryTab
