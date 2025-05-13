import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import styles from './HistoryTab.module.css'
import { HistoryBudgets } from '../../types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface HistoryTabProps {
  pastBudgets: HistoryBudgets[]
  selectedMonth: string | null
  setSelectedMonth: (month: string | null) => void
  formatCurrency: (value: number) => string
}

const HistoryTab: React.FC<HistoryTabProps> = ({ pastBudgets, selectedMonth, setSelectedMonth, formatCurrency }) => {
  const filteredBudgets = selectedMonth ? pastBudgets.filter((b) => b.month === selectedMonth) : pastBudgets
  return (
    <div className={styles.historyTab}>
      <h3 className={styles.sectionTitle}>📅 Lịch sử ngân sách</h3>

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

      {filteredBudgets.map((entry) => {
        const spentTotal = Object.values(entry.spent).reduce((a, b) => a + b, 0)

        const chartData = {
          labels: entry.allocations.map((a) => a.description),
          datasets: [
            {
              label: 'Phân bổ',
              data: entry.allocations.map((a) => a.amount),
              backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#22D3EE'],
              borderWidth: 1
            }
          ]
        }

        return (
          <div key={entry.month} className={styles.pastMonth}>
            <div className={styles.headerRow}>
              <h4>{entry.month}</h4>
              <div className={styles.summaryBox}>
                <span>Tổng chi tiêu: {formatCurrency(spentTotal)}</span>
                <span className={spentTotal > entry.total ? styles.overBudget : styles.underBudget}>
                  {spentTotal > entry.total ? '🚨 Vượt ngân sách' : '✅ Trong giới hạn'}
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
                {entry.allocations.map((a, index) => {
                  const actual = entry.spent[a.description] ?? 0
                  const diff = a.amount - actual
                  return (
                    <tr key={`allocation-${index}`}>
                      <td>{a.description}</td>
                      <td>{formatCurrency(a.amount)}</td>
                      <td>{formatCurrency(actual)}</td>
                      <td
                        style={{
                          color: diff < 0 ? 'red' : 'green',
                          fontWeight: 500
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
                    <tr key={`spent-${index}`}>
                      <td>{description}</td>
                      <td>{formatCurrency(0)}</td>
                      <td>{formatCurrency(actual)}</td>
                      <td
                        style={{
                          color: 'red',
                          fontWeight: 500
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
                <h5>🎯 Phân bổ ngân sách theo danh mục</h5>
                <Doughnut data={chartData} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default HistoryTab
