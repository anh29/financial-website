import React, { useState } from 'react'
import styles from './ExpensesTable.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { Transaction } from '../../types/transaction'

type Props = {
  expenses: Transaction[]
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e, index) => (
            <>
              <tr key={e.id} className={e.is_amortized ? styles.smartAllocatedRow : styles.singleExpenseRow}>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.category}</td>
                <td>{e.amount.toLocaleString()} VND</td>
                <td>{e.description}</td>
                <td>
                  {e.is_amortized ? (
                    <span key={index} className={`${styles.tagBadge} ${styles.amortizedTag}`}>
                      Amortized
                    </span>
                  ) : (
                    <span key={index} className={styles.tagBadge}>
                      Single
                    </span>
                  )}
                </td>
                <td>
                  {e.is_amortized && (
                    <button
                      className={styles.tableAction}
                      onClick={() => handleExpand(e.id)}
                      aria-label={expanded === e.id ? 'Hide daily allocation' : 'Show daily allocation'}
                    >
                      {expanded === e.id ? 'Hide' : 'Show'}
                    </button>
                  )}
                </td>
              </tr>
              {e.is_amortized && expanded === e.id && (
                <tr className={styles.dailyAllocationRow}>
                  <td colSpan={7}>
                    <div className={styles.amortizedCard}>
                      <div className={styles.amortizedHeader}>
                        <span className={styles.amortizedIcon} role='img' aria-label='calendar'>
                          📅
                        </span>
                        <span className={styles.amortizedLabel}>Amortized Usage</span>
                      </div>
                      <div className={styles.amortizedInfoContent}>
                        <span className={styles.amortizedDateRange}>
                          {new Date(e.date).toLocaleDateString()} →{' '}
                          {new Date(
                            new Date(e.date).getTime() + ((e.amortized_days || 0) - 1) * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}
                        </span>
                        <span className={styles.amortizedPerDay}>
                          💸 {(e.amount / (e.amortized_days || 0)).toLocaleString()} VND{' '}
                          <span className={styles.perDayText}>per day</span>
                        </span>
                      </div>
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
