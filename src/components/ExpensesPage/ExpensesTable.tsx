import React, { useState } from 'react'
import styles from './ExpensesTable.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

type DailyAllocation = {
  date: string
  amount: number
}

type Expense = {
  id: string
  category: string
  amount: number
  date: string
  details: string
  tags: string[]
  note: string
  dailyAllocation?: DailyAllocation[]
}

type Props = {
  expenses: Expense[]
  onSearch: (val: string) => void
  onFilterCategory: (val: string) => void
  search: string
  filterCategory: string
  onExport: () => void
}

const ExpensesTable: React.FC<Props> = ({ expenses, onSearch, onFilterCategory, search, filterCategory, onExport }) => {
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <section className={styles.tableExpensesSection}>
      <div className={styles.tableControls}>
        <input
          type='text'
          placeholder='Search details...'
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className={styles.tableSearch}
        />
        <select
          value={filterCategory}
          onChange={(e) => onFilterCategory(e.target.value)}
          className={styles.tableSelect}
        >
          <option value=''>All Categories</option>
          {Array.from(new Set(expenses.map((e) => e.category))).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button onClick={onExport} className={styles.exportButton}>
          <FontAwesomeIcon icon={faDownload} /> Export CSV
        </button>
      </div>
      <table className={styles.expenseTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Details</th>
            <th>Tags</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <>
              <tr key={e.id} className={e.dailyAllocation ? styles.smartAllocatedRow : undefined}>
                <td>{e.date}</td>
                <td>{e.category}</td>
                <td>${e.amount}</td>
                <td>{e.details}</td>
                <td>
                  {e.tags.map((tag) => (
                    <span key={tag} className={styles.tagBadge}>
                      {tag}
                    </span>
                  ))}
                </td>
                <td>{e.note}</td>
                <td>
                  {e.dailyAllocation && e.dailyAllocation.length > 0 && (
                    <button
                      className={styles.tableAction}
                      onClick={() => handleExpand(e.id)}
                      aria-label={expanded === e.id ? 'Hide daily allocation' : 'Show daily allocation'}
                    >
                      {expanded === e.id ? 'Hide' : 'Show'}
                    </button>
                  )}
                  <button className={styles.tableAction}>
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </td>
              </tr>
              {e.dailyAllocation && expanded === e.id && (
                <tr className={styles.dailyAllocationRow}>
                  <td colSpan={7}>
                    <div className={styles.dailyAllocationBox}>
                      <strong>Daily Allocation:</strong>
                      <table className={styles.dailyAllocationTable}>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Allocated Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {e.dailyAllocation.map((d, idx) => (
                            <tr key={idx}>
                              <td>{d.date}</td>
                              <td>${d.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default ExpensesTable
