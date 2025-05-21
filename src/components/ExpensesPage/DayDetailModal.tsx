import React from 'react'
import { Modal } from '../common'
import styles from './DayDetailModal.module.css'

interface Expense {
  id: string
  category: string
  amount: number
  date: string
  details: string
  tags: string[]
  note: string
  change: number
  direction: 'up' | 'down'
}

interface DayDetailModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDay: number | null
  calendarMonth: number
  calendarYear: number
  dayExpenses: Expense[]
  monthNames: string[]
  handleAddExpense: () => void
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  calendarMonth,
  calendarYear,
  dayExpenses,
  monthNames,
  handleAddExpense
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='small'>
      <div className={styles.dayDetailModal}>
        <div className={styles.dayDetailHeader}>
          <h3>
            {monthNames[calendarMonth]} {selectedDay}, {calendarYear}
          </h3>
          <div className={styles.totalAmount}>
            ${dayExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            <span>total spent</span>
          </div>
        </div>

        <div className={styles.expensesList}>
          {dayExpenses.length === 0 ? (
            <div className={styles.noExpenses}>
              <span className={styles.emptyIcon}>💰</span>
              <p>No expenses recorded for this day.</p>
              <button className={styles.addButton} onClick={handleAddExpense}>
                Add Expense
              </button>
            </div>
          ) : (
            <>
              {dayExpenses.map((e) => (
                <div key={e.id} className={styles.expenseItem}>
                  <div className={styles.expenseIcon}>
                    {e.category === 'Food' && '🍽️'}
                    {e.category === 'Housing' && '🏠'}
                    {e.category === 'Transportation' && '🚗'}
                    {e.category === 'Entertainment' && '🎮'}
                    {e.category === 'Shopping' && '🛍️'}
                    {e.category === 'Others' && '📦'}
                  </div>
                  <div className={styles.expenseInfo}>
                    <div className={styles.expenseCategory}>{e.category}</div>
                    <div className={styles.expenseDetails}>{e.details}</div>
                    {e.tags.length > 0 && (
                      <div className={styles.expenseTags}>
                        {e.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div
                    className={`${styles.expenseAmount} ${
                      e.amount < 50 ? styles.low : e.amount < 150 ? styles.medium : styles.high
                    }`}
                  >
                    ${e.amount.toLocaleString()}
                  </div>
                </div>
              ))}

              <div className={styles.dayStats}>
                <div className={styles.statItem}>
                  <span>Average per transaction</span>
                  <strong>{(dayExpenses.reduce((sum, e) => sum + e.amount, 0) / dayExpenses.length).toFixed(2)}</strong>
                </div>
                <div className={styles.statItem}>
                  <span>Number of transactions</span>
                  <strong>{dayExpenses.length}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default DayDetailModal
